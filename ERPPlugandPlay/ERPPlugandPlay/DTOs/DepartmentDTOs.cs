using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateDepartmentDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public int CompanyId { get; set; }
    }

    public class UpdateDepartmentDto : CreateDepartmentDto
    {
        public int Id { get; set; }
    }

    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
    }

    public class CreateDesignationDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public int CompanyId { get; set; }
    }

    public class DesignationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CompanyId { get; set; }
    }
}
