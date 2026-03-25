namespace ERPPlugandPlay.Models
{
    public class Salary
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
        public decimal Basic { get; set; }
        public decimal HRA { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
