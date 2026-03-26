using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/inventory")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _svc;
        public InventoryController(IInventoryService svc) => _svc = svc;

        // ── Dashboard ────────────────────────────────────────
        [HttpGet("dashboard/{companyId}")]
        public async Task<IActionResult> Dashboard(int companyId, [FromQuery] int lowStockThreshold = 10)
            => Ok(await _svc.GetDashboardAsync(companyId, lowStockThreshold));

        // ── Products ─────────────────────────────────────────
        [HttpPost("products")]
        public async Task<IActionResult> AddProduct([FromBody] CreateProductDto dto)
            => Ok(await _svc.AddProductAsync(dto));

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
            => Ok(await _svc.UpdateProductAsync(id, dto));

        [HttpGet("product/{id}")]
        public async Task<IActionResult> GetProduct(int id)
            => Ok(await _svc.GetProductAsync(id));

        [HttpGet("products/{companyId}")]
        public async Task<IActionResult> ListProducts(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListProductsAsync(companyId, p));

        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
            => Ok(await _svc.DeleteProductAsync(id));

        // ── Stock ─────────────────────────────────────────────
        [HttpPost("stock/update")]
        public async Task<IActionResult> UpdateStock([FromBody] UpdateStockDto dto)
            => Ok(await _svc.UpdateStockAsync(dto));

        [HttpGet("stock/history/{productId}")]
        public async Task<IActionResult> StockHistory(int productId)
            => Ok(await _svc.GetStockHistoryAsync(productId));

        // ── Categories ────────────────────────────────────────
        [HttpPost("categories")]
        public async Task<IActionResult> AddCategory([FromBody] CreateCategoryDto dto)
            => Ok(await _svc.AddCategoryAsync(dto));

        [HttpGet("categories/{companyId}")]
        public async Task<IActionResult> ListCategories(int companyId)
            => Ok(await _svc.ListCategoriesAsync(companyId));

        [HttpGet("brands/{companyId}")]
        public async Task<IActionResult> ListBrands(int companyId)
            => Ok(await _svc.ListBrandsAsync(companyId));

        [HttpPost("brands")]
        public async Task<IActionResult> AddBrand([FromBody] CreateBrandDto dto)
            => Ok(await _svc.AddBrandAsync(dto));

        [HttpGet("units/{companyId}")]
        public async Task<IActionResult> ListUnits(int companyId)
            => Ok(await _svc.ListUnitsAsync(companyId));

        [HttpPost("units")]
        public async Task<IActionResult> AddUnit([FromBody] CreateUnitDto dto)
            => Ok(await _svc.AddUnitAsync(dto));

        [HttpGet("taxtypes/{companyId}")]
        public async Task<IActionResult> ListTaxTypes(int companyId)
            => Ok(await _svc.ListTaxTypesAsync(companyId));

        [HttpPost("taxtypes")]
        public async Task<IActionResult> AddTaxType([FromBody] CreateTaxTypeDto dto)
            => Ok(await _svc.AddTaxTypeAsync(dto));

        // ── Warehouses ──────────────────────────────────────────
        [HttpGet("warehouses/{companyId}")]
        public async Task<IActionResult> ListWarehouses(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListWarehousesAsync(companyId, p));

        [HttpPost("warehouses")]
        public async Task<IActionResult> AddWarehouse([FromBody] CreateWarehouseDto dto)
            => Ok(await _svc.AddWarehouseAsync(dto));

        [HttpPut("warehouses/{id}")]
        public async Task<IActionResult> UpdateWarehouse(int id, [FromBody] UpdateWarehouseDto dto)
            => Ok(await _svc.UpdateWarehouseAsync(id, dto));

        [HttpDelete("warehouses/{id}")]
        public async Task<IActionResult> DeleteWarehouse(int id)
            => Ok(await _svc.DeleteWarehouseAsync(id));

        // ── Material Dispatch ─────────────────────────────────
        [HttpPost("dispatch")]
        public async Task<IActionResult> CreateDispatch([FromBody] CreateDispatchDto dto)
            => Ok(await _svc.CreateDispatchAsync(dto));

        [HttpGet("dispatch/{companyId}")]
        public async Task<IActionResult> ListDispatches(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListDispatchesAsync(companyId, p));

        [HttpGet("dispatch/detail/{id}")]
        public async Task<IActionResult> GetDispatch(int id)
            => Ok(await _svc.GetDispatchAsync(id));

        [HttpPut("dispatch/{id}/status")]
        public async Task<IActionResult> UpdateDispatchStatus(int id, [FromQuery] string status)
            => Ok(await _svc.UpdateDispatchStatusAsync(id, status));

        // ── Product Transfer ──────────────────────────────────
        [HttpPost("transfer")]
        public async Task<IActionResult> CreateTransfer([FromBody] CreateTransferDto dto)
            => Ok(await _svc.CreateTransferAsync(dto));

        [HttpGet("transfer/{companyId}")]
        public async Task<IActionResult> ListTransfers(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListTransfersAsync(companyId, p));

        [HttpPut("transfer/{id}/status")]
        public async Task<IActionResult> UpdateTransferStatus(int id, [FromQuery] string status)
            => Ok(await _svc.UpdateTransferStatusAsync(id, status));

        // ── Product Receive (GRN) ─────────────────────────────
        [HttpPost("receive")]
        public async Task<IActionResult> CreateReceive([FromBody] CreateReceiveDto dto)
            => Ok(await _svc.CreateReceiveAsync(dto));

        [HttpGet("receive/{companyId}")]
        public async Task<IActionResult> ListReceives(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListReceivesAsync(companyId, p));
    }
}
