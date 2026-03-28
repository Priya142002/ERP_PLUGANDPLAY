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
        public string AccountGroup { get; set; } = string.Empty; // Current Asset, Fixed Asset, Direct Income, etc.
        public string? ParentAccountCode { get; set; }
        public bool IsGroup { get; set; } = false; // Group accounts can't have transactions
        public int Level { get; set; } = 1; // Hierarchy depth
        public decimal OpeningBalance { get; set; }
        public string OpeningBalanceType { get; set; } = "Debit"; // Debit or Credit
        public string Currency { get; set; } = "INR";
        public string? TaxType { get; set; } // GST, VAT, None
        public bool IsBankAccount { get; set; } = false;
        public bool IsSystemAccount { get; set; } = false; // Prevent deletion
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        
        public ICollection<JournalVoucherEntry> JournalEntries { get; set; } = new List<JournalVoucherEntry>();
        public ICollection<AccountOpeningBalance> OpeningBalances { get; set; } = new List<AccountOpeningBalance>();
    }
}
