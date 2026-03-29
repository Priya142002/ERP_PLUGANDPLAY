namespace ERPPlugandPlay.Models
{
    public class FinancialYear
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        /// <summary>
        /// Human-readable unique code per company per year.
        /// Format: FY{YYYY}-{YY}-C{CompanyId:D4}
        /// Example: FY2025-26-C0001
        /// Generated automatically on create — never changes.
        /// </summary>
        public string FYCode { get; set; } = string.Empty;

        public string YearName { get; set; } = string.Empty; // e.g., "FY 2025-26"
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsClosed { get; set; } = false;
        public DateTime? ClosedAt { get; set; }
        public int? ClosedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

        // Navigation
        public ICollection<JournalVoucher> JournalVouchers { get; set; } = new List<JournalVoucher>();
        public ICollection<AccountOpeningBalance> OpeningBalances { get; set; } = new List<AccountOpeningBalance>();
    }
}
