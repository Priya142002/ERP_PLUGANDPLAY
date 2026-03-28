using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IProjectsService
    {
        Task<ApiResponse<ProjectDto>> CreateProjectAsync(CreateProjectDto dto);
        Task<ApiResponse<List<ProjectDto>>> ListProjectsAsync(int companyId);
        Task<ApiResponse<ProjectDto>> UpdateProjectAsync(int id, CreateProjectDto dto);
        Task<ApiResponse<bool>> UpdateProjectStatusAsync(int id, string status);
        Task<ApiResponse<bool>> DeleteProjectAsync(int id);

        Task<ApiResponse<ProjectTaskDto>> CreateTaskAsync(CreateTaskDto dto);
        Task<ApiResponse<List<ProjectTaskDto>>> ListTasksAsync(int projectId);
        Task<ApiResponse<bool>> UpdateTaskStatusAsync(int id, string status);

        Task<ApiResponse<TimesheetDto>> LogTimesheetAsync(CreateTimesheetDto dto);
        Task<ApiResponse<List<TimesheetDto>>> ListTimesheetsAsync(int projectId);
    }

    public class ProjectsService : IProjectsService
    {
        private readonly ERPDbContext _db;
        public ProjectsService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<ProjectDto>> CreateProjectAsync(CreateProjectDto dto)
        {
            var project = new Project
            {
                CompanyId = dto.CompanyId, ProjectName = dto.Name, Description = dto.Description,
                StartDate = dto.StartDate, EndDate = dto.EndDate,
                Budget = dto.Budget, ClientName = dto.ClientName
            };
            _db.Projects.Add(project);
            await _db.SaveChangesAsync();
            return ApiResponse<ProjectDto>.Ok(MapProject(project, 0), "Project created.");
        }

        public async Task<ApiResponse<List<ProjectDto>>> ListProjectsAsync(int companyId)
        {
            var projects = await _db.Projects
                .Include(p => p.Tasks)
                .Where(p => p.CompanyId == companyId)
                .OrderByDescending(p => p.CreatedAt).ToListAsync();
            return ApiResponse<List<ProjectDto>>.Ok(projects.Select(p => MapProject(p, p.Tasks.Count)).ToList());
        }

        public async Task<ApiResponse<ProjectDto>> UpdateProjectAsync(int id, CreateProjectDto dto)
        {
            var project = await _db.Projects.FindAsync(id);
            if (project == null) return ApiResponse<ProjectDto>.Fail("Project not found.");
            project.ProjectName = dto.Name; project.Description = dto.Description;
            project.StartDate = dto.StartDate; project.EndDate = dto.EndDate;
            project.Budget = dto.Budget; project.ClientName = dto.ClientName;
            await _db.SaveChangesAsync();
            return ApiResponse<ProjectDto>.Ok(MapProject(project, 0));
        }

        public async Task<ApiResponse<bool>> UpdateProjectStatusAsync(int id, string status)
        {
            var project = await _db.Projects.FindAsync(id);
            if (project == null) return ApiResponse<bool>.Fail("Project not found.");
            project.Status = status;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<bool>> DeleteProjectAsync(int id)
        {
            var project = await _db.Projects.FindAsync(id);
            if (project == null) return ApiResponse<bool>.Fail("Project not found.");
            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Project deleted.");
        }

        public async Task<ApiResponse<ProjectTaskDto>> CreateTaskAsync(CreateTaskDto dto)
        {
            var task = new ProjectTask
            {
                ProjectId = dto.ProjectId, Title = dto.Title, Description = dto.Description,
                Priority = dto.Priority, AssignedToUserId = dto.AssignedToUserId, DueDate = dto.DueDate
            };
            _db.ProjectTasks.Add(task);
            await _db.SaveChangesAsync();
            var project = await _db.Projects.FindAsync(dto.ProjectId);
            return ApiResponse<ProjectTaskDto>.Ok(MapTask(task, project?.ProjectName ?? ""), "Task created.");
        }

        public async Task<ApiResponse<List<ProjectTaskDto>>> ListTasksAsync(int projectId)
        {
            var project = await _db.Projects.FindAsync(projectId);
            var tasks = await _db.ProjectTasks
                .Where(t => t.ProjectId == projectId)
                .OrderBy(t => t.CreatedAt).ToListAsync();
            return ApiResponse<List<ProjectTaskDto>>.Ok(tasks.Select(t => MapTask(t, project?.ProjectName ?? "")).ToList());
        }

        public async Task<ApiResponse<bool>> UpdateTaskStatusAsync(int id, string status)
        {
            var task = await _db.ProjectTasks.FindAsync(id);
            if (task == null) return ApiResponse<bool>.Fail("Task not found.");
            task.Status = status;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<TimesheetDto>> LogTimesheetAsync(CreateTimesheetDto dto)
        {
            var ts = new Timesheet
            {
                ProjectId = dto.ProjectId, EmployeeId = dto.EmployeeId,
                WorkDate = dto.WorkDate, HoursWorked = dto.HoursWorked,
                Description = dto.Description, BillableAmount = dto.BillableAmount
            };
            _db.Timesheets.Add(ts);
            await _db.SaveChangesAsync();
            var project = await _db.Projects.FindAsync(dto.ProjectId);
            var emp = await _db.Employees.FindAsync(dto.EmployeeId);
            return ApiResponse<TimesheetDto>.Ok(new TimesheetDto
            {
                Id = ts.Id, ProjectId = ts.ProjectId, ProjectName = project?.ProjectName ?? "",
                EmployeeId = ts.EmployeeId, EmployeeName = emp?.Name ?? "",
                WorkDate = ts.WorkDate, HoursWorked = ts.HoursWorked,
                Description = ts.Description, BillableAmount = ts.BillableAmount, CreatedAt = ts.CreatedAt
            }, "Timesheet logged.");
        }

        public async Task<ApiResponse<List<TimesheetDto>>> ListTimesheetsAsync(int projectId)
        {
            var project = await _db.Projects.FindAsync(projectId);
            var timesheets = await _db.Timesheets.Include(t => t.Employee)
                .Where(t => t.ProjectId == projectId)
                .OrderByDescending(t => t.WorkDate).ToListAsync();
            return ApiResponse<List<TimesheetDto>>.Ok(timesheets.Select(t => new TimesheetDto
            {
                Id = t.Id, ProjectId = t.ProjectId, ProjectName = project?.ProjectName ?? "",
                EmployeeId = t.EmployeeId, EmployeeName = t.Employee?.Name ?? "",
                WorkDate = t.WorkDate, HoursWorked = t.HoursWorked,
                Description = t.Description, BillableAmount = t.BillableAmount, CreatedAt = t.CreatedAt
            }).ToList());
        }

        private static ProjectDto MapProject(Project p, int taskCount) => new()
        {
            Id = p.Id, CompanyId = p.CompanyId, Name = p.ProjectName, Description = p.Description,
            Status = p.Status, StartDate = p.StartDate, EndDate = p.EndDate,
            Budget = p.Budget, ClientName = p.ClientName, CreatedAt = p.CreatedAt, TaskCount = taskCount
        };

        private static ProjectTaskDto MapTask(ProjectTask t, string projectName) => new()
        {
            Id = t.Id, ProjectId = t.ProjectId, ProjectName = projectName,
            Title = t.Title, Description = t.Description, Priority = t.Priority,
            Status = t.Status, AssignedToUserId = t.AssignedToUserId,
            DueDate = t.DueDate, CreatedAt = t.CreatedAt
        };
    }
}
