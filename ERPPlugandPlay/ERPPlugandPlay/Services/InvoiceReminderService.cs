using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ERPPlugandPlay.Services
{
    public class InvoiceReminderService : BackgroundService
    {
        private readonly ILogger<InvoiceReminderService> _logger;

        public InvoiceReminderService(ILogger<InvoiceReminderService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Invoice Reminder Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Add your invoice reminder logic here
                    _logger.LogInformation("Invoice Reminder Service running at: {time}", DateTimeOffset.Now);

                    // Run every 24 hours
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in Invoice Reminder Service");
                }
            }

            _logger.LogInformation("Invoice Reminder Service stopped");
        }
    }
}
