using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ERPPlugandPlay.Services
{
    public interface IAdminService
    {
        // Users
        Task<ApiResponse<PagedResult<UserAdminDto>>> ListUsersAsync(PaginationParams p);
        Task<ApiResponse<UserAdminDto>> CreateUserAsync(CreateUserDto dto);
        Task<ApiResponse<UserAdminDto>> UpdateUserAsync(int id, AdminUpdateUserDto dto);
        Task<ApiResponse<bool>> ToggleUserStatusAsync(int id);

        // Access
        Task<ApiResponse<List<RoleDto>>> ListRolesAsync();
        Task<ApiResponse<List<PermissionDto>>> ListPermissionsAsync();
        Task<ApiResponse<List<int>>> GetRolePermissionIdsAsync(int roleId);
        Task<ApiResponse<bool>> AssignPermissionsToRoleAsync(RolePermissionDto dto);

        // Audit
        Task<ApiResponse<PagedResult<AuditLogDto>>> ListAuditLogsAsync(PaginationParams p);
    }

    public class AdminService : IAdminService
    {
        private readonly ERPDbContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdminService(ERPDbContext db, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
        }

        private int? GetCurrentCompanyId()
        {
            var claim = _httpContextAccessor.HttpContext?.User?.FindFirst("CompanyId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        public async Task<ApiResponse<PagedResult<UserAdminDto>>> ListUsersAsync(PaginationParams p)
        {
            var companyId = GetCurrentCompanyId();
            var query = _db.Users.Include(u => u.Role).AsQueryable();

            if (companyId.HasValue)
                query = query.Where(u => u.CompanyId == companyId.Value);

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(u => u.Name.Contains(p.Search) || u.Email.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(u => new UserAdminDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    RoleId = u.RoleId,
                    RoleName = u.Role.RoleName,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                }).ToListAsync();

            return ApiResponse<PagedResult<UserAdminDto>>.Ok(new PagedResult<UserAdminDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<UserAdminDto>> CreateUserAsync(CreateUserDto dto)
        {
            var companyId = GetCurrentCompanyId();
            if (!companyId.HasValue) return ApiResponse<UserAdminDto>.Fail("Could not identify company context.");

            // Check Subscription & User Limit
            var subscription = await _db.CompanySubscriptions
                .Include(s => s.Plan)
                .FirstOrDefaultAsync(s => s.CompanyId == companyId.Value && s.Status == "Active");

            if (subscription == null) return ApiResponse<UserAdminDto>.Fail("No active subscription found.");

            var currentUserCount = await _db.Users.CountAsync(u => u.CompanyId == companyId.Value);
            if (subscription.Plan.MaxSeats > 0 && currentUserCount >= subscription.Plan.MaxSeats)
                return ApiResponse<UserAdminDto>.Fail($"User limit reached ({subscription.Plan.MaxSeats} seats). Please upgrade your plan.");

            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return ApiResponse<UserAdminDto>.Fail("User email already exists.");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PlainPassword = dto.Password,
                RoleId = dto.RoleId,
                CompanyId = companyId.Value,
                IsActive = true
            };

            _db.Users.Add(user);
            
            // Increment UsedSeats
            subscription.UsedSeats++;
            subscription.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return ApiResponse<UserAdminDto>.Ok(new UserAdminDto { Id = user.Id, Name = user.Name, Email = user.Email });
        }

        public async Task<ApiResponse<UserAdminDto>> UpdateUserAsync(int id, AdminUpdateUserDto dto)
        {
            var companyId = GetCurrentCompanyId();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id && (!companyId.HasValue || u.CompanyId == companyId.Value));
            if (user == null) return ApiResponse<UserAdminDto>.Fail("User not found.");

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.RoleId = dto.RoleId;
            user.IsActive = dto.IsActive;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                user.PlainPassword = dto.Password;
            }

            await _db.SaveChangesAsync();
            return ApiResponse<UserAdminDto>.Ok(new UserAdminDto { Id = user.Id, Name = user.Name, Email = user.Email });
        }

        public async Task<ApiResponse<bool>> ToggleUserStatusAsync(int id)
        {
            var companyId = GetCurrentCompanyId();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id && (!companyId.HasValue || u.CompanyId == companyId.Value));
            if (user == null) return ApiResponse<bool>.Fail("User not found.");
            user.IsActive = !user.IsActive;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"User status changed to {(user.IsActive ? "Active" : "Inactive")}");
        }

        public async Task<ApiResponse<List<RoleDto>>> ListRolesAsync()
        {
            var roles = await _db.Roles.Select(r => new RoleDto { Id = r.Id, RoleName = r.RoleName }).ToListAsync();
            return ApiResponse<List<RoleDto>>.Ok(roles);
        }

        public async Task<ApiResponse<List<PermissionDto>>> ListPermissionsAsync()
        {
            var permissions = await _db.Permissions.Select(p => new PermissionDto { Id = p.Id, Name = p.Name }).ToListAsync();
            return ApiResponse<List<PermissionDto>>.Ok(permissions);
        }

        public async Task<ApiResponse<List<int>>> GetRolePermissionIdsAsync(int roleId)
        {
            var ids = await _db.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.PermissionId)
                .ToListAsync();
            return ApiResponse<List<int>>.Ok(ids);
        }

        public async Task<ApiResponse<bool>> AssignPermissionsToRoleAsync(RolePermissionDto dto)
        {
            var existing = await _db.RolePermissions.Where(rp => rp.RoleId == dto.RoleId).ToListAsync();
            _db.RolePermissions.RemoveRange(existing);

            foreach (var pId in dto.PermissionIds)
            {
                _db.RolePermissions.Add(new RolePermission { RoleId = dto.RoleId, PermissionId = pId });
            }

            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Permissions assigned to role.");
        }

        public async Task<ApiResponse<PagedResult<AuditLogDto>>> ListAuditLogsAsync(PaginationParams p)
        {
            var query = _db.AuditLogs.AsQueryable();
            var total = await query.CountAsync();
            var items = await query.OrderByDescending(l => l.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(l => new AuditLogDto
                {
                    Id = l.Id,
                    UserName = l.UserName,
                    Action = l.Action,
                    Entity = l.Entity,
                    EntityId = l.EntityId,
                    CreatedAt = l.CreatedAt,
                    IPAddress = l.IPAddress
                }).ToListAsync();

            return ApiResponse<PagedResult<AuditLogDto>>.Ok(new PagedResult<AuditLogDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }
    }
}
