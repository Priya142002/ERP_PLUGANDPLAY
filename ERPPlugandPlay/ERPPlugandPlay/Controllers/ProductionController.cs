using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/production")]
    [Authorize]
    public class ProductionController : ControllerBase
    {
        private readonly IProductionService _svc;
        public ProductionController(IProductionService svc) => _svc = svc;

        [HttpPost("bom")] public async Task<IActionResult> CreateBom([FromBody] CreateBomDto dto) => Ok(await _svc.CreateBomAsync(dto));
        [HttpGet("bom/{companyId}")] public async Task<IActionResult> ListBoms(int companyId) => Ok(await _svc.ListBomsAsync(companyId));
        [HttpDelete("bom/{id}")] public async Task<IActionResult> DeleteBom(int id) => Ok(await _svc.DeleteBomAsync(id));

        [HttpPost("orders")] public async Task<IActionResult> CreateOrder([FromBody] CreateProductionOrderDto dto) => Ok(await _svc.CreateOrderAsync(dto));
        [HttpGet("orders/{companyId}")] public async Task<IActionResult> ListOrders(int companyId) => Ok(await _svc.ListOrdersAsync(companyId));
        [HttpPut("orders/{id}/status")] public async Task<IActionResult> UpdateOrderStatus(int id, [FromQuery] string status) => Ok(await _svc.UpdateOrderStatusAsync(id, status));

        [HttpPost("quality-checks")] public async Task<IActionResult> CreateQualityCheck([FromBody] CreateQualityCheckDto dto) => Ok(await _svc.CreateQualityCheckAsync(dto));
        [HttpGet("quality-checks/{productionOrderId}")] public async Task<IActionResult> ListQualityChecks(int productionOrderId) => Ok(await _svc.ListQualityChecksAsync(productionOrderId));
    }
}
