namespace ERPPlugandPlay.Models
{
    public class CompanySubscription
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int PlanId { get; set; }
        public SubscriptionPlan Plan { get; set; } = null!;
        public string Status { get; set; } = "Active"; // Active, Suspended, Expired, Trial
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public DateTime NextBillingDate { get; set; }
        public int UsedSeats { get; set; } = 0;
        public bool IsProrated { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
