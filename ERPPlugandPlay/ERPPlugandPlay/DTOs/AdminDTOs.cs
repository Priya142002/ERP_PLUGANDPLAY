using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class UserAdminDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateUserDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
        [Required] public int RoleId { get; set; }
    }

    public class AdminUpdateUserDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        [Required] public int RoleId { get; set; }
        public bool IsActive { get; set; }
    }

    public class RoleDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }

    public class PermissionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class RolePermissionDto
    {
        public int RoleId { get; set; }
        public List<int> PermissionIds { get; set; } = new();
    }
}
