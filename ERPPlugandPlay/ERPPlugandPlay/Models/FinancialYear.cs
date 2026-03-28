namespace ERPPlugandPlay.Models
{
    public class FinancialYear
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string YearName { get; set; } = string.Empty; // e.g., "FY 2024-25"
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
    }
}
