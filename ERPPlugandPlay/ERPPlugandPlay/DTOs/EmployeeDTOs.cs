using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateEmployeeDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [EmailAddress] public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        [Required] public int DepartmentId { get; set; }
        [Required] public int DesignationId { get; set; }
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public decimal Salary { get; set; }
    }

    public class UpdateEmployeeDto : CreateEmployeeDto
    {
        public int Id { get; set; }
    }

    public class EmployeeDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; }
        public decimal Salary { get; set; }
    }
}
