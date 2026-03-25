using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    // ── Company ──────────────────────────────────────────────
    public class CreateCompanyFullDto
    {
        public string Code { get; set; } = string.Empty;
        [Required] public string Name { get; set; } = string.Empty;
        public string CompanyType { get; set; } = "private_limited";
        [Required] public string Industry { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required] public string Phone { get; set; } = string.Empty;

        // Address
        [Required] public string Street { get; set; } = string.Empty;
        [Required] public string City { get; set; } = string.Empty;
        [Required] public string State { get; set; } = string.Empty;
        [Required] public string Country { get; set; } = string.Empty;
        [Required] public string PostalCode { get; set; } = string.Empty;

        public string? GSTNumber { get; set; }
        public string? TaxNumber { get; set; }
        public string Status { get; set; } = "active";
        public string? Logo { get; set; }

        // Admin user
        [Required] public string AdminName { get; set; } = string.Empty;
        [Required, EmailAddress] public string AdminEmail { get; set; } = string.Empty;
        [Required] public string AdminPhone { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = "Admin@123";

        // Trial modules
        public List<string> AllowedModules { get; set; } = new() { "inventory", "sales", "purchase", "accounts" };
    }

    public class UpdateCompanyFullDto : CreateCompanyFullDto
    {
        public int Id { get; set; }
    }

    public class CompanyFullDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CompanyType { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public AddressDto Address { get; set; } = new();
        public string? GSTNumber { get; set; }
        public string? TaxNumber { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Logo { get; set; }
        public string AdminName { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string AdminPhone { get; set; } = string.Empty;
        public List<string> AllowedModules { get; set; } = new();
        public string? ActivePlan { get; set; }
        public string? SubscriptionStatus { get; set; }
        public int UsedSeats { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AddressDto
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
    }

    // ── Subscription Plans ────────────────────────────────────
    public class CreatePlanDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public string PlanType { get; set; } = "Monthly";
        public int MaxSeats { get; set; }
        public int MaxModules { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class PlanDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public string PlanType { get; set; } = "Monthly";
        public int MaxSeats { get; set; }
        public int MaxModules { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    // ── Company Subscription ──────────────────────────────────
    public class AssignSubscriptionDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int PlanId { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsProrated { get; set; } = false;
    }

    public class ChangePlanDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public int NewPlanId { get; set; }
        public bool IsProrated { get; set; } = false;
    }

    public class SuspendSubscriptionDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Status { get; set; } = string.Empty; // Active, Suspended, Expired
    }

    public class CompanySubscriptionDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public int PlanId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public string PlanType { get; set; } = "Monthly";
        public string Status { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime NextBillingDate { get; set; }
        public int UsedSeats { get; set; }
        public int MaxSeats { get; set; }
    }

    // ── Module Access ─────────────────────────────────────────
    public class SetCompanyModulesDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public List<string> ModuleIds { get; set; } = new();
        public bool IsTrialAccess { get; set; } = false;
    }

    public class ToggleModuleDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string ModuleId { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
    }

    public class SetTrialModulesDto
    {
        [Required] public List<string> ModuleIds { get; set; } = new();
    }

    public class CompanyModuleDto
    {
        public string ModuleId { get; set; } = string.Empty;
        public string ModuleName { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public bool IsTrialAccess { get; set; }
    }

    public class CreateGlobalModuleDto
    {
        [Required] public string ModuleId { get; set; } = string.Empty;
        [Required] public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "Custom";
        public string? Icon { get; set; }
    }

    // ── Analytics ─────────────────────────────────────────────
    public class PlatformAnalyticsDto
    {
        public int TotalCompanies { get; set; }
        public int ActiveCompanies { get; set; }
        public int TotalUsers { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int TrialCompanies { get; set; }
        public int SuspendedCompanies { get; set; }
        public List<PlanDistributionDto> PlanDistribution { get; set; } = new();
        public List<MonthlyGrowthDto> MonthlyGrowth { get; set; } = new();
        public List<RecentActivityDto> RecentActivity { get; set; } = new();
    }

    public class PlanDistributionDto
    {
        public string PlanName { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Revenue { get; set; }
    }

    public class MonthlyGrowthDto
    {
        public string Month { get; set; } = string.Empty;
        public int Companies { get; set; }
        public int Users { get; set; }
    }

    public class RecentActivityDto
    {
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // ── Audit Logs ────────────────────────────────────────────
    public class AuditLogDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? IPAddress { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ── System settings ───────────────────────────────────────
    public class SystemHealthDto
    {
        public string Database { get; set; } = string.Empty;
        public string DatabaseUptime { get; set; } = string.Empty;
        public string ApiServer { get; set; } = string.Empty;
        public string ApiUptime { get; set; } = string.Empty;
        public string StorageUsage { get; set; } = string.Empty;
        public string CpuUsage { get; set; } = string.Empty;
        public string MemoryUsage { get; set; } = string.Empty;
        public DateTime LastBackupAt { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Environment { get; set; } = string.Empty;
    }
    // ── User Management ────────────────────────────────────────
    public class UserManagementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // Company info
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? Industry { get; set; }

        // Trial info
        public bool IsTrialActive { get; set; }
        public DateTime? TrialStartDate { get; set; }
        public DateTime? TrialEndDate { get; set; }
        public int DaysRemaining { get; set; }

        // Subscription
        public bool HasActiveSubscription { get; set; }
        public string? PlanName { get; set; }

        // Modules
        public List<UserModuleDto> Modules { get; set; } = new();
    }

    public class UserModuleDto
    {
        public string ModuleId { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public bool IsTrialAccess { get; set; }
    }
}
