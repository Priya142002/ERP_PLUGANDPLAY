using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IPurchaseService
    {
        // Vendor
        Task<ApiResponse<VendorDto>> CreateVendorAsync(CreateVendorDto dto);
        Task<ApiResponse<PagedResult<VendorDto>>> ListVendorsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<VendorDto>> UpdateVendorAsync(int id, CreateVendorDto dto);
        Task<ApiResponse<bool>> DeleteVendorAsync(int id);

        // Purchase Invoice
        Task<ApiResponse<PurchaseInvoiceDto>> CreateInvoiceAsync(CreatePurchaseInvoiceDto dto);
        Task<ApiResponse<PagedResult<PurchaseInvoiceDto>>> ListInvoicesAsync(int companyId, PaginationParams p);
        Task<ApiResponse<PurchaseInvoiceDto>> GetInvoiceAsync(int id);
        Task<ApiResponse<bool>> CancelInvoiceAsync(int id);

        // Purchase Return
        Task<ApiResponse<PurchaseReturnDto>> CreateReturnAsync(CreatePurchaseReturnDto dto);
        Task<ApiResponse<List<PurchaseReturnDto>>> ListReturnsAsync(int companyId);
        Task<ApiResponse<bool>> ApproveReturnAsync(int id, string status);

        // Vendor Payment
        Task<ApiResponse<VendorPaymentDto>> CreatePaymentAsync(CreateVendorPaymentDto dto);
        Task<ApiResponse<List<VendorPaymentDto>>> ListPaymentsAsync(int companyId);

        // Credit / Debit Notes
        Task<ApiResponse<NoteDto>> CreateCreditNoteAsync(CreateNoteDto dto);
        Task<ApiResponse<NoteDto>> CreateDebitNoteAsync(CreateNoteDto dto);
        Task<ApiResponse<List<NoteDto>>> ListCreditNotesAsync(int companyId);
        Task<ApiResponse<List<NoteDto>>> ListDebitNotesAsync(int companyId);
    }

    public class PurchaseService : IPurchaseService
    {
        private readonly ERPDbContext _db;
        private readonly IAutoAccountingService _accounting;
        public PurchaseService(ERPDbContext db, IAutoAccountingService accounting)
        {
            _db = db;
            _accounting = accounting;
        }

        // ── Vendor ───────────────────────────────────────────
        public async Task<ApiResponse<VendorDto>> CreateVendorAsync(CreateVendorDto dto)
        {
            var vendor = new Vendor
            {
                CompanyId = dto.CompanyId, Name = dto.Name, Email = dto.Email,
                Phone = dto.Phone, Address = dto.Address,
                GSTNumber = dto.GSTNumber, ContactPerson = dto.ContactPerson
            };
            _db.Vendors.Add(vendor);
            await _db.SaveChangesAsync();
            return ApiResponse<VendorDto>.Ok(MapVendor(vendor), "Vendor created.");
        }

        public async Task<ApiResponse<PagedResult<VendorDto>>> ListVendorsAsync(int companyId, PaginationParams p)
        {
            var query = _db.Vendors.Where(v => v.CompanyId == companyId && v.IsActive);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(v => v.Name.Contains(p.Search) || v.Email.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(v => MapVendor(v)).ToListAsync();

            return ApiResponse<PagedResult<VendorDto>>.Ok(new PagedResult<VendorDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<VendorDto>> UpdateVendorAsync(int id, CreateVendorDto dto)
        {
            var vendor = await _db.Vendors.FindAsync(id);
            if (vendor == null) return ApiResponse<VendorDto>.Fail("Vendor not found.");
            vendor.Name = dto.Name; vendor.Email = dto.Email; vendor.Phone = dto.Phone;
            vendor.Address = dto.Address; vendor.GSTNumber = dto.GSTNumber;
            vendor.ContactPerson = dto.ContactPerson;
            await _db.SaveChangesAsync();
            return ApiResponse<VendorDto>.Ok(MapVendor(vendor));
        }

        public async Task<ApiResponse<bool>> DeleteVendorAsync(int id)
        {
            var vendor = await _db.Vendors.FindAsync(id);
            if (vendor == null) return ApiResponse<bool>.Fail("Vendor not found.");
            vendor.IsActive = false;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Vendor deleted.");
        }

        // ── Purchase Invoice ──────────────────────────────────
        public async Task<ApiResponse<PurchaseInvoiceDto>> CreateInvoiceAsync(CreatePurchaseInvoiceDto dto)
        {
            var invoiceNumber = string.IsNullOrEmpty(dto.InvoiceNumber)
                ? $"PI-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}"
                : dto.InvoiceNumber;

            var invoice = new PurchaseInvoice
            {
                CompanyId = dto.CompanyId, VendorId = dto.VendorId,
                InvoiceNumber = invoiceNumber, InvoiceDate = dto.InvoiceDate,
                DueDate = dto.DueDate, Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                var lineTotal = item.Quantity * item.UnitPrice;
                var discount = lineTotal * (item.DiscountPercent / 100);
                var tax = (lineTotal - discount) * (item.TaxPercent / 100);
                invoice.Items.Add(new PurchaseInvoiceItem
                {
                    ProductId = item.ProductId, Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice, TaxPercent = item.TaxPercent,
                    DiscountPercent = item.DiscountPercent,
                    TotalPrice = lineTotal - discount + tax
                });
                invoice.SubTotal += lineTotal;
                invoice.DiscountAmount += discount;
                invoice.TaxAmount += tax;

                // Update stock
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQty += item.Quantity;
                    _db.StockTransactions.Add(new StockTransaction
                    {
                        ProductId = item.ProductId, Quantity = item.Quantity,
                        Type = "IN", Remarks = $"Purchase Invoice {invoiceNumber}"
                    });
                }
            }

            invoice.TotalAmount = invoice.SubTotal - invoice.DiscountAmount + invoice.TaxAmount;
            invoice.BalanceAmount = invoice.TotalAmount;

            _db.PurchaseInvoices.Add(invoice);
            await _db.SaveChangesAsync();

            // Auto-post accounting entry: DR Purchase / CR Accounts Payable
            var vendor = await _db.Vendors.FindAsync(dto.VendorId);
            try { await _accounting.PostPurchaseInvoiceAsync(dto.CompanyId, invoice.Id, invoice.TotalAmount, vendor?.Name ?? "Vendor"); }
            catch { /* Non-blocking — accounting failure should not break invoice creation */ }

            return ApiResponse<PurchaseInvoiceDto>.Ok(await GetInvoiceDtoAsync(invoice.Id), "Purchase invoice created.");
        }

        public async Task<ApiResponse<PagedResult<PurchaseInvoiceDto>>> ListInvoicesAsync(int companyId, PaginationParams p)
        {
            var query = _db.PurchaseInvoices.Include(i => i.Vendor)
                .Where(i => i.CompanyId == companyId);

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(i => i.InvoiceNumber.Contains(p.Search) || i.Vendor.Name.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(i => i.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(i => MapInvoice(i)).ToListAsync();

            return ApiResponse<PagedResult<PurchaseInvoiceDto>>.Ok(new PagedResult<PurchaseInvoiceDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<PurchaseInvoiceDto>> GetInvoiceAsync(int id)
        {
            var dto = await GetInvoiceDtoAsync(id);
            return ApiResponse<PurchaseInvoiceDto>.Ok(dto);
        }

        public async Task<ApiResponse<bool>> CancelInvoiceAsync(int id)
        {
            var invoice = await _db.PurchaseInvoices.FindAsync(id);
            if (invoice == null) return ApiResponse<bool>.Fail("Invoice not found.");
            invoice.Status = "Cancelled";
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Invoice cancelled.");
        }

        // ── Purchase Return ───────────────────────────────────
        public async Task<ApiResponse<PurchaseReturnDto>> CreateReturnAsync(CreatePurchaseReturnDto dto)
        {
            var invoice = await _db.PurchaseInvoices.Include(i => i.Vendor).FirstOrDefaultAsync(i => i.Id == dto.PurchaseInvoiceId);
            if (invoice == null) return ApiResponse<PurchaseReturnDto>.Fail("Invoice not found.");

            var returnNumber = $"PR-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var ret = new PurchaseReturn
            {
                PurchaseInvoiceId = dto.PurchaseInvoiceId,
                ReturnNumber = returnNumber, Reason = dto.Reason
            };

            foreach (var item in dto.Items)
            {
                var total = item.Quantity * item.UnitPrice;
                ret.Items.Add(new PurchaseReturnItem
                {
                    ProductId = item.ProductId, Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice, TotalPrice = total
                });
                ret.ReturnAmount += total;
            }

            _db.PurchaseReturns.Add(ret);
            await _db.SaveChangesAsync();

            // Auto-post reversal: DR Accounts Payable / CR Purchase Account
            try { await _accounting.PostPurchaseReturnAsync(invoice.CompanyId, ret.Id, ret.ReturnAmount, invoice.Vendor?.Name ?? "Vendor"); }
            catch { /* Non-blocking */ }

            return ApiResponse<PurchaseReturnDto>.Ok(await GetReturnDtoAsync(ret.Id), "Purchase return created.");
        }

        public async Task<ApiResponse<List<PurchaseReturnDto>>> ListReturnsAsync(int companyId)
        {
            var returns = await _db.PurchaseReturns
                .Include(r => r.PurchaseInvoice).Include(r => r.Items).ThenInclude(i => i.Product)
                .Where(r => r.PurchaseInvoice.CompanyId == companyId)
                .OrderByDescending(r => r.CreatedAt).ToListAsync();

            return ApiResponse<List<PurchaseReturnDto>>.Ok(returns.Select(r => MapReturn(r)).ToList());
        }

        public async Task<ApiResponse<bool>> ApproveReturnAsync(int id, string status)
        {
            var ret = await _db.PurchaseReturns.Include(r => r.Items).FirstOrDefaultAsync(r => r.Id == id);
            if (ret == null) return ApiResponse<bool>.Fail("Return not found.");
            ret.Status = status;

            if (status == "Approved")
            {
                foreach (var item in ret.Items)
                {
                    var product = await _db.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.StockQty -= item.Quantity;
                        _db.StockTransactions.Add(new StockTransaction
                        {
                            ProductId = item.ProductId, Quantity = item.Quantity,
                            Type = "OUT", Remarks = $"Purchase Return {ret.ReturnNumber}"
                        });
                    }
                }
            }

            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"Return {status}.");
        }

        // ── Vendor Payment ────────────────────────────────────
        public async Task<ApiResponse<VendorPaymentDto>> CreatePaymentAsync(CreateVendorPaymentDto dto)
        {
            var invoice = await _db.PurchaseInvoices.FindAsync(dto.PurchaseInvoiceId);
            if (invoice == null) return ApiResponse<VendorPaymentDto>.Fail("Invoice not found.");
            if (dto.Amount > invoice.BalanceAmount)
                return ApiResponse<VendorPaymentDto>.Fail("Payment exceeds balance amount.");

            var payment = new VendorPayment
            {
                VendorId = dto.VendorId, PurchaseInvoiceId = dto.PurchaseInvoiceId,
                Amount = dto.Amount, PaymentMode = dto.PaymentMode,
                ReferenceNumber = dto.ReferenceNumber, PaymentDate = dto.PaymentDate, Notes = dto.Notes
            };
            _db.VendorPayments.Add(payment);

            invoice.PaidAmount += dto.Amount;
            invoice.BalanceAmount -= dto.Amount;
            invoice.Status = invoice.BalanceAmount <= 0 ? "Paid" : "Partial";

            await _db.SaveChangesAsync();

            // Auto-post: DR Accounts Payable / CR Cash or Bank
            var vendor = await _db.Vendors.FindAsync(dto.VendorId);
            try { await _accounting.PostVendorPaymentAsync(invoice.CompanyId, payment.Id, dto.Amount, vendor?.Name ?? "Vendor", dto.PaymentMode); }
            catch { /* Non-blocking */ }

            return ApiResponse<VendorPaymentDto>.Ok(new VendorPaymentDto
            {
                Id = payment.Id, VendorId = payment.VendorId, VendorName = vendor?.Name ?? "",
                PurchaseInvoiceId = payment.PurchaseInvoiceId, InvoiceNumber = invoice.InvoiceNumber,
                Amount = payment.Amount, PaymentMode = payment.PaymentMode,
                ReferenceNumber = payment.ReferenceNumber, PaymentDate = payment.PaymentDate, Notes = payment.Notes
            }, "Payment recorded.");
        }

        public async Task<ApiResponse<List<VendorPaymentDto>>> ListPaymentsAsync(int companyId)
        {
            var payments = await _db.VendorPayments
                .Include(p => p.Vendor).Include(p => p.PurchaseInvoice)
                .Where(p => p.PurchaseInvoice.CompanyId == companyId)
                .OrderByDescending(p => p.CreatedAt).ToListAsync();

            return ApiResponse<List<VendorPaymentDto>>.Ok(payments.Select(p => new VendorPaymentDto
            {
                Id = p.Id, VendorId = p.VendorId, VendorName = p.Vendor?.Name ?? "",
                PurchaseInvoiceId = p.PurchaseInvoiceId, InvoiceNumber = p.PurchaseInvoice?.InvoiceNumber ?? "",
                Amount = p.Amount, PaymentMode = p.PaymentMode,
                ReferenceNumber = p.ReferenceNumber, PaymentDate = p.PaymentDate, Notes = p.Notes
            }).ToList());
        }

        // ── Credit / Debit Notes ──────────────────────────────
        public async Task<ApiResponse<NoteDto>> CreateCreditNoteAsync(CreateNoteDto dto)
        {
            var note = new VendorCreditNote
            {
                VendorId = dto.VendorId, PurchaseInvoiceId = dto.PurchaseInvoiceId,
                NoteNumber = $"VCN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                Amount = dto.Amount, Reason = dto.Reason
            };
            _db.VendorCreditNotes.Add(note);
            await _db.SaveChangesAsync();
            var vendor = await _db.Vendors.FindAsync(dto.VendorId);
            return ApiResponse<NoteDto>.Ok(new NoteDto
            {
                Id = note.Id, VendorId = note.VendorId, VendorName = vendor?.Name ?? "",
                PurchaseInvoiceId = note.PurchaseInvoiceId, NoteNumber = note.NoteNumber,
                NoteDate = note.NoteDate, Amount = note.Amount, Reason = note.Reason, Status = note.Status
            }, "Credit note created.");
        }

        public async Task<ApiResponse<NoteDto>> CreateDebitNoteAsync(CreateNoteDto dto)
        {
            var note = new VendorDebitNote
            {
                VendorId = dto.VendorId, PurchaseInvoiceId = dto.PurchaseInvoiceId,
                NoteNumber = $"VDN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                Amount = dto.Amount, Reason = dto.Reason
            };
            _db.VendorDebitNotes.Add(note);
            await _db.SaveChangesAsync();
            var vendor = await _db.Vendors.FindAsync(dto.VendorId);
            return ApiResponse<NoteDto>.Ok(new NoteDto
            {
                Id = note.Id, VendorId = note.VendorId, VendorName = vendor?.Name ?? "",
                PurchaseInvoiceId = note.PurchaseInvoiceId, NoteNumber = note.NoteNumber,
                NoteDate = note.NoteDate, Amount = note.Amount, Reason = note.Reason, Status = note.Status
            }, "Debit note created.");
        }

        public async Task<ApiResponse<List<NoteDto>>> ListCreditNotesAsync(int companyId)
        {
            var notes = await _db.VendorCreditNotes.Include(n => n.Vendor)
                .Where(n => n.Vendor.CompanyId == companyId)
                .OrderByDescending(n => n.CreatedAt).ToListAsync();
            return ApiResponse<List<NoteDto>>.Ok(notes.Select(n => new NoteDto
            {
                Id = n.Id, VendorId = n.VendorId, VendorName = n.Vendor?.Name ?? "",
                PurchaseInvoiceId = n.PurchaseInvoiceId, NoteNumber = n.NoteNumber,
                NoteDate = n.NoteDate, Amount = n.Amount, Reason = n.Reason, Status = n.Status
            }).ToList());
        }

        public async Task<ApiResponse<List<NoteDto>>> ListDebitNotesAsync(int companyId)
        {
            var notes = await _db.VendorDebitNotes.Include(n => n.Vendor)
                .Where(n => n.Vendor.CompanyId == companyId)
                .OrderByDescending(n => n.CreatedAt).ToListAsync();
            return ApiResponse<List<NoteDto>>.Ok(notes.Select(n => new NoteDto
            {
                Id = n.Id, VendorId = n.VendorId, VendorName = n.Vendor?.Name ?? "",
                PurchaseInvoiceId = n.PurchaseInvoiceId, NoteNumber = n.NoteNumber,
                NoteDate = n.NoteDate, Amount = n.Amount, Reason = n.Reason, Status = n.Status
            }).ToList());
        }

        // ── Helpers ───────────────────────────────────────────
        private async Task<PurchaseInvoiceDto> GetInvoiceDtoAsync(int id)
        {
            var inv = await _db.PurchaseInvoices
                .Include(i => i.Vendor).Include(i => i.Items).ThenInclude(i => i.Product)
                .FirstAsync(i => i.Id == id);
            return MapInvoice(inv);
        }

        private async Task<PurchaseReturnDto> GetReturnDtoAsync(int id)
        {
            var ret = await _db.PurchaseReturns
                .Include(r => r.PurchaseInvoice).Include(r => r.Items).ThenInclude(i => i.Product)
                .FirstAsync(r => r.Id == id);
            return MapReturn(ret);
        }

        private static VendorDto MapVendor(Vendor v) => new()
        {
            Id = v.Id, CompanyId = v.CompanyId, Name = v.Name, Email = v.Email,
            Phone = v.Phone, Address = v.Address, GSTNumber = v.GSTNumber,
            ContactPerson = v.ContactPerson, IsActive = v.IsActive, CreatedAt = v.CreatedAt
        };

        private static PurchaseInvoiceDto MapInvoice(PurchaseInvoice i) => new()
        {
            Id = i.Id, CompanyId = i.CompanyId, VendorId = i.VendorId,
            VendorName = i.Vendor?.Name ?? "", InvoiceNumber = i.InvoiceNumber,
            InvoiceDate = i.InvoiceDate, DueDate = i.DueDate, SubTotal = i.SubTotal,
            TaxAmount = i.TaxAmount, DiscountAmount = i.DiscountAmount, TotalAmount = i.TotalAmount,
            PaidAmount = i.PaidAmount, BalanceAmount = i.BalanceAmount,
            Status = i.Status, Notes = i.Notes, CreatedAt = i.CreatedAt,
            Items = i.Items.Select(it => new PurchaseInvoiceItemDto
            {
                Id = it.Id, ProductId = it.ProductId, ProductName = it.Product?.Name ?? "",
                Quantity = it.Quantity, UnitPrice = it.UnitPrice, TaxPercent = it.TaxPercent,
                DiscountPercent = it.DiscountPercent, TotalPrice = it.TotalPrice
            }).ToList()
        };

        private static PurchaseReturnDto MapReturn(PurchaseReturn r) => new()
        {
            Id = r.Id, PurchaseInvoiceId = r.PurchaseInvoiceId,
            InvoiceNumber = r.PurchaseInvoice?.InvoiceNumber ?? "",
            ReturnNumber = r.ReturnNumber, ReturnDate = r.ReturnDate,
            ReturnAmount = r.ReturnAmount, Reason = r.Reason, Status = r.Status,
            Items = r.Items.Select(i => new ReturnItemResultDto
            {
                ProductId = i.ProductId, ProductName = i.Product?.Name ?? "",
                Quantity = i.Quantity, UnitPrice = i.UnitPrice, TotalPrice = i.TotalPrice
            }).ToList()
        };
    }
}
