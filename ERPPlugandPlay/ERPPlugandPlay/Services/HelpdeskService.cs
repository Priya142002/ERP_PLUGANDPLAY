using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IHelpdeskService
    {
        Task<ApiResponse<TicketDto>> CreateTicketAsync(CreateTicketDto dto);
        Task<ApiResponse<PagedResult<TicketDto>>> ListTicketsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<TicketDto>> GetTicketAsync(int id);
        Task<ApiResponse<bool>> UpdateTicketStatusAsync(int id, string status, int? assignedTo);
        Task<ApiResponse<TicketCommentDto>> AddCommentAsync(AddCommentDto dto);
    }

    public class HelpdeskService : IHelpdeskService
    {
        private readonly ERPDbContext _db;
        public HelpdeskService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<TicketDto>> CreateTicketAsync(CreateTicketDto dto)
        {
            var ticketNumber = $"TKT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var ticket = new HelpdeskTicket
            {
                CompanyId = dto.CompanyId, TicketNumber = ticketNumber,
                Subject = dto.Subject, Description = dto.Description,
                Priority = dto.Priority, Category = dto.Category,
                RaisedByUserId = dto.RaisedByUserId, SlaDeadline = dto.SlaDeadline
            };
            _db.HelpdeskTickets.Add(ticket);
            await _db.SaveChangesAsync();
            return ApiResponse<TicketDto>.Ok(MapTicket(ticket), "Ticket created.");
        }

        public async Task<ApiResponse<PagedResult<TicketDto>>> ListTicketsAsync(int companyId, PaginationParams p)
        {
            var query = _db.HelpdeskTickets.Where(t => t.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(t => t.Subject.Contains(p.Search) || t.TicketNumber.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(t => t.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(t => MapTicket(t)).ToListAsync();

            return ApiResponse<PagedResult<TicketDto>>.Ok(new PagedResult<TicketDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<TicketDto>> GetTicketAsync(int id)
        {
            var ticket = await _db.HelpdeskTickets.Include(t => t.Comments)
                .FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null) return ApiResponse<TicketDto>.Fail("Ticket not found.");
            return ApiResponse<TicketDto>.Ok(MapTicket(ticket));
        }

        public async Task<ApiResponse<bool>> UpdateTicketStatusAsync(int id, string status, int? assignedTo)
        {
            var ticket = await _db.HelpdeskTickets.FindAsync(id);
            if (ticket == null) return ApiResponse<bool>.Fail("Ticket not found.");
            ticket.Status = status;
            if (assignedTo.HasValue) ticket.AssignedToUserId = assignedTo;
            if (status == "Resolved") ticket.ResolvedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<TicketCommentDto>> AddCommentAsync(AddCommentDto dto)
        {
            var comment = new TicketComment
            {
                TicketId = dto.TicketId, UserId = dto.UserId, UserName = dto.UserName,
                Comment = dto.Comment, IsInternal = dto.IsInternal
            };
            _db.TicketComments.Add(comment);
            await _db.SaveChangesAsync();
            return ApiResponse<TicketCommentDto>.Ok(new TicketCommentDto
            {
                Id = comment.Id, UserId = comment.UserId, UserName = comment.UserName,
                Comment = comment.Comment, IsInternal = comment.IsInternal, CreatedAt = comment.CreatedAt
            }, "Comment added.");
        }

        private static TicketDto MapTicket(HelpdeskTicket t) => new()
        {
            Id = t.Id, CompanyId = t.CompanyId, TicketNumber = t.TicketNumber,
            Subject = t.Subject, Description = t.Description, Priority = t.Priority,
            Status = t.Status, Category = t.Category, AssignedToUserId = t.AssignedToUserId,
            RaisedByUserId = t.RaisedByUserId, SlaDeadline = t.SlaDeadline,
            ResolvedAt = t.ResolvedAt, CreatedAt = t.CreatedAt,
            Comments = t.Comments.Select(c => new TicketCommentDto
            {
                Id = c.Id, UserId = c.UserId, UserName = c.UserName,
                Comment = c.Comment, IsInternal = c.IsInternal, CreatedAt = c.CreatedAt
            }).ToList()
        };
    }
}
