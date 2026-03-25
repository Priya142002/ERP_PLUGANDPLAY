namespace ERPPlugandPlay.Models
{
    public class BillOfMaterial
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int FinishedProductId { get; set; }
        public Product FinishedProduct { get; set; } = null!;
        public string BomCode { get; set; } = string.Empty;
        public decimal Quantity { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<BomItem> Items { get; set; } = new List<BomItem>();
    }

    public class BomItem
    {
        public int Id { get; set; }
        public int BomId { get; set; }
        public BillOfMaterial Bom { get; set; } = null!;
        public int RawMaterialProductId { get; set; }
        public Product RawMaterial { get; set; } = null!;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "pcs";
    }

    public class ProductionOrder
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string OrderNumber { get; set; } = string.Empty;
        public int BomId { get; set; }
        public BillOfMaterial Bom { get; set; } = null!;
        public decimal PlannedQty { get; set; }
        public decimal ProducedQty { get; set; }
        public string Status { get; set; } = "Draft"; // Draft | In Progress | Completed | Cancelled
        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class QualityCheck
    {
        public int Id { get; set; }
        public int ProductionOrderId { get; set; }
        public ProductionOrder ProductionOrder { get; set; } = null!;
        public DateTime CheckDate { get; set; }
        public decimal SampleSize { get; set; }
        public decimal PassedQty { get; set; }
        public decimal RejectedQty { get; set; }
        public string Result { get; set; } = "Pass"; // Pass | Fail | Partial
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
