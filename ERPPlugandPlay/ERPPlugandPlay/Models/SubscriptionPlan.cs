namespace ERPPlugandPlay.Models
{
    public class SubscriptionPlan
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Basic, Pro, Enterprise
        public decimal MonthlyPrice { get; set; }
        public string PlanType { get; set; } = "Monthly"; // Monthly, Yearly, Quarterly
        public int MaxSeats { get; set; } // 0 = unlimited
        public int MaxModules { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<CompanySubscription> CompanySubscriptions { get; set; } = new List<CompanySubscription>();
    }
}
