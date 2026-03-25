using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    // ── Customer ─────────────────────────────────────────────
    public class CreateCustomerDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [EmailAddress] public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public decimal CreditLimit { get; set; }
    }

    public class CustomerDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public decimal CreditLimit { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ── Quotation ─────────────────────────────────────────────
    public class CreateQuotationDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int CustomerId { get; set; }
        public DateTime QuotationDate { get; set; } = DateTime.UtcNow;
        public DateTime ValidUntil { get; set; }
        public string? Notes { get; set; }
        [Required] public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class QuotationDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string QuotationNumber { get; set; } = string.Empty;
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<QuotationItemDto> Items { get; set; } = new();
    }

    public class QuotationItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }

    // ── Sales Invoice ─────────────────────────────────────────
    public class CreateSalesInvoiceDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int CustomerId { get; set; }
        public int? QuotationId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public string? Notes { get; set; }
        [Required] public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class SalesInvoiceDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int? QuotationId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SalesInvoiceItemDto> Items { get; set; } = new();
    }

    public class SalesInvoiceItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }

    // ── Sales Return ──────────────────────────────────────────
    public class CreateSalesReturnDto
    {
        [Required] public int SalesInvoiceId { get; set; }
        public string Reason { get; set; } = string.Empty;
        [Required] public List<ReturnItemDto> Items { get; set; } = new();
    }

    public class SalesReturnDto
    {
        public int Id { get; set; }
        public int SalesInvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string ReturnNumber { get; set; } = string.Empty;
        public DateTime ReturnDate { get; set; }
        public decimal ReturnAmount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<ReturnItemResultDto> Items { get; set; } = new();
    }

    // ── Customer Payment ──────────────────────────────────────
    public class CreateCustomerPaymentDto
    {
        [Required] public int CustomerId { get; set; }
        [Required] public int SalesInvoiceId { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
    }

    public class CustomerPaymentDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int SalesInvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? Notes { get; set; }
    }

    // ── Customer Credit / Debit Notes ─────────────────────────
    public class CreateCustomerNoteDto
    {
        [Required] public int CustomerId { get; set; }
        public int? SalesInvoiceId { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string Reason { get; set; } = string.Empty;
    }

    public class CustomerNoteDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int? SalesInvoiceId { get; set; }
        public string NoteNumber { get; set; } = string.Empty;
        public DateTime NoteDate { get; set; }
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
