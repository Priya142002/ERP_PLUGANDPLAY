namespace ERPPlugandPlay.Models
{
    public class PaymentMode
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string ModeName { get; set; } = string.Empty; // Cash, Cheque, NEFT, RTGS, UPI, Card
        public string? Description { get; set; }
        public int? DefaultAccountId { get; set; }
        public ChartOfAccount? DefaultAccount { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
