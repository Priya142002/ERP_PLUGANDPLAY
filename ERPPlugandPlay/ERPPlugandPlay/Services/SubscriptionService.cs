using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface ISubscriptionService
    {
        Task<ApiResponse<PlanDto>> CreatePlanAsync(CreatePlanDto dto);
        Task<ApiResponse<List<PlanDto>>> GetPlansAsync();
        Task<ApiResponse<PlanDto>> UpdatePlanAsync(int id, CreatePlanDto dto);
        Task<ApiResponse<bool>> DeletePlanAsync(int id);

        Task<ApiResponse<CompanySubscriptionDto>> AssignSubscriptionAsync(AssignSubscriptionDto dto);
        Task<ApiResponse<CompanySubscriptionDto>> ChangePlanAsync(ChangePlanDto dto);
        Task<ApiResponse<bool>> UpdateStatusAsync(SuspendSubscriptionDto dto);
        Task<ApiResponse<List<CompanySubscriptionDto>>> GetAllSubscriptionsAsync(PaginationParams p);
        Task<ApiResponse<CompanySubscriptionDto?>> GetCompanySubscriptionAsync(int companyId);
    }

    public class SubscriptionService : ISubscriptionService
    {
        private readonly ERPDbContext _db;
        public SubscriptionService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<PlanDto>> CreatePlanAsync(CreatePlanDto dto)
        {
            var plan = new SubscriptionPlan
            {
                Name = dto.Name, MonthlyPrice = dto.MonthlyPrice,
                PricePerUser = dto.PricePerUser,
                PlanType = dto.PlanType,
                MaxSeats = dto.MaxSeats, MaxModules = dto.MaxModules,
                AllowedModules = dto.AllowedModules,
                Description = dto.Description
            };
            _db.SubscriptionPlans.Add(plan);
            await _db.SaveChangesAsync();
            return ApiResponse<PlanDto>.Ok(Map(plan), "Plan created.");
        }

        public async Task<ApiResponse<List<PlanDto>>> GetPlansAsync()
        {
            var plans = await _db.SubscriptionPlans.Where(p => p.IsActive)
                .Select(p => Map(p)).ToListAsync();
            return ApiResponse<List<PlanDto>>.Ok(plans);
        }

        public async Task<ApiResponse<PlanDto>> UpdatePlanAsync(int id, CreatePlanDto dto)
        {
            var plan = await _db.SubscriptionPlans.FindAsync(id);
            if (plan == null) return ApiResponse<PlanDto>.Fail("Plan not found.");
            plan.Name = dto.Name; plan.MonthlyPrice = dto.MonthlyPrice;
            plan.PricePerUser = dto.PricePerUser;
            plan.PlanType = dto.PlanType;
            plan.MaxSeats = dto.MaxSeats; plan.MaxModules = dto.MaxModules;
            plan.AllowedModules = dto.AllowedModules;
            plan.Description = dto.Description;
            await _db.SaveChangesAsync();
            return ApiResponse<PlanDto>.Ok(Map(plan));
        }

        public async Task<ApiResponse<bool>> DeletePlanAsync(int id)
        {
            var plan = await _db.SubscriptionPlans.FindAsync(id);
            if (plan == null) return ApiResponse<bool>.Fail("Plan not found.");
            plan.IsActive = false;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Plan deactivated.");
        }

        public async Task<ApiResponse<CompanySubscriptionDto>> AssignSubscriptionAsync(AssignSubscriptionDto dto)
        {
            var company = await _db.Companies.FindAsync(dto.CompanyId);
            if (company == null) return ApiResponse<CompanySubscriptionDto>.Fail("Company not found.");

            var plan = await _db.SubscriptionPlans.FindAsync(dto.PlanId);
            if (plan == null) return ApiResponse<CompanySubscriptionDto>.Fail("Plan not found.");

            // Deactivate existing
            var existing = await _db.CompanySubscriptions
                .Where(s => s.CompanyId == dto.CompanyId && s.Status == "Active").ToListAsync();
            existing.ForEach(s => s.Status = "Expired");

            var sub = new CompanySubscription
            {
                CompanyId = dto.CompanyId, PlanId = dto.PlanId,
                Status = "Active", StartDate = DateTime.UtcNow,
                EndDate = dto.EndDate,
                NextBillingDate = plan.PlanType == "Yearly" ? DateTime.UtcNow.AddYears(1) : DateTime.UtcNow.AddMonths(1),
                IsProrated = dto.IsProrated
            };
            _db.CompanySubscriptions.Add(sub);
            await _db.SaveChangesAsync();

            return ApiResponse<CompanySubscriptionDto>.Ok(await MapSubAsync(sub.Id), "Subscription assigned.");
        }

        public async Task<ApiResponse<CompanySubscriptionDto>> ChangePlanAsync(ChangePlanDto dto)
        {
            var sub = await _db.CompanySubscriptions
                .FirstOrDefaultAsync(s => s.CompanyId == dto.CompanyId && s.Status == "Active");

            if (sub == null) return ApiResponse<CompanySubscriptionDto>.Fail("No active subscription found.");

            var newPlan = await _db.SubscriptionPlans.FindAsync(dto.NewPlanId);
            if (newPlan == null) return ApiResponse<CompanySubscriptionDto>.Fail("Plan not found.");

            sub.PlanId = dto.NewPlanId;
            sub.IsProrated = dto.IsProrated;
            sub.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return ApiResponse<CompanySubscriptionDto>.Ok(await MapSubAsync(sub.Id), "Plan changed.");
        }

        public async Task<ApiResponse<bool>> UpdateStatusAsync(SuspendSubscriptionDto dto)
        {
            var sub = await _db.CompanySubscriptions
                .FirstOrDefaultAsync(s => s.CompanyId == dto.CompanyId && s.Status != "Expired");

            if (sub == null) return ApiResponse<bool>.Fail("Subscription not found.");
            sub.Status = dto.Status;
            sub.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, $"Subscription status updated to {dto.Status}.");
        }

        public async Task<ApiResponse<List<CompanySubscriptionDto>>> GetAllSubscriptionsAsync(PaginationParams p)
        {
            var query = _db.CompanySubscriptions
                .Include(s => s.Company).Include(s => s.Plan)
                .Where(s => s.Status != "Expired")
                .AsQueryable();

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(s => s.Company.Name.Contains(p.Search));

            var items = await query.OrderByDescending(s => s.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(s => MapSub(s)).ToListAsync();

            return ApiResponse<List<CompanySubscriptionDto>>.Ok(items);
        }

        public async Task<ApiResponse<CompanySubscriptionDto?>> GetCompanySubscriptionAsync(int companyId)
        {
            var sub = await _db.CompanySubscriptions
                .Include(s => s.Company).Include(s => s.Plan)
                .FirstOrDefaultAsync(s => s.CompanyId == companyId && s.Status == "Active");

            return ApiResponse<CompanySubscriptionDto?>.Ok(sub == null ? null : MapSub(sub));
        }

        private async Task<CompanySubscriptionDto> MapSubAsync(int id)
        {
            var sub = await _db.CompanySubscriptions
                .Include(s => s.Company).Include(s => s.Plan)
                .FirstAsync(s => s.Id == id);
            return MapSub(sub);
        }

        private static CompanySubscriptionDto MapSub(CompanySubscription s) => new()
        {
            Id = s.Id, CompanyId = s.CompanyId, CompanyName = s.Company?.Name ?? "",
            PlanId = s.PlanId, PlanName = s.Plan?.Name ?? "",
            MonthlyPrice = s.Plan?.MonthlyPrice ?? 0,
            PlanType = s.Plan?.PlanType ?? "Monthly",
            Status = s.Status, StartDate = s.StartDate, EndDate = s.EndDate,
            NextBillingDate = s.NextBillingDate,
            UsedSeats = s.UsedSeats, MaxSeats = s.Plan?.MaxSeats ?? 0
        };

        private static PlanDto Map(SubscriptionPlan p) => new()
        {
            Id = p.Id, Name = p.Name, MonthlyPrice = p.MonthlyPrice,
            PricePerUser = p.PricePerUser,
            PlanType = p.PlanType,
            MaxSeats = p.MaxSeats, MaxModules = p.MaxModules,
            AllowedModules = p.AllowedModules,
            Description = p.Description, IsActive = p.IsActive
        };
    }
}
