using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsService _svc;
        public AccountsController(IAccountsService svc) => _svc = svc;

        // ── Chart of Accounts ────────────────────────────────
        [HttpPost("chart")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
            => Ok(await _svc.CreateAccountAsync(dto));

        [HttpGet("chart/{companyId}")]
        public async Task<IActionResult> ListAccounts(int companyId)
            => Ok(await _svc.ListAccountsAsync(companyId));

        [HttpPut("chart/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] CreateAccountDto dto)
            => Ok(await _svc.UpdateAccountAsync(id, dto));

        [HttpDelete("chart/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
            => Ok(await _svc.DeleteAccountAsync(id));

        // ── Journal Vouchers ─────────────────────────────────
        [HttpPost("journal-vouchers")]
        public async Task<IActionResult> CreateJournalVoucher([FromBody] CreateJournalVoucherDto dto)
            => Ok(await _svc.CreateJournalVoucherAsync(dto));

        [HttpGet("journal-vouchers/{companyId}")]
        public async Task<IActionResult> ListJournalVouchers(int companyId)
            => Ok(await _svc.ListJournalVouchersAsync(companyId));

        [HttpGet("journal-vouchers/detail/{id}")]
        public async Task<IActionResult> GetJournalVoucher(int id)
            => Ok(await _svc.GetJournalVoucherAsync(id));

        // ── Payment Vouchers ─────────────────────────────────
        [HttpPost("payment-vouchers")]
        public async Task<IActionResult> CreatePaymentVoucher([FromBody] CreatePaymentVoucherDto dto)
            => Ok(await _svc.CreatePaymentVoucherAsync(dto));

        [HttpGet("payment-vouchers/{companyId}")]
        public async Task<IActionResult> ListPaymentVouchers(int companyId)
            => Ok(await _svc.ListPaymentVouchersAsync(companyId));

        // ── Receipt Vouchers ─────────────────────────────────
        [HttpPost("receipt-vouchers")]
        public async Task<IActionResult> CreateReceiptVoucher([FromBody] CreateReceiptVoucherDto dto)
            => Ok(await _svc.CreateReceiptVoucherAsync(dto));

        [HttpGet("receipt-vouchers/{companyId}")]
        public async Task<IActionResult> ListReceiptVouchers(int companyId)
            => Ok(await _svc.ListReceiptVouchersAsync(companyId));
    }
}
