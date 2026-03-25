using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IDepartmentService
    {
        Task<ApiResponse<DepartmentDto>> CreateAsync(CreateDepartmentDto dto);
        Task<ApiResponse<List<DepartmentDto>>> ListAsync(int? companyId);
        Task<ApiResponse<DepartmentDto>> UpdateAsync(int id, CreateDepartmentDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<DesignationDto>> CreateDesignationAsync(CreateDesignationDto dto);
        Task<ApiResponse<List<DesignationDto>>> ListDesignationsAsync(int? companyId);
        Task<ApiResponse<bool>> DeleteDesignationAsync(int id);
    }

    public class DepartmentService : IDepartmentService
    {
        private readonly ERPDbContext _db;
        public DepartmentService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<DepartmentDto>> CreateAsync(CreateDepartmentDto dto)
        {
            var dept = new Department { Name = dto.Name, CompanyId = dto.CompanyId };
            _db.Departments.Add(dept);
            await _db.SaveChangesAsync();
            await _db.Entry(dept).Reference(d => d.Company).LoadAsync();
            return ApiResponse<DepartmentDto>.Ok(Map(dept), "Department created.");
        }

        public async Task<ApiResponse<List<DepartmentDto>>> ListAsync(int? companyId)
        {
            var query = _db.Departments.Include(d => d.Company).AsQueryable();
            if (companyId.HasValue) query = query.Where(d => d.CompanyId == companyId.Value);
            var items = await query.Select(d => Map(d)).ToListAsync();
            return ApiResponse<List<DepartmentDto>>.Ok(items);
        }

        public async Task<ApiResponse<DepartmentDto>> UpdateAsync(int id, CreateDepartmentDto dto)
        {
            var dept = await _db.Departments.Include(d => d.Company).FirstOrDefaultAsync(d => d.Id == id);
            if (dept == null) return ApiResponse<DepartmentDto>.Fail("Department not found.");
            dept.Name = dto.Name; dept.CompanyId = dto.CompanyId;
            await _db.SaveChangesAsync();
            return ApiResponse<DepartmentDto>.Ok(Map(dept));
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var dept = await _db.Departments.FindAsync(id);
            if (dept == null) return ApiResponse<bool>.Fail("Department not found.");
            _db.Departments.Remove(dept);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Department deleted.");
        }

        public async Task<ApiResponse<DesignationDto>> CreateDesignationAsync(CreateDesignationDto dto)
        {
            var des = new Designation { Name = dto.Name, CompanyId = dto.CompanyId };
            _db.Designations.Add(des);
            await _db.SaveChangesAsync();
            return ApiResponse<DesignationDto>.Ok(new DesignationDto { Id = des.Id, Name = des.Name, CompanyId = des.CompanyId }, "Designation created.");
        }

        public async Task<ApiResponse<List<DesignationDto>>> ListDesignationsAsync(int? companyId)
        {
            var query = _db.Designations.AsQueryable();
            if (companyId.HasValue) query = query.Where(d => d.CompanyId == companyId.Value);
            var items = await query.Select(d => new DesignationDto { Id = d.Id, Name = d.Name, CompanyId = d.CompanyId }).ToListAsync();
            return ApiResponse<List<DesignationDto>>.Ok(items);
        }

        public async Task<ApiResponse<bool>> DeleteDesignationAsync(int id)
        {
            var des = await _db.Designations.FindAsync(id);
            if (des == null) return ApiResponse<bool>.Fail("Designation not found.");
            _db.Designations.Remove(des);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Designation deleted.");
        }

        private static DepartmentDto Map(Department d) => new()
        {
            Id = d.Id, Name = d.Name, CompanyId = d.CompanyId, CompanyName = d.Company?.Name ?? ""
        };
    }
}
