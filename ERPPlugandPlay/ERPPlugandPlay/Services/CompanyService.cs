using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ERPPlugandPlay.Services
{
    public interface ICompanyService
    {
        Task<ApiResponse<CompanyDto>> CreateAsync(CreateCompanyDto dto);
        Task<ApiResponse<PagedResult<CompanyDto>>> ListAsync(PaginationParams p);
        Task<ApiResponse<CompanyDto>> UpdateAsync(int id, UpdateCompanyDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class CompanyService : ICompanyService
    {
        private readonly ERPDbContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CompanyService(ERPDbContext db, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
        }

        private int? GetCurrentCompanyId()
        {
            var claim = _httpContextAccessor.HttpContext?.User?.FindFirst("CompanyId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        public async Task<ApiResponse<CompanyDto>> CreateAsync(CreateCompanyDto dto)
        {
            // Check if email already exists
            if (await _db.Companies.AnyAsync(c => c.Email == dto.Email))
                return ApiResponse<CompanyDto>.Fail("Company email already registered.");

            var company = new Company
            {
                Name = dto.Name, 
                Street = dto.Address, 
                Phone = dto.Phone,
                Email = dto.Email, 
                GSTNumber = dto.GSTNumber,
                AdminEmail = dto.Email,
                AdminName = dto.Name,
                AdminPhone = dto.Phone,
                IsTrialActive = true,
                TrialStartDate = DateTime.UtcNow,
                TrialEndDate = DateTime.UtcNow.AddDays(30),
                Branches = dto.Branches.Select(b => new Branch
                {
                    BranchName = b.BranchName,
                    Address = b.Address,
                    ContactPhone = b.ContactPhone,
                    Email = b.Email
                }).ToList()
            };
            
            _db.Companies.Add(company);
            await _db.SaveChangesAsync();
            
            return ApiResponse<CompanyDto>.Ok(Map(company), "Company created with branches and 30-day trial.");
        }

        public async Task<ApiResponse<PagedResult<CompanyDto>>> ListAsync(PaginationParams p)
        {
            var query = _db.Companies.Include(c => c.Branches).AsQueryable();
            if (!string.IsNullOrEmpty(p.Search) && p.Search != "undefined")
                query = query.Where(c => c.Name.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(c => Map(c)).ToListAsync();

            return ApiResponse<PagedResult<CompanyDto>>.Ok(new PagedResult<CompanyDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<CompanyDto>> UpdateAsync(int id, UpdateCompanyDto dto)
        {
            var currentId = GetCurrentCompanyId();
            if (currentId.HasValue && currentId.Value != id)
                return ApiResponse<CompanyDto>.Fail("Unauthorized to update this company.");

            var company = await _db.Companies.Include(c => c.Branches).FirstOrDefaultAsync(c => c.Id == id);
            if (company == null) return ApiResponse<CompanyDto>.Fail("Company not found.");

            company.Name = dto.Name; company.Street = dto.Address;
            company.Phone = dto.Phone; company.Email = dto.Email;
            company.GSTNumber = dto.GSTNumber; company.UpdatedAt = DateTime.UtcNow;

            // Handle branches (simple replace for now)
            _db.Branches.RemoveRange(company.Branches);
            company.Branches = dto.Branches.Select(b => new Branch
            {
                CompanyId = id,
                BranchName = b.BranchName,
                Address = b.Address,
                ContactPhone = b.ContactPhone,
                Email = b.Email
            }).ToList();

            await _db.SaveChangesAsync();
            return ApiResponse<CompanyDto>.Ok(Map(company));
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var company = await _db.Companies.FindAsync(id);
            if (company == null) return ApiResponse<bool>.Fail("Company not found.");
            _db.Companies.Remove(company);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Company deleted.");
        }

        private static CompanyDto Map(Company c) => new()
        {
            Id = c.Id, Code = c.Code, Name = c.Name,
            Address = c.Street, Phone = c.Phone, Email = c.Email,
            GSTNumber = c.GSTNumber ?? "", Status = c.Status, CreatedAt = c.CreatedAt,
            Branches = c.Branches.Select(b => new BranchDto
            {
                Id = b.Id, BranchName = b.BranchName, Address = b.Address,
                ContactPhone = b.ContactPhone, Email = b.Email
            }).ToList()
        };
    }
}
