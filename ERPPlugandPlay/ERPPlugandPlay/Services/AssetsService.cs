using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IAssetsService
    {
        Task<ApiResponse<AssetDto>> CreateAssetAsync(CreateAssetDto dto);
        Task<ApiResponse<PagedResult<AssetDto>>> ListAssetsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<AssetDto>> UpdateAssetAsync(int id, CreateAssetDto dto);
        Task<ApiResponse<bool>> DeleteAssetAsync(int id);

        Task<ApiResponse<MaintenanceDto>> LogMaintenanceAsync(CreateMaintenanceDto dto);
        Task<ApiResponse<List<MaintenanceDto>>> ListMaintenanceAsync(int assetId);

        Task<ApiResponse<DisposalDto>> DisposeAssetAsync(CreateDisposalDto dto);
        Task<ApiResponse<List<DisposalDto>>> ListDisposalsAsync(int companyId);
    }

    public class AssetsService : IAssetsService
    {
        private readonly ERPDbContext _db;
        public AssetsService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<AssetDto>> CreateAssetAsync(CreateAssetDto dto)
        {
            var assetCode = $"AST-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var asset = new Asset
            {
                CompanyId = dto.CompanyId, AssetCode = assetCode, Name = dto.Name,
                Category = dto.Category, Description = dto.Description,
                PurchasePrice = dto.PurchasePrice, PurchaseDate = dto.PurchaseDate,
                CurrentValue = dto.PurchasePrice,
                DepreciationMethod = dto.DepreciationMethod, DepreciationRate = dto.DepreciationRate,
                AssignedToEmployeeId = dto.AssignedToEmployeeId, Location = dto.Location
            };
            _db.Assets.Add(asset);
            await _db.SaveChangesAsync();
            return ApiResponse<AssetDto>.Ok(await GetAssetDtoAsync(asset.Id), "Asset created.");
        }

        public async Task<ApiResponse<PagedResult<AssetDto>>> ListAssetsAsync(int companyId, PaginationParams p)
        {
            var query = _db.Assets.Where(a => a.CompanyId == companyId && a.Status != "Disposed");
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(a => a.Name.Contains(p.Search) || a.AssetCode.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Include(a => a.AssignedToEmployee)
                .OrderByDescending(a => a.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .ToListAsync();

            return ApiResponse<PagedResult<AssetDto>>.Ok(new PagedResult<AssetDto>
            {
                Items = items.Select(MapAsset).ToList(),
                TotalCount = total, Page = p.Page, PageSize = p.PageSize
            });
        }

        public async Task<ApiResponse<AssetDto>> UpdateAssetAsync(int id, CreateAssetDto dto)
        {
            var asset = await _db.Assets.FindAsync(id);
            if (asset == null) return ApiResponse<AssetDto>.Fail("Asset not found.");
            asset.Name = dto.Name; asset.Category = dto.Category; asset.Description = dto.Description;
            asset.DepreciationMethod = dto.DepreciationMethod; asset.DepreciationRate = dto.DepreciationRate;
            asset.AssignedToEmployeeId = dto.AssignedToEmployeeId; asset.Location = dto.Location;
            await _db.SaveChangesAsync();
            return ApiResponse<AssetDto>.Ok(await GetAssetDtoAsync(asset.Id));
        }

        public async Task<ApiResponse<bool>> DeleteAssetAsync(int id)
        {
            var asset = await _db.Assets.FindAsync(id);
            if (asset == null) return ApiResponse<bool>.Fail("Asset not found.");
            asset.Status = "Disposed";
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Asset disposed.");
        }

        public async Task<ApiResponse<MaintenanceDto>> LogMaintenanceAsync(CreateMaintenanceDto dto)
        {
            var log = new AssetMaintenance
            {
                AssetId = dto.AssetId, MaintenanceDate = dto.MaintenanceDate,
                Type = dto.Type, Description = dto.Description, Cost = dto.Cost,
                ServiceProvider = dto.ServiceProvider, NextMaintenanceDate = dto.NextMaintenanceDate
            };
            _db.AssetMaintenances.Add(log);
            var asset = await _db.Assets.FindAsync(dto.AssetId);
            if (asset != null) asset.Status = "Under Maintenance";
            await _db.SaveChangesAsync();
            return ApiResponse<MaintenanceDto>.Ok(new MaintenanceDto
            {
                Id = log.Id, AssetId = log.AssetId, AssetName = asset?.Name ?? "",
                MaintenanceDate = log.MaintenanceDate, Type = log.Type, Description = log.Description,
                Cost = log.Cost, ServiceProvider = log.ServiceProvider,
                NextMaintenanceDate = log.NextMaintenanceDate, CreatedAt = log.CreatedAt
            }, "Maintenance logged.");
        }

        public async Task<ApiResponse<List<MaintenanceDto>>> ListMaintenanceAsync(int assetId)
        {
            var asset = await _db.Assets.FindAsync(assetId);
            var logs = await _db.AssetMaintenances.Where(m => m.AssetId == assetId)
                .OrderByDescending(m => m.MaintenanceDate).ToListAsync();
            return ApiResponse<List<MaintenanceDto>>.Ok(logs.Select(m => new MaintenanceDto
            {
                Id = m.Id, AssetId = m.AssetId, AssetName = asset?.Name ?? "",
                MaintenanceDate = m.MaintenanceDate, Type = m.Type, Description = m.Description,
                Cost = m.Cost, ServiceProvider = m.ServiceProvider,
                NextMaintenanceDate = m.NextMaintenanceDate, CreatedAt = m.CreatedAt
            }).ToList());
        }

        public async Task<ApiResponse<DisposalDto>> DisposeAssetAsync(CreateDisposalDto dto)
        {
            var asset = await _db.Assets.FindAsync(dto.AssetId);
            if (asset == null) return ApiResponse<DisposalDto>.Fail("Asset not found.");

            var disposal = new AssetDisposal
            {
                AssetId = dto.AssetId, DisposalDate = dto.DisposalDate,
                Method = dto.Method, SaleValue = dto.SaleValue, Remarks = dto.Remarks
            };
            _db.AssetDisposals.Add(disposal);
            asset.Status = "Disposed";
            await _db.SaveChangesAsync();
            return ApiResponse<DisposalDto>.Ok(new DisposalDto
            {
                Id = disposal.Id, AssetId = disposal.AssetId, AssetName = asset.Name,
                DisposalDate = disposal.DisposalDate, Method = disposal.Method,
                SaleValue = disposal.SaleValue, Remarks = disposal.Remarks, CreatedAt = disposal.CreatedAt
            }, "Asset disposed.");
        }

        public async Task<ApiResponse<List<DisposalDto>>> ListDisposalsAsync(int companyId)
        {
            var disposals = await _db.AssetDisposals.Include(d => d.Asset)
                .Where(d => d.Asset.CompanyId == companyId)
                .OrderByDescending(d => d.DisposalDate).ToListAsync();
            return ApiResponse<List<DisposalDto>>.Ok(disposals.Select(d => new DisposalDto
            {
                Id = d.Id, AssetId = d.AssetId, AssetName = d.Asset?.Name ?? "",
                DisposalDate = d.DisposalDate, Method = d.Method,
                SaleValue = d.SaleValue, Remarks = d.Remarks, CreatedAt = d.CreatedAt
            }).ToList());
        }

        private async Task<AssetDto> GetAssetDtoAsync(int id)
        {
            var asset = await _db.Assets.Include(a => a.AssignedToEmployee).FirstAsync(a => a.Id == id);
            return MapAsset(asset);
        }

        private static AssetDto MapAsset(Asset a) => new()
        {
            Id = a.Id, CompanyId = a.CompanyId, AssetCode = a.AssetCode, Name = a.Name,
            Category = a.Category, Description = a.Description, PurchasePrice = a.PurchasePrice,
            PurchaseDate = a.PurchaseDate, CurrentValue = a.CurrentValue,
            DepreciationMethod = a.DepreciationMethod, DepreciationRate = a.DepreciationRate,
            Status = a.Status, AssignedToEmployeeId = a.AssignedToEmployeeId,
            AssignedToEmployeeName = a.AssignedToEmployee?.Name,
            Location = a.Location, CreatedAt = a.CreatedAt
        };
    }
}
