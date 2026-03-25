using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/subscriptions")]
    [Authorize(Roles = "SuperAdmin")]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _service;
        public SubscriptionController(ISubscriptionService service) => _service = service;

        // ── Plans ──────────────────────────────────────────────

        /// <summary>GET /api/superadmin/subscriptions/plans</summary>
        [HttpGet("plans")]
        [AllowAnonymous] // Plans are public for pricing page
        public async Task<IActionResult> GetPlans()
        {
            var result = await _service.GetPlansAsync();
            return Ok(result);
        }

        /// <summary>POST /api/superadmin/subscriptions/plans</summary>
        [HttpPost("plans")]
        public async Task<IActionResult> CreatePlan([FromBody] CreatePlanDto dto)
        {
            var result = await _service.CreatePlanAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PUT /api/superadmin/subscriptions/plans/{id}</summary>
        [HttpPut("plans/{id}")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] CreatePlanDto dto)
        {
            var result = await _service.UpdatePlanAsync(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>DELETE /api/superadmin/subscriptions/plans/{id}</summary>
        [HttpDelete("plans/{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            var result = await _service.DeletePlanAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        // ── Company Subscriptions ──────────────────────────────

        /// <summary>GET /api/superadmin/subscriptions</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationParams p)
        {
            var result = await _service.GetAllSubscriptionsAsync(p);
            return Ok(result);
        }

        /// <summary>GET /api/superadmin/subscriptions/company/{companyId}</summary>
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCompanySubscription(int companyId)
        {
            var result = await _service.GetCompanySubscriptionAsync(companyId);
            return Ok(result);
        }

        /// <summary>POST /api/superadmin/subscriptions/assign</summary>
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignSubscriptionDto dto)
        {
            var result = await _service.AssignSubscriptionAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PUT /api/superadmin/subscriptions/change-plan</summary>
        [HttpPut("change-plan")]
        public async Task<IActionResult> ChangePlan([FromBody] ChangePlanDto dto)
        {
            var result = await _service.ChangePlanAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PUT /api/superadmin/subscriptions/status</summary>
        [HttpPut("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] SuspendSubscriptionDto dto)
        {
            var result = await _service.UpdateStatusAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
