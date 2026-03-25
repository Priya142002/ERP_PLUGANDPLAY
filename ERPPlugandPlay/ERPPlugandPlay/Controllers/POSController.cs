using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/pos")]
    [Authorize]
    public class POSController : ControllerBase
    {
        private readonly IPOSService _svc;
        public POSController(IPOSService svc) => _svc = svc;

        [HttpPost("sessions/open")] public async Task<IActionResult> OpenSession([FromBody] OpenSessionDto dto) => Ok(await _svc.OpenSessionAsync(dto));
        [HttpPut("sessions/{id}/close")] public async Task<IActionResult> CloseSession(int id, [FromQuery] decimal closingCash) => Ok(await _svc.CloseSessionAsync(id, closingCash));
        [HttpGet("sessions/{companyId}")] public async Task<IActionResult> ListSessions(int companyId) => Ok(await _svc.ListSessionsAsync(companyId));

        [HttpPost("orders")] public async Task<IActionResult> CreateOrder([FromBody] CreatePosOrderDto dto) => Ok(await _svc.CreateOrderAsync(dto));
        [HttpGet("orders/{companyId}")] public async Task<IActionResult> ListOrders(int companyId, [FromQuery] PaginationParams p) => Ok(await _svc.ListOrdersAsync(companyId, p));
        [HttpPut("orders/{id}/refund")] public async Task<IActionResult> RefundOrder(int id) => Ok(await _svc.RefundOrderAsync(id));
    }
}
