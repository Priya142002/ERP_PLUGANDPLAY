using System.Collections.Generic;
using System.Threading.Tasks;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;

namespace ERPPlugandPlay.Services
{
    public interface ISystemSettingsService
    {
        Task<ApiResponse<List<SystemSetting>>> GetSettingsAsync();
        Task<ApiResponse<bool>> UpdateSettingAsync(string key, string value);
        Task<ApiResponse<bool>> UpdateSettingsAsync(Dictionary<string, string> settings);
        Task<ApiResponse<SystemHealthDto>> GetSystemHealthAsync();
    }
}
