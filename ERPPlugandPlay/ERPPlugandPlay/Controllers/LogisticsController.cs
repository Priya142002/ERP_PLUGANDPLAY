using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/logistics")]
    [Authorize]
    public class LogisticsController : ControllerBase
    {
        private readonly ILogisticsService _svc;
        public LogisticsController(ILogisticsService svc) => _svc = svc;

        [HttpPost("carriers")] public async Task<IActionResult> CreateCarrier([FromBody] CreateCarrierDto dto) => Ok(await _svc.CreateCarrierAsync(dto));
        [HttpGet("carriers/{companyId}")] public async Task<IActionResult> ListCarriers(int companyId) => Ok(await _svc.ListCarriersAsync(companyId));
        [HttpDelete("carriers/{id}")] public async Task<IActionResult> DeleteCarrier(int id) => Ok(await _svc.DeleteCarrierAsync(id));

        [HttpPost("shipments")] public async Task<IActionResult> CreateShipment([FromBody] CreateShipmentDto dto) => Ok(await _svc.CreateShipmentAsync(dto));
        [HttpGet("shipments/{companyId}")] public async Task<IActionResult> ListShipments(int companyId, [FromQuery] PaginationParams p) => Ok(await _svc.ListShipmentsAsync(companyId, p));
        [HttpPut("shipments/{id}/status")] public async Task<IActionResult> UpdateShipmentStatus(int id, [FromQuery] string status, [FromQuery] string? trackingNumber) => Ok(await _svc.UpdateShipmentStatusAsync(id, status, trackingNumber));

        [HttpPost("routes")] public async Task<IActionResult> CreateRoute([FromBody] CreateRouteDto dto) => Ok(await _svc.CreateRouteAsync(dto));
        [HttpGet("routes/{companyId}")] public async Task<IActionResult> ListRoutes(int companyId) => Ok(await _svc.ListRoutesAsync(companyId));

        [HttpPost("feedback")] public async Task<IActionResult> AddFeedback([FromBody] CreateFeedbackDto dto) => Ok(await _svc.AddFeedbackAsync(dto));
        [HttpGet("feedback/{companyId}")] public async Task<IActionResult> ListFeedback(int companyId) => Ok(await _svc.ListFeedbackAsync(companyId));
    }
}
