using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ERPDbContext _db;

        public AuthController(IAuthService authService, ERPDbContext db)
        {
            _authService = authService;
            _db = db;
        }

        /// <summary>POST /api/auth/login</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return result.Success ? Ok(result) : Unauthorized(result);
        }

        /// <summary>POST /api/auth/google-login</summary>
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            var result = await _authService.GoogleLoginAsync(dto.IdToken);
            return result.Success ? Ok(result) : Unauthorized(result);
        }

        /// <summary>POST /api/auth/register</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>GET /api/auth/users</summary>
        [HttpGet("users")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetUsers([FromQuery] PaginationParams p)
        {
            var result = await _authService.GetUsersAsync(p);
            return Ok(result);
        }

        /// <summary>PUT /api/auth/update-user</summary>
        [HttpPut("update-user")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var result = await _authService.UpdateUserAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>DELETE /api/auth/delete-user/{id}</summary>
        [HttpDelete("delete-user/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _authService.DeleteUserAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>GET /api/auth/health — DB connection test</summary>
        [HttpGet("health")]
        public async Task<IActionResult> Health()
        {
            try
            {
                var canConnect = await _db.Database.CanConnectAsync();
                var userCount = canConnect ? await _db.Users.CountAsync() : -1;
                return Ok(new { success = true, canConnect, userCount, time = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        /// <summary>GET /api/auth/trial-status</summary>
        [HttpGet("trial-status")]
        [Authorize]
        public async Task<IActionResult> TrialStatus()
        {
            var email = User.FindFirstValue(ClaimTypes.Email) ?? "";
            var company = await _db.Companies.FirstOrDefaultAsync(c => c.AdminEmail == email);

            if (company == null)
            {
                var employee = await _db.Employees.FirstOrDefaultAsync(e => e.Email == email);
                if (employee != null)
                    company = await _db.Companies.FindAsync(employee.CompanyId);
            }

            if (company == null)
                return Ok(new { success = true, data = new { isTrialActive = false, hasActiveSubscription = false, daysRemaining = 0 } });

            var hasActiveSub = await _db.CompanySubscriptions.AnyAsync(s =>
                s.CompanyId == company.Id && s.Status == "Active" &&
                (!s.EndDate.HasValue || s.EndDate.Value >= DateTime.UtcNow));

            var isTrialActive = company.IsTrialActive && company.TrialEndDate.HasValue
                && company.TrialEndDate.Value >= DateTime.UtcNow;
            var daysRemaining = isTrialActive
                ? (int)(company.TrialEndDate!.Value - DateTime.UtcNow).TotalDays : 0;

            return Ok(new
            {
                success = true,
                data = new
                {
                    companyId = company.Id,
                    companyName = company.Name,
                    isTrialActive,
                    trialEndDate = company.TrialEndDate,
                    trialStartDate = company.TrialStartDate,
                    hasActiveSubscription = hasActiveSub,
                    daysRemaining,
                    isExpired = !isTrialActive && !hasActiveSub
                }
            });
        }
    }
}
