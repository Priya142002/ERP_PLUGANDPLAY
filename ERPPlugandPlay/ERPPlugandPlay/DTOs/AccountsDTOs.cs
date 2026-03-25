using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    // ── Chart of Accounts ─────────────────────────────────────
    public class CreateAccountDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string AccountCode { get; set; } = string.Empty;
        [Required] public string AccountName { get; set; } = string.Empty;
        [Required] public string AccountType { get; set; } = string.Empty; // Asset, Liability, Equity, Income, Expense
        public string? ParentAccountCode { get; set; }
        public decimal OpeningBalance { get; set; }
    }

    public class AccountDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public string? ParentAccountCode { get; set; }
        public decimal OpeningBalance { get; set; }
        public bool IsActive { get; set; }
    }

    // ── Journal Voucher ───────────────────────────────────────
    public class CreateJournalVoucherDto
    {
        [Required] public int CompanyId { get; set; }
        public DateTime VoucherDate { get; set; } = DateTime.UtcNow;
        [Required] public string Description { get; set; } = string.Empty;
        [Required] public List<JournalEntryDto> Entries { get; set; } = new();
    }

    public class JournalEntryDto
    {
        [Required] public int AccountId { get; set; }
        [Required] public string Type { get; set; } = string.Empty; // Debit, Credit
        [Required] public decimal Amount { get; set; }
        public string? Narration { get; set; }
    }

    public class JournalVoucherDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<JournalEntryResultDto> Entries { get; set; } = new();
    }

    public class JournalEntryResultDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountCode { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? Narration { get; set; }
    }

    // ── Payment Voucher ───────────────────────────────────────
    public class CreatePaymentVoucherDto
    {
        [Required] public int CompanyId { get; set; }
        public DateTime VoucherDate { get; set; } = DateTime.UtcNow;
        [Required] public string PayTo { get; set; } = string.Empty;
        [Required] public int AccountId { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        [Required] public string Description { get; set; } = string.Empty;
    }

    public class PaymentVoucherDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public string PayTo { get; set; } = string.Empty;
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // ── Receipt Voucher ───────────────────────────────────────
    public class CreateReceiptVoucherDto
    {
        [Required] public int CompanyId { get; set; }
        public DateTime VoucherDate { get; set; } = DateTime.UtcNow;
        [Required] public string ReceivedFrom { get; set; } = string.Empty;
        [Required] public int AccountId { get; set; }
        [Required] public decimal Amount { get; set; }
        [Required] public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        [Required] public string Description { get; set; } = string.Empty;
    }

    public class ReceiptVoucherDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public string ReceivedFrom { get; set; } = string.Empty;
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string? ReferenceNumber { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
