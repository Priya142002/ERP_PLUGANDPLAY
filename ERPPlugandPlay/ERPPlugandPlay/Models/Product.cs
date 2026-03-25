namespace ERPPlugandPlay.Models
{
    public class Product
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int? BrandId { get; set; }
        public Brand? Brand { get; set; }
        public int? UnitId { get; set; }
        public Unit? Unit { get; set; }

        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public string Status { get; set; } = "Active"; // Active, Low Stock, Out of Stock
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }
}
