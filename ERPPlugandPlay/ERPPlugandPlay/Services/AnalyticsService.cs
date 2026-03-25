using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IAnalyticsService
    {
        Task<ApiResponse<PlatformAnalyticsDto>> GetPlatformAnalyticsAsync();
        Task<ApiResponse<PlatformAnalyticsDto>> GetCompanyAnalyticsAsync(int companyId);
        Task<ApiResponse<PagedResult<AuditLogDto>>> GetAuditLogsAsync(PaginationParams p);
    }

    public class AnalyticsService : IAnalyticsService
    {
        private readonly ERPDbContext _db;
        public AnalyticsService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<PlatformAnalyticsDto>> GetCompanyAnalyticsAsync(int companyId)
        {
            var company = await _db.Companies.FindAsync(companyId);
            if (company == null) return ApiResponse<PlatformAnalyticsDto>.Fail("Company not found.");

            var domain = company.Email.Contains('@') ? company.Email.Split('@')[1] : null;
            var totalUsers = domain != null 
                ? await _db.Users.CountAsync(u => u.IsActive && u.Email.Contains(domain)) 
                : 0;
            var subscription = await _db.CompanySubscriptions
                .Include(s => s.Plan)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync(s => s.CompanyId == companyId && s.Status == "Active");

            var monthlyRevenue = subscription?.Plan?.MonthlyPrice ?? 0;

            // Mock growth for the specific company
            var monthlyGrowth = new List<MonthlyGrowthDto>();
            for (int i = 5; i >= 0; i--)
            {
                var date = DateTime.UtcNow.AddMonths(-i);
                monthlyGrowth.Add(new MonthlyGrowthDto
                {
                    Month = date.ToString("MMM"),
                    Companies = 1,
                    Users = totalUsers > 0 ? (totalUsers * (10 - i) / 10) : (i * 5) // randomized mock scale
                });
            }

            return ApiResponse<PlatformAnalyticsDto>.Ok(new PlatformAnalyticsDto
            {
                TotalCompanies = 1,
                ActiveCompanies = company.Status == "active" ? 1 : 0,
                TotalUsers = totalUsers,
                MonthlyRevenue = monthlyRevenue,
                TrialCompanies = subscription?.Status == "Trial" ? 1 : 0,
                PlanDistribution = subscription != null ? new List<PlanDistributionDto> { 
                    new PlanDistributionDto { PlanName = subscription.Plan?.Name ?? "Trial", Count = 1, Revenue = monthlyRevenue }
                } : new List<PlanDistributionDto>(),
                MonthlyGrowth = monthlyGrowth
            });
        }

        public async Task<ApiResponse<PlatformAnalyticsDto>> GetPlatformAnalyticsAsync()
        {
            var totalCompanies = await _db.Companies.CountAsync();
            var activeCompanies = await _db.Companies.CountAsync(c => c.Status == "active");
            var totalUsers = await _db.Users.CountAsync(u => u.IsActive);

            var subscriptions = await _db.CompanySubscriptions
                .Include(s => s.Plan)
                .Where(s => s.Status == "Active")
                .ToListAsync();

            var monthlyRevenue = subscriptions.Sum(s => s.Plan?.MonthlyPrice ?? 0);
            var trialCompanies = await _db.CompanySubscriptions.CountAsync(s => s.Status == "Trial");
            var suspendedCompanies = await _db.CompanySubscriptions.CountAsync(s => s.Status == "Suspended");

            var planDist = subscriptions
                .GroupBy(s => s.Plan?.Name ?? "Unknown")
                .Select(g => new PlanDistributionDto
                {
                    PlanName = g.Key,
                    Count = g.Count(),
                    Revenue = g.Sum(s => s.Plan?.MonthlyPrice ?? 0)
                }).ToList();

            // Monthly growth — last 6 months
            var monthlyGrowth = new List<MonthlyGrowthDto>();
            for (int i = 5; i >= 0; i--)
            {
                var date = DateTime.UtcNow.AddMonths(-i);
                var companiesCount = await _db.Companies
                    .CountAsync(c => c.CreatedAt.Year == date.Year && c.CreatedAt.Month == date.Month);
                var usersCount = await _db.Users
                    .CountAsync(u => u.CreatedAt.Year == date.Year && u.CreatedAt.Month == date.Month);

                monthlyGrowth.Add(new MonthlyGrowthDto
                {
                    Month = date.ToString("MMM"),
                    Companies = companiesCount,
                    Users = usersCount
                });
            }

            var recentActivity = await _db.AuditLogs
                .OrderByDescending(a => a.CreatedAt)
                .Take(10)
                .Select(a => new RecentActivityDto
                {
                    Action = a.Action,
                    Entity = a.Entity,
                    UserName = a.UserName,
                    CreatedAt = a.CreatedAt
                }).ToListAsync();

            return ApiResponse<PlatformAnalyticsDto>.Ok(new PlatformAnalyticsDto
            {
                TotalCompanies = totalCompanies,
                ActiveCompanies = activeCompanies,
                TotalUsers = totalUsers,
                MonthlyRevenue = monthlyRevenue,
                TrialCompanies = trialCompanies,
                SuspendedCompanies = suspendedCompanies,
                PlanDistribution = planDist,
                MonthlyGrowth = monthlyGrowth,
                RecentActivity = recentActivity
            });
        }

        public async Task<ApiResponse<PagedResult<AuditLogDto>>> GetAuditLogsAsync(PaginationParams p)
        {
            var query = _db.AuditLogs.AsQueryable();

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(a => a.UserName.Contains(p.Search) || a.Action.Contains(p.Search) || a.Entity.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize)
                .Take(p.PageSize)
                .Select(a => new AuditLogDto
                {
                    Id = a.Id, UserName = a.UserName, Action = a.Action,
                    Entity = a.Entity, EntityId = a.EntityId,
                    OldValues = a.OldValues, NewValues = a.NewValues,
                    IPAddress = a.IPAddress, CreatedAt = a.CreatedAt
                }).ToListAsync();

            return ApiResponse<PagedResult<AuditLogDto>>.Ok(new PagedResult<AuditLogDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }
    }
}
