using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IBillingService
    {
        Task<ApiResponse<BillingInvoiceDto>> CreateInvoiceAsync(CreateBillingInvoiceDto dto);
        Task<ApiResponse<PagedResult<BillingInvoiceDto>>> ListInvoicesAsync(int companyId, PaginationParams p);
        Task<ApiResponse<BillingInvoiceDto>> GetInvoiceAsync(int id);
        Task<ApiResponse<bool>> UpdateInvoiceStatusAsync(int id, string status);

        Task<ApiResponse<ReminderDto>> CreateReminderAsync(CreateReminderDto dto);
        Task<ApiResponse<List<ReminderDto>>> ListRemindersAsync(int companyId);
        Task<ApiResponse<bool>> MarkReminderSentAsync(int id);
    }

    public class BillingService : IBillingService
    {
        private readonly ERPDbContext _db;
        public BillingService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<BillingInvoiceDto>> CreateInvoiceAsync(CreateBillingInvoiceDto dto)
        {
            var invoiceNumber = $"BILL-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var invoice = new BillingInvoice
            {
                CompanyId = dto.CompanyId, InvoiceNumber = invoiceNumber,
                ClientName = dto.ClientName, ClientEmail = dto.ClientEmail,
                InvoiceDate = dto.InvoiceDate, DueDate = dto.DueDate, Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                var lineTotal = item.Quantity * item.UnitPrice;
                var tax = lineTotal * (item.TaxPercent / 100);
                invoice.Items.Add(new BillingInvoiceItem
                {
                    Description = item.Description, Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice, TaxPercent = item.TaxPercent,
                    TotalPrice = lineTotal + tax
                });
                invoice.SubTotal += lineTotal;
                invoice.TaxAmount += tax;
            }
            invoice.TotalAmount = invoice.SubTotal + invoice.TaxAmount;

            _db.BillingInvoices.Add(invoice);
            await _db.SaveChangesAsync();
            return ApiResponse<BillingInvoiceDto>.Ok(await GetInvoiceDtoAsync(invoice.Id), "Invoice created.");
        }

        public async Task<ApiResponse<PagedResult<BillingInvoiceDto>>> ListInvoicesAsync(int companyId, PaginationParams p)
        {
            var query = _db.BillingInvoices.Where(i => i.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(i => i.InvoiceNumber.Contains(p.Search) || i.ClientName.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Include(i => i.Items)
                .OrderByDescending(i => i.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return ApiResponse<PagedResult<BillingInvoiceDto>>.Ok(new PagedResult<BillingInvoiceDto>
            {
                Items = items.Select(MapInvoice).ToList(),
                TotalCount = total, Page = p.Page, PageSize = p.PageSize
            });
        }

        public async Task<ApiResponse<BillingInvoiceDto>> GetInvoiceAsync(int id)
            => ApiResponse<BillingInvoiceDto>.Ok(await GetInvoiceDtoAsync(id));

        public async Task<ApiResponse<bool>> UpdateInvoiceStatusAsync(int id, string status)
        {
            var invoice = await _db.BillingInvoices.FindAsync(id);
            if (invoice == null) return ApiResponse<bool>.Fail("Invoice not found.");
            invoice.Status = status;
            if (status == "Paid") invoice.PaidAmount = invoice.TotalAmount;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<ReminderDto>> CreateReminderAsync(CreateReminderDto dto)
        {
            var reminder = new PaymentReminder
            {
                BillingInvoiceId = dto.BillingInvoiceId,
                ReminderDate = dto.ReminderDate, Channel = dto.Channel
            };
            _db.PaymentReminders.Add(reminder);
            await _db.SaveChangesAsync();
            var invoice = await _db.BillingInvoices.FindAsync(dto.BillingInvoiceId);
            return ApiResponse<ReminderDto>.Ok(new ReminderDto
            {
                Id = reminder.Id, BillingInvoiceId = reminder.BillingInvoiceId,
                InvoiceNumber = invoice?.InvoiceNumber ?? "", ClientName = invoice?.ClientName ?? "",
                ReminderDate = reminder.ReminderDate, Channel = reminder.Channel,
                IsSent = reminder.IsSent, CreatedAt = reminder.CreatedAt
            }, "Reminder created.");
        }

        public async Task<ApiResponse<List<ReminderDto>>> ListRemindersAsync(int companyId)
        {
            var reminders = await _db.PaymentReminders.Include(r => r.BillingInvoice)
                .Where(r => r.BillingInvoice.CompanyId == companyId)
                .OrderBy(r => r.ReminderDate).ToListAsync();
            return ApiResponse<List<ReminderDto>>.Ok(reminders.Select(r => new ReminderDto
            {
                Id = r.Id, BillingInvoiceId = r.BillingInvoiceId,
                InvoiceNumber = r.BillingInvoice?.InvoiceNumber ?? "",
                ClientName = r.BillingInvoice?.ClientName ?? "",
                ReminderDate = r.ReminderDate, Channel = r.Channel,
                IsSent = r.IsSent, CreatedAt = r.CreatedAt
            }).ToList());
        }

        public async Task<ApiResponse<bool>> MarkReminderSentAsync(int id)
        {
            var reminder = await _db.PaymentReminders.FindAsync(id);
            if (reminder == null) return ApiResponse<bool>.Fail("Reminder not found.");
            reminder.IsSent = true;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        private async Task<BillingInvoiceDto> GetInvoiceDtoAsync(int id)
        {
            var invoice = await _db.BillingInvoices.Include(i => i.Items).FirstAsync(i => i.Id == id);
            return MapInvoice(invoice);
        }

        private static BillingInvoiceDto MapInvoice(BillingInvoice i) => new()
        {
            Id = i.Id, CompanyId = i.CompanyId, InvoiceNumber = i.InvoiceNumber,
            ClientName = i.ClientName, ClientEmail = i.ClientEmail,
            InvoiceDate = i.InvoiceDate, DueDate = i.DueDate,
            SubTotal = i.SubTotal, TaxAmount = i.TaxAmount, TotalAmount = i.TotalAmount,
            PaidAmount = i.PaidAmount, Status = i.Status, Notes = i.Notes, CreatedAt = i.CreatedAt,
            Items = i.Items.Select(it => new BillingItemResultDto
            {
                Id = it.Id, Description = it.Description, Quantity = it.Quantity,
                UnitPrice = it.UnitPrice, TaxPercent = it.TaxPercent, TotalPrice = it.TotalPrice
            }).ToList()
        };
    }
}
