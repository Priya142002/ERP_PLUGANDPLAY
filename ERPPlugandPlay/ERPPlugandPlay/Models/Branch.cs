using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.Models
{
    public class Branch
    {
        public int Id { get; set; }
        
        [Required]
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        [Required]
        public string BranchName { get; set; } = string.Empty;
        
        public string Address { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
