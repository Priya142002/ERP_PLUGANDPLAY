using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class LoginDto
    {
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
    }

    public class GoogleLoginDto
    {
        [Required] public string IdToken { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
        public int RoleId { get; set; } = 2;
    }

    public class UpdateUserDto
    {
        [Required] public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime Expiry { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public bool IsTrialActive { get; set; }
        public DateTime? TrialEndDate { get; set; }
        public bool HasActiveSubscription { get; set; }
        public int DaysRemaining { get; set; }
        public List<string> AllowedModules { get; set; } = new();
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
