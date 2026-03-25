namespace ERPPlugandPlay.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }
}
