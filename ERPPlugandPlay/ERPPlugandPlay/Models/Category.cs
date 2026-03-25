namespace ERPPlugandPlay.Models
{
    public class Category
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
