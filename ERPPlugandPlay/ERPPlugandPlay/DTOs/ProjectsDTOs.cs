using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateProjectDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? ClientName { get; set; }
    }

    public class ProjectDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? ClientName { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TaskCount { get; set; }
    }

    public class CreateTaskDto
    {
        [Required] public int ProjectId { get; set; }
        [Required] public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public int? AssignedToUserId { get; set; }
        public DateTime? DueDate { get; set; }
    }

    public class ProjectTaskDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int? AssignedToUserId { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTimesheetDto
    {
        [Required] public int ProjectId { get; set; }
        [Required] public int EmployeeId { get; set; }
        [Required] public DateTime WorkDate { get; set; }
        [Required] public decimal HoursWorked { get; set; }
        public string? Description { get; set; }
        public decimal? BillableAmount { get; set; }
    }

    public class TimesheetDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime WorkDate { get; set; }
        public decimal HoursWorked { get; set; }
        public string? Description { get; set; }
        public decimal? BillableAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
