using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class GenerateSalaryDto
    {
        [Required] public int EmployeeId { get; set; }
        [Required, Range(1, 12)] public int Month { get; set; }
        [Required] public int Year { get; set; }
        public decimal Basic { get; set; }
        public decimal HRA { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
    }

    public class SalaryDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public decimal Basic { get; set; }
        public decimal HRA { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class PayrollReportDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public int TotalEmployees { get; set; }
        public decimal TotalNetSalary { get; set; }
        public List<SalaryDto> Salaries { get; set; } = new();
    }
}
