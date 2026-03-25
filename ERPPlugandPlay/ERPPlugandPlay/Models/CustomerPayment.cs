namespace ERPPlugandPlay.Models
{
    public class CustomerPayment
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public int SalesInvoiceId { get; set; }
        public SalesInvoice SalesInvoice { get; set; } = null!;
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = string.Empty; // Cash, Bank, Cheque, UPI
        public string? ReferenceNumber { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
