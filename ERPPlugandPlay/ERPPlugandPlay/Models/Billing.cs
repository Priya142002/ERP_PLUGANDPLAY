namespace ERPPlugandPlay.Models
{
    public class BillingInvoice
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string InvoiceNumber { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string Status { get; set; } = "Draft"; // Draft | Sent | Paid | Overdue | Cancelled
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<BillingInvoiceItem> Items { get; set; } = new List<BillingInvoiceItem>();
        public ICollection<PaymentReminder> Reminders { get; set; } = new List<PaymentReminder>();
    }

    public class BillingInvoiceItem
    {
        public int Id { get; set; }
        public int BillingInvoiceId { get; set; }
        public BillingInvoice BillingInvoice { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class PaymentReminder
    {
        public int Id { get; set; }
        public int BillingInvoiceId { get; set; }
        public BillingInvoice BillingInvoice { get; set; } = null!;
        public DateTime ReminderDate { get; set; }
        public string Channel { get; set; } = "Email"; // Email | SMS
        public bool IsSent { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
