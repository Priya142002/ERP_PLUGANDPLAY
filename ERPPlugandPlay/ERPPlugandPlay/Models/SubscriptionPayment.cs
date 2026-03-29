namespace ERPPlugandPlay.Models
{
    /// <summary>
    /// Records each payment made by a company for their subscription.
    /// One row per billing cycle payment.
    /// </summary>
    public class SubscriptionPayment
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public int? CompanySubscriptionId { get; set; }
        public CompanySubscription? CompanySubscription { get; set; }

        public string InvoiceNumber { get; set; } = string.Empty; // e.g. SINV-2025-001
        public string PlanName { get; set; } = string.Empty;
        public string PlanType { get; set; } = "Monthly"; // Monthly | Yearly | Quarterly
        public decimal Amount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }

        public DateTime BillingPeriodStart { get; set; }
        public DateTime BillingPeriodEnd { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public string Status { get; set; } = "Pending"; // Pending | Paid | Overdue | Waived
        public string PaymentMode { get; set; } = string.Empty; // Cash | Bank Transfer | UPI | Card
        public string? TransactionRef { get; set; }
        public string? Notes { get; set; }

        public bool ReminderSent { get; set; } = false;
        public DateTime? ReminderSentAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
    }
}
