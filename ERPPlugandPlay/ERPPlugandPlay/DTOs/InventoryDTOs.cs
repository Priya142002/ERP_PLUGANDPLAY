using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateProductDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public int CategoryId { get; set; }
        public decimal Price { get; set; }
        public int StockQty { get; set; }
    }

    public class UpdateProductDto : CreateProductDto
    {
        public int Id { get; set; }
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQty { get; set; }
    }

    public class UpdateStockDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int Quantity { get; set; }
        [Required] public string Type { get; set; } = string.Empty; // IN / OUT
        public string? Remarks { get; set; }
    }

    public class StockTransactionDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Remarks { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required] public string Name { get; set; } = string.Empty;
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    // ── Inventory Dashboard ───────────────────────────────────────
    public class InventoryDashboardDto
    {
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public int LowStockCount { get; set; }
        public int OutOfStockCount { get; set; }
        public decimal TotalInventoryValue { get; set; }
        public int TodayDispatches { get; set; }
        public int TodayReceives { get; set; }
        public List<LowStockItemDto> LowStockItems { get; set; } = new();
        public List<StockTransactionDto> RecentTransactions { get; set; } = new();
    }

    public class LowStockItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int StockQty { get; set; }
        public decimal Price { get; set; }
    }

    // ── Material Dispatch ─────────────────────────────────────────
    public class CreateDispatchDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string DispatchedTo { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime DispatchDate { get; set; } = DateTime.UtcNow;
        [Required] public List<DispatchItemDto> Items { get; set; } = new();
    }

    public class DispatchItemDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int Quantity { get; set; }
    }

    public class MaterialDispatchDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string DispatchNumber { get; set; } = string.Empty;
        public string DispatchedTo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime DispatchDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<DispatchItemResultDto> Items { get; set; } = new();
    }

    public class DispatchItemResultDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    // ── Product Transfer ──────────────────────────────────────────
    public class CreateTransferDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string FromLocation { get; set; } = string.Empty;
        [Required] public string ToLocation { get; set; } = string.Empty;
        public DateTime TransferDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        [Required] public List<TransferItemDto> Items { get; set; } = new();
    }

    public class TransferItemDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int Quantity { get; set; }
    }

    public class ProductTransferDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string TransferNumber { get; set; } = string.Empty;
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime TransferDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TransferItemResultDto> Items { get; set; } = new();
    }

    public class TransferItemResultDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    // ── Product Receive (GRN) ─────────────────────────────────────
    public class CreateReceiveDto
    {
        [Required] public int CompanyId { get; set; }
        public int? VendorId { get; set; }
        public string? PurchaseOrderRef { get; set; }
        public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        [Required] public List<ReceiveItemDto> Items { get; set; } = new();
    }

    public class ReceiveItemDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int OrderedQty { get; set; }
        [Required] public int ReceivedQty { get; set; }
        public decimal UnitCost { get; set; }
    }

    public class ProductReceiveDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string GrnNumber { get; set; } = string.Empty;
        public int? VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? PurchaseOrderRef { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime ReceivedDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ReceiveItemResultDto> Items { get; set; } = new();
    }

    public class ReceiveItemResultDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int OrderedQty { get; set; }
        public int ReceivedQty { get; set; }
        public decimal UnitCost { get; set; }
    }
}
