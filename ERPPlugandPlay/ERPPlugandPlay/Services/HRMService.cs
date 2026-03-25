using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IHRMService
    {
        Task<ApiResponse<AttendanceDto>> MarkAttendanceAsync(MarkAttendanceDto dto);
        Task<ApiResponse<List<AttendanceDto>>> GetAttendanceAsync(int employeeId, int month, int year);
        Task<ApiResponse<List<AttendanceDto>>> GetCompanyAttendanceAsync(int companyId, DateTime date);

        Task<ApiResponse<LeaveTypeDto>> CreateLeaveTypeAsync(CreateLeaveTypeDto dto);
        Task<ApiResponse<List<LeaveTypeDto>>> ListLeaveTypesAsync(int companyId);

        Task<ApiResponse<LeaveRequestDto>> CreateLeaveRequestAsync(CreateLeaveRequestDto dto);
        Task<ApiResponse<List<LeaveRequestDto>>> ListLeaveRequestsAsync(int companyId);
        Task<ApiResponse<bool>> ApproveLeaveAsync(int id, string status, string? remarks);
    }

    public class HRMService : IHRMService
    {
        private readonly ERPDbContext _db;
        public HRMService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<AttendanceDto>> MarkAttendanceAsync(MarkAttendanceDto dto)
        {
            var existing = await _db.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.Date.Date == dto.Date.Date);

            if (existing != null)
            {
                existing.CheckIn = dto.CheckIn ?? existing.CheckIn;
                existing.CheckOut = dto.CheckOut ?? existing.CheckOut;
                existing.Status = dto.Status;
                existing.Remarks = dto.Remarks;
                await _db.SaveChangesAsync();
                var emp = await _db.Employees.FindAsync(dto.EmployeeId);
                return ApiResponse<AttendanceDto>.Ok(MapAttendance(existing, emp?.Name ?? ""), "Attendance updated.");
            }

            var attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId, Date = dto.Date.Date,
                CheckIn = dto.CheckIn, CheckOut = dto.CheckOut,
                Status = dto.Status, Remarks = dto.Remarks
            };
            _db.Attendances.Add(attendance);
            await _db.SaveChangesAsync();
            var employee = await _db.Employees.FindAsync(dto.EmployeeId);
            return ApiResponse<AttendanceDto>.Ok(MapAttendance(attendance, employee?.Name ?? ""), "Attendance marked.");
        }

        public async Task<ApiResponse<List<AttendanceDto>>> GetAttendanceAsync(int employeeId, int month, int year)
        {
            var records = await _db.Attendances.Include(a => a.Employee)
                .Where(a => a.EmployeeId == employeeId && a.Date.Month == month && a.Date.Year == year)
                .OrderBy(a => a.Date).ToListAsync();
            return ApiResponse<List<AttendanceDto>>.Ok(records.Select(a => MapAttendance(a, a.Employee?.Name ?? "")).ToList());
        }

        public async Task<ApiResponse<List<AttendanceDto>>> GetCompanyAttendanceAsync(int companyId, DateTime date)
        {
            var records = await _db.Attendances.Include(a => a.Employee)
                .Where(a => a.Employee.CompanyId == companyId && a.Date.Date == date.Date)
                .ToListAsync();
            return ApiResponse<List<AttendanceDto>>.Ok(records.Select(a => MapAttendance(a, a.Employee?.Name ?? "")).ToList());
        }

        public async Task<ApiResponse<LeaveTypeDto>> CreateLeaveTypeAsync(CreateLeaveTypeDto dto)
        {
            var lt = new LeaveType
            {
                CompanyId = dto.CompanyId, Name = dto.Name,
                MaxDaysPerYear = dto.MaxDaysPerYear, IsPaid = dto.IsPaid
            };
            _db.LeaveTypes.Add(lt);
            await _db.SaveChangesAsync();
            return ApiResponse<LeaveTypeDto>.Ok(new LeaveTypeDto
            {
                Id = lt.Id, CompanyId = lt.CompanyId, Name = lt.Name,
                MaxDaysPerYear = lt.MaxDaysPerYear, IsPaid = lt.IsPaid
            }, "Leave type created.");
        }

        public async Task<ApiResponse<List<LeaveTypeDto>>> ListLeaveTypesAsync(int companyId)
        {
            var types = await _db.LeaveTypes.Where(lt => lt.CompanyId == companyId).ToListAsync();
            return ApiResponse<List<LeaveTypeDto>>.Ok(types.Select(lt => new LeaveTypeDto
            {
                Id = lt.Id, CompanyId = lt.CompanyId, Name = lt.Name,
                MaxDaysPerYear = lt.MaxDaysPerYear, IsPaid = lt.IsPaid
            }).ToList());
        }

        public async Task<ApiResponse<LeaveRequestDto>> CreateLeaveRequestAsync(CreateLeaveRequestDto dto)
        {
            var totalDays = (int)(dto.ToDate - dto.FromDate).TotalDays + 1;
            var request = new LeaveRequest
            {
                EmployeeId = dto.EmployeeId, LeaveTypeId = dto.LeaveTypeId,
                FromDate = dto.FromDate, ToDate = dto.ToDate,
                TotalDays = totalDays, Reason = dto.Reason
            };
            _db.LeaveRequests.Add(request);
            await _db.SaveChangesAsync();

            var emp = await _db.Employees.FindAsync(dto.EmployeeId);
            var lt = await _db.LeaveTypes.FindAsync(dto.LeaveTypeId);
            return ApiResponse<LeaveRequestDto>.Ok(MapLeaveRequest(request, emp?.Name ?? "", lt?.Name ?? ""), "Leave request submitted.");
        }

        public async Task<ApiResponse<List<LeaveRequestDto>>> ListLeaveRequestsAsync(int companyId)
        {
            var requests = await _db.LeaveRequests
                .Include(r => r.Employee).Include(r => r.LeaveType)
                .Where(r => r.Employee.CompanyId == companyId)
                .OrderByDescending(r => r.CreatedAt).ToListAsync();
            return ApiResponse<List<LeaveRequestDto>>.Ok(requests.Select(r =>
                MapLeaveRequest(r, r.Employee?.Name ?? "", r.LeaveType?.Name ?? "")).ToList());
        }

        public async Task<ApiResponse<bool>> ApproveLeaveAsync(int id, string status, string? remarks)
        {
            var request = await _db.LeaveRequests.FindAsync(id);
            if (request == null) return ApiResponse<bool>.Fail("Leave request not found.");
            request.Status = status;
            request.ApproverRemarks = remarks;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"Leave {status}.");
        }

        private static AttendanceDto MapAttendance(Attendance a, string empName) => new()
        {
            Id = a.Id, EmployeeId = a.EmployeeId, EmployeeName = empName,
            Date = a.Date, CheckIn = a.CheckIn, CheckOut = a.CheckOut,
            Status = a.Status, Remarks = a.Remarks
        };

        private static LeaveRequestDto MapLeaveRequest(LeaveRequest r, string empName, string ltName) => new()
        {
            Id = r.Id, EmployeeId = r.EmployeeId, EmployeeName = empName,
            LeaveTypeId = r.LeaveTypeId, LeaveTypeName = ltName,
            FromDate = r.FromDate, ToDate = r.ToDate, TotalDays = r.TotalDays,
            Reason = r.Reason, Status = r.Status, ApproverRemarks = r.ApproverRemarks,
            CreatedAt = r.CreatedAt
        };
    }
}
