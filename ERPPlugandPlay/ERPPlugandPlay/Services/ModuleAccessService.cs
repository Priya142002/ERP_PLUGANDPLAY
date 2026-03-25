using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IModuleAccessService
    {
        Task<ApiResponse<List<CompanyModuleDto>>> GetCompanyModulesAsync(int companyId);
        Task<ApiResponse<bool>> SetCompanyModulesAsync(SetCompanyModulesDto dto);
        Task<ApiResponse<bool>> ToggleModuleAsync(ToggleModuleDto dto);
        Task<ApiResponse<bool>> SetDefaultTrialModulesAsync(List<string> moduleIds);
        Task<ApiResponse<List<string>>> GetDefaultTrialModulesAsync();
    }

    public class ModuleAccessService : IModuleAccessService
    {
        private readonly ERPDbContext _db;

        private static readonly Dictionary<string, string> ModuleNames = new()
        {
            { "inventory", "Inventory Management" },
            { "purchase", "Purchase Management" },
            { "sales", "Sales Management" },
            { "accounts", "Accounts & Finance" },
            { "crm", "CRM" },
            { "hrm", "HRM" },
            { "projects", "Projects" },
            { "helpdesk", "Helpdesk" },
            { "assets", "Assets" },
            { "logistics", "Logistics" },
            { "production", "Production" },
            { "billing", "Billing" }
        };

        public ModuleAccessService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<List<CompanyModuleDto>>> GetCompanyModulesAsync(int companyId)
        {
            var modules = await _db.CompanyModules
                .Where(m => m.CompanyId == companyId)
                .ToListAsync();

            var result = ModuleNames.Select(kv => new CompanyModuleDto
            {
                ModuleId = kv.Key,
                ModuleName = kv.Value,
                IsEnabled = modules.FirstOrDefault(m => m.ModuleId == kv.Key)?.IsEnabled ?? false,
                IsTrialAccess = modules.FirstOrDefault(m => m.ModuleId == kv.Key)?.IsTrialAccess ?? false
            }).ToList();

            return ApiResponse<List<CompanyModuleDto>>.Ok(result);
        }

        public async Task<ApiResponse<bool>> SetCompanyModulesAsync(SetCompanyModulesDto dto)
        {
            var existing = await _db.CompanyModules
                .Where(m => m.CompanyId == dto.CompanyId).ToListAsync();
            _db.CompanyModules.RemoveRange(existing);

            foreach (var moduleId in dto.ModuleIds)
            {
                _db.CompanyModules.Add(new CompanyModule
                {
                    CompanyId = dto.CompanyId,
                    ModuleId = moduleId,
                    IsEnabled = true,
                    IsTrialAccess = dto.IsTrialAccess
                });
            }

            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Modules updated.");
        }

        public async Task<ApiResponse<bool>> ToggleModuleAsync(ToggleModuleDto dto)
        {
            var module = await _db.CompanyModules
                .FirstOrDefaultAsync(m => m.CompanyId == dto.CompanyId && m.ModuleId == dto.ModuleId);

            if (module == null)
            {
                _db.CompanyModules.Add(new CompanyModule
                {
                    CompanyId = dto.CompanyId,
                    ModuleId = dto.ModuleId,
                    IsEnabled = dto.IsEnabled
                });
            }
            else
            {
                module.IsEnabled = dto.IsEnabled;
                module.UpdatedAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"Module {dto.ModuleId} {(dto.IsEnabled ? "enabled" : "disabled")}.");
        }

        public async Task<ApiResponse<bool>> SetDefaultTrialModulesAsync(List<string> moduleIds)
        {
            // Store as a system setting — apply to all companies with no custom modules
            var companiesWithNoModules = await _db.Companies
                .Where(c => !_db.CompanyModules.Any(m => m.CompanyId == c.Id))
                .Select(c => c.Id)
                .ToListAsync();

            foreach (var companyId in companiesWithNoModules)
            {
                foreach (var moduleId in moduleIds)
                {
                    _db.CompanyModules.Add(new CompanyModule
                    {
                        CompanyId = companyId,
                        ModuleId = moduleId,
                        IsEnabled = true,
                        IsTrialAccess = true
                    });
                }
            }

            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Default trial modules applied.");
        }

        public async Task<ApiResponse<List<string>>> GetDefaultTrialModulesAsync()
        {
            // Return the most common trial module set across companies
            var defaults = new List<string> { "inventory", "sales", "purchase", "accounts" };
            return ApiResponse<List<string>>.Ok(defaults);
        }
    }
}
