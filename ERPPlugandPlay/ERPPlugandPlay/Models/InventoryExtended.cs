namespace ERPPlugandPlay.Models
{
    // Material Dispatch — outbound from warehouse to a destination/department
    public class MaterialDispatch
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string DispatchNumber { get; set; } = string.Empty;
        public string DispatchedTo { get; set; } = string.Empty;   // department / location / person
        public string? Notes { get; set; }
        public string Status { get; set; } = "Pending";            // Pending | Dispatched | Cancelled
        public DateTime DispatchDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<MaterialDispatchItem> Items { get; set; } = new List<MaterialDispatchItem>();
    }

    public class MaterialDispatchItem
    {
        public int Id { get; set; }
        public int DispatchId { get; set; }
        public MaterialDispatch Dispatch { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
    }

    // Product Transfer — move stock between warehouses / locations
    public class ProductTransfer
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string TransferNumber { get; set; } = string.Empty;
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";            // Pending | Transferred | Cancelled
        public DateTime TransferDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ProductTransferItem> Items { get; set; } = new List<ProductTransferItem>();
    }

    public class ProductTransferItem
    {
        public int Id { get; set; }

        public int TransferId { get; set; }
        public ProductTransfer Transfer { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
    }

    // Product Receive — inbound goods receipt (GRN)
    public class ProductReceive
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string GrnNumber { get; set; } = string.Empty;
        public int? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        public string? PurchaseOrderRef { get; set; }
        public string Status { get; set; } = "Received";
        public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ProductReceiveItem> Items { get; set; } = new List<ProductReceiveItem>();
    }

    public class ProductReceiveItem
    {
        public int Id { get; set; }
        public int ReceiveId { get; set; }
        public ProductReceive Receive { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int OrderedQty { get; set; }
        public int ReceivedQty { get; set; }
        public decimal UnitCost { get; set; }
    }
}
