namespace ERPPlugandPlay.Models
{
    public class GlobalModule
    {
        public int Id { get; set; }
        public string ModuleId { get; set; } = string.Empty;   // e.g. "inventory"
        public string Name { get; set; } = string.Empty;       // e.g. "Inventory Management"
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Icon { get; set; } = "Puzzle";
        public bool IsActive { get; set; } = true;
        public bool IsBuiltIn { get; set; } = true;            // false = custom module
        public int SortOrder { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
