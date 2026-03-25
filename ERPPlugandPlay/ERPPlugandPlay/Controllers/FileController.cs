using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/file")]
    [Authorize]
    public class FileController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<FileController> _logger;

        public FileController(IConfiguration config, ILogger<FileController> logger)
        {
            _config = config;
            _logger = logger;
        }

        /// <summary>POST /api/file/upload</summary>
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string folder = "general")
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file provided." });

            var maxMb = int.Parse(_config["FileUpload:MaxFileSizeMB"] ?? "10");
            if (file.Length > maxMb * 1024 * 1024)
                return BadRequest(new { success = false, message = $"File exceeds {maxMb}MB limit." });

            var physicalRoot = _config["FileUpload:PhysicalRoot"] ?? "C:\\ERPPlugandPlay\\uploads";
            var uploadDir = Path.Combine(physicalRoot, folder);
            Directory.CreateDirectory(uploadDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            var url = $"/api/documents/{folder}/{fileName}";
            _logger.LogInformation("File uploaded: {FileName}", fileName);

            return Ok(new { success = true, message = "File uploaded.", data = new { fileName, url } });
        }

        /// <summary>DELETE /api/file/delete</summary>
        [HttpDelete("delete")]
        public IActionResult Delete([FromQuery] string fileName, [FromQuery] string folder = "general")
        {
            var physicalRoot = _config["FileUpload:PhysicalRoot"] ?? "C:\\ERPPlugandPlay\\uploads";
            var filePath = Path.Combine(physicalRoot, folder, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound(new { success = false, message = "File not found." });

            System.IO.File.Delete(filePath);
            return Ok(new { success = true, message = "File deleted." });
        }
    }
}
