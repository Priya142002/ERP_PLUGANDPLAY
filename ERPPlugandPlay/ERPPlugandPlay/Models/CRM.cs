namespace ERPPlugandPlay.Models
{
    public class Lead
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Company2 { get; set; } // lead's company name
        public string? Source { get; set; }
        public string Status { get; set; } = "New";
        public string? Notes { get; set; }
        public int? AssignedToUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
        public ICollection<CrmActivity> Activities { get; set; } = new List<CrmActivity>();
    }

    public class Opportunity
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int? LeadId { get; set; }
        public Lead? Lead { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Stage { get; set; } = "Prospecting";
        public DateTime? CloseDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CrmActivity
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int? LeadId { get; set; }
        public Lead? Lead { get; set; }
        public int? OpportunityId { get; set; }
        public Opportunity? Opportunity { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public bool IsDone { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
