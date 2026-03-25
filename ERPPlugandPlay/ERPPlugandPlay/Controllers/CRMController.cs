using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/crm")]
    [Authorize]
    public class CRMController : ControllerBase
    {
        private readonly ICRMService _svc;
        public CRMController(ICRMService svc) => _svc = svc;

        [HttpPost("leads")] public async Task<IActionResult> CreateLead([FromBody] CreateLeadDto dto) => Ok(await _svc.CreateLeadAsync(dto));
        [HttpGet("leads/{companyId}")] public async Task<IActionResult> ListLeads(int companyId, [FromQuery] PaginationParams p) => Ok(await _svc.ListLeadsAsync(companyId, p));
        [HttpPut("leads/{id}")] public async Task<IActionResult> UpdateLead(int id, [FromBody] CreateLeadDto dto) => Ok(await _svc.UpdateLeadAsync(id, dto));
        [HttpPut("leads/{id}/status")] public async Task<IActionResult> UpdateLeadStatus(int id, [FromQuery] string status) => Ok(await _svc.UpdateLeadStatusAsync(id, status));
        [HttpDelete("leads/{id}")] public async Task<IActionResult> DeleteLead(int id) => Ok(await _svc.DeleteLeadAsync(id));

        [HttpPost("opportunities")] public async Task<IActionResult> CreateOpportunity([FromBody] CreateOpportunityDto dto) => Ok(await _svc.CreateOpportunityAsync(dto));
        [HttpGet("opportunities/{companyId}")] public async Task<IActionResult> ListOpportunities(int companyId) => Ok(await _svc.ListOpportunitiesAsync(companyId));
        [HttpPut("opportunities/{id}/stage")] public async Task<IActionResult> UpdateStage(int id, [FromQuery] string stage) => Ok(await _svc.UpdateOpportunityStageAsync(id, stage));

        [HttpPost("activities")] public async Task<IActionResult> CreateActivity([FromBody] CreateActivityDto dto) => Ok(await _svc.CreateActivityAsync(dto));
        [HttpGet("activities/{companyId}")] public async Task<IActionResult> ListActivities(int companyId) => Ok(await _svc.ListActivitiesAsync(companyId));
        [HttpPut("activities/{id}/done")] public async Task<IActionResult> MarkDone(int id) => Ok(await _svc.MarkActivityDoneAsync(id));
    }
}
