using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/payroll")]
    [Authorize]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _service;
        public PayrollController(IPayrollService service) => _service = service;

        /// <summary>POST /api/payroll/generate</summary>
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] GenerateSalaryDto dto)
        {
            var result = await _service.GenerateSalaryAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>GET /api/payroll/employee/{employeeId}</summary>
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId)
        {
            var result = await _service.GetByEmployeeAsync(employeeId);
            return Ok(result);
        }

        /// <summary>GET /api/payroll/report?month=3&year=2026</summary>
        [HttpGet("report")]
        public async Task<IActionResult> MonthlyReport([FromQuery] int month, [FromQuery] int year)
        {
            var result = await _service.MonthlyReportAsync(month, year);
            return Ok(result);
        }
    }
}
