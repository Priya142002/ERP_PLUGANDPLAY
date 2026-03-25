namespace ERPPlugandPlay.Models
{
    public class PaymentVoucher
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public string PayTo { get; set; } = string.Empty;
        public int AccountId { get; set; }
        public ChartOfAccount Account { get; set; } = null!;
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = string.Empty; // Cash, Bank, Cheque, UPI
        public string? ReferenceNumber { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Draft"; // Draft, Posted, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
