using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IProductionService
    {
        Task<ApiResponse<BomDto>> CreateBomAsync(CreateBomDto dto);
        Task<ApiResponse<List<BomDto>>> ListBomsAsync(int companyId);
        Task<ApiResponse<bool>> DeleteBomAsync(int id);

        Task<ApiResponse<ProductionOrderDto>> CreateOrderAsync(CreateProductionOrderDto dto);
        Task<ApiResponse<List<ProductionOrderDto>>> ListOrdersAsync(int companyId);
        Task<ApiResponse<bool>> UpdateOrderStatusAsync(int id, string status);

        Task<ApiResponse<QualityCheckDto>> CreateQualityCheckAsync(CreateQualityCheckDto dto);
        Task<ApiResponse<List<QualityCheckDto>>> ListQualityChecksAsync(int productionOrderId);
    }

    public class ProductionService : IProductionService
    {
        private readonly ERPDbContext _db;
        private readonly IAutoAccountingService _accounting;
        public ProductionService(ERPDbContext db, IAutoAccountingService accounting)
        {
            _db = db;
            _accounting = accounting;
        }

        public async Task<ApiResponse<BomDto>> CreateBomAsync(CreateBomDto dto)
        {
            var bomCode = $"BOM-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var bom = new BillOfMaterial
            {
                CompanyId = dto.CompanyId, FinishedProductId = dto.FinishedProductId,
                BomCode = bomCode, Quantity = dto.Quantity
            };
            foreach (var item in dto.Items)
                bom.Items.Add(new BomItem { RawMaterialProductId = item.RawMaterialProductId, Quantity = item.Quantity, Unit = item.Unit });

            _db.BillsOfMaterial.Add(bom);
            await _db.SaveChangesAsync();
            return ApiResponse<BomDto>.Ok(await GetBomDtoAsync(bom.Id), "BOM created.");
        }

        public async Task<ApiResponse<List<BomDto>>> ListBomsAsync(int companyId)
        {
            var boms = await _db.BillsOfMaterial.Include(b => b.FinishedProduct)
                .Include(b => b.Items).ThenInclude(i => i.RawMaterial)
                .Where(b => b.CompanyId == companyId && b.IsActive).ToListAsync();
            return ApiResponse<List<BomDto>>.Ok(boms.Select(MapBom).ToList());
        }

        public async Task<ApiResponse<bool>> DeleteBomAsync(int id)
        {
            var bom = await _db.BillsOfMaterial.FindAsync(id);
            if (bom == null) return ApiResponse<bool>.Fail("BOM not found.");
            bom.IsActive = false;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<ProductionOrderDto>> CreateOrderAsync(CreateProductionOrderDto dto)
        {
            var orderNumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var order = new ProductionOrder
            {
                CompanyId = dto.CompanyId, OrderNumber = orderNumber, BomId = dto.BomId,
                PlannedQty = dto.PlannedQty, PlannedStartDate = dto.PlannedStartDate,
                PlannedEndDate = dto.PlannedEndDate
            };
            _db.ProductionOrders.Add(order);
            await _db.SaveChangesAsync();
            return ApiResponse<ProductionOrderDto>.Ok(await GetOrderDtoAsync(order.Id), "Production order created.");
        }

        public async Task<ApiResponse<List<ProductionOrderDto>>> ListOrdersAsync(int companyId)
        {
            var orders = await _db.ProductionOrders.Include(o => o.Bom).ThenInclude(b => b.FinishedProduct)
                .Where(o => o.CompanyId == companyId).OrderByDescending(o => o.CreatedAt).ToListAsync();
            return ApiResponse<List<ProductionOrderDto>>.Ok(orders.Select(MapOrder).ToList());
        }

        public async Task<ApiResponse<bool>> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _db.ProductionOrders.Include(o => o.Bom).ThenInclude(b => b.FinishedProduct).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return ApiResponse<bool>.Fail("Order not found.");
            order.Status = status;
            if (status == "In Progress" && order.ActualStartDate == null) order.ActualStartDate = DateTime.UtcNow;
            if (status == "Completed") order.ActualEndDate = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Auto-post on completion: DR COGS / CR Inventory (raw material consumption)
            if (status == "Completed" && order.Bom != null)
            {
                var productName = order.Bom.FinishedProduct?.Name ?? order.OrderNumber;
                try { await _accounting.PostProductionCompletionAsync(order.CompanyId, order.Id, order.PlannedQty, productName); }
                catch { /* Non-blocking */ }
            }

            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<QualityCheckDto>> CreateQualityCheckAsync(CreateQualityCheckDto dto)
        {
            var result = dto.RejectedQty == 0 ? "Pass" : dto.PassedQty == 0 ? "Fail" : "Partial";
            var qc = new QualityCheck
            {
                ProductionOrderId = dto.ProductionOrderId, CheckDate = dto.CheckDate,
                SampleSize = dto.SampleSize, PassedQty = dto.PassedQty,
                RejectedQty = dto.RejectedQty, Result = result, Remarks = dto.Remarks
            };
            _db.QualityChecks.Add(qc);
            await _db.SaveChangesAsync();
            var order = await _db.ProductionOrders.FindAsync(dto.ProductionOrderId);
            return ApiResponse<QualityCheckDto>.Ok(new QualityCheckDto
            {
                Id = qc.Id, ProductionOrderId = qc.ProductionOrderId,
                OrderNumber = order?.OrderNumber ?? "", CheckDate = qc.CheckDate,
                SampleSize = qc.SampleSize, PassedQty = qc.PassedQty, RejectedQty = qc.RejectedQty,
                Result = qc.Result, Remarks = qc.Remarks, CreatedAt = qc.CreatedAt
            }, "Quality check recorded.");
        }

        public async Task<ApiResponse<List<QualityCheckDto>>> ListQualityChecksAsync(int productionOrderId)
        {
            var order = await _db.ProductionOrders.FindAsync(productionOrderId);
            var checks = await _db.QualityChecks.Where(q => q.ProductionOrderId == productionOrderId)
                .OrderByDescending(q => q.CheckDate).ToListAsync();
            return ApiResponse<List<QualityCheckDto>>.Ok(checks.Select(q => new QualityCheckDto
            {
                Id = q.Id, ProductionOrderId = q.ProductionOrderId,
                OrderNumber = order?.OrderNumber ?? "", CheckDate = q.CheckDate,
                SampleSize = q.SampleSize, PassedQty = q.PassedQty, RejectedQty = q.RejectedQty,
                Result = q.Result, Remarks = q.Remarks, CreatedAt = q.CreatedAt
            }).ToList());
        }

        private async Task<BomDto> GetBomDtoAsync(int id)
        {
            var bom = await _db.BillsOfMaterial.Include(b => b.FinishedProduct)
                .Include(b => b.Items).ThenInclude(i => i.RawMaterial).FirstAsync(b => b.Id == id);
            return MapBom(bom);
        }

        private async Task<ProductionOrderDto> GetOrderDtoAsync(int id)
        {
            var order = await _db.ProductionOrders.Include(o => o.Bom).ThenInclude(b => b.FinishedProduct)
                .FirstAsync(o => o.Id == id);
            return MapOrder(order);
        }

        private static BomDto MapBom(BillOfMaterial b) => new()
        {
            Id = b.Id, CompanyId = b.CompanyId, FinishedProductId = b.FinishedProductId,
            FinishedProductName = b.FinishedProduct?.Name ?? "", BomCode = b.BomCode,
            Quantity = b.Quantity, IsActive = b.IsActive, CreatedAt = b.CreatedAt,
            Items = b.Items.Select(i => new BomItemResultDto
            {
                RawMaterialProductId = i.RawMaterialProductId,
                RawMaterialName = i.RawMaterial?.Name ?? "",
                Quantity = i.Quantity, Unit = i.Unit
            }).ToList()
        };

        private static ProductionOrderDto MapOrder(ProductionOrder o) => new()
        {
            Id = o.Id, CompanyId = o.CompanyId, OrderNumber = o.OrderNumber, BomId = o.BomId,
            ProductName = o.Bom?.FinishedProduct?.Name ?? "", PlannedQty = o.PlannedQty,
            ProducedQty = o.ProducedQty, Status = o.Status,
            PlannedStartDate = o.PlannedStartDate, PlannedEndDate = o.PlannedEndDate,
            ActualStartDate = o.ActualStartDate, ActualEndDate = o.ActualEndDate, CreatedAt = o.CreatedAt
        };
    }
}
