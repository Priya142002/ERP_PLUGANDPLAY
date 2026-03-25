namespace ERPPlugandPlay.Models
{
    public class CompanyModule
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string ModuleId { get; set; } = string.Empty; // inventory, sales, hrm, etc.
        public bool IsEnabled { get; set; } = true;
        public bool IsTrialAccess { get; set; } = false;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
