using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateBomDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int FinishedProductId { get; set; }
        public decimal Quantity { get; set; } = 1;
        [Required] public List<BomItemDto> Items { get; set; } = new();
    }

    public class BomItemDto
    {
        [Required] public int RawMaterialProductId { get; set; }
        [Required] public decimal Quantity { get; set; }
        public string Unit { get; set; } = "pcs";
    }

    public class BomDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int FinishedProductId { get; set; }
        public string FinishedProductName { get; set; } = string.Empty;
        public string BomCode { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<BomItemResultDto> Items { get; set; } = new();
    }

    public class BomItemResultDto
    {
        public int RawMaterialProductId { get; set; }
        public string RawMaterialName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;
    }

    public class CreateProductionOrderDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int BomId { get; set; }
        [Required] public decimal PlannedQty { get; set; }
        [Required] public DateTime PlannedStartDate { get; set; }
        [Required] public DateTime PlannedEndDate { get; set; }
    }

    public class ProductionOrderDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int BomId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal PlannedQty { get; set; }
        public decimal ProducedQty { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateQualityCheckDto
    {
        [Required] public int ProductionOrderId { get; set; }
        [Required] public DateTime CheckDate { get; set; }
        [Required] public decimal SampleSize { get; set; }
        [Required] public decimal PassedQty { get; set; }
        [Required] public decimal RejectedQty { get; set; }
        public string? Remarks { get; set; }
    }

    public class QualityCheckDto
    {
        public int Id { get; set; }
        public int ProductionOrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime CheckDate { get; set; }
        public decimal SampleSize { get; set; }
        public decimal PassedQty { get; set; }
        public decimal RejectedQty { get; set; }
        public string Result { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
