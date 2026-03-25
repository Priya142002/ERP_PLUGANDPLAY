using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateLeadDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Source { get; set; }
        public string? Notes { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    public class LeadDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Source { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public int? AssignedToUserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateOpportunityDto
    {
        [Required] public int CompanyId { get; set; }
        public int? LeadId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Stage { get; set; } = "Prospecting";
        public DateTime? CloseDate { get; set; }
        public string? Notes { get; set; }
    }

    public class OpportunityDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int? LeadId { get; set; }
        public string? LeadName { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Stage { get; set; } = string.Empty;
        public DateTime? CloseDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateActivityDto
    {
        [Required] public int CompanyId { get; set; }
        public int? LeadId { get; set; }
        public int? OpportunityId { get; set; }
        [Required] public string Type { get; set; } = string.Empty;
        [Required] public string Subject { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime? ScheduledAt { get; set; }
    }

    public class ActivityDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int? LeadId { get; set; }
        public string? LeadName { get; set; }
        public int? OpportunityId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public bool IsDone { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
