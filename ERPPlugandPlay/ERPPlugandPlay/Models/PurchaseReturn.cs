namespace ERPPlugandPlay.Models
{
    public class PurchaseReturn
    {
        public int Id { get; set; }
        public int PurchaseInvoiceId { get; set; }
        public PurchaseInvoice PurchaseInvoice { get; set; } = null!;
        public string ReturnNumber { get; set; } = string.Empty;
        public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
        public decimal ReturnAmount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<PurchaseReturnItem> Items { get; set; } = new List<PurchaseReturnItem>();
    }
}
