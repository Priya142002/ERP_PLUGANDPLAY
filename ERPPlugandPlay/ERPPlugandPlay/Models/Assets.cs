namespace ERPPlugandPlay.Models
{
    public class Asset
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string AssetCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal CurrentValue { get; set; }
        public string DepreciationMethod { get; set; } = "StraightLine"; // StraightLine | DecliningBalance
        public decimal DepreciationRate { get; set; } // % per year
        public string Status { get; set; } = "Active"; // Active | Under Maintenance | Disposed
        public int? AssignedToEmployeeId { get; set; }
        public Employee? AssignedToEmployee { get; set; }
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<AssetMaintenance> MaintenanceLogs { get; set; } = new List<AssetMaintenance>();
    }

    public class AssetMaintenance
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;
        public DateTime MaintenanceDate { get; set; }
        public string Type { get; set; } = string.Empty; // Preventive | Corrective
        public string Description { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string? ServiceProvider { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AssetDisposal
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;
        public DateTime DisposalDate { get; set; }
        public string Method { get; set; } = string.Empty; // Sale | Scrap | Donation
        public decimal SaleValue { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
