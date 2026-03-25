using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/hrm")]
    [Authorize]
    public class HRMController : ControllerBase
    {
        private readonly IHRMService _svc;
        public HRMController(IHRMService svc) => _svc = svc;

        [HttpPost("attendance")] public async Task<IActionResult> MarkAttendance([FromBody] MarkAttendanceDto dto) => Ok(await _svc.MarkAttendanceAsync(dto));
        [HttpGet("attendance/{employeeId}")] public async Task<IActionResult> GetAttendance(int employeeId, [FromQuery] int month, [FromQuery] int year) => Ok(await _svc.GetAttendanceAsync(employeeId, month, year));
        [HttpGet("attendance/company/{companyId}")] public async Task<IActionResult> GetCompanyAttendance(int companyId, [FromQuery] DateTime date) => Ok(await _svc.GetCompanyAttendanceAsync(companyId, date));

        [HttpPost("leave-types")] public async Task<IActionResult> CreateLeaveType([FromBody] CreateLeaveTypeDto dto) => Ok(await _svc.CreateLeaveTypeAsync(dto));
        [HttpGet("leave-types/{companyId}")] public async Task<IActionResult> ListLeaveTypes(int companyId) => Ok(await _svc.ListLeaveTypesAsync(companyId));

        [HttpPost("leave-requests")] public async Task<IActionResult> CreateLeaveRequest([FromBody] CreateLeaveRequestDto dto) => Ok(await _svc.CreateLeaveRequestAsync(dto));
        [HttpGet("leave-requests/{companyId}")] public async Task<IActionResult> ListLeaveRequests(int companyId) => Ok(await _svc.ListLeaveRequestsAsync(companyId));
        [HttpPut("leave-requests/{id}/approve")] public async Task<IActionResult> ApproveLeave(int id, [FromQuery] string status, [FromQuery] string? remarks) => Ok(await _svc.ApproveLeaveAsync(id, status, remarks));
    }
}
