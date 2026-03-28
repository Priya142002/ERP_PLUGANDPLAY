namespace ERPPlugandPlay.Models
{
    public class JournalVoucher
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int FinancialYearId { get; set; }
        public FinancialYear FinancialYear { get; set; } = null!;
        public int? BranchId { get; set; }
        public Branch? Branch { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public string VoucherType { get; set; } = "Journal"; // Journal, Payment, Receipt, Contra, Sales, Purchase
        public DateTime VoucherDate { get; set; }
        public string? ReferenceNumber { get; set; } // External reference (Invoice #, PO #, etc.)
        public string? ReferenceType { get; set; } // SalesInvoice, PurchaseInvoice, Payment, etc.
        public int? ReferenceId { get; set; } // FK to source document
        public string Description { get; set; } = string.Empty;
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, Posted, Cancelled
        public DateTime? PostedAt { get; set; }
        public int? PostedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CancelledAt { get; set; }
        public int? CancelledBy { get; set; }
        public string? CancellationReason { get; set; }
        
        public ICollection<JournalVoucherEntry> Entries { get; set; } = new List<JournalVoucherEntry>();
    }
}
