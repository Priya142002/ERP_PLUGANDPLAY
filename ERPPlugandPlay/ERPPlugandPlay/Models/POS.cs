namespace ERPPlugandPlay.Models
{
    public class PosSession
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int CashierId { get; set; }
        public string CashierName { get; set; } = string.Empty;
        public decimal OpeningCash { get; set; }
        public decimal ClosingCash { get; set; }
        public string Status { get; set; } = "Open"; // Open | Closed
        public DateTime OpenedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
        public ICollection<PosOrder> Orders { get; set; } = new List<PosOrder>();
    }

    public class PosOrder
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int SessionId { get; set; }
        public PosSession Session { get; set; } = null!;
        public string OrderNumber { get; set; } = string.Empty;
        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMode { get; set; } = "Cash";
        public string Status { get; set; } = "Completed"; // Completed | Refunded | Cancelled
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public ICollection<PosOrderItem> Items { get; set; } = new List<PosOrderItem>();
    }

    public class PosOrderItem
    {
        public int Id { get; set; }
        public int PosOrderId { get; set; }
        public PosOrder PosOrder { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
