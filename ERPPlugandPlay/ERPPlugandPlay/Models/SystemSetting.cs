using System;

namespace ERPPlugandPlay.Models
{
    public class SystemSetting
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Group { get; set; } = "General";
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
