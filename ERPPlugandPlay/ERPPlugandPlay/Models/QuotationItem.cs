namespace ERPPlugandPlay.Models
{
    public class QuotationItem
    {
        public int Id { get; set; }
        public int QuotationId { get; set; }
        public Quotation Quotation { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
