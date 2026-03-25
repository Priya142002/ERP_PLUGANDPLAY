namespace ERPPlugandPlay.Models
{
    public class ChartOfAccount
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty; // Asset, Liability, Equity, Income, Expense
        public string? ParentAccountCode { get; set; }
        public decimal OpeningBalance { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<JournalVoucherEntry> JournalEntries { get; set; } = new List<JournalVoucherEntry>();
    }
}
