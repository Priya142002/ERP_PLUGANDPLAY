using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/department")]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _service;
        public DepartmentController(IDepartmentService service) => _service = service;

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] int? companyId)
        {
            var result = await _service.ListAsync(companyId);
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDepartmentDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        // Designation endpoints
        [HttpPost("designation/create")]
        public async Task<IActionResult> CreateDesignation([FromBody] CreateDesignationDto dto)
        {
            var result = await _service.CreateDesignationAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("designation/list")]
        public async Task<IActionResult> ListDesignations([FromQuery] int? companyId)
        {
            var result = await _service.ListDesignationsAsync(companyId);
            return Ok(result);
        }

        [HttpDelete("designation/delete/{id}")]
        public async Task<IActionResult> DeleteDesignation(int id)
        {
            var result = await _service.DeleteDesignationAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }
    }
}
