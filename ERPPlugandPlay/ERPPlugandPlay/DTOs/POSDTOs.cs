using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class OpenSessionDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int CashierId { get; set; }
        [Required] public string CashierName { get; set; } = string.Empty;
        public decimal OpeningCash { get; set; }
    }

    public class SessionDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int CashierId { get; set; }
        public string CashierName { get; set; } = string.Empty;
        public decimal OpeningCash { get; set; }
        public decimal ClosingCash { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public int OrderCount { get; set; }
        public decimal TotalSales { get; set; }
    }

    public class CreatePosOrderDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int SessionId { get; set; }
        public int? CustomerId { get; set; }
        public string PaymentMode { get; set; } = "Cash";
        [Required] public List<PosOrderItemDto> Items { get; set; } = new();
    }

    public class PosOrderItemDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int Quantity { get; set; }
        [Required] public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
    }

    public class PosOrderDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int SessionId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public List<PosOrderItemResultDto> Items { get; set; } = new();
    }

    public class PosOrderItemResultDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
