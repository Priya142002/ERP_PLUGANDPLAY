using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/helpdesk")]
    [Authorize]
    public class HelpdeskController : ControllerBase
    {
        private readonly IHelpdeskService _svc;
        public HelpdeskController(IHelpdeskService svc) => _svc = svc;

        [HttpPost("tickets")] public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto) => Ok(await _svc.CreateTicketAsync(dto));
        [HttpGet("tickets/{companyId}")] public async Task<IActionResult> ListTickets(int companyId, [FromQuery] PaginationParams p) => Ok(await _svc.ListTicketsAsync(companyId, p));
        [HttpGet("tickets/detail/{id}")] public async Task<IActionResult> GetTicket(int id) => Ok(await _svc.GetTicketAsync(id));
        [HttpPut("tickets/{id}/status")] public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status, [FromQuery] int? assignedTo) => Ok(await _svc.UpdateTicketStatusAsync(id, status, assignedTo));
        [HttpPost("tickets/comments")] public async Task<IActionResult> AddComment([FromBody] AddCommentDto dto) => Ok(await _svc.AddCommentAsync(dto));
    }
}
