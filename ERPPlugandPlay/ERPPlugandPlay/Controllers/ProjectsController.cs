using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectsService _svc;
        public ProjectsController(IProjectsService svc) => _svc = svc;

        [HttpPost] public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto) => Ok(await _svc.CreateProjectAsync(dto));
        [HttpGet("{companyId}")] public async Task<IActionResult> ListProjects(int companyId) => Ok(await _svc.ListProjectsAsync(companyId));
        [HttpPut("{id}")] public async Task<IActionResult> UpdateProject(int id, [FromBody] CreateProjectDto dto) => Ok(await _svc.UpdateProjectAsync(id, dto));
        [HttpPut("{id}/status")] public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status) => Ok(await _svc.UpdateProjectStatusAsync(id, status));
        [HttpDelete("{id}")] public async Task<IActionResult> DeleteProject(int id) => Ok(await _svc.DeleteProjectAsync(id));

        [HttpPost("tasks")] public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto) => Ok(await _svc.CreateTaskAsync(dto));
        [HttpGet("{projectId}/tasks")] public async Task<IActionResult> ListTasks(int projectId) => Ok(await _svc.ListTasksAsync(projectId));
        [HttpPut("tasks/{id}/status")] public async Task<IActionResult> UpdateTaskStatus(int id, [FromQuery] string status) => Ok(await _svc.UpdateTaskStatusAsync(id, status));

        [HttpPost("timesheets")] public async Task<IActionResult> LogTimesheet([FromBody] CreateTimesheetDto dto) => Ok(await _svc.LogTimesheetAsync(dto));
        [HttpGet("{projectId}/timesheets")] public async Task<IActionResult> ListTimesheets(int projectId) => Ok(await _svc.ListTimesheetsAsync(projectId));
    }
}
