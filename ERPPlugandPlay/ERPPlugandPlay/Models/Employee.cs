namespace ERPPlugandPlay.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
        public int DesignationId { get; set; }
        public Designation Designation { get; set; } = null!;
        public DateTime JoinDate { get; set; }
        public decimal Salary { get; set; }
        public ICollection<Salary> Salaries { get; set; } = new List<Salary>();
    }
}
