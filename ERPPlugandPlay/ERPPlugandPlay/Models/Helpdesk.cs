namespace ERPPlugandPlay.Models
{
    public class HelpdeskTicket
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string TicketNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = "Open";
        public string? Category { get; set; }
        public int? AssignedTo { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? RaisedByUserId { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime? SlaDeadline { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
    }

    public class TicketComment
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public HelpdeskTicket Ticket { get; set; } = null!;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public bool IsInternal { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
