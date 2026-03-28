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
        [Required] public string AccountGroup { get; set; } = string.Empty;
        public string? ParentAccountCode { get; set; }
        public bool IsGroup { get; set; } = false;
        public int Level { get; set; } = 1;
        public decimal OpeningBalance { get; set; }
        public string OpeningBalanceType { get; set; } = "Debit";
        public string Currency { get; set; } = "INR";
        public string? TaxType { get; set; }
        public bool IsBankAccount { get; set; } = false;
        public bool IsSystemAccount { get; set; } = false;
    }

    public class UpdateAccountDto
    {
        [Required] public string AccountName { get; set; } = string.Empty;
        [Required] public string AccountGroup { get; set; } = string.Empty;
        public string? ParentAccountCode { get; set; }
        public bool IsGroup { get; set; } = false;
        public decimal OpeningBalance { get; set; }
        public string OpeningBalanceType { get; set; } = "Debit";
        public string? TaxType { get; set; }
        public bool IsBankAccount { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }

    public class AccountDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public string AccountGroup { get; set; } = string.Empty;
        public string? ParentAccountCode { get; set; }
        public bool IsGroup { get; set; }
        public int Level { get; set; }
        public decimal OpeningBalance { get; set; }
        public string OpeningBalanceType { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public string? TaxType { get; set; }
        public bool IsBankAccount { get; set; }
        public bool IsSystemAccount { get; set; }
        public bool IsActive { get; set; }
        public decimal CurrentBalance { get; set; }
    }

    // ── Journal Voucher ───────────────────────────────────────
    public class CreateJournalVoucherDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int FinancialYearId { get; set; }
        public int? BranchId { get; set; }
        public string VoucherType { get; set; } = "Journal";
        public DateTime VoucherDate { get; set; } = DateTime.UtcNow;
        public string? ReferenceNumber { get; set; }
        public string? ReferenceType { get; set; }
        public int? ReferenceId { get; set; }
        [Required] public string Description { get; set; } = string.Empty;
        [Required] public List<JournalEntryDto> Entries { get; set; } = new();
    }

    public class UpdateJournalVoucherDto
    {
        public DateTime VoucherDate { get; set; }
        public string? ReferenceNumber { get; set; }
        [Required] public string Description { get; set; } = string.Empty;
        [Required] public List<JournalEntryDto> Entries { get; set; } = new();
    }

    public class JournalEntryDto
    {
        [Required] public int AccountId { get; set; }
        [Required] public string Type { get; set; } = string.Empty; // Debit, Credit
        [Required] public decimal Amount { get; set; }
        public string? Narration { get; set; }
        public int? CostCenterId { get; set; }
        public int? ProjectId { get; set; }
    }

    public class JournalVoucherDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int FinancialYearId { get; set; }
        public string FinancialYearName { get; set; } = string.Empty;
        public int? BranchId { get; set; }
        public string? BranchName { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public string VoucherType { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? ReferenceType { get; set; }
        public int? ReferenceId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? PostedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<JournalEntryResultDto> Entries { get; set; } = new();
    }

    public class JournalEntryResultDto
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountCode { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? Narration { get; set; }
        public int? CostCenterId { get; set; }
        public string? CostCenterName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
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

    // ── Financial Year ────────────────────────────────────────
    public class CreateFinancialYearDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string YearName { get; set; } = string.Empty;
        [Required] public DateTime StartDate { get; set; }
        [Required] public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class FinancialYearDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string YearName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsClosed { get; set; }
        public DateTime? ClosedAt { get; set; }
    }

    // ── Bank Account ──────────────────────────────────────────
    public class CreateBankAccountDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int AccountId { get; set; }
        [Required] public string BankName { get; set; } = string.Empty;
        [Required] public string BranchName { get; set; } = string.Empty;
        [Required] public string AccountNumber { get; set; } = string.Empty;
        public string? IFSCCode { get; set; }
        public string? SwiftCode { get; set; }
        public string AccountType { get; set; } = "Current";
        public decimal OpeningBalance { get; set; }
    }

    public class BankAccountDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BranchName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string? IFSCCode { get; set; }
        public string? SwiftCode { get; set; }
        public string AccountType { get; set; } = string.Empty;
        public decimal OpeningBalance { get; set; }
        public decimal CurrentBalance { get; set; }
        public bool IsActive { get; set; }
    }

    // ── Payment Mode ──────────────────────────────────────────
    public class CreatePaymentModeDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string ModeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? DefaultAccountId { get; set; }
    }

    public class PaymentModeDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string ModeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? DefaultAccountId { get; set; }
        public string? DefaultAccountName { get; set; }
        public bool IsActive { get; set; }
    }

    // ── Cost Center ───────────────────────────────────────────
    public class CreateCostCenterDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string CostCenterCode { get; set; } = string.Empty;
        [Required] public string CostCenterName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CostCenterDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CostCenterCode { get; set; } = string.Empty;
        public string CostCenterName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    // ── Account Ledger ────────────────────────────────────────
    public class AccountLedgerDto
    {
        public int AccountId { get; set; }
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal OpeningBalance { get; set; }
        public string OpeningBalanceType { get; set; } = string.Empty;
        public List<LedgerEntryDto> Entries { get; set; } = new();
        public decimal ClosingBalance { get; set; }
        public string ClosingBalanceType { get; set; } = string.Empty;
    }

    public class LedgerEntryDto
    {
        public DateTime Date { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public string VoucherType { get; set; } = string.Empty;
        public string Narration { get; set; } = string.Empty;
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public decimal Balance { get; set; }
    }

    // ── Trial Balance ─────────────────────────────────────────
    public class TrialBalanceDto
    {
        public DateTime AsOnDate { get; set; }
        public List<TrialBalanceItemDto> Items { get; set; } = new();
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
    }

    public class TrialBalanceItemDto
    {
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }

    // ── Opening Balance ───────────────────────────────────────
    public class CreateOpeningBalanceDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int FinancialYearId { get; set; }
        [Required] public int AccountId { get; set; }
        [Required] public decimal OpeningBalance { get; set; }
        [Required] public string BalanceType { get; set; } = "Debit";
    }

    public class OpeningBalanceDto
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string AccountCode { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal OpeningBalance { get; set; }
        public string BalanceType { get; set; } = string.Empty;
    }
