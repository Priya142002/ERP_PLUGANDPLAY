namespace ERPPlugandPlay.Models
{
    public class Designation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CompanyId { get; set; }
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
