using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/purchase")]
    [Authorize]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _svc;
        public PurchaseController(IPurchaseService svc) => _svc = svc;

        // ── Vendors ──────────────────────────────────────────
        [HttpPost("vendors")]
        public async Task<IActionResult> CreateVendor([FromBody] CreateVendorDto dto)
            => Ok(await _svc.CreateVendorAsync(dto));

        [HttpGet("vendors/{companyId}")]
        public async Task<IActionResult> ListVendors(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListVendorsAsync(companyId, p));

        [HttpPut("vendors/{id}")]
        public async Task<IActionResult> UpdateVendor(int id, [FromBody] CreateVendorDto dto)
            => Ok(await _svc.UpdateVendorAsync(id, dto));

        [HttpDelete("vendors/{id}")]
        public async Task<IActionResult> DeleteVendor(int id)
            => Ok(await _svc.DeleteVendorAsync(id));

        // ── Purchase Invoices ────────────────────────────────
        [HttpPost("invoices")]
        public async Task<IActionResult> CreateInvoice([FromBody] CreatePurchaseInvoiceDto dto)
            => Ok(await _svc.CreateInvoiceAsync(dto));

        [HttpGet("invoices/{companyId}")]
        public async Task<IActionResult> ListInvoices(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListInvoicesAsync(companyId, p));

        [HttpGet("invoices/detail/{id}")]
        public async Task<IActionResult> GetInvoice(int id)
            => Ok(await _svc.GetInvoiceAsync(id));

        [HttpPut("invoices/cancel/{id}")]
        public async Task<IActionResult> CancelInvoice(int id)
            => Ok(await _svc.CancelInvoiceAsync(id));

        // ── Purchase Returns ─────────────────────────────────
        [HttpPost("returns")]
        public async Task<IActionResult> CreateReturn([FromBody] CreatePurchaseReturnDto dto)
            => Ok(await _svc.CreateReturnAsync(dto));

        [HttpGet("returns/{companyId}")]
        public async Task<IActionResult> ListReturns(int companyId)
            => Ok(await _svc.ListReturnsAsync(companyId));

        [HttpPut("returns/{id}/status")]
        public async Task<IActionResult> ApproveReturn(int id, [FromQuery] string status)
            => Ok(await _svc.ApproveReturnAsync(id, status));

        // ── Vendor Payments ──────────────────────────────────
        [HttpPost("payments")]
        public async Task<IActionResult> CreatePayment([FromBody] CreateVendorPaymentDto dto)
            => Ok(await _svc.CreatePaymentAsync(dto));

        [HttpGet("payments/{companyId}")]
        public async Task<IActionResult> ListPayments(int companyId)
            => Ok(await _svc.ListPaymentsAsync(companyId));

        // ── Credit Notes ─────────────────────────────────────
        [HttpPost("credit-notes")]
        public async Task<IActionResult> CreateCreditNote([FromBody] CreateNoteDto dto)
            => Ok(await _svc.CreateCreditNoteAsync(dto));

        [HttpGet("credit-notes/{companyId}")]
        public async Task<IActionResult> ListCreditNotes(int companyId)
            => Ok(await _svc.ListCreditNotesAsync(companyId));

        // ── Debit Notes ──────────────────────────────────────
        [HttpPost("debit-notes")]
        public async Task<IActionResult> CreateDebitNote([FromBody] CreateNoteDto dto)
            => Ok(await _svc.CreateDebitNoteAsync(dto));

        [HttpGet("debit-notes/{companyId}")]
        public async Task<IActionResult> ListDebitNotes(int companyId)
            => Ok(await _svc.ListDebitNotesAsync(companyId));
    }
}
