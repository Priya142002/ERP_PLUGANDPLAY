namespace ERPPlugandPlay.Models
{
    public class Quotation
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public string QuotationNumber { get; set; } = string.Empty;
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, Sent, Accepted, Rejected, Converted
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<QuotationItem> Items { get; set; } = new List<QuotationItem>();
    }
}
