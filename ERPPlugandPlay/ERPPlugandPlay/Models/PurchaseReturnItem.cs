namespace ERPPlugandPlay.Models
{
    public class PurchaseReturnItem
    {
        public int Id { get; set; }
        public int PurchaseReturnId { get; set; }
        public PurchaseReturn PurchaseReturn { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
