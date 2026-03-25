namespace ERPPlugandPlay.Models
{
    public class Brand
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Unit
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string Abbreviation { get; set; } = string.Empty;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Warehouse
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
    }
}
