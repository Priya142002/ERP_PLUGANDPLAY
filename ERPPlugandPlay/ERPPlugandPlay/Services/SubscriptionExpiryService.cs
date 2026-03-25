using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ERPPlugandPlay.Services
{
    public class SubscriptionExpiryService : BackgroundService
    {
        private readonly ILogger<SubscriptionExpiryService> _logger;

        public SubscriptionExpiryService(ILogger<SubscriptionExpiryService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Subscription Expiry Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Add your subscription expiry logic here
                    _logger.LogInformation("Subscription Expiry Service running at: {time}", DateTimeOffset.Now);

                    // Run every 12 hours
                    await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in Subscription Expiry Service");
                }
            }

            _logger.LogInformation("Subscription Expiry Service stopped");
        }
    }
}
