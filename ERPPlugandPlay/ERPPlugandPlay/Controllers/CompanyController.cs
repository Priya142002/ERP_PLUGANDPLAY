using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/company")]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _service;
        public CompanyController(ICompanyService service) => _service = service;

        /// <summary>POST /api/company/create</summary>
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>GET /api/company/list</summary>
        [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] PaginationParams p)
        {
            var result = await _service.ListAsync(p);
            return Ok(result);
        }

        /// <summary>PUT /api/company/update/{id}</summary>
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompanyDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>DELETE /api/company/delete/{id}</summary>
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }
    }
}
