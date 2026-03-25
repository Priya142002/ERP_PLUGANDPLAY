using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

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
        public CompanyService(ERPDbContext db) => _db = db;

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
                // Automatically activate 30-day trial
                IsTrialActive = true,
                TrialStartDate = DateTime.UtcNow,
                TrialEndDate = DateTime.UtcNow.AddDays(30)
            };
            
            _db.Companies.Add(company);
            await _db.SaveChangesAsync();
            
            return ApiResponse<CompanyDto>.Ok(Map(company), "Company created with 30-day trial period.");
        }

        public async Task<ApiResponse<PagedResult<CompanyDto>>> ListAsync(PaginationParams p)
        {
            var query = _db.Companies.AsQueryable();
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(c => c.Name.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(c => Map(c)).ToListAsync();

            return ApiResponse<PagedResult<CompanyDto>>.Ok(new PagedResult<CompanyDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<CompanyDto>> UpdateAsync(int id, UpdateCompanyDto dto)
        {
            var company = await _db.Companies.FindAsync(id);
            if (company == null) return ApiResponse<CompanyDto>.Fail("Company not found.");

            company.Name = dto.Name; company.Street = dto.Address;
            company.Phone = dto.Phone; company.Email = dto.Email;
            company.GSTNumber = dto.GSTNumber; company.UpdatedAt = DateTime.UtcNow;
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
            GSTNumber = c.GSTNumber ?? "", Status = c.Status, CreatedAt = c.CreatedAt
        };
    }
}
