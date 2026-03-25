using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/assets")]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetsService _svc;
        public AssetsController(IAssetsService svc) => _svc = svc;

        [HttpPost] public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDto dto) => Ok(await _svc.CreateAssetAsync(dto));
        [HttpGet("{companyId}")] public async Task<IActionResult> ListAssets(int companyId, [FromQuery] PaginationParams p) => Ok(await _svc.ListAssetsAsync(companyId, p));
        [HttpPut("{id}")] public async Task<IActionResult> UpdateAsset(int id, [FromBody] CreateAssetDto dto) => Ok(await _svc.UpdateAssetAsync(id, dto));
        [HttpDelete("{id}")] public async Task<IActionResult> DeleteAsset(int id) => Ok(await _svc.DeleteAssetAsync(id));

        [HttpPost("maintenance")] public async Task<IActionResult> LogMaintenance([FromBody] CreateMaintenanceDto dto) => Ok(await _svc.LogMaintenanceAsync(dto));
        [HttpGet("{assetId}/maintenance")] public async Task<IActionResult> ListMaintenance(int assetId) => Ok(await _svc.ListMaintenanceAsync(assetId));

        [HttpPost("disposal")] public async Task<IActionResult> DisposeAsset([FromBody] CreateDisposalDto dto) => Ok(await _svc.DisposeAssetAsync(dto));
        [HttpGet("{companyId}/disposals")] public async Task<IActionResult> ListDisposals(int companyId) => Ok(await _svc.ListDisposalsAsync(companyId));
    }
}
