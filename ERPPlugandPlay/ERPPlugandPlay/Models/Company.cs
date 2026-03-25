namespace ERPPlugandPlay.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CompanyType { get; set; } = "private_limited";
        public string Industry { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        // Address (flattened)
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;

        public string? GSTNumber { get; set; }
        public string? TaxNumber { get; set; }
        public string Status { get; set; } = "active"; // active / inactive
        public string? Logo { get; set; } // base64 or URL

        // Admin user details (stored for reference)
        public string AdminName { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string AdminPhone { get; set; } = string.Empty;
        public string? AdminPassword { get; set; } // plain password for admin visibility

        // Trial period tracking
        public DateTime? TrialStartDate { get; set; }
        public DateTime? TrialEndDate { get; set; }
        public bool IsTrialActive { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Department> Departments { get; set; } = new List<Department>();
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public ICollection<CompanySubscription> Subscriptions { get; set; } = new List<CompanySubscription>();
        public ICollection<CompanyModule> Modules { get; set; } = new List<CompanyModule>();
    }
}
