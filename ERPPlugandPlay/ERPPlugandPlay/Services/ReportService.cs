using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IReportService
    {
        Task<byte[]> ExportEmployeeReportAsync(int? companyId);
        Task<byte[]> ExportPayrollReportAsync(int month, int year);
        Task<byte[]> ExportInventoryReportAsync(int? companyId);
        Task<byte[]> ExportPurchaseReportAsync(int companyId, DateTime? from, DateTime? to);
        Task<byte[]> ExportSalesReportAsync(int companyId, DateTime? from, DateTime? to);
        Task<byte[]> ExportAccountsReportAsync(int companyId, DateTime? from, DateTime? to);
    }

    public class ReportService : IReportService
    {
        private readonly ERPDbContext _db;
        public ReportService(ERPDbContext db) => _db = db;

        public async Task<byte[]> ExportEmployeeReportAsync(int? companyId)
        {
            var query = _db.Employees
                .Include(e => e.Company).Include(e => e.Department).Include(e => e.Designation)
                .AsQueryable();
            if (companyId.HasValue) query = query.Where(e => e.CompanyId == companyId.Value);

            var data = await query.Select(e => new
            {
                e.Id, e.Name, e.Email, e.Phone,
                Company = e.Company.Name, Department = e.Department.Name,
                Designation = e.Designation.Name, e.JoinDate, e.Salary
            }).ToListAsync();

            return ExportHelper.ExportToExcel(data, "Employees");
        }

        public async Task<byte[]> ExportPayrollReportAsync(int month, int year)
        {
            var data = await _db.Salaries
                .Include(s => s.Employee).ThenInclude(e => e.Department)
                .Where(s => s.Month == month && s.Year == year)
                .Select(s => new
                {
                    s.Id, Employee = s.Employee.Name, Department = s.Employee.Department.Name,
                    s.Basic, s.HRA, s.Allowances, s.Deductions, s.NetSalary, s.Month, s.Year
                }).ToListAsync();

            return ExportHelper.ExportToExcel(data, "Payroll");
        }

        public async Task<byte[]> ExportInventoryReportAsync(int? companyId)
        {
            var data = await _db.Products.Include(p => p.Category)
                .Select(p => new
                {
                    p.Id, p.Name, Category = p.Category.Name, p.Price, p.StockQty
                }).ToListAsync();

            return ExportHelper.ExportToExcel(data, "Inventory");
        }

        public async Task<byte[]> ExportPurchaseReportAsync(int companyId, DateTime? from, DateTime? to)
        {
            var query = _db.PurchaseInvoices
                .Include(i => i.Vendor)
                .Where(i => i.CompanyId == companyId);

            if (from.HasValue) query = query.Where(i => i.InvoiceDate >= from.Value);
            if (to.HasValue) query = query.Where(i => i.InvoiceDate <= to.Value);

            var data = await query.Select(i => new
            {
                i.Id, i.InvoiceNumber, Vendor = i.Vendor.Name,
                i.InvoiceDate, i.DueDate, i.SubTotal, i.TaxAmount,
                i.DiscountAmount, i.TotalAmount, i.PaidAmount, i.BalanceAmount, i.Status
            }).ToListAsync();

            return ExportHelper.ExportToExcel(data, "PurchaseInvoices");
        }

        public async Task<byte[]> ExportSalesReportAsync(int companyId, DateTime? from, DateTime? to)
        {
            var query = _db.SalesInvoices
                .Include(i => i.Customer)
                .Where(i => i.CompanyId == companyId);

            if (from.HasValue) query = query.Where(i => i.InvoiceDate >= from.Value);
            if (to.HasValue) query = query.Where(i => i.InvoiceDate <= to.Value);

            var data = await query.Select(i => new
            {
                i.Id, i.InvoiceNumber, Customer = i.Customer.Name,
                i.InvoiceDate, i.DueDate, i.SubTotal, i.TaxAmount,
                i.DiscountAmount, i.TotalAmount, i.PaidAmount, i.BalanceAmount, i.Status
            }).ToListAsync();

            return ExportHelper.ExportToExcel(data, "SalesInvoices");
        }

        public async Task<byte[]> ExportAccountsReportAsync(int companyId, DateTime? from, DateTime? to)
        {
            var query = _db.JournalVouchers
                .Where(v => v.CompanyId == companyId);

            if (from.HasValue) query = query.Where(v => v.VoucherDate >= from.Value);
            if (to.HasValue) query = query.Where(v => v.VoucherDate <= to.Value);

            var data = await query.Select(v => new
            {
                v.Id, v.VoucherNumber, v.VoucherDate,
                v.Description, v.TotalDebit, v.TotalCredit, v.Status
            }).ToListAsync();

            return ExportHelper.ExportToExcel(data, "JournalVouchers");
        }
    }
}
