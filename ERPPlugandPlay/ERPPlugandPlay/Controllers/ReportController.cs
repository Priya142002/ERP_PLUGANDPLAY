using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/report")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;
        public ReportController(IReportService service) => _service = service;

        [HttpGet("employees")]
        public async Task<IActionResult> EmployeeReport([FromQuery] int? companyId)
        {
            var bytes = await _service.ExportEmployeeReportAsync(companyId);
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"EmployeeReport_{DateTime.Now:yyyyMMdd}.xlsx");
        }

        [HttpGet("payroll")]
        public async Task<IActionResult> PayrollReport([FromQuery] int month, [FromQuery] int year)
        {
            var bytes = await _service.ExportPayrollReportAsync(month, year);
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"PayrollReport_{year}_{month:D2}.xlsx");
        }

        [HttpGet("inventory")]
        public async Task<IActionResult> InventoryReport([FromQuery] int? companyId)
        {
            var bytes = await _service.ExportInventoryReportAsync(companyId);
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"InventoryReport_{DateTime.Now:yyyyMMdd}.xlsx");
        }

        [HttpGet("purchase")]
        public async Task<IActionResult> PurchaseReport([FromQuery] int companyId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var bytes = await _service.ExportPurchaseReportAsync(companyId, from, to);
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"PurchaseReport_{DateTime.Now:yyyyMMdd}.xlsx");
        }

        [HttpGet("sales")]
        public async Task<IActionResult> SalesReport([FromQuery] int companyId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var bytes = await _service.ExportSalesReportAsync(companyId, from, to);
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"SalesReport_{DateTime.Now:yyyyMMdd}.xlsx");
        }

        [HttpGet("accounts")]
        public async Task<IActionResult> AccountsReport([FromQuery] int companyId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var bytes = await _service.ExportAccountsReportAsync(companyId, from, to);
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"AccountsReport_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
