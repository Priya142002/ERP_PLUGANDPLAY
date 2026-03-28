using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;
        public AdminController(IAdminService service) => _service = service;

        // ── Users ─────────────────────────────────────────────
        [HttpGet("users")]
        public async Task<IActionResult> ListUsers([FromQuery] PaginationParams p) => Ok(await _service.ListUsersAsync(p));

        [HttpPost("users/create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            var result = await _service.CreateUserAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("users/update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUpdateUserDto dto)
        {
            var result = await _service.UpdateUserAsync(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        [HttpPost("users/toggle-status/{id}")]
        public async Task<IActionResult> ToggleUserStatus(int id) => Ok(await _service.ToggleUserStatusAsync(id));

        // ── Access (Roles & Permissions) ──────────────────────
        [HttpGet("roles")]
        public async Task<IActionResult> ListRoles() => Ok(await _service.ListRolesAsync());

        [HttpGet("permissions")]
        public async Task<IActionResult> ListPermissions() => Ok(await _service.ListPermissionsAsync());

        [HttpGet("roles/{roleId}/permissions")]
        public async Task<IActionResult> GetRolePermissions(int roleId) => Ok(await _service.GetRolePermissionIdsAsync(roleId));

        [HttpPost("roles/assign-permissions")]
        public async Task<IActionResult> AssignPermissions([FromBody] RolePermissionDto dto) => Ok(await _service.AssignPermissionsToRoleAsync(dto));

        // ── Audit Logs ────────────────────────────────────────
        [HttpGet("audit-logs")]
        public async Task<IActionResult> ListAuditLogs([FromQuery] PaginationParams p) => Ok(await _service.ListAuditLogsAsync(p));
    }
}
