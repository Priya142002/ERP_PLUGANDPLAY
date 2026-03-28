using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Controllers
{
    /// <summary>
    /// Aggregated dashboard endpoints for every module.
    /// GET /api/dashboard/{module}/{companyId}
    /// </summary>
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ERPDbContext _db;
        public DashboardController(ERPDbContext db) => _db = db;

        // ── Purchase Dashboard ────────────────────────────────
        [HttpGet("purchase/{companyId}")]
        public async Task<IActionResult> PurchaseDashboard(int companyId)
        {
            var invoices = _db.PurchaseInvoices.Where(i => i.CompanyId == companyId);
            var result = new
            {
                TotalVendors = await _db.Vendors.CountAsync(v => v.CompanyId == companyId && v.IsActive),
                TotalInvoices = await invoices.CountAsync(),
                PendingInvoices = await invoices.CountAsync(i => i.Status == "Pending"),
                PaidInvoices = await invoices.CountAsync(i => i.Status == "Paid"),
                TotalPurchaseValue = await invoices.SumAsync(i => (decimal?)i.TotalAmount) ?? 0,
                TotalPaid = await invoices.SumAsync(i => (decimal?)i.PaidAmount) ?? 0,
                TotalBalance = await invoices.SumAsync(i => (decimal?)i.BalanceAmount) ?? 0,
                PendingReturns = await _db.PurchaseReturns.Include(r => r.PurchaseInvoice)
                    .CountAsync(r => r.PurchaseInvoice.CompanyId == companyId && r.Status == "Pending"),
                RecentInvoices = await invoices.Include(i => i.Vendor)
                    .OrderByDescending(i => i.CreatedAt).Take(5)
                    .Select(i => new { i.Id, i.InvoiceNumber, VendorName = i.Vendor.Name, i.TotalAmount, i.Status, i.InvoiceDate })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Sales Dashboard ───────────────────────────────────
        [HttpGet("sales/{companyId}")]
        public async Task<IActionResult> SalesDashboard(int companyId)
        {
            var invoices = _db.SalesInvoices.Where(i => i.CompanyId == companyId);
            var result = new
            {
                TotalCustomers = await _db.Customers.CountAsync(c => c.CompanyId == companyId && c.IsActive),
                TotalQuotations = await _db.Quotations.CountAsync(q => q.CompanyId == companyId),
                TotalInvoices = await invoices.CountAsync(),
                PendingInvoices = await invoices.CountAsync(i => i.Status == "Pending"),
                PaidInvoices = await invoices.CountAsync(i => i.Status == "Paid"),
                TotalSalesValue = await invoices.SumAsync(i => (decimal?)i.TotalAmount) ?? 0,
                TotalCollected = await invoices.SumAsync(i => (decimal?)i.PaidAmount) ?? 0,
                TotalOutstanding = await invoices.SumAsync(i => (decimal?)i.BalanceAmount) ?? 0,
                PendingReturns = await _db.SalesReturns.Include(r => r.SalesInvoice)
                    .CountAsync(r => r.SalesInvoice.CompanyId == companyId && r.Status == "Pending"),
                RecentInvoices = await invoices.Include(i => i.Customer)
                    .OrderByDescending(i => i.CreatedAt).Take(5)
                    .Select(i => new { i.Id, i.InvoiceNumber, CustomerName = i.Customer.Name, i.TotalAmount, i.Status, i.InvoiceDate })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Accounts Dashboard ────────────────────────────────
        [HttpGet("accounts/{companyId}")]
        public async Task<IActionResult> AccountsDashboard(int companyId)
        {
            var result = new
            {
                TotalAccounts = await _db.ChartOfAccounts.CountAsync(a => a.CompanyId == companyId && a.IsActive),
                TotalJournalVouchers = await _db.JournalVouchers.CountAsync(v => v.CompanyId == companyId),
                TotalPaymentVouchers = await _db.PaymentVouchers.CountAsync(v => v.CompanyId == companyId),
                TotalReceiptVouchers = await _db.ReceiptVouchers.CountAsync(v => v.CompanyId == companyId),
                TotalPayments = await _db.PaymentVouchers.Where(v => v.CompanyId == companyId).SumAsync(v => (decimal?)v.Amount) ?? 0,
                TotalReceipts = await _db.ReceiptVouchers.Where(v => v.CompanyId == companyId).SumAsync(v => (decimal?)v.Amount) ?? 0,
                RecentJournalVouchers = await _db.JournalVouchers.Where(v => v.CompanyId == companyId)
                    .OrderByDescending(v => v.CreatedAt).Take(5)
                    .Select(v => new { v.Id, v.VoucherNumber, v.VoucherDate, v.Description, v.TotalDebit, v.Status })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── CRM Dashboard ─────────────────────────────────────
        [HttpGet("crm/{companyId}")]
        public async Task<IActionResult> CrmDashboard(int companyId)
        {
            var result = new
            {
                TotalLeads = await _db.Leads.CountAsync(l => l.CompanyId == companyId),
                NewLeads = await _db.Leads.CountAsync(l => l.CompanyId == companyId && l.Status == "New"),
                QualifiedLeads = await _db.Leads.CountAsync(l => l.CompanyId == companyId && l.Status == "Qualified"),
                ConvertedLeads = await _db.Leads.CountAsync(l => l.CompanyId == companyId && l.Status == "Converted"),
                TotalOpportunities = await _db.Opportunities.CountAsync(o => o.CompanyId == companyId),
                WonOpportunities = await _db.Opportunities.CountAsync(o => o.CompanyId == companyId && o.Stage == "Won"),
                TotalPipelineValue = await _db.Opportunities.Where(o => o.CompanyId == companyId).SumAsync(o => (decimal?)o.Value) ?? 0,
                PendingActivities = await _db.CrmActivities.CountAsync(a => a.CompanyId == companyId && !a.IsDone),
                RecentLeads = await _db.Leads.Where(l => l.CompanyId == companyId)
                    .OrderByDescending(l => l.CreatedAt).Take(5)
                    .Select(l => new { l.Id, l.Name, l.Email, l.Source, l.Status, l.CreatedAt })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── HRM Dashboard ─────────────────────────────────────
        [HttpGet("hrm/{companyId}")]
        public async Task<IActionResult> HrmDashboard(int companyId)
        {
            var today = DateTime.UtcNow.Date;
            var result = new
            {
                TotalEmployees = await _db.Employees.CountAsync(e => e.CompanyId == companyId),
                TodayPresent = await _db.Attendances.Include(a => a.Employee)
                    .CountAsync(a => a.Employee.CompanyId == companyId && a.Date.Date == today && a.Status == "Present"),
                TodayAbsent = await _db.Attendances.Include(a => a.Employee)
                    .CountAsync(a => a.Employee.CompanyId == companyId && a.Date.Date == today && a.Status == "Absent"),
                PendingLeaves = await _db.LeaveRequests.Include(r => r.Employee)
                    .CountAsync(r => r.Employee.CompanyId == companyId && r.Status == "Pending"),
                ApprovedLeaves = await _db.LeaveRequests.Include(r => r.Employee)
                    .CountAsync(r => r.Employee.CompanyId == companyId && r.Status == "Approved"),
                TotalDepartments = await _db.Departments.CountAsync(d => d.CompanyId == companyId),
                RecentLeaveRequests = await _db.LeaveRequests.Include(r => r.Employee).Include(r => r.LeaveType)
                    .Where(r => r.Employee.CompanyId == companyId)
                    .OrderByDescending(r => r.CreatedAt).Take(5)
                    .Select(r => new { r.Id, EmployeeName = r.Employee.Name, LeaveType = r.LeaveType.Name, r.FromDate, r.ToDate, r.Status })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Projects Dashboard ────────────────────────────────
        [HttpGet("projects/{companyId}")]
        public async Task<IActionResult> ProjectsDashboard(int companyId)
        {
            var result = new
            {
                TotalProjects = await _db.Projects.CountAsync(p => p.CompanyId == companyId),
                ActiveProjects = await _db.Projects.CountAsync(p => p.CompanyId == companyId && p.Status == "Active"),
                CompletedProjects = await _db.Projects.CountAsync(p => p.CompanyId == companyId && p.Status == "Completed"),
                TotalTasks = await _db.ProjectTasks.Include(t => t.Project).CountAsync(t => t.Project.CompanyId == companyId),
                PendingTasks = await _db.ProjectTasks.Include(t => t.Project).CountAsync(t => t.Project.CompanyId == companyId && t.Status == "Todo"),
                InProgressTasks = await _db.ProjectTasks.Include(t => t.Project).CountAsync(t => t.Project.CompanyId == companyId && t.Status == "In Progress"),
                TotalBudget = await _db.Projects.Where(p => p.CompanyId == companyId).SumAsync(p => (decimal?)p.Budget) ?? 0,
                RecentProjects = await _db.Projects.Where(p => p.CompanyId == companyId)
                    .OrderByDescending(p => p.CreatedAt).Take(5)
                    .Select(p => new { p.Id, Name = p.ProjectName, p.Status, p.StartDate, p.EndDate, p.ClientName })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Helpdesk Dashboard ────────────────────────────────
        [HttpGet("helpdesk/{companyId}")]
        public async Task<IActionResult> HelpdeskDashboard(int companyId)
        {
            var tickets = _db.HelpdeskTickets.Where(t => t.CompanyId == companyId);
            var result = new
            {
                TotalTickets = await tickets.CountAsync(),
                OpenTickets = await tickets.CountAsync(t => t.Status == "Open"),
                InProgressTickets = await tickets.CountAsync(t => t.Status == "In Progress"),
                ResolvedTickets = await tickets.CountAsync(t => t.Status == "Resolved"),
                CriticalTickets = await tickets.CountAsync(t => t.Priority == "Critical" && t.Status != "Closed"),
                SlaBreached = await tickets.CountAsync(t => t.SlaDeadline < DateTime.UtcNow && t.Status != "Resolved" && t.Status != "Closed"),
                RecentTickets = await tickets.OrderByDescending(t => t.CreatedAt).Take(5)
                    .Select(t => new { t.Id, t.TicketNumber, t.Subject, t.Priority, t.Status, t.CreatedAt })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Assets Dashboard ──────────────────────────────────
        [HttpGet("assets/{companyId}")]
        public async Task<IActionResult> AssetsDashboard(int companyId)
        {
            var assets = _db.Assets.Where(a => a.CompanyId == companyId);
            var result = new
            {
                TotalAssets = await assets.CountAsync(),
                ActiveAssets = await assets.CountAsync(a => a.Status == "Active"),
                UnderMaintenance = await assets.CountAsync(a => a.Status == "Under Maintenance"),
                DisposedAssets = await assets.CountAsync(a => a.Status == "Disposed"),
                TotalPurchaseValue = await assets.SumAsync(a => (decimal?)a.PurchasePrice) ?? 0,
                TotalCurrentValue = await assets.SumAsync(a => (decimal?)a.CurrentValue) ?? 0,
                TotalDepreciation = (await assets.SumAsync(a => (decimal?)a.PurchasePrice) ?? 0) - (await assets.SumAsync(a => (decimal?)a.CurrentValue) ?? 0),
                RecentAssets = await assets.OrderByDescending(a => a.CreatedAt).Take(5)
                    .Select(a => new { a.Id, a.AssetCode, a.Name, a.Category, a.PurchasePrice, a.CurrentValue, a.Status })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Logistics Dashboard ───────────────────────────────
        [HttpGet("logistics/{companyId}")]
        public async Task<IActionResult> LogisticsDashboard(int companyId)
        {
            var shipments = _db.ShipmentOrders.Where(s => s.CompanyId == companyId);
            var result = new
            {
                TotalShipments = await shipments.CountAsync(),
                PendingShipments = await shipments.CountAsync(s => s.Status == "Pending"),
                InTransitShipments = await shipments.CountAsync(s => s.Status == "Shipped"),
                DeliveredShipments = await shipments.CountAsync(s => s.Status == "Delivered"),
                TotalCarriers = await _db.Carriers.CountAsync(c => c.CompanyId == companyId && c.IsActive),
                TotalRoutes = await _db.DeliveryRoutes.CountAsync(r => r.CompanyId == companyId && r.IsActive),
                AvgFeedbackRating = await _db.DeliveryFeedbacks.Include(f => f.ShipmentOrder)
                    .Where(f => f.ShipmentOrder.CompanyId == companyId)
                    .AverageAsync(f => (double?)f.Rating) ?? 0,
                RecentShipments = await shipments.Include(s => s.Carrier)
                    .OrderByDescending(s => s.CreatedAt).Take(5)
                    .Select(s => new { s.Id, s.OrderNumber, s.CustomerName, s.Status, s.ExpectedDelivery, CarrierName = s.Carrier != null ? s.Carrier.Name : "" })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Production Dashboard ──────────────────────────────
        [HttpGet("production/{companyId}")]
        public async Task<IActionResult> ProductionDashboard(int companyId)
        {
            var orders = _db.ProductionOrders.Where(o => o.CompanyId == companyId);
            var result = new
            {
                TotalBoms = await _db.BillsOfMaterial.CountAsync(b => b.CompanyId == companyId && b.IsActive),
                TotalOrders = await orders.CountAsync(),
                DraftOrders = await orders.CountAsync(o => o.Status == "Draft"),
                InProgressOrders = await orders.CountAsync(o => o.Status == "In Progress"),
                CompletedOrders = await orders.CountAsync(o => o.Status == "Completed"),
                TotalQualityChecks = await _db.QualityChecks.Include(q => q.ProductionOrder)
                    .CountAsync(q => q.ProductionOrder.CompanyId == companyId),
                PassRate = await _db.QualityChecks.Include(q => q.ProductionOrder)
                    .Where(q => q.ProductionOrder.CompanyId == companyId)
                    .AverageAsync(q => (double?)q.PassedQty / (q.SampleSize > 0 ? (double)q.SampleSize : 1) * 100) ?? 0,
                RecentOrders = await orders.Include(o => o.Bom).ThenInclude(b => b.FinishedProduct)
                    .OrderByDescending(o => o.CreatedAt).Take(5)
                    .Select(o => new { o.Id, o.OrderNumber, ProductName = o.Bom.FinishedProduct.Name, o.PlannedQty, o.ProducedQty, o.Status })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── Billing Dashboard ─────────────────────────────────
        [HttpGet("billing/{companyId}")]
        public async Task<IActionResult> BillingDashboard(int companyId)
        {
            var invoices = _db.BillingInvoices.Where(i => i.CompanyId == companyId);
            var result = new
            {
                TotalInvoices = await invoices.CountAsync(),
                DraftInvoices = await invoices.CountAsync(i => i.Status == "Draft"),
                SentInvoices = await invoices.CountAsync(i => i.Status == "Sent"),
                PaidInvoices = await invoices.CountAsync(i => i.Status == "Paid"),
                OverdueInvoices = await invoices.CountAsync(i => i.Status == "Overdue"),
                TotalBilled = await invoices.SumAsync(i => (decimal?)i.TotalAmount) ?? 0,
                TotalCollected = await invoices.SumAsync(i => (decimal?)i.PaidAmount) ?? 0,
                PendingReminders = await _db.PaymentReminders.Include(r => r.BillingInvoice)
                    .CountAsync(r => r.BillingInvoice.CompanyId == companyId && !r.IsSent),
                RecentInvoices = await invoices.OrderByDescending(i => i.CreatedAt).Take(5)
                    .Select(i => new { i.Id, i.InvoiceNumber, i.ClientName, i.TotalAmount, i.Status, i.DueDate })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }

        // ── POS Dashboard ─────────────────────────────────────
        [HttpGet("pos/{companyId}")]
        public async Task<IActionResult> PosDashboard(int companyId)
        {
            var today = DateTime.UtcNow.Date;
            var orders = _db.PosOrders.Where(o => o.CompanyId == companyId);
            var result = new
            {
                TodaySales = await orders.Where(o => o.OrderDate.Date == today && o.Status == "Completed").SumAsync(o => (decimal?)o.TotalAmount) ?? 0,
                TodayOrders = await orders.CountAsync(o => o.OrderDate.Date == today),
                ActiveSessions = await _db.PosSessions.CountAsync(s => s.CompanyId == companyId && s.Status == "Open"),
                TotalOrders = await orders.CountAsync(),
                TotalRevenue = await orders.Where(o => o.Status == "Completed").SumAsync(o => (decimal?)o.TotalAmount) ?? 0,
                RefundedOrders = await orders.CountAsync(o => o.Status == "Refunded"),
                RecentOrders = await orders.Include(o => o.Customer)
                    .OrderByDescending(o => o.OrderDate).Take(5)
                    .Select(o => new { o.Id, o.OrderNumber, CustomerName = o.Customer != null ? o.Customer.Name : "Walk-in", o.TotalAmount, o.PaymentMode, o.Status, o.OrderDate })
                    .ToListAsync()
            };
            return Ok(ApiResponse<object>.Ok(result));
        }
    }
}
