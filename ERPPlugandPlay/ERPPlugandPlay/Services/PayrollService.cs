using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IPayrollService
    {
        Task<ApiResponse<SalaryDto>> GenerateSalaryAsync(GenerateSalaryDto dto);
        Task<ApiResponse<List<SalaryDto>>> GetByEmployeeAsync(int employeeId);
        Task<ApiResponse<PayrollReportDto>> MonthlyReportAsync(int month, int year);
    }

    public class PayrollService : IPayrollService
    {
        private readonly ERPDbContext _db;
        public PayrollService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<SalaryDto>> GenerateSalaryAsync(GenerateSalaryDto dto)
        {
            var exists = await _db.Salaries.AnyAsync(s =>
                s.EmployeeId == dto.EmployeeId && s.Month == dto.Month && s.Year == dto.Year);
            if (exists) return ApiResponse<SalaryDto>.Fail("Salary already generated for this month.");

            var emp = await _db.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
            if (emp == null) return ApiResponse<SalaryDto>.Fail("Employee not found.");

            var net = dto.Basic + dto.HRA + dto.Allowances - dto.Deductions;
            var salary = new Salary
            {
                EmployeeId = dto.EmployeeId, Basic = dto.Basic, HRA = dto.HRA,
                Allowances = dto.Allowances, Deductions = dto.Deductions,
                NetSalary = net, Month = dto.Month, Year = dto.Year
            };
            _db.Salaries.Add(salary);
            await _db.SaveChangesAsync();
            return ApiResponse<SalaryDto>.Ok(Map(salary, emp), "Salary generated.");
        }

        public async Task<ApiResponse<List<SalaryDto>>> GetByEmployeeAsync(int employeeId)
        {
            var salaries = await _db.Salaries
                .Include(s => s.Employee).ThenInclude(e => e.Department)
                .Where(s => s.EmployeeId == employeeId)
                .OrderByDescending(s => s.Year).ThenByDescending(s => s.Month)
                .ToListAsync();
            return ApiResponse<List<SalaryDto>>.Ok(salaries.Select(s => Map(s, s.Employee)).ToList());
        }

        public async Task<ApiResponse<PayrollReportDto>> MonthlyReportAsync(int month, int year)
        {
            var salaries = await _db.Salaries
                .Include(s => s.Employee).ThenInclude(e => e.Department)
                .Where(s => s.Month == month && s.Year == year)
                .ToListAsync();

            return ApiResponse<PayrollReportDto>.Ok(new PayrollReportDto
            {
                Month = month, Year = year,
                TotalEmployees = salaries.Count,
                TotalNetSalary = salaries.Sum(s => s.NetSalary),
                Salaries = salaries.Select(s => Map(s, s.Employee)).ToList()
            });
        }

        private static SalaryDto Map(Salary s, Employee e) => new()
        {
            Id = s.Id, EmployeeId = s.EmployeeId, EmployeeName = e.Name,
            DepartmentName = e.Department?.Name ?? "", Basic = s.Basic, HRA = s.HRA,
            Allowances = s.Allowances, Deductions = s.Deductions, NetSalary = s.NetSalary,
            Month = s.Month, Year = s.Year, GeneratedAt = s.GeneratedAt
        };
    }
}
