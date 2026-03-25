using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IEmployeeService
    {
        Task<ApiResponse<EmployeeDto>> CreateAsync(CreateEmployeeDto dto);
        Task<ApiResponse<PagedResult<EmployeeDto>>> ListAsync(PaginationParams p);
        Task<ApiResponse<EmployeeDto>> GetByIdAsync(int id);
        Task<ApiResponse<EmployeeDto>> UpdateAsync(int id, UpdateEmployeeDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly ERPDbContext _db;
        public EmployeeService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<EmployeeDto>> CreateAsync(CreateEmployeeDto dto)
        {
            var emp = new Employee
            {
                CompanyId = dto.CompanyId, Name = dto.Name, Email = dto.Email,
                Phone = dto.Phone, DepartmentId = dto.DepartmentId,
                DesignationId = dto.DesignationId, JoinDate = dto.JoinDate, Salary = dto.Salary
            };
            _db.Employees.Add(emp);
            await _db.SaveChangesAsync();
            return ApiResponse<EmployeeDto>.Ok(await GetDtoAsync(emp.Id), "Employee created.");
        }

        public async Task<ApiResponse<PagedResult<EmployeeDto>>> ListAsync(PaginationParams p)
        {
            var query = _db.Employees
                .Include(e => e.Company).Include(e => e.Department).Include(e => e.Designation)
                .AsQueryable();

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(e => e.Name.Contains(p.Search) || e.Email.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(e => Map(e)).ToListAsync();

            return ApiResponse<PagedResult<EmployeeDto>>.Ok(new PagedResult<EmployeeDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<EmployeeDto>> GetByIdAsync(int id)
        {
            var emp = await _db.Employees
                .Include(e => e.Company).Include(e => e.Department).Include(e => e.Designation)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (emp == null) return ApiResponse<EmployeeDto>.Fail("Employee not found.");
            return ApiResponse<EmployeeDto>.Ok(Map(emp));
        }

        public async Task<ApiResponse<EmployeeDto>> UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            var emp = await _db.Employees.FindAsync(id);
            if (emp == null) return ApiResponse<EmployeeDto>.Fail("Employee not found.");

            emp.Name = dto.Name; emp.Email = dto.Email; emp.Phone = dto.Phone;
            emp.DepartmentId = dto.DepartmentId; emp.DesignationId = dto.DesignationId;
            emp.JoinDate = dto.JoinDate; emp.Salary = dto.Salary;
            await _db.SaveChangesAsync();
            return ApiResponse<EmployeeDto>.Ok(await GetDtoAsync(id));
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var emp = await _db.Employees.FindAsync(id);
            if (emp == null) return ApiResponse<bool>.Fail("Employee not found.");
            _db.Employees.Remove(emp);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Employee deleted.");
        }

        private async Task<EmployeeDto> GetDtoAsync(int id)
        {
            var emp = await _db.Employees
                .Include(e => e.Company).Include(e => e.Department).Include(e => e.Designation)
                .FirstAsync(e => e.Id == id);
            return Map(emp);
        }

        private static EmployeeDto Map(Employee e) => new()
        {
            Id = e.Id, CompanyId = e.CompanyId, CompanyName = e.Company?.Name ?? "",
            Name = e.Name, Email = e.Email, Phone = e.Phone,
            DepartmentId = e.DepartmentId, DepartmentName = e.Department?.Name ?? "",
            DesignationId = e.DesignationId, DesignationName = e.Designation?.Name ?? "",
            JoinDate = e.JoinDate, Salary = e.Salary
        };
    }
}
