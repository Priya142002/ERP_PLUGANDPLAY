using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    // ── Vendor ───────────────────────────────────────────────
    public class CreateVendorDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [EmailAddress] public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
    }

    public class VendorDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ── Purchase Invoice ──────────────────────────────────────
    public class CreatePurchaseInvoiceDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int VendorId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public string? Notes { get; set; }
        [Required] public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class InvoiceItemDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int Quantity { get; set; }
        [Required] public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
    }

    public class PurchaseInvoiceDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
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
        public List<PurchaseInvoiceItemDto> Items { get; set; } = new();
    }

    public class PurchaseInvoiceItemDto
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

    // ── Purchase Return ───────────────────────────────────────
    public class CreatePurchaseReturnDto
    {
        [Required] public int PurchaseInvoiceId { get; set; }
        public string Reason { get; set; } = string.Empty;
        [Required] public List<ReturnItemDto> Items { get; set; } = new();
    }

    public class ReturnItemDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int Quantity { get; set; }
        [Required] public decimal UnitPrice { get; set; }
    }

    public class PurchaseReturnDto
    {
        public int Id { get; set; }
        public int PurchaseInvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string ReturnNumber { get; set; } = string.Empty;
        public DateTime ReturnDate { get; set; }
        public decimal ReturnAmount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<ReturnItemResultDto> Items { get; set; } = new();
    }

    public class ReturnItemResultDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    // ── Vendor Payment ────────────────────────────────────────
    public class CreateVendorPaymentDto
    {
        [Required] public int VendorId { get; set; }
        [Required] public int PurchaseInvoiceId { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
    }

    public class VendorPaymentDto
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public int PurchaseInvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? Notes { get; set; }
    }

    // ── Credit / Debit Notes ──────────────────────────────────
    public class CreateNoteDto
    {
        [Required] public int VendorId { get; set; }
        public int? PurchaseInvoiceId { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string Reason { get; set; } = string.Empty;
    }

    public class NoteDto
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public int? PurchaseInvoiceId { get; set; }
        public string NoteNumber { get; set; } = string.Empty;
        public DateTime NoteDate { get; set; }
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
