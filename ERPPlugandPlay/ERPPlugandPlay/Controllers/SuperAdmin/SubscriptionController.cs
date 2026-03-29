using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/subscriptions")]
    [Authorize(Roles = "SuperAdmin")]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _service;
        private readonly ERPDbContext _db;

        public SubscriptionController(ISubscriptionService service, ERPDbContext db)
        {
            _service = service;
            _db = db;
        }

        // ── Plans ──────────────────────────────────────────────

        /// <summary>GET /api/superadmin/subscriptions/plans</summary>
        [HttpGet("plans")]
        [AllowAnonymous] // Plans are public for pricing page
        public async Task<IActionResult> GetPlans()
        {
            var result = await _service.GetPlansAsync();
            return Ok(result);
        }

        /// <summary>POST /api/superadmin/subscriptions/plans</summary>
        [HttpPost("plans")]
        public async Task<IActionResult> CreatePlan([FromBody] CreatePlanDto dto)
        {
            var result = await _service.CreatePlanAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PUT /api/superadmin/subscriptions/plans/{id}</summary>
        [HttpPut("plans/{id}")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] CreatePlanDto dto)
        {
            var result = await _service.UpdatePlanAsync(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>DELETE /api/superadmin/subscriptions/plans/{id}</summary>
        [HttpDelete("plans/{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            var result = await _service.DeletePlanAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        // ── Company Subscriptions ──────────────────────────────

        /// <summary>GET /api/superadmin/subscriptions</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationParams p)
        {
            var result = await _service.GetAllSubscriptionsAsync(p);
            return Ok(result);
        }

        /// <summary>GET /api/superadmin/subscriptions/company/{companyId}</summary>
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCompanySubscription(int companyId)
        {
            var result = await _service.GetCompanySubscriptionAsync(companyId);
            return Ok(result);
        }

        /// <summary>POST /api/superadmin/subscriptions/assign</summary>
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignSubscriptionDto dto)
        {
            var result = await _service.AssignSubscriptionAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PUT /api/superadmin/subscriptions/change-plan</summary>
        [HttpPut("change-plan")]
        public async Task<IActionResult> ChangePlan([FromBody] ChangePlanDto dto)
        {
            var result = await _service.ChangePlanAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PUT /api/superadmin/subscriptions/status</summary>
        [HttpPut("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] SuspendSubscriptionDto dto)
        {
            var result = await _service.UpdateStatusAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ── Company Billing History ────────────────────────────

        /// <summary>GET /api/superadmin/subscriptions/billing/{companyId} — all payment records for a company</summary>
        [HttpGet("billing/{companyId}")]
        public async Task<IActionResult> GetBillingHistory(int companyId)
        {
            var payments = await _db.SubscriptionPayments
                .Where(p => p.CompanyId == companyId)
                .OrderByDescending(p => p.BillingPeriodStart)
                .Select(p => new
                {
                    p.Id, p.InvoiceNumber, p.PlanName, p.PlanType,
                    p.Amount, p.TaxAmount, p.TotalAmount,
                    p.BillingPeriodStart, p.BillingPeriodEnd,
                    p.DueDate, p.PaidDate, p.Status,
                    p.PaymentMode, p.TransactionRef, p.Notes,
                    p.ReminderSent, p.ReminderSentAt, p.CreatedAt
                })
                .ToListAsync();

            var company = await _db.Companies.FindAsync(companyId);
            var activeSub = await _db.CompanySubscriptions
                .Include(s => s.Plan)
                .FirstOrDefaultAsync(s => s.CompanyId == companyId && s.Status == "Active");

            return Ok(new
            {
                success = true,
                data = new
                {
                    companyId,
                    companyName = company?.Name ?? "",
                    companyEmail = company?.Email ?? "",
                    activePlan = activeSub?.Plan?.Name,
                    activeStatus = activeSub?.Status,
                    nextBillingDate = activeSub?.NextBillingDate,
                    payments,
                    summary = new
                    {
                        totalPaid    = payments.Where(p => p.Status == "Paid").Sum(p => p.TotalAmount),
                        totalPending = payments.Where(p => p.Status == "Pending").Sum(p => p.TotalAmount),
                        totalOverdue = payments.Where(p => p.Status == "Overdue").Sum(p => p.TotalAmount),
                        paidCount    = payments.Count(p => p.Status == "Paid"),
                        pendingCount = payments.Count(p => p.Status == "Pending"),
                        overdueCount = payments.Count(p => p.Status == "Overdue"),
                    }
                }
            });
        }

        /// <summary>POST /api/superadmin/subscriptions/billing — record a payment</summary>
        [HttpPost("billing")]
        public async Task<IActionResult> RecordPayment([FromBody] RecordPaymentDto dto)
        {
            var company = await _db.Companies.FindAsync(dto.CompanyId);
            if (company == null) return NotFound(new { success = false, message = "Company not found" });

            var activeSub = await _db.CompanySubscriptions
                .Include(s => s.Plan)
                .FirstOrDefaultAsync(s => s.CompanyId == dto.CompanyId && s.Status == "Active");

            var count = await _db.SubscriptionPayments.CountAsync(p => p.CompanyId == dto.CompanyId);
            var invoiceNumber = $"SINV-{DateTime.UtcNow.Year}-{dto.CompanyId:D3}-{count + 1:D3}";

            var payment = new SubscriptionPayment
            {
                CompanyId             = dto.CompanyId,
                CompanySubscriptionId = activeSub?.Id,
                InvoiceNumber         = invoiceNumber,
                PlanName              = dto.PlanName ?? activeSub?.Plan?.Name ?? "",
                PlanType              = dto.PlanType ?? activeSub?.Plan?.PlanType ?? "Monthly",
                Amount                = dto.Amount,
                TaxAmount             = dto.TaxAmount,
                TotalAmount           = dto.Amount + dto.TaxAmount,
                BillingPeriodStart    = dto.BillingPeriodStart,
                BillingPeriodEnd      = dto.BillingPeriodEnd,
                DueDate               = dto.DueDate,
                PaidDate              = dto.Status == "Paid" ? DateTime.UtcNow : null,
                Status                = dto.Status,
                PaymentMode           = dto.PaymentMode ?? "",
                TransactionRef        = dto.TransactionRef,
                Notes                 = dto.Notes,
                CreatedAt             = DateTime.UtcNow
            };

            _db.SubscriptionPayments.Add(payment);
            await _db.SaveChangesAsync();

            return Ok(new { success = true, data = new { payment.Id, payment.InvoiceNumber, payment.Status }, message = "Payment recorded." });
        }

        /// <summary>PUT /api/superadmin/subscriptions/billing/{id}/mark-paid — mark a payment as paid</summary>
        [HttpPut("billing/{id}/mark-paid")]
        public async Task<IActionResult> MarkPaid(int id, [FromBody] MarkPaidDto dto)
        {
            var payment = await _db.SubscriptionPayments.FindAsync(id);
            if (payment == null) return NotFound(new { success = false, message = "Payment not found" });

            payment.Status         = "Paid";
            payment.PaidDate       = DateTime.UtcNow;
            payment.PaymentMode    = dto.PaymentMode ?? payment.PaymentMode;
            payment.TransactionRef = dto.TransactionRef ?? payment.TransactionRef;
            payment.Notes          = dto.Notes ?? payment.Notes;

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Payment marked as paid." });
        }

        /// <summary>POST /api/superadmin/subscriptions/billing/{id}/send-reminder — mark reminder sent</summary>
        [HttpPost("billing/{id}/send-reminder")]
        public async Task<IActionResult> SendReminder(int id)
        {
            var payment = await _db.SubscriptionPayments
                .Include(p => p.Company)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null) return NotFound(new { success = false, message = "Payment not found" });
            if (payment.Status == "Paid") return BadRequest(new { success = false, message = "Payment is already paid" });

            payment.ReminderSent   = true;
            payment.ReminderSentAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // In production: send actual email/SMS here
            return Ok(new
            {
                success = true,
                message = $"Reminder marked as sent to {payment.Company?.Email}",
                data = new { payment.Id, payment.InvoiceNumber, sentTo = payment.Company?.Email, sentAt = payment.ReminderSentAt }
            });
        }

        /// <summary>POST /api/superadmin/subscriptions/billing/send-bulk-reminders — send reminders to all overdue/pending</summary>
        [HttpPost("billing/send-bulk-reminders")]
        public async Task<IActionResult> SendBulkReminders()
        {
            var overduePayments = await _db.SubscriptionPayments
                .Include(p => p.Company)
                .Where(p => (p.Status == "Overdue" || (p.Status == "Pending" && p.DueDate < DateTime.UtcNow))
                         && !p.ReminderSent)
                .ToListAsync();

            foreach (var p in overduePayments)
            {
                p.Status           = "Overdue";
                p.ReminderSent     = true;
                p.ReminderSentAt   = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = $"Reminders sent to {overduePayments.Count} companies.", count = overduePayments.Count });
        }
    }
}
