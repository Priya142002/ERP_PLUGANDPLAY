using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ERPPlugandPlay.Services
{
    public interface ISuperAdminCompanyService
    {
        Task<ApiResponse<CompanyFullDto>> CreateAsync(CreateCompanyFullDto dto);
        Task<ApiResponse<PagedResult<CompanyFullDto>>> ListAsync(PaginationParams p, string? status, string? industry);
        Task<ApiResponse<CompanyFullDto>> GetByIdAsync(int id);
        Task<ApiResponse<CompanyFullDto>> UpdateAsync(int id, UpdateCompanyFullDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<bool>> ToggleStatusAsync(int id);
    }

    public class SuperAdminCompanyService : ISuperAdminCompanyService
    {
        private readonly ERPDbContext _db;
        private readonly IAuthService _authService;

        public SuperAdminCompanyService(ERPDbContext db, IAuthService authService)
        {
            _db = db;
            _authService = authService;
        }

        public async Task<ApiResponse<CompanyFullDto>> CreateAsync(CreateCompanyFullDto dto)
        {
            if (await _db.Companies.AnyAsync(c => c.Email == dto.Email))
                return ApiResponse<CompanyFullDto>.Fail("A company with this email already exists.");

            if (!string.IsNullOrEmpty(dto.AdminEmail) && await _db.Users.AnyAsync(u => u.Email == dto.AdminEmail))
                return ApiResponse<CompanyFullDto>.Fail("Admin email is already registered.");

            var company = MapToEntity(dto);
            _db.Companies.Add(company);
            await _db.SaveChangesAsync();

            // Seed default trial modules
            var validModuleIds = await _db.GlobalModules.Where(m => m.IsActive).Select(m => m.ModuleId).ToListAsync();
 
             foreach (var moduleId in dto.AllowedModules)
             {
                 if (!validModuleIds.Contains(moduleId)) continue;

                 _db.CompanyModules.Add(new CompanyModule
                 {
                     CompanyId = company.Id,
                     ModuleId = moduleId,
                     IsEnabled = true,
                     IsTrialAccess = true
                 });
             }

            // Create admin user for this company
            var adminRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Admin");
            if (adminRole != null && !string.IsNullOrEmpty(dto.AdminEmail))
            {
                _db.Users.Add(new User
                {
                    Name = dto.AdminName,
                    Email = dto.AdminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.AdminPassword),
                    RoleId = adminRole.Id,
                    CompanyId = company.Id, // Link to company
                    IsActive = true
                });
            }

            await _db.SaveChangesAsync();
            return ApiResponse<CompanyFullDto>.Ok(await BuildDtoAsync(company.Id), "Company created successfully.");
        }

        public async Task<ApiResponse<PagedResult<CompanyFullDto>>> ListAsync(PaginationParams p, string? status, string? industry)
        {
            var query = _db.Companies
                .AsNoTracking()
                .Include(c => c.Subscriptions).ThenInclude(s => s.Plan)
                .Include(c => c.Modules)
                .AsSplitQuery()
                .AsQueryable();

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(c => c.Name.Contains(p.Search) || c.Email.Contains(p.Search) || c.Code.Contains(p.Search));

            if (!string.IsNullOrEmpty(status))
                query = query.Where(c => c.Status == status);

            if (!string.IsNullOrEmpty(industry))
                query = query.Where(c => c.Industry == industry);

            var total = await query.CountAsync();
            var companies = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToListAsync();

            var items = companies.Select(c => MapToDto(c)).ToList();

            return ApiResponse<PagedResult<CompanyFullDto>>.Ok(new PagedResult<CompanyFullDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<CompanyFullDto>> GetByIdAsync(int id)
        {
            var company = await _db.Companies
                .Include(c => c.Subscriptions).ThenInclude(s => s.Plan)
                .Include(c => c.Modules)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null) return ApiResponse<CompanyFullDto>.Fail("Company not found.");
            return ApiResponse<CompanyFullDto>.Ok(MapToDto(company));
        }

        public async Task<ApiResponse<CompanyFullDto>> UpdateAsync(int id, UpdateCompanyFullDto dto)
        {
            var company = await _db.Companies
                .Include(c => c.Modules)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null) return ApiResponse<CompanyFullDto>.Fail("Company not found.");

            company.Code = dto.Code;
            company.Name = dto.Name;
            company.CompanyType = dto.CompanyType;
            company.Industry = dto.Industry;
            company.Email = dto.Email;
            company.Phone = dto.Phone;
            company.Street = dto.Street;
            company.City = dto.City;
            company.State = dto.State;
            company.Country = dto.Country;
            company.PostalCode = dto.PostalCode;
            company.GSTNumber = dto.GSTNumber;
            company.TaxNumber = dto.TaxNumber;
            company.Status = dto.Status;
            if (!string.IsNullOrEmpty(dto.Logo)) company.Logo = dto.Logo;
            company.AdminName = dto.AdminName;
            company.AdminEmail = dto.AdminEmail;
            company.AdminPhone = dto.AdminPhone;
            company.AdminPassword = dto.AdminPassword;
            company.UpdatedAt = DateTime.UtcNow;

            // Update allowed modules
            var existing = company.Modules.Where(m => m.IsTrialAccess).ToList();
            _db.CompanyModules.RemoveRange(existing);

            var validModuleIds = await _db.GlobalModules.Where(m => m.IsActive).Select(m => m.ModuleId).ToListAsync();
 
             foreach (var moduleId in dto.AllowedModules)
             {
                 if (!validModuleIds.Contains(moduleId)) continue;

                 _db.CompanyModules.Add(new CompanyModule
                 {
                     CompanyId = company.Id,
                     ModuleId = moduleId,
                     IsEnabled = true,
                     IsTrialAccess = true
                 });
             }

            await _db.SaveChangesAsync();
            return ApiResponse<CompanyFullDto>.Ok(await BuildDtoAsync(company.Id));
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var company = await _db.Companies.FindAsync(id);
            if (company == null) return ApiResponse<bool>.Fail("Company not found.");
            _db.Companies.Remove(company);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Company deleted.");
        }

        public async Task<ApiResponse<bool>> ToggleStatusAsync(int id)
        {
            var company = await _db.Companies.FindAsync(id);
            if (company == null) return ApiResponse<bool>.Fail("Company not found.");
            company.Status = company.Status == "active" ? "inactive" : "active";
            company.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"Company status set to {company.Status}.");
        }

        private async Task<CompanyFullDto> BuildDtoAsync(int id)
        {
            var company = await _db.Companies
                .Include(c => c.Subscriptions).ThenInclude(s => s.Plan)
                .Include(c => c.Modules)
                .FirstAsync(c => c.Id == id);
            return MapToDto(company);
        }

        private static Company MapToEntity(CreateCompanyFullDto dto) => new()
        {
            Code = dto.Code, Name = dto.Name, CompanyType = dto.CompanyType,
            Industry = dto.Industry, Email = dto.Email, Phone = dto.Phone,
            Street = dto.Street, City = dto.City, State = dto.State,
            Country = dto.Country, PostalCode = dto.PostalCode,
            GSTNumber = dto.GSTNumber, TaxNumber = dto.TaxNumber,
            Status = dto.Status, Logo = dto.Logo,
            AdminName = dto.AdminName, AdminEmail = dto.AdminEmail, AdminPhone = dto.AdminPhone,
            AdminPassword = dto.AdminPassword,
            // Auto-activate 30-day trial for every new company
            IsTrialActive = true,
            TrialStartDate = DateTime.UtcNow,
            TrialEndDate = DateTime.UtcNow.AddDays(30)
        };

        private static CompanyFullDto MapToDto(Company c)
        {
            var activeSub = c.Subscriptions.FirstOrDefault(s => s.Status == "Active");
            var trialModules = c.Modules.Where(m => m.IsTrialAccess && m.IsEnabled).Select(m => m.ModuleId).ToList();

            return new CompanyFullDto
            {
                Id = c.Id, Code = c.Code, Name = c.Name, CompanyType = c.CompanyType,
                Industry = c.Industry, Email = c.Email, Phone = c.Phone,
                Address = new AddressDto
                {
                    Street = c.Street, City = c.City, State = c.State,
                    Country = c.Country, PostalCode = c.PostalCode
                },
                GSTNumber = c.GSTNumber, TaxNumber = c.TaxNumber,
                Status = c.Status, Logo = c.Logo,
                AdminName = c.AdminName, AdminEmail = c.AdminEmail, AdminPhone = c.AdminPhone,
                AllowedModules = trialModules,
                ActivePlan = activeSub?.Plan?.Name,
                SubscriptionStatus = activeSub?.Status,
                UsedSeats = activeSub?.UsedSeats ?? 0,
                CreatedAt = c.CreatedAt, UpdatedAt = c.UpdatedAt
            };
        }
    }
}
