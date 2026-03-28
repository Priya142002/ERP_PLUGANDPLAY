namespace ERPPlugandPlay.Models
{
    public class BankAccount
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int AccountId { get; set; }
        public ChartOfAccount Account { get; set; } = null!;
        public string BankName { get; set; } = string.Empty;
        public string BranchName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string? IFSCCode { get; set; }
        public string? SwiftCode { get; set; }
        public string AccountType { get; set; } = "Current"; // Savings, Current, OD
        public decimal OpeningBalance { get; set; }
        public decimal CurrentBalance { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
