namespace ERPPlugandPlay.Models
{
    public class SalesReturn
    {
        public int Id { get; set; }
        public int SalesInvoiceId { get; set; }
        public SalesInvoice SalesInvoice { get; set; } = null!;
        public string ReturnNumber { get; set; } = string.Empty;
        public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
        public decimal ReturnAmount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<SalesReturnItem> Items { get; set; } = new List<SalesReturnItem>();
    }
}
