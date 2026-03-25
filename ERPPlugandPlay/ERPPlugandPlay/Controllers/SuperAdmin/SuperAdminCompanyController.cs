using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers.SuperAdmin
{
    [ApiController]
    [Route("api/superadmin/companies")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminCompanyController : ControllerBase
    {
        private readonly ISuperAdminCompanyService _service;
        public SuperAdminCompanyController(ISuperAdminCompanyService service) => _service = service;

        /// <summary>POST /api/superadmin/companies</summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCompanyFullDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>GET /api/superadmin/companies?page=1&pageSize=10&search=&status=active&industry=</summary>
        [HttpGet]
        public async Task<IActionResult> List([FromQuery] PaginationParams p,
            [FromQuery] string? status, [FromQuery] string? industry)
        {
            var result = await _service.ListAsync(p, status, industry);
            return Ok(result);
        }

        /// <summary>GET /api/superadmin/companies/{id}</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>PUT /api/superadmin/companies/{id}</summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompanyFullDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>DELETE /api/superadmin/companies/{id}</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>PATCH /api/superadmin/companies/{id}/toggle-status</summary>
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var result = await _service.ToggleStatusAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }
    }
}
