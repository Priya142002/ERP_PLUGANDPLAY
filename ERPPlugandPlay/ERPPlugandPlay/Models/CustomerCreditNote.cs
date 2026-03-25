namespace ERPPlugandPlay.Models
{
    public class CustomerCreditNote
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public int? SalesInvoiceId { get; set; }
        public string NoteNumber { get; set; } = string.Empty;
        public DateTime NoteDate { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Open"; // Open, Applied, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
