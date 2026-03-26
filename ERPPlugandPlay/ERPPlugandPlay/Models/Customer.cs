using System;
using System.Collections.Generic;

namespace ERPPlugandPlay.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? GSTNumber { get; set; }
        public string? ContactPerson { get; set; }
        public decimal CreditLimit { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Extended fields for richer UI
        public string? CustomerCode { get; set; }
        public string? CustomerType { get; set; }
        public string? Country { get; set; }
        public string? CreditTerms { get; set; }
        public string? Currency { get; set; }
        public string? PriceList { get; set; }
        public string? Website { get; set; }

        public ICollection<Quotation> Quotations { get; set; } = new List<Quotation>();
        public ICollection<SalesInvoice> SalesInvoices { get; set; } = new List<SalesInvoice>();
        public ICollection<CustomerPayment> Payments { get; set; } = new List<CustomerPayment>();
    }
}
