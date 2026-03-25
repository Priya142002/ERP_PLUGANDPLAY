using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class MarkAttendanceDto
    {
        [Required] public int EmployeeId { get; set; }
        [Required] public DateTime Date { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; } = "Present";
        public string? Remarks { get; set; }
    }

    public class AttendanceDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
    }

    public class CreateLeaveTypeDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        public int MaxDaysPerYear { get; set; }
        public bool IsPaid { get; set; } = true;
    }

    public class LeaveTypeDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int MaxDaysPerYear { get; set; }
        public bool IsPaid { get; set; }
    }

    public class CreateLeaveRequestDto
    {
        [Required] public int EmployeeId { get; set; }
        [Required] public int LeaveTypeId { get; set; }
        [Required] public DateTime FromDate { get; set; }
        [Required] public DateTime ToDate { get; set; }
        [Required] public string Reason { get; set; } = string.Empty;
    }

    public class LeaveRequestDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int TotalDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ApproverRemarks { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
