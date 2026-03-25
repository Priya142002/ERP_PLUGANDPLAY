using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ERPPlugandPlay.Data;
using ERPPlugandPlay.Models;
using ERPPlugandPlay.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public class SystemSettingsService : ISystemSettingsService
    {
        private readonly ERPDbContext _db;
        public SystemSettingsService(ERPDbContext db) => _db = db;

        public async Task<ApiResponse<List<SystemSetting>>> GetSettingsAsync()
        {
            var settings = await _db.SystemSettings.ToListAsync();
            return ApiResponse<List<SystemSetting>>.Ok(settings);
        }

        public async Task<ApiResponse<bool>> UpdateSettingAsync(string key, string value)
        {
            var setting = await _db.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
            if (setting == null)
            {
                setting = new SystemSetting { Key = key, Value = value, UpdatedAt = DateTime.UtcNow };
                _db.SystemSettings.Add(setting);
            }
            else
            {
                setting.Value = value;
                setting.UpdatedAt = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<bool>> UpdateSettingsAsync(Dictionary<string, string> settings)
        {
            foreach (var kvp in settings)
            {
                var setting = await _db.SystemSettings.FirstOrDefaultAsync(s => s.Key == kvp.Key);
                if (setting == null)
                {
                    _db.SystemSettings.Add(new SystemSetting { Key = kvp.Key, Value = kvp.Value, UpdatedAt = DateTime.UtcNow });
                }
                else
                {
                    setting.Value = kvp.Value;
                    setting.UpdatedAt = DateTime.UtcNow;
                }
            }
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<SystemHealthDto>> GetSystemHealthAsync()
        {
            // For now, return some pseudo-randomized but semi-realistic "health" data
            // In real app, this would check DB connections, disk space, etc.
            return ApiResponse<SystemHealthDto>.Ok(new SystemHealthDto
            {
                Database = "Healthy",
                DatabaseUptime = "99.9%",
                ApiServer = "Healthy",
                ApiUptime = "99.8%",
                StorageUsage = "62%",
                CpuUsage = "24%",
                MemoryUsage = "48%",
                LastBackupAt = DateTime.UtcNow.AddHours(-12),
                Version = "v2.5.0",
                Environment = "Production"
            });
        }
    }
}
