using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateAssetDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
        public string DepreciationMethod { get; set; } = "StraightLine";
        public decimal DepreciationRate { get; set; }
        public int? AssignedToEmployeeId { get; set; }
        public string? Location { get; set; }
    }

    public class AssetDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string AssetCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal CurrentValue { get; set; }
        public string DepreciationMethod { get; set; } = string.Empty;
        public decimal DepreciationRate { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? AssignedToEmployeeId { get; set; }
        public string? AssignedToEmployeeName { get; set; }
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMaintenanceDto
    {
        [Required] public int AssetId { get; set; }
        [Required] public DateTime MaintenanceDate { get; set; }
        [Required] public string Type { get; set; } = string.Empty;
        [Required] public string Description { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string? ServiceProvider { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
    }

    public class MaintenanceDto
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public DateTime MaintenanceDate { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string? ServiceProvider { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateDisposalDto
    {
        [Required] public int AssetId { get; set; }
        [Required] public DateTime DisposalDate { get; set; }
        [Required] public string Method { get; set; } = string.Empty;
        public decimal SaleValue { get; set; }
        public string? Remarks { get; set; }
    }

    public class DisposalDto
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public DateTime DisposalDate { get; set; }
        public string Method { get; set; } = string.Empty;
        public decimal SaleValue { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
