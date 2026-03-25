using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateBillingInvoiceDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(30);
        public string? Notes { get; set; }
        [Required] public List<BillingItemDto> Items { get; set; } = new();
    }

    public class BillingItemDto
    {
        [Required] public string Description { get; set; } = string.Empty;
        [Required] public decimal Quantity { get; set; }
        [Required] public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
    }

    public class BillingInvoiceDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<BillingItemResultDto> Items { get; set; } = new();
    }

    public class BillingItemResultDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CreateReminderDto
    {
        [Required] public int BillingInvoiceId { get; set; }
        [Required] public DateTime ReminderDate { get; set; }
        public string Channel { get; set; } = "Email";
    }

    public class ReminderDto
    {
        public int Id { get; set; }
        public int BillingInvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public DateTime ReminderDate { get; set; }
        public string Channel { get; set; } = string.Empty;
        public bool IsSent { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
