namespace ERPPlugandPlay.Models
{
    public class PurchaseInvoice
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int VendorId { get; set; }
        public Vendor Vendor { get; set; } = null!;
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
        public ICollection<PurchaseInvoiceItem> Items { get; set; } = new List<PurchaseInvoiceItem>();
        public ICollection<VendorPayment> Payments { get; set; } = new List<VendorPayment>();
        public ICollection<PurchaseReturn> Returns { get; set; } = new List<PurchaseReturn>();
    }
}
