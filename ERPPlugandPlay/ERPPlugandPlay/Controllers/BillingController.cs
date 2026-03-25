using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/billing")]
    [Authorize]
    public class BillingController : ControllerBase
    {
        private readonly IBillingService _svc;
        public BillingController(IBillingService svc) => _svc = svc;

        [HttpPost("invoices")] public async Task<IActionResult> CreateInvoice([FromBody] CreateBillingInvoiceDto dto) => Ok(await _svc.CreateInvoiceAsync(dto));
        [HttpGet("invoices/{companyId}")] public async Task<IActionResult> ListInvoices(int companyId, [FromQuery] PaginationParams p) => Ok(await _svc.ListInvoicesAsync(companyId, p));
        [HttpGet("invoices/detail/{id}")] public async Task<IActionResult> GetInvoice(int id) => Ok(await _svc.GetInvoiceAsync(id));
        [HttpPut("invoices/{id}/status")] public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status) => Ok(await _svc.UpdateInvoiceStatusAsync(id, status));

        [HttpPost("reminders")] public async Task<IActionResult> CreateReminder([FromBody] CreateReminderDto dto) => Ok(await _svc.CreateReminderAsync(dto));
        [HttpGet("reminders/{companyId}")] public async Task<IActionResult> ListReminders(int companyId) => Ok(await _svc.ListRemindersAsync(companyId));
        [HttpPut("reminders/{id}/sent")] public async Task<IActionResult> MarkSent(int id) => Ok(await _svc.MarkReminderSentAsync(id));
    }
}
