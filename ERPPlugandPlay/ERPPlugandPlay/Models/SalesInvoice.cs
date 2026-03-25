namespace ERPPlugandPlay.Models
{
    public class SalesInvoice
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public int? QuotationId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Partial, Paid, Cancelled
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<SalesInvoiceItem> Items { get; set; } = new List<SalesInvoiceItem>();
        public ICollection<CustomerPayment> Payments { get; set; } = new List<CustomerPayment>();
        public ICollection<SalesReturn> Returns { get; set; } = new List<SalesReturn>();
    }
}
