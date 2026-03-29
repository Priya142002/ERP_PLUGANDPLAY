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

        // ── Dropdown Options (Company Types, Industries, Countries) ──────────

        [HttpGet("dropdown/{key}")]
        public async Task<IActionResult> GetDropdownOptions(string key)
        {
            var result = await _service.GetSettingsAsync();
            var setting = result.Data?.FirstOrDefault(s => s.Key == $"dropdown.{key}");
            if (setting == null) return Ok(new { success = true, data = new List<string>() });

            try
            {
                var items = System.Text.Json.JsonSerializer.Deserialize<List<string>>(setting.Value) ?? new();
                return Ok(new { success = true, data = items });
            }
            catch { return Ok(new { success = true, data = new List<string>() }); }
        }

        [HttpPost("dropdown/{key}")]
        public async Task<IActionResult> SaveDropdownOptions(string key, [FromBody] List<string> items)
        {
            var json = System.Text.Json.JsonSerializer.Serialize(items);
            await _service.UpdateSettingAsync($"dropdown.{key}", json);
            return Ok(new { success = true, message = $"Saved {items.Count} custom {key}" });
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetHealth()
        {
            var result = await _service.GetSystemHealthAsync();
            return Ok(result);
        }
    }
}
