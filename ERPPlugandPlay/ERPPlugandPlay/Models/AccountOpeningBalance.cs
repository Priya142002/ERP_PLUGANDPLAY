namespace ERPPlugandPlay.Models
{
    public class AccountOpeningBalance
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int FinancialYearId { get; set; }
        public FinancialYear FinancialYear { get; set; } = null!;
        public int AccountId { get; set; }
        public ChartOfAccount Account { get; set; } = null!;
        public decimal OpeningBalance { get; set; }
        public string BalanceType { get; set; } = "Debit"; // Debit or Credit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
