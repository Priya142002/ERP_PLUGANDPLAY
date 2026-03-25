namespace ERPPlugandPlay.Models
{
    public class JournalVoucherEntry
    {
        public int Id { get; set; }
        public int JournalVoucherId { get; set; }
        public JournalVoucher JournalVoucher { get; set; } = null!;
        public int AccountId { get; set; }
        public ChartOfAccount Account { get; set; } = null!;
        public string Type { get; set; } = string.Empty; // Debit, Credit
        public decimal Amount { get; set; }
        public string? Narration { get; set; }
    }
}
