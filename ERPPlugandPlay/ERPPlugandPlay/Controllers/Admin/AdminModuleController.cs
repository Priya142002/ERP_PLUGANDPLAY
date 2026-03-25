using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/modules")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public class AdminModuleController : ControllerBase
    {
        private readonly ERPDbContext _db;
        private readonly IModuleAccessService _moduleService;
        private readonly ISubscriptionService _subscriptionService;

        public AdminModuleController(ERPDbContext db, IModuleAccessService moduleService, ISubscriptionService subscriptionService)
        {
            _db = db;
            _moduleService = moduleService;
            _subscriptionService = subscriptionService;
        }

        /// <summary>GET /api/admin/modules/{companyId} — all modules with enabled/trial flags</summary>
        [HttpGet("{companyId}")]
        public async Task<IActionResult> GetModules(int companyId)
        {
            var modules = await _db.CompanyModules
                .Where(m => m.CompanyId == companyId)
                .Select(m => new
                {
                    m.Id,
                    m.ModuleId,
                    m.IsEnabled,
                    m.IsTrialAccess,
                    m.UpdatedAt
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.Ok(modules));
        }

        /// <summary>
        /// PUT /api/admin/modules/{companyId}/trial-modules
        /// Admin sets which modules are accessible during trial.
        /// Body: { "moduleIds": ["inventory","sales","hrm"] }
        /// </summary>
        [HttpPut("{companyId}/trial-modules")]
        public async Task<IActionResult> SetTrialModules(int companyId, [FromBody] SetTrialModulesDto dto)
        {
            var company = await _db.Companies.FindAsync(companyId);
            if (company == null)
                return NotFound(ApiResponse<bool>.Fail("Company not found."));

            var existing = await _db.CompanyModules
                .Where(m => m.CompanyId == companyId)
                .ToListAsync();

            foreach (var mod in existing)
            {
                mod.IsTrialAccess = dto.ModuleIds.Contains(mod.ModuleId);
                mod.UpdatedAt = DateTime.UtcNow;
            }

            // Add any new module entries that don't exist yet
            foreach (var moduleId in dto.ModuleIds)
            {
                if (!existing.Any(m => m.ModuleId == moduleId))
                {
                    _db.CompanyModules.Add(new CompanyModule
                    {
                        CompanyId     = companyId,
                        ModuleId      = moduleId,
                        IsEnabled     = true,
                        IsTrialAccess = true,
                        UpdatedAt     = DateTime.UtcNow
                    });
                }
            }

            await _db.SaveChangesAsync();
            return Ok(ApiResponse<bool>.Ok(true, $"Trial modules updated. {dto.ModuleIds.Count} module(s) enabled for trial."));
        }

        /// <summary>
        /// PATCH /api/admin/modules/toggle — toggle a single module on/off
        /// </summary>
        [HttpPatch("toggle")]
        public async Task<IActionResult> Toggle([FromBody] ToggleModuleDto dto)
        {
            var result = await _moduleService.ToggleModuleAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>GET /api/admin/modules/{companyId}/subscription</summary>
        [HttpGet("{companyId}/subscription")]
        public async Task<IActionResult> GetSubscription(int companyId)
        {
            var result = await _subscriptionService.GetCompanySubscriptionAsync(companyId);
            return Ok(result);
        }

        /// <summary>GET /api/admin/modules/{companyId}/allowed — returns only the modules the company can access right now</summary>
        [HttpGet("{companyId}/allowed")]
        public async Task<IActionResult> GetAllowedModules(int companyId)
        {
            var company = await _db.Companies
                .Include(c => c.Modules)
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
                return NotFound(ApiResponse<object>.Fail("Company not found."));

            var hasActiveSub = await _db.CompanySubscriptions.AnyAsync(s =>
                s.CompanyId == companyId &&
                s.Status == "Active" &&
                (!s.EndDate.HasValue || s.EndDate.Value >= DateTime.UtcNow));

            List<string> allowed;

            if (hasActiveSub)
            {
                allowed = company.Modules
                    .Where(m => m.IsEnabled)
                    .Select(m => m.ModuleId)
                    .ToList();

                if (!allowed.Any())
                    allowed = AllModules();
            }
            else
            {
                // Trial: only trial-enabled modules
                var isTrialValid = company.IsTrialActive &&
                                   company.TrialEndDate.HasValue &&
                                   company.TrialEndDate.Value >= DateTime.UtcNow;

                allowed = isTrialValid
                    ? company.Modules.Where(m => m.IsEnabled && m.IsTrialAccess).Select(m => m.ModuleId).ToList()
                    : new List<string>();
            }

            return Ok(ApiResponse<object>.Ok(new
            {
                companyId,
                hasActiveSubscription = hasActiveSub,
                isTrialActive = company.IsTrialActive && company.TrialEndDate >= DateTime.UtcNow,
                trialEndDate = company.TrialEndDate,
                allowedModules = allowed
            }));
        }

        private static List<string> AllModules() =>
        [
            "inventory", "purchase", "sales", "accounts",
            "crm", "hrm", "projects", "helpdesk",
            "assets", "logistics", "production", "billing", "pos"
        ];

        // ── Global Module CRUD ────────────────────────────────

        /// <summary>GET /api/admin/modules/global — all global modules</summary>
        [HttpGet("global")]
        public async Task<IActionResult> GetGlobalModules()
        {
            var modules = await _db.GlobalModules.OrderBy(m => m.SortOrder).ToListAsync();
            return Ok(ApiResponse<object>.Ok(modules));
        }

        /// <summary>POST /api/admin/modules/global — create a new custom module</summary>
        [HttpPost("global")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> CreateGlobalModule([FromBody] CreateGlobalModuleDto dto)
        {
            if (await _db.GlobalModules.AnyAsync(m => m.ModuleId == dto.ModuleId))
                return BadRequest(ApiResponse<object>.Fail("Module ID already exists."));

            var module = new GlobalModule
            {
                ModuleId    = dto.ModuleId.ToLower().Replace(" ", "_"),
                Name        = dto.Name,
                Description = dto.Description,
                Category    = dto.Category,
                Icon        = dto.Icon ?? "Puzzle",
                IsActive    = true,
                IsBuiltIn   = false,
                SortOrder   = await _db.GlobalModules.MaxAsync(m => (int?)m.SortOrder) + 1 ?? 14
            };
            _db.GlobalModules.Add(module);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(module, "Module created."));
        }

        /// <summary>PUT /api/admin/modules/global/{id}/toggle — activate/deactivate global module</summary>
        [HttpPut("global/{id}/toggle")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> ToggleGlobalModule(int id)
        {
            var module = await _db.GlobalModules.FindAsync(id);
            if (module == null) return NotFound(ApiResponse<object>.Fail("Module not found."));
            module.IsActive = !module.IsActive;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(new { module.Id, module.IsActive }, $"Module {(module.IsActive ? "activated" : "deactivated")}."));
        }

        /// <summary>DELETE /api/admin/modules/global/{id} — delete custom module</summary>
        [HttpDelete("global/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteGlobalModule(int id)
        {
            var module = await _db.GlobalModules.FindAsync(id);
            if (module == null) return NotFound(ApiResponse<object>.Fail("Module not found."));
            if (module.IsBuiltIn) return BadRequest(ApiResponse<object>.Fail("Cannot delete built-in modules."));
            _db.GlobalModules.Remove(module);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(true, "Module deleted."));
        }
    }
}
