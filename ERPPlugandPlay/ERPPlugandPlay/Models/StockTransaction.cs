namespace ERPPlugandPlay.Models
{
    public class StockTransaction
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
        public string Type { get; set; } = string.Empty; // IN / OUT
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? Remarks { get; set; }
    }
}
