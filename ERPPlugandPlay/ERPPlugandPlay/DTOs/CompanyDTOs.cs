using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateBranchDto
    {
        public string BranchName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class BranchDto : CreateBranchDto
    {
        public int Id { get; set; }
    }

    // Kept for Admin-scoped simple usage
    public class CreateCompanyDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        [EmailAddress] public string Email { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public List<CreateBranchDto> Branches { get; set; } = new();
    }

    public class UpdateCompanyDto : CreateCompanyDto
    {
        public int Id { get; set; }
    }

    public class CompanyDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<BranchDto> Branches { get; set; } = new();
    }
}
