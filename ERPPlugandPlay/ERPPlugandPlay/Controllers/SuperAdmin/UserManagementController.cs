using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/users")]
    [Authorize(Roles = "SuperAdmin")]
    public class UserManagementController : ControllerBase
    {
        private readonly ERPDbContext _db;
        public UserManagementController(ERPDbContext db) => _db = db;

        /// <summary>GET /api/superadmin/users — List all users with company/trial/module info</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? filter)
        {
            var usersQuery = _db.Users.Include(u => u.Role).AsQueryable();

            var users = await usersQuery.OrderByDescending(u => u.CreatedAt).ToListAsync();

            var result = new List<UserManagementDto>();

            foreach (var u in users)
            {
                var company = await _db.Companies.FirstOrDefaultAsync(c => c.AdminEmail == u.Email);

                var dto = new UserManagementDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role?.RoleName ?? "Unknown",
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                };

                if (company != null)
                {
                    dto.CompanyId = company.Id;
                    dto.CompanyName = company.Name;
                    dto.Industry = company.Industry;
                    dto.IsTrialActive = company.IsTrialActive
                        && company.TrialEndDate.HasValue
                        && company.TrialEndDate.Value >= DateTime.UtcNow;
                    dto.TrialStartDate = company.TrialStartDate;
                    dto.TrialEndDate = company.TrialEndDate;
                    dto.DaysRemaining = dto.IsTrialActive
                        ? (int)(company.TrialEndDate!.Value - DateTime.UtcNow).TotalDays
                        : 0;

                    dto.HasActiveSubscription = await _db.CompanySubscriptions.AnyAsync(s =>
                        s.CompanyId == company.Id && s.Status == "Active"
                        && (!s.EndDate.HasValue || s.EndDate.Value >= DateTime.UtcNow));

                    if (dto.HasActiveSubscription)
                    {
                        var sub = await _db.CompanySubscriptions
                            .Include(s => s.Plan)
                            .FirstOrDefaultAsync(s =>
                                s.CompanyId == company.Id && s.Status == "Active");
                        dto.PlanName = sub?.Plan?.Name;
                    }

                    dto.Modules = await _db.CompanyModules
                        .Where(cm => cm.CompanyId == company.Id)
                        .Select(cm => new UserModuleDto
                        {
                            ModuleId = cm.ModuleId,
                            IsEnabled = cm.IsEnabled,
                            IsTrialAccess = cm.IsTrialAccess
                        }).ToListAsync();
                }

                // Apply filter
                if (filter == "trial" && !dto.IsTrialActive) continue;
                if (filter == "subscribed" && !dto.HasActiveSubscription) continue;
                if (filter == "expired" && (dto.IsTrialActive || dto.HasActiveSubscription)) continue;

                result.Add(dto);
            }

            return Ok(new { success = true, data = result });
        }

        /// <summary>GET /api/superadmin/users/{id} — Single user detail</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var u = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (u == null) return NotFound(new { success = false, message = "User not found" });

            var company = await _db.Companies.FirstOrDefaultAsync(c => c.AdminEmail == u.Email);

            var dto = new UserManagementDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role?.RoleName ?? "Unknown",
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            };

            if (company != null)
            {
                dto.CompanyId = company.Id;
                dto.CompanyName = company.Name;
                dto.Industry = company.Industry;
                dto.IsTrialActive = company.IsTrialActive
                    && company.TrialEndDate.HasValue
                    && company.TrialEndDate.Value >= DateTime.UtcNow;
                dto.TrialStartDate = company.TrialStartDate;
                dto.TrialEndDate = company.TrialEndDate;
                dto.DaysRemaining = dto.IsTrialActive
                    ? (int)(company.TrialEndDate!.Value - DateTime.UtcNow).TotalDays
                    : 0;

                dto.HasActiveSubscription = await _db.CompanySubscriptions.AnyAsync(s =>
                    s.CompanyId == company.Id && s.Status == "Active"
                    && (!s.EndDate.HasValue || s.EndDate.Value >= DateTime.UtcNow));

                dto.Modules = await _db.CompanyModules
                    .Where(cm => cm.CompanyId == company.Id)
                    .Select(cm => new UserModuleDto
                    {
                        ModuleId = cm.ModuleId,
                        IsEnabled = cm.IsEnabled,
                        IsTrialAccess = cm.IsTrialAccess
                    }).ToListAsync();
            }

            return Ok(new { success = true, data = dto });
        }

        /// <summary>PUT /api/superadmin/users/{id}/toggle — Toggle user active status</summary>
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { success = false, message = "User not found" });

            user.IsActive = !user.IsActive;
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = $"User {(user.IsActive ? "activated" : "deactivated")}." });
        }
    }
}
