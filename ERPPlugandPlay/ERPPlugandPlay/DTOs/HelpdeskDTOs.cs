using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateTicketDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Subject { get; set; } = string.Empty;
        [Required] public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium";
        public string Category { get; set; } = string.Empty;
        public int? RaisedByUserId { get; set; }
        public DateTime? SlaDeadline { get; set; }
    }

    public class TicketDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string TicketNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int? AssignedToUserId { get; set; }
        public int? RaisedByUserId { get; set; }
        public DateTime? SlaDeadline { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TicketCommentDto> Comments { get; set; } = new();
    }

    public class AddCommentDto
    {
        [Required] public int TicketId { get; set; }
        [Required] public int UserId { get; set; }
        [Required] public string UserName { get; set; } = string.Empty;
        [Required] public string Comment { get; set; } = string.Empty;
        public bool IsInternal { get; set; } = false;
    }

    public class TicketCommentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
