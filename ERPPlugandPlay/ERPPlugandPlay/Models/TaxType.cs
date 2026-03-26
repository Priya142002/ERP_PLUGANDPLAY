namespace ERPPlugandPlay.Models
{
    public class TaxType
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty; // GST, VAT, etc.
        public decimal Percentage { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
