using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/sales")]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly ISalesService _svc;
        public SalesController(ISalesService svc) => _svc = svc;

        // ── Customers ────────────────────────────────────────
        [HttpPost("customers")]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerDto dto)
            => Ok(await _svc.CreateCustomerAsync(dto));

        [HttpGet("customers/{companyId}")]
        public async Task<IActionResult> ListCustomers(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListCustomersAsync(companyId, p));

        [HttpPut("customers/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CreateCustomerDto dto)
            => Ok(await _svc.UpdateCustomerAsync(id, dto));

        [HttpDelete("customers/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
            => Ok(await _svc.DeleteCustomerAsync(id));

        // ── Quotations ───────────────────────────────────────
        [HttpPost("quotations")]
        public async Task<IActionResult> CreateQuotation([FromBody] CreateQuotationDto dto)
            => Ok(await _svc.CreateQuotationAsync(dto));

        [HttpGet("quotations/{companyId}")]
        public async Task<IActionResult> ListQuotations(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListQuotationsAsync(companyId, p));

        [HttpGet("quotations/detail/{id}")]
        public async Task<IActionResult> GetQuotation(int id)
            => Ok(await _svc.GetQuotationAsync(id));

        [HttpPut("quotations/{id}/status")]
        public async Task<IActionResult> UpdateQuotationStatus(int id, [FromQuery] string status)
            => Ok(await _svc.UpdateQuotationStatusAsync(id, status));

        // ── Sales Invoices ───────────────────────────────────
        [HttpPost("invoices")]
        public async Task<IActionResult> CreateInvoice([FromBody] CreateSalesInvoiceDto dto)
            => Ok(await _svc.CreateInvoiceAsync(dto));

        [HttpPost("invoices/from-quotation/{quotationId}")]
        public async Task<IActionResult> CreateFromQuotation(int quotationId)
            => Ok(await _svc.CreateFromQuotationAsync(quotationId));

        [HttpGet("invoices/{companyId}")]
        public async Task<IActionResult> ListInvoices(int companyId, [FromQuery] PaginationParams p)
            => Ok(await _svc.ListInvoicesAsync(companyId, p));

        [HttpGet("invoices/detail/{id}")]
        public async Task<IActionResult> GetInvoice(int id)
            => Ok(await _svc.GetInvoiceAsync(id));

        [HttpPut("invoices/cancel/{id}")]
        public async Task<IActionResult> CancelInvoice(int id)
            => Ok(await _svc.CancelInvoiceAsync(id));

        // ── Sales Returns ────────────────────────────────────
        [HttpPost("returns")]
        public async Task<IActionResult> CreateReturn([FromBody] CreateSalesReturnDto dto)
            => Ok(await _svc.CreateReturnAsync(dto));

        [HttpGet("returns/{companyId}")]
        public async Task<IActionResult> ListReturns(int companyId)
            => Ok(await _svc.ListReturnsAsync(companyId));

        [HttpPut("returns/{id}/status")]
        public async Task<IActionResult> ApproveReturn(int id, [FromQuery] string status)
            => Ok(await _svc.ApproveReturnAsync(id, status));

        // ── Customer Payments ────────────────────────────────
        [HttpPost("payments")]
        public async Task<IActionResult> CreatePayment([FromBody] CreateCustomerPaymentDto dto)
            => Ok(await _svc.CreatePaymentAsync(dto));

        [HttpGet("payments/{companyId}")]
        public async Task<IActionResult> ListPayments(int companyId)
            => Ok(await _svc.ListPaymentsAsync(companyId));

        // ── Credit Notes ─────────────────────────────────────
        [HttpPost("credit-notes")]
        public async Task<IActionResult> CreateCreditNote([FromBody] CreateCustomerNoteDto dto)
            => Ok(await _svc.CreateCreditNoteAsync(dto));

        [HttpGet("credit-notes/{companyId}")]
        public async Task<IActionResult> ListCreditNotes(int companyId)
            => Ok(await _svc.ListCreditNotesAsync(companyId));

        // ── Debit Notes ──────────────────────────────────────
        [HttpPost("debit-notes")]
        public async Task<IActionResult> CreateDebitNote([FromBody] CreateCustomerNoteDto dto)
            => Ok(await _svc.CreateDebitNoteAsync(dto));

        [HttpGet("debit-notes/{companyId}")]
        public async Task<IActionResult> ListDebitNotes(int companyId)
            => Ok(await _svc.ListDebitNotesAsync(companyId));
    }
}
