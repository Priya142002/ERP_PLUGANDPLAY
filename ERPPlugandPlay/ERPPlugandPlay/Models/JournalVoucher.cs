namespace ERPPlugandPlay.Models
{
    public class JournalVoucher
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, Posted, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<JournalVoucherEntry> Entries { get; set; } = new List<JournalVoucherEntry>();
    }
}
