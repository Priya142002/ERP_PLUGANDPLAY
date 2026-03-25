using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ERPPlugandPlay.Services
{
    public class StockAlertService : BackgroundService
    {
        private readonly ILogger<StockAlertService> _logger;

        public StockAlertService(ILogger<StockAlertService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Stock Alert Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Add your stock alert logic here
                    _logger.LogInformation("Stock Alert Service running at: {time}", DateTimeOffset.Now);

                    // Run every 6 hours
                    await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in Stock Alert Service");
                }
            }

            _logger.LogInformation("Stock Alert Service stopped");
        }
    }
}
