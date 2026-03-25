using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/system")]
    [Authorize(Roles = "SuperAdmin")]
    public class SystemSettingController : ControllerBase
    {
        private readonly ERPPlugandPlay.Services.ISystemSettingsService _service;
        public SystemSettingController(ERPPlugandPlay.Services.ISystemSettingsService service) => _service = service;

        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var result = await _service.GetSettingsAsync();
            return Ok(result);
        }

        [HttpPost("settings")]
        public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string> settings)
        {
            var result = await _service.UpdateSettingsAsync(settings);
            return Ok(result);
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetHealth()
        {
            var result = await _service.GetSystemHealthAsync();
            return Ok(result);
        }
    }
}
