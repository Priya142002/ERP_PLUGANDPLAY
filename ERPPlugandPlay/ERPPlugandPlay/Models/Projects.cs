namespace ERPPlugandPlay.Models
{
    public class Project
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string ProjectName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "Planning"; // Planning | Active | On Hold | Completed | Cancelled
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? ClientName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
        public ICollection<Timesheet> Timesheets { get; set; } = new List<Timesheet>();
    }

    public class ProjectTask
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium"; // Low | Medium | High | Critical
        public string Status { get; set; } = "Todo"; // Todo | In Progress | Review | Done
        public int? AssignedToUserId { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Timesheet
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
        public DateTime WorkDate { get; set; }
        public decimal HoursWorked { get; set; }
        public string? Description { get; set; }
        public decimal? BillableAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
