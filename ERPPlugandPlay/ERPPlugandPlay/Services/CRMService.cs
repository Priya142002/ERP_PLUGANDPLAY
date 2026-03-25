using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface ICRMService
    {
        Task<ApiResponse<LeadDto>> CreateLeadAsync(CreateLeadDto dto);
        Task<ApiResponse<PagedResult<LeadDto>>> ListLeadsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<LeadDto>> UpdateLeadAsync(int id, CreateLeadDto dto);
        Task<ApiResponse<bool>> UpdateLeadStatusAsync(int id, string status);
        Task<ApiResponse<bool>> DeleteLeadAsync(int id);

        Task<ApiResponse<OpportunityDto>> CreateOpportunityAsync(CreateOpportunityDto dto);
        Task<ApiResponse<List<OpportunityDto>>> ListOpportunitiesAsync(int companyId);
        Task<ApiResponse<bool>> UpdateOpportunityStageAsync(int id, string stage);

        Task<ApiResponse<ActivityDto>> CreateActivityAsync(CreateActivityDto dto);
        Task<ApiResponse<List<ActivityDto>>> ListActivitiesAsync(int companyId);
        Task<ApiResponse<bool>> MarkActivityDoneAsync(int id);
    }

    public class CRMService : ICRMService
    {
        private readonly ERPDbContext _db;
        public CRMService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<LeadDto>> CreateLeadAsync(CreateLeadDto dto)
        {
            var lead = new Lead
            {
                CompanyId = dto.CompanyId, Name = dto.Name, Email = dto.Email,
                Phone = dto.Phone, Source = dto.Source, Notes = dto.Notes,
                AssignedToUserId = dto.AssignedToUserId
            };
            _db.Leads.Add(lead);
            await _db.SaveChangesAsync();
            return ApiResponse<LeadDto>.Ok(MapLead(lead), "Lead created.");
        }

        public async Task<ApiResponse<PagedResult<LeadDto>>> ListLeadsAsync(int companyId, PaginationParams p)
        {
            var query = _db.Leads.Where(l => l.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(l => l.Name.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(l => l.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(l => MapLead(l)).ToListAsync();

            return ApiResponse<PagedResult<LeadDto>>.Ok(new PagedResult<LeadDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<LeadDto>> UpdateLeadAsync(int id, CreateLeadDto dto)
        {
            var lead = await _db.Leads.FindAsync(id);
            if (lead == null) return ApiResponse<LeadDto>.Fail("Lead not found.");
            lead.Name = dto.Name; lead.Email = dto.Email; lead.Phone = dto.Phone;
            lead.Source = dto.Source; lead.Notes = dto.Notes;
            lead.AssignedToUserId = dto.AssignedToUserId;
            await _db.SaveChangesAsync();
            return ApiResponse<LeadDto>.Ok(MapLead(lead));
        }

        public async Task<ApiResponse<bool>> UpdateLeadStatusAsync(int id, string status)
        {
            var lead = await _db.Leads.FindAsync(id);
            if (lead == null) return ApiResponse<bool>.Fail("Lead not found.");
            lead.Status = status;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<bool>> DeleteLeadAsync(int id)
        {
            var lead = await _db.Leads.FindAsync(id);
            if (lead == null) return ApiResponse<bool>.Fail("Lead not found.");
            _db.Leads.Remove(lead);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Lead deleted.");
        }

        public async Task<ApiResponse<OpportunityDto>> CreateOpportunityAsync(CreateOpportunityDto dto)
        {
            var opp = new Opportunity
            {
                CompanyId = dto.CompanyId, LeadId = dto.LeadId, Name = dto.Name,
                Value = dto.Value, Stage = dto.Stage, CloseDate = dto.CloseDate, Notes = dto.Notes
            };
            _db.Opportunities.Add(opp);
            await _db.SaveChangesAsync();
            string? leadName = dto.LeadId.HasValue ? (await _db.Leads.FindAsync(dto.LeadId.Value))?.Name : null;
            return ApiResponse<OpportunityDto>.Ok(MapOpportunity(opp, leadName), "Opportunity created.");
        }

        public async Task<ApiResponse<List<OpportunityDto>>> ListOpportunitiesAsync(int companyId)
        {
            var opps = await _db.Opportunities.Include(o => o.Lead)
                .Where(o => o.CompanyId == companyId)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();
            return ApiResponse<List<OpportunityDto>>.Ok(opps.Select(o => MapOpportunity(o, o.Lead?.Name)).ToList());
        }

        public async Task<ApiResponse<bool>> UpdateOpportunityStageAsync(int id, string stage)
        {
            var opp = await _db.Opportunities.FindAsync(id);
            if (opp == null) return ApiResponse<bool>.Fail("Opportunity not found.");
            opp.Stage = stage;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<ActivityDto>> CreateActivityAsync(CreateActivityDto dto)
        {
            var activity = new CrmActivity
            {
                CompanyId = dto.CompanyId, LeadId = dto.LeadId, OpportunityId = dto.OpportunityId,
                Type = dto.Type, Subject = dto.Subject, Notes = dto.Notes, ScheduledAt = dto.ScheduledAt
            };
            _db.CrmActivities.Add(activity);
            await _db.SaveChangesAsync();
            string? leadName = dto.LeadId.HasValue ? (await _db.Leads.FindAsync(dto.LeadId.Value))?.Name : null;
            return ApiResponse<ActivityDto>.Ok(MapActivity(activity, leadName), "Activity created.");
        }

        public async Task<ApiResponse<List<ActivityDto>>> ListActivitiesAsync(int companyId)
        {
            var activities = await _db.CrmActivities.Include(a => a.Lead)
                .Where(a => a.CompanyId == companyId)
                .OrderByDescending(a => a.CreatedAt).ToListAsync();
            return ApiResponse<List<ActivityDto>>.Ok(activities.Select(a => MapActivity(a, a.Lead?.Name)).ToList());
        }

        public async Task<ApiResponse<bool>> MarkActivityDoneAsync(int id)
        {
            var activity = await _db.CrmActivities.FindAsync(id);
            if (activity == null) return ApiResponse<bool>.Fail("Activity not found.");
            activity.IsDone = true;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        private static LeadDto MapLead(Lead l) => new()
        {
            Id = l.Id, CompanyId = l.CompanyId, Name = l.Name, Email = l.Email,
            Phone = l.Phone, Source = l.Source, Status = l.Status, Notes = l.Notes,
            AssignedToUserId = l.AssignedToUserId, CreatedAt = l.CreatedAt
        };

        private static OpportunityDto MapOpportunity(Opportunity o, string? leadName) => new()
        {
            Id = o.Id, CompanyId = o.CompanyId, LeadId = o.LeadId, LeadName = leadName,
            Name = o.Name, Value = o.Value, Stage = o.Stage,
            CloseDate = o.CloseDate, Notes = o.Notes, CreatedAt = o.CreatedAt
        };

        private static ActivityDto MapActivity(CrmActivity a, string? leadName) => new()
        {
            Id = a.Id, CompanyId = a.CompanyId, LeadId = a.LeadId, LeadName = leadName,
            OpportunityId = a.OpportunityId, Type = a.Type, Subject = a.Subject,
            Notes = a.Notes, ScheduledAt = a.ScheduledAt, IsDone = a.IsDone, CreatedAt = a.CreatedAt
        };
    }
}
