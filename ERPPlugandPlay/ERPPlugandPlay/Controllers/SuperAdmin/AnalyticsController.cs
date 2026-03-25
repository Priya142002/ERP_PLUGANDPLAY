using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/analytics")]
    [Authorize(Roles = "SuperAdmin")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _service;
        public AnalyticsController(IAnalyticsService service) => _service = service;

        /// <summary>GET /api/superadmin/analytics/platform</summary>
        [HttpGet("platform")]
        public async Task<IActionResult> GetPlatformAnalytics()
        {
            var result = await _service.GetPlatformAnalyticsAsync();
            return Ok(result);
        }

        /// <summary>GET /api/superadmin/analytics/company/{id}</summary>
        [HttpGet("company/{id}")]
        public async Task<IActionResult> GetCompanyAnalytics(int id)
        {
            var result = await _service.GetCompanyAnalyticsAsync(id);
            return Ok(result);
        }

        /// <summary>GET /api/superadmin/analytics/audit-logs</summary>
        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs([FromQuery] PaginationParams p)
        {
            var result = await _service.GetAuditLogsAsync(p);
            return Ok(result);
        }
    }
}
