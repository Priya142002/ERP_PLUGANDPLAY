using ERPPlugandPlay.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ERPPlugandPlay.Middleware
{
    /// <summary>
    /// Enforces trial expiry and module-level access on every authenticated request.
    /// - SuperAdmin: always passes through
    /// - Subscribed company: all enabled modules pass through
    /// - Trial company: only IsTrialAccess=true modules pass through
    /// - Expired trial + no subscription: 403
    /// </summary>
    public class TrialAccessMiddleware
    {
        private readonly RequestDelegate _next;

        // Map route prefix → module ID
        private static readonly Dictionary<string, string> _routeModuleMap = new(StringComparer.OrdinalIgnoreCase)
        {
            ["/api/inventory"]   = "inventory",
            ["/api/purchase"]    = "purchase",
            ["/api/sales"]       = "sales",
            ["/api/accounts"]    = "accounts",
            ["/api/crm"]         = "crm",
            ["/api/hrm"]         = "hrm",
            ["/api/projects"]    = "projects",
            ["/api/helpdesk"]    = "helpdesk",
            ["/api/assets"]      = "assets",
            ["/api/logistics"]   = "logistics",
            ["/api/production"]  = "production",
            ["/api/billing"]     = "billing",
            ["/api/pos"]         = "pos",
            ["/api/payroll"]     = "hrm",
            ["/api/report"]      = "accounts",
            ["/api/dashboard"]   = null!,   // dashboard is always allowed
        };

        // Paths always exempt from checks
        private static readonly string[] _exemptPaths =
        [
            "/api/auth",
            "/api/superadmin",
            "/api/admin/modules",
            "/swagger",
            "/api/documents",
            "/api/company",
            "/api/employee",
            "/api/department",
        ];

        public TrialAccessMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context, ERPDbContext db)
        {
            var path = context.Request.Path.Value ?? "";

            // Always exempt
            if (_exemptPaths.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase)))
            {
                await _next(context);
                return;
            }

            // Only check authenticated requests
            if (!(context.User.Identity?.IsAuthenticated ?? false))
            {
                await _next(context);
                return;
            }

            var role = context.User.FindFirstValue(ClaimTypes.Role) ?? "";

            // SuperAdmin always passes
            if (role == "SuperAdmin")
            {
                await _next(context);
                return;
            }

            var email = context.User.FindFirstValue(ClaimTypes.Email) ?? "";
            if (string.IsNullOrEmpty(email))
            {
                await _next(context);
                return;
            }

            // Resolve company
            var company = await db.Companies
                .Include(c => c.Modules)
                .FirstOrDefaultAsync(c => c.AdminEmail == email);

            if (company == null)
            {
                var employee = await db.Employees.FirstOrDefaultAsync(e => e.Email == email);
                if (employee != null)
                    company = await db.Companies
                        .Include(c => c.Modules)
                        .FirstOrDefaultAsync(c => c.Id == employee.CompanyId);
            }

            if (company == null)
            {
                await _next(context);
                return;
            }

            // Check subscription
            var hasActiveSub = await db.CompanySubscriptions.AnyAsync(s =>
                s.CompanyId == company.Id &&
                s.Status == "Active" &&
                (!s.EndDate.HasValue || s.EndDate.Value >= DateTime.UtcNow));

            // Check trial
            var isTrialValid = company.IsTrialActive &&
                               company.TrialEndDate.HasValue &&
                               company.TrialEndDate.Value >= DateTime.UtcNow;

            // Expire trial if needed
            if (!hasActiveSub && company.IsTrialActive &&
                company.TrialEndDate.HasValue && company.TrialEndDate.Value < DateTime.UtcNow)
            {
                company.IsTrialActive = false;
                await db.SaveChangesAsync();
                isTrialValid = false;
            }

            // Block if neither active
            if (!hasActiveSub && !isTrialValid)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Your 30-day free trial has expired. Please subscribe to a plan to continue.",
                    code = "TRIAL_EXPIRED",
                    trialEndDate = company.TrialEndDate
                });
                return;
            }

            // ── Module-level access check ─────────────────────────────────
            var matchedModule = _routeModuleMap
                .FirstOrDefault(kv => path.StartsWith(kv.Key, StringComparison.OrdinalIgnoreCase));

            if (matchedModule.Key != null && matchedModule.Value != null)
            {
                var moduleId = matchedModule.Value;

                bool moduleAllowed;

                if (hasActiveSub)
                {
                    // Subscribed: check IsEnabled
                    var mod = company.Modules.FirstOrDefault(m => m.ModuleId == moduleId);
                    moduleAllowed = mod == null || mod.IsEnabled; // default allow if not configured
                }
                else
                {
                    // Trial: must be IsEnabled AND IsTrialAccess
                    var mod = company.Modules.FirstOrDefault(m => m.ModuleId == moduleId);
                    moduleAllowed = mod != null && mod.IsEnabled && mod.IsTrialAccess;
                }

                if (!moduleAllowed)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(new
                    {
                        success = false,
                        message = $"Access to the '{moduleId}' module is not enabled for your account.",
                        code = "MODULE_ACCESS_DENIED",
                        module = moduleId
                    });
                    return;
                }
            }

            await _next(context);
        }
    }
}
