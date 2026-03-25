using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/modules")]
    [Authorize(Roles = "SuperAdmin")]
    public class ModuleAccessController : ControllerBase
    {
        private readonly IModuleAccessService _service;
        public ModuleAccessController(IModuleAccessService service) => _service = service;

        /// <summary>GET /api/superadmin/modules/company/{companyId}</summary>
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCompanyModules(int companyId)
        {
            var result = await _service.GetCompanyModulesAsync(companyId);
            return Ok(result);
        }

        /// <summary>POST /api/superadmin/modules/set</summary>
        [HttpPost("set")]
        public async Task<IActionResult> SetModules([FromBody] SetCompanyModulesDto dto)
        {
            var result = await _service.SetCompanyModulesAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>PATCH /api/superadmin/modules/toggle</summary>
        [HttpPatch("toggle")]
        public async Task<IActionResult> Toggle([FromBody] ToggleModuleDto dto)
        {
            var result = await _service.ToggleModuleAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>GET /api/superadmin/modules/trial-defaults</summary>
        [HttpGet("trial-defaults")]
        public async Task<IActionResult> GetTrialDefaults()
        {
            var result = await _service.GetDefaultTrialModulesAsync();
            return Ok(result);
        }

        /// <summary>POST /api/superadmin/modules/trial-defaults</summary>
        [HttpPost("trial-defaults")]
        public async Task<IActionResult> SetTrialDefaults([FromBody] List<string> moduleIds)
        {
            var result = await _service.SetDefaultTrialModulesAsync(moduleIds);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
