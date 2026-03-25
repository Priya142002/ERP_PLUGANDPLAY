using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface ISalesService
    {
        // Customer
        Task<ApiResponse<CustomerDto>> CreateCustomerAsync(CreateCustomerDto dto);
        Task<ApiResponse<PagedResult<CustomerDto>>> ListCustomersAsync(int companyId, PaginationParams p);
        Task<ApiResponse<CustomerDto>> UpdateCustomerAsync(int id, CreateCustomerDto dto);
        Task<ApiResponse<bool>> DeleteCustomerAsync(int id);

        // Quotation
        Task<ApiResponse<QuotationDto>> CreateQuotationAsync(CreateQuotationDto dto);
        Task<ApiResponse<PagedResult<QuotationDto>>> ListQuotationsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<QuotationDto>> GetQuotationAsync(int id);
        Task<ApiResponse<bool>> UpdateQuotationStatusAsync(int id, string status);

        // Sales Invoice
        Task<ApiResponse<SalesInvoiceDto>> CreateInvoiceAsync(CreateSalesInvoiceDto dto);
        Task<ApiResponse<SalesInvoiceDto>> CreateFromQuotationAsync(int quotationId);
        Task<ApiResponse<PagedResult<SalesInvoiceDto>>> ListInvoicesAsync(int companyId, PaginationParams p);
        Task<ApiResponse<SalesInvoiceDto>> GetInvoiceAsync(int id);
        Task<ApiResponse<bool>> CancelInvoiceAsync(int id);

        // Sales Return
        Task<ApiResponse<SalesReturnDto>> CreateReturnAsync(CreateSalesReturnDto dto);
        Task<ApiResponse<List<SalesReturnDto>>> ListReturnsAsync(int companyId);
        Task<ApiResponse<bool>> ApproveReturnAsync(int id, string status);

        // Customer Payment
        Task<ApiResponse<CustomerPaymentDto>> CreatePaymentAsync(CreateCustomerPaymentDto dto);
        Task<ApiResponse<List<CustomerPaymentDto>>> ListPaymentsAsync(int companyId);

        // Credit / Debit Notes
        Task<ApiResponse<CustomerNoteDto>> CreateCreditNoteAsync(CreateCustomerNoteDto dto);
        Task<ApiResponse<CustomerNoteDto>> CreateDebitNoteAsync(CreateCustomerNoteDto dto);
        Task<ApiResponse<List<CustomerNoteDto>>> ListCreditNotesAsync(int companyId);
        Task<ApiResponse<List<CustomerNoteDto>>> ListDebitNotesAsync(int companyId);
    }

    public class SalesService : ISalesService
    {
        private readonly ERPDbContext _db;
        public SalesService(ERPDbContext db) => _db = db;

        // ── Customer ─────────────────────────────────────────
        public async Task<ApiResponse<CustomerDto>> CreateCustomerAsync(CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                CompanyId = dto.CompanyId, Name = dto.Name, Email = dto.Email,
                Phone = dto.Phone, Address = dto.Address, GSTNumber = dto.GSTNumber,
                ContactPerson = dto.ContactPerson, CreditLimit = dto.CreditLimit
            };
            _db.Customers.Add(customer);
            await _db.SaveChangesAsync();
            return ApiResponse<CustomerDto>.Ok(MapCustomer(customer), "Customer created.");
        }

        public async Task<ApiResponse<PagedResult<CustomerDto>>> ListCustomersAsync(int companyId, PaginationParams p)
        {
            var query = _db.Customers.Where(c => c.CompanyId == companyId && c.IsActive);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(c => c.Name.Contains(p.Search) || c.Email.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(c => MapCustomer(c)).ToListAsync();

            return ApiResponse<PagedResult<CustomerDto>>.Ok(new PagedResult<CustomerDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<CustomerDto>> UpdateCustomerAsync(int id, CreateCustomerDto dto)
        {
            var customer = await _db.Customers.FindAsync(id);
            if (customer == null) return ApiResponse<CustomerDto>.Fail("Customer not found.");
            customer.Name = dto.Name; customer.Email = dto.Email; customer.Phone = dto.Phone;
            customer.Address = dto.Address; customer.GSTNumber = dto.GSTNumber;
            customer.ContactPerson = dto.ContactPerson; customer.CreditLimit = dto.CreditLimit;
            await _db.SaveChangesAsync();
            return ApiResponse<CustomerDto>.Ok(MapCustomer(customer));
        }

        public async Task<ApiResponse<bool>> DeleteCustomerAsync(int id)
        {
            var customer = await _db.Customers.FindAsync(id);
            if (customer == null) return ApiResponse<bool>.Fail("Customer not found.");
            customer.IsActive = false;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Customer deleted.");
        }

        // ── Quotation ─────────────────────────────────────────
        public async Task<ApiResponse<QuotationDto>> CreateQuotationAsync(CreateQuotationDto dto)
        {
            var quotationNumber = $"QT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var quotation = new Quotation
            {
                CompanyId = dto.CompanyId, CustomerId = dto.CustomerId,
                QuotationNumber = quotationNumber, QuotationDate = dto.QuotationDate,
                ValidUntil = dto.ValidUntil, Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                var lineTotal = item.Quantity * item.UnitPrice;
                var discount = lineTotal * (item.DiscountPercent / 100);
                var tax = (lineTotal - discount) * (item.TaxPercent / 100);
                quotation.Items.Add(new QuotationItem
                {
                    ProductId = item.ProductId, Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice, TaxPercent = item.TaxPercent,
                    DiscountPercent = item.DiscountPercent, TotalPrice = lineTotal - discount + tax
                });
                quotation.SubTotal += lineTotal;
                quotation.DiscountAmount += discount;
                quotation.TaxAmount += tax;
            }
            quotation.TotalAmount = quotation.SubTotal - quotation.DiscountAmount + quotation.TaxAmount;

            _db.Quotations.Add(quotation);
            await _db.SaveChangesAsync();
            return ApiResponse<QuotationDto>.Ok(await GetQuotationDtoAsync(quotation.Id), "Quotation created.");
        }

        public async Task<ApiResponse<PagedResult<QuotationDto>>> ListQuotationsAsync(int companyId, PaginationParams p)
        {
            var query = _db.Quotations.Include(q => q.Customer)
                .Where(q => q.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(q => q.QuotationNumber.Contains(p.Search) || q.Customer.Name.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(q => q.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(q => MapQuotation(q)).ToListAsync();

            return ApiResponse<PagedResult<QuotationDto>>.Ok(new PagedResult<QuotationDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<QuotationDto>> GetQuotationAsync(int id)
            => ApiResponse<QuotationDto>.Ok(await GetQuotationDtoAsync(id));

        public async Task<ApiResponse<bool>> UpdateQuotationStatusAsync(int id, string status)
        {
            var q = await _db.Quotations.FindAsync(id);
            if (q == null) return ApiResponse<bool>.Fail("Quotation not found.");
            q.Status = status;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        // ── Sales Invoice ─────────────────────────────────────
        public async Task<ApiResponse<SalesInvoiceDto>> CreateInvoiceAsync(CreateSalesInvoiceDto dto)
        {
            var invoiceNumber = string.IsNullOrEmpty(dto.InvoiceNumber)
                ? $"SI-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}"
                : dto.InvoiceNumber;

            var invoice = new SalesInvoice
            {
                CompanyId = dto.CompanyId, CustomerId = dto.CustomerId,
                QuotationId = dto.QuotationId, InvoiceNumber = invoiceNumber,
                InvoiceDate = dto.InvoiceDate, DueDate = dto.DueDate, Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                var lineTotal = item.Quantity * item.UnitPrice;
                var discount = lineTotal * (item.DiscountPercent / 100);
                var tax = (lineTotal - discount) * (item.TaxPercent / 100);
                invoice.Items.Add(new SalesInvoiceItem
                {
                    ProductId = item.ProductId, Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice, TaxPercent = item.TaxPercent,
                    DiscountPercent = item.DiscountPercent, TotalPrice = lineTotal - discount + tax
                });
                invoice.SubTotal += lineTotal;
                invoice.DiscountAmount += discount;
                invoice.TaxAmount += tax;

                // Reduce stock
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQty -= item.Quantity;
                    _db.StockTransactions.Add(new StockTransaction
                    {
                        ProductId = item.ProductId, Quantity = item.Quantity,
                        Type = "OUT", Remarks = $"Sales Invoice {invoiceNumber}"
                    });
                }
            }

            invoice.TotalAmount = invoice.SubTotal - invoice.DiscountAmount + invoice.TaxAmount;
            invoice.BalanceAmount = invoice.TotalAmount;

            if (dto.QuotationId.HasValue)
            {
                var q = await _db.Quotations.FindAsync(dto.QuotationId.Value);
                if (q != null) q.Status = "Converted";
            }

            _db.SalesInvoices.Add(invoice);
            await _db.SaveChangesAsync();
            return ApiResponse<SalesInvoiceDto>.Ok(await GetInvoiceDtoAsync(invoice.Id), "Sales invoice created.");
        }

        public async Task<ApiResponse<SalesInvoiceDto>> CreateFromQuotationAsync(int quotationId)
        {
            var q = await _db.Quotations.Include(q => q.Items).FirstOrDefaultAsync(q => q.Id == quotationId);
            if (q == null) return ApiResponse<SalesInvoiceDto>.Fail("Quotation not found.");

            var dto = new CreateSalesInvoiceDto
            {
                CompanyId = q.CompanyId, CustomerId = q.CustomerId, QuotationId = q.Id,
                InvoiceDate = DateTime.UtcNow, DueDate = DateTime.UtcNow.AddDays(30),
                Items = q.Items.Select(i => new InvoiceItemDto
                {
                    ProductId = i.ProductId, Quantity = i.Quantity, UnitPrice = i.UnitPrice,
                    TaxPercent = i.TaxPercent, DiscountPercent = i.DiscountPercent
                }).ToList()
            };
            return await CreateInvoiceAsync(dto);
        }

        public async Task<ApiResponse<PagedResult<SalesInvoiceDto>>> ListInvoicesAsync(int companyId, PaginationParams p)
        {
            var query = _db.SalesInvoices.Include(i => i.Customer)
                .Where(i => i.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(i => i.InvoiceNumber.Contains(p.Search) || i.Customer.Name.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(i => i.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(i => MapInvoice(i)).ToListAsync();

            return ApiResponse<PagedResult<SalesInvoiceDto>>.Ok(new PagedResult<SalesInvoiceDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<SalesInvoiceDto>> GetInvoiceAsync(int id)
            => ApiResponse<SalesInvoiceDto>.Ok(await GetInvoiceDtoAsync(id));

        public async Task<ApiResponse<bool>> CancelInvoiceAsync(int id)
        {
            var invoice = await _db.SalesInvoices.FindAsync(id);
            if (invoice == null) return ApiResponse<bool>.Fail("Invoice not found.");
            invoice.Status = "Cancelled";
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Invoice cancelled.");
        }

        // ── Sales Return ──────────────────────────────────────
        public async Task<ApiResponse<SalesReturnDto>> CreateReturnAsync(CreateSalesReturnDto dto)
        {
            var invoice = await _db.SalesInvoices.FindAsync(dto.SalesInvoiceId);
            if (invoice == null) return ApiResponse<SalesReturnDto>.Fail("Invoice not found.");

            var returnNumber = $"SR-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var ret = new SalesReturn
            {
                SalesInvoiceId = dto.SalesInvoiceId,
                ReturnNumber = returnNumber, Reason = dto.Reason
            };

            foreach (var item in dto.Items)
            {
                var total = item.Quantity * item.UnitPrice;
                ret.Items.Add(new SalesReturnItem
                {
                    ProductId = item.ProductId, Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice, TotalPrice = total
                });
                ret.ReturnAmount += total;
            }

            _db.SalesReturns.Add(ret);
            await _db.SaveChangesAsync();
            return ApiResponse<SalesReturnDto>.Ok(await GetReturnDtoAsync(ret.Id), "Sales return created.");
        }

        public async Task<ApiResponse<List<SalesReturnDto>>> ListReturnsAsync(int companyId)
        {
            var returns = await _db.SalesReturns
                .Include(r => r.SalesInvoice).Include(r => r.Items).ThenInclude(i => i.Product)
                .Where(r => r.SalesInvoice.CompanyId == companyId)
                .OrderByDescending(r => r.CreatedAt).ToListAsync();
            return ApiResponse<List<SalesReturnDto>>.Ok(returns.Select(r => MapReturn(r)).ToList());
        }

        public async Task<ApiResponse<bool>> ApproveReturnAsync(int id, string status)
        {
            var ret = await _db.SalesReturns.Include(r => r.Items).FirstOrDefaultAsync(r => r.Id == id);
            if (ret == null) return ApiResponse<bool>.Fail("Return not found.");
            ret.Status = status;

            if (status == "Approved")
            {
                foreach (var item in ret.Items)
                {
                    var product = await _db.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.StockQty += item.Quantity;
                        _db.StockTransactions.Add(new StockTransaction
                        {
                            ProductId = item.ProductId, Quantity = item.Quantity,
                            Type = "IN", Remarks = $"Sales Return {ret.ReturnNumber}"
                        });
                    }
                }
            }

            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"Return {status}.");
        }

        // ── Customer Payment ──────────────────────────────────
        public async Task<ApiResponse<CustomerPaymentDto>> CreatePaymentAsync(CreateCustomerPaymentDto dto)
        {
            var invoice = await _db.SalesInvoices.FindAsync(dto.SalesInvoiceId);
            if (invoice == null) return ApiResponse<CustomerPaymentDto>.Fail("Invoice not found.");
            if (dto.Amount > invoice.BalanceAmount)
                return ApiResponse<CustomerPaymentDto>.Fail("Payment exceeds balance amount.");

            var payment = new CustomerPayment
            {
                CustomerId = dto.CustomerId, SalesInvoiceId = dto.SalesInvoiceId,
                Amount = dto.Amount, PaymentMode = dto.PaymentMode,
                ReferenceNumber = dto.ReferenceNumber, PaymentDate = dto.PaymentDate, Notes = dto.Notes
            };
            _db.CustomerPayments.Add(payment);

            invoice.PaidAmount += dto.Amount;
            invoice.BalanceAmount -= dto.Amount;
            invoice.Status = invoice.BalanceAmount <= 0 ? "Paid" : "Partial";

            await _db.SaveChangesAsync();
            var customer = await _db.Customers.FindAsync(dto.CustomerId);
            return ApiResponse<CustomerPaymentDto>.Ok(new CustomerPaymentDto
            {
                Id = payment.Id, CustomerId = payment.CustomerId, CustomerName = customer?.Name ?? "",
                SalesInvoiceId = payment.SalesInvoiceId, InvoiceNumber = invoice.InvoiceNumber,
                Amount = payment.Amount, PaymentMode = payment.PaymentMode,
                ReferenceNumber = payment.ReferenceNumber, PaymentDate = payment.PaymentDate, Notes = payment.Notes
            }, "Payment recorded.");
        }

        public async Task<ApiResponse<List<CustomerPaymentDto>>> ListPaymentsAsync(int companyId)
        {
            var payments = await _db.CustomerPayments
                .Include(p => p.Customer).Include(p => p.SalesInvoice)
                .Where(p => p.SalesInvoice.CompanyId == companyId)
                .OrderByDescending(p => p.CreatedAt).ToListAsync();

            return ApiResponse<List<CustomerPaymentDto>>.Ok(payments.Select(p => new CustomerPaymentDto
            {
                Id = p.Id, CustomerId = p.CustomerId, CustomerName = p.Customer?.Name ?? "",
                SalesInvoiceId = p.SalesInvoiceId, InvoiceNumber = p.SalesInvoice?.InvoiceNumber ?? "",
                Amount = p.Amount, PaymentMode = p.PaymentMode,
                ReferenceNumber = p.ReferenceNumber, PaymentDate = p.PaymentDate, Notes = p.Notes
            }).ToList());
        }

        // ── Credit / Debit Notes ──────────────────────────────
        public async Task<ApiResponse<CustomerNoteDto>> CreateCreditNoteAsync(CreateCustomerNoteDto dto)
        {
            var note = new CustomerCreditNote
            {
                CustomerId = dto.CustomerId, SalesInvoiceId = dto.SalesInvoiceId,
                NoteNumber = $"CCN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                Amount = dto.Amount, Reason = dto.Reason
            };
            _db.CustomerCreditNotes.Add(note);
            await _db.SaveChangesAsync();
            var customer = await _db.Customers.FindAsync(dto.CustomerId);
            return ApiResponse<CustomerNoteDto>.Ok(MapNote(note, customer?.Name ?? ""), "Credit note created.");
        }

        public async Task<ApiResponse<CustomerNoteDto>> CreateDebitNoteAsync(CreateCustomerNoteDto dto)
        {
            var note = new CustomerDebitNote
            {
                CustomerId = dto.CustomerId, SalesInvoiceId = dto.SalesInvoiceId,
                NoteNumber = $"CDN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                Amount = dto.Amount, Reason = dto.Reason
            };
            _db.CustomerDebitNotes.Add(note);
            await _db.SaveChangesAsync();
            var customer = await _db.Customers.FindAsync(dto.CustomerId);
            return ApiResponse<CustomerNoteDto>.Ok(new CustomerNoteDto
            {
                Id = note.Id, CustomerId = note.CustomerId, CustomerName = customer?.Name ?? "",
                SalesInvoiceId = note.SalesInvoiceId, NoteNumber = note.NoteNumber,
                NoteDate = note.NoteDate, Amount = note.Amount, Reason = note.Reason, Status = note.Status
            }, "Debit note created.");
        }

        public async Task<ApiResponse<List<CustomerNoteDto>>> ListCreditNotesAsync(int companyId)
        {
            var notes = await _db.CustomerCreditNotes.Include(n => n.Customer)
                .Where(n => n.Customer.CompanyId == companyId)
                .OrderByDescending(n => n.CreatedAt).ToListAsync();
            return ApiResponse<List<CustomerNoteDto>>.Ok(notes.Select(n => MapNote(n, n.Customer?.Name ?? "")).ToList());
        }

        public async Task<ApiResponse<List<CustomerNoteDto>>> ListDebitNotesAsync(int companyId)
        {
            var notes = await _db.CustomerDebitNotes.Include(n => n.Customer)
                .Where(n => n.Customer.CompanyId == companyId)
                .OrderByDescending(n => n.CreatedAt).ToListAsync();
            return ApiResponse<List<CustomerNoteDto>>.Ok(notes.Select(n => new CustomerNoteDto
            {
                Id = n.Id, CustomerId = n.CustomerId, CustomerName = n.Customer?.Name ?? "",
                SalesInvoiceId = n.SalesInvoiceId, NoteNumber = n.NoteNumber,
                NoteDate = n.NoteDate, Amount = n.Amount, Reason = n.Reason, Status = n.Status
            }).ToList());
        }

        // ── Helpers ───────────────────────────────────────────
        private async Task<QuotationDto> GetQuotationDtoAsync(int id)
        {
            var q = await _db.Quotations.Include(q => q.Customer).Include(q => q.Items).ThenInclude(i => i.Product)
                .FirstAsync(q => q.Id == id);
            return MapQuotation(q);
        }

        private async Task<SalesInvoiceDto> GetInvoiceDtoAsync(int id)
        {
            var inv = await _db.SalesInvoices.Include(i => i.Customer).Include(i => i.Items).ThenInclude(i => i.Product)
                .FirstAsync(i => i.Id == id);
            return MapInvoice(inv);
        }

        private async Task<SalesReturnDto> GetReturnDtoAsync(int id)
        {
            var ret = await _db.SalesReturns.Include(r => r.SalesInvoice).Include(r => r.Items).ThenInclude(i => i.Product)
                .FirstAsync(r => r.Id == id);
            return MapReturn(ret);
        }

        private static CustomerDto MapCustomer(Customer c) => new()
        {
            Id = c.Id, CompanyId = c.CompanyId, Name = c.Name, Email = c.Email,
            Phone = c.Phone, Address = c.Address, GSTNumber = c.GSTNumber,
            ContactPerson = c.ContactPerson, CreditLimit = c.CreditLimit,
            IsActive = c.IsActive, CreatedAt = c.CreatedAt
        };

        private static QuotationDto MapQuotation(Quotation q) => new()
        {
            Id = q.Id, CompanyId = q.CompanyId, CustomerId = q.CustomerId,
            CustomerName = q.Customer?.Name ?? "", QuotationNumber = q.QuotationNumber,
            QuotationDate = q.QuotationDate, ValidUntil = q.ValidUntil,
            SubTotal = q.SubTotal, TaxAmount = q.TaxAmount, DiscountAmount = q.DiscountAmount,
            TotalAmount = q.TotalAmount, Status = q.Status, Notes = q.Notes, CreatedAt = q.CreatedAt,
            Items = q.Items.Select(i => new QuotationItemDto
            {
                Id = i.Id, ProductId = i.ProductId, ProductName = i.Product?.Name ?? "",
                Quantity = i.Quantity, UnitPrice = i.UnitPrice, TaxPercent = i.TaxPercent,
                DiscountPercent = i.DiscountPercent, TotalPrice = i.TotalPrice
            }).ToList()
        };

        private static SalesInvoiceDto MapInvoice(SalesInvoice i) => new()
        {
            Id = i.Id, CompanyId = i.CompanyId, CustomerId = i.CustomerId,
            CustomerName = i.Customer?.Name ?? "", QuotationId = i.QuotationId,
            InvoiceNumber = i.InvoiceNumber, InvoiceDate = i.InvoiceDate, DueDate = i.DueDate,
            SubTotal = i.SubTotal, TaxAmount = i.TaxAmount, DiscountAmount = i.DiscountAmount,
            TotalAmount = i.TotalAmount, PaidAmount = i.PaidAmount, BalanceAmount = i.BalanceAmount,
            Status = i.Status, Notes = i.Notes, CreatedAt = i.CreatedAt,
            Items = i.Items.Select(it => new SalesInvoiceItemDto
            {
                Id = it.Id, ProductId = it.ProductId, ProductName = it.Product?.Name ?? "",
                Quantity = it.Quantity, UnitPrice = it.UnitPrice, TaxPercent = it.TaxPercent,
                DiscountPercent = it.DiscountPercent, TotalPrice = it.TotalPrice
            }).ToList()
        };

        private static SalesReturnDto MapReturn(SalesReturn r) => new()
        {
            Id = r.Id, SalesInvoiceId = r.SalesInvoiceId,
            InvoiceNumber = r.SalesInvoice?.InvoiceNumber ?? "",
            ReturnNumber = r.ReturnNumber, ReturnDate = r.ReturnDate,
            ReturnAmount = r.ReturnAmount, Reason = r.Reason, Status = r.Status,
            Items = r.Items.Select(i => new ReturnItemResultDto
            {
                ProductId = i.ProductId, ProductName = i.Product?.Name ?? "",
                Quantity = i.Quantity, UnitPrice = i.UnitPrice, TotalPrice = i.TotalPrice
            }).ToList()
        };

        private static CustomerNoteDto MapNote(CustomerCreditNote n, string customerName) => new()
        {
            Id = n.Id, CustomerId = n.CustomerId, CustomerName = customerName,
            SalesInvoiceId = n.SalesInvoiceId, NoteNumber = n.NoteNumber,
            NoteDate = n.NoteDate, Amount = n.Amount, Reason = n.Reason, Status = n.Status
        };
    }
}
