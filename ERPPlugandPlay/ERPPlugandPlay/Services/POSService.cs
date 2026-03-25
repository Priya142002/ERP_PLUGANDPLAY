using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IPOSService
    {
        Task<ApiResponse<SessionDto>> OpenSessionAsync(OpenSessionDto dto);
        Task<ApiResponse<SessionDto>> CloseSessionAsync(int sessionId, decimal closingCash);
        Task<ApiResponse<List<SessionDto>>> ListSessionsAsync(int companyId);

        Task<ApiResponse<PosOrderDto>> CreateOrderAsync(CreatePosOrderDto dto);
        Task<ApiResponse<PagedResult<PosOrderDto>>> ListOrdersAsync(int companyId, PaginationParams p);
        Task<ApiResponse<bool>> RefundOrderAsync(int id);
    }

    public class POSService : IPOSService
    {
        private readonly ERPDbContext _db;
        public POSService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<SessionDto>> OpenSessionAsync(OpenSessionDto dto)
        {
            var session = new PosSession
            {
                CompanyId = dto.CompanyId, CashierId = dto.CashierId,
                CashierName = dto.CashierName, OpeningCash = dto.OpeningCash
            };
            _db.PosSessions.Add(session);
            await _db.SaveChangesAsync();
            return ApiResponse<SessionDto>.Ok(MapSession(session, 0, 0), "Session opened.");
        }

        public async Task<ApiResponse<SessionDto>> CloseSessionAsync(int sessionId, decimal closingCash)
        {
            var session = await _db.PosSessions.Include(s => s.Orders).FirstOrDefaultAsync(s => s.Id == sessionId);
            if (session == null) return ApiResponse<SessionDto>.Fail("Session not found.");
            session.Status = "Closed";
            session.ClosingCash = closingCash;
            session.ClosedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            var totalSales = session.Orders.Sum(o => o.TotalAmount);
            return ApiResponse<SessionDto>.Ok(MapSession(session, session.Orders.Count, totalSales), "Session closed.");
        }

        public async Task<ApiResponse<List<SessionDto>>> ListSessionsAsync(int companyId)
        {
            var sessions = await _db.PosSessions.Include(s => s.Orders)
                .Where(s => s.CompanyId == companyId)
                .OrderByDescending(s => s.OpenedAt).ToListAsync();
            return ApiResponse<List<SessionDto>>.Ok(sessions.Select(s =>
                MapSession(s, s.Orders.Count, s.Orders.Sum(o => o.TotalAmount))).ToList());
        }

        public async Task<ApiResponse<PosOrderDto>> CreateOrderAsync(CreatePosOrderDto dto)
        {
            var orderNumber = $"POS-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var order = new PosOrder
            {
                CompanyId = dto.CompanyId, SessionId = dto.SessionId,
                OrderNumber = orderNumber, CustomerId = dto.CustomerId, PaymentMode = dto.PaymentMode
            };

            foreach (var item in dto.Items)
            {
                var lineTotal = item.Quantity * item.UnitPrice;
                var discount = lineTotal * (item.DiscountPercent / 100);
                var tax = (lineTotal - discount) * (item.TaxPercent / 100);
                order.Items.Add(new PosOrderItem
                {
                    ProductId = item.ProductId, Quantity = item.Quantity, UnitPrice = item.UnitPrice,
                    TaxPercent = item.TaxPercent, DiscountPercent = item.DiscountPercent,
                    TotalPrice = lineTotal - discount + tax
                });
                order.SubTotal += lineTotal;
                order.DiscountAmount += discount;
                order.TaxAmount += tax;

                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQty -= item.Quantity;
                    _db.StockTransactions.Add(new StockTransaction
                    {
                        ProductId = item.ProductId, Quantity = item.Quantity,
                        Type = "OUT", Remarks = $"POS Sale {orderNumber}"
                    });
                }
            }
            order.TotalAmount = order.SubTotal - order.DiscountAmount + order.TaxAmount;

            _db.PosOrders.Add(order);
            await _db.SaveChangesAsync();
            return ApiResponse<PosOrderDto>.Ok(await GetOrderDtoAsync(order.Id), "Order created.");
        }

        public async Task<ApiResponse<PagedResult<PosOrderDto>>> ListOrdersAsync(int companyId, PaginationParams p)
        {
            var query = _db.PosOrders.Where(o => o.CompanyId == companyId);
            var total = await query.CountAsync();
            var items = await query.Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return ApiResponse<PagedResult<PosOrderDto>>.Ok(new PagedResult<PosOrderDto>
            {
                Items = items.Select(MapOrder).ToList(),
                TotalCount = total, Page = p.Page, PageSize = p.PageSize
            });
        }

        public async Task<ApiResponse<bool>> RefundOrderAsync(int id)
        {
            var order = await _db.PosOrders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return ApiResponse<bool>.Fail("Order not found.");
            order.Status = "Refunded";
            foreach (var item in order.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null) product.StockQty += item.Quantity;
            }
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Order refunded.");
        }

        private async Task<PosOrderDto> GetOrderDtoAsync(int id)
        {
            var order = await _db.PosOrders.Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Customer).FirstAsync(o => o.Id == id);
            return MapOrder(order);
        }

        private static SessionDto MapSession(PosSession s, int orderCount, decimal totalSales) => new()
        {
            Id = s.Id, CompanyId = s.CompanyId, CashierId = s.CashierId,
            CashierName = s.CashierName, OpeningCash = s.OpeningCash, ClosingCash = s.ClosingCash,
            Status = s.Status, OpenedAt = s.OpenedAt, ClosedAt = s.ClosedAt,
            OrderCount = orderCount, TotalSales = totalSales
        };

        private static PosOrderDto MapOrder(PosOrder o) => new()
        {
            Id = o.Id, CompanyId = o.CompanyId, SessionId = o.SessionId,
            OrderNumber = o.OrderNumber, CustomerId = o.CustomerId,
            CustomerName = o.Customer?.Name, SubTotal = o.SubTotal,
            TaxAmount = o.TaxAmount, DiscountAmount = o.DiscountAmount,
            TotalAmount = o.TotalAmount, PaymentMode = o.PaymentMode,
            Status = o.Status, OrderDate = o.OrderDate,
            Items = o.Items.Select(i => new PosOrderItemResultDto
            {
                ProductId = i.ProductId, ProductName = i.Product?.Name ?? "",
                Quantity = i.Quantity, UnitPrice = i.UnitPrice, TaxPercent = i.TaxPercent,
                DiscountPercent = i.DiscountPercent, TotalPrice = i.TotalPrice
            }).ToList()
        };
    }
}
