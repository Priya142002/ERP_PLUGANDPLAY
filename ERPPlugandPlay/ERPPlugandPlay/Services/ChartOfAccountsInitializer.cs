using ERPPlugandPlay.Data;
using ERPPlugandPlay.Models;

namespace ERPPlugandPlay.Services
{
    public interface IChartOfAccountsInitializer
    {
        Task InitializeDefaultAccountsAsync(int companyId, int userId);
    }

    public class ChartOfAccountsInitializer : IChartOfAccountsInitializer
    {
        private readonly ERPDbContext _context;

        public ChartOfAccountsInitializer(ERPDbContext context)
        {
            _context = context;
        }

        public async Task InitializeDefaultAccountsAsync(int companyId, int userId)
        {
            var defaultAccounts = GetDefaultAccounts(companyId, userId);

            _context.ChartOfAccounts.AddRange(defaultAccounts);
            await _context.SaveChangesAsync();
        }

        private List<ChartOfAccount> GetDefaultAccounts(int companyId, int userId)
        {
            var accounts = new List<ChartOfAccount>();
            var now = DateTime.UtcNow;

            // ══════════════════════════════════════════════════════
            // ASSETS (1000-1999)
            // ══════════════════════════════════════════════════════

            // Current Assets
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1000", AccountName = "Current Assets", AccountType = "Asset", AccountGroup = "Current Assets", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1001", AccountName = "Cash", AccountType = "Asset", AccountGroup = "Current Assets", ParentAccountCode = "1000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1100", AccountName = "Bank Accounts", AccountType = "Asset", AccountGroup = "Current Assets", ParentAccountCode = "1000", IsGroup = true, Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1200", AccountName = "Accounts Receivable", AccountType = "Asset", AccountGroup = "Current Assets", ParentAccountCode = "1000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1300", AccountName = "Inventory", AccountType = "Asset", AccountGroup = "Current Assets", ParentAccountCode = "1000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1400", AccountName = "Prepaid Expenses", AccountType = "Asset", AccountGroup = "Current Assets", ParentAccountCode = "1000", Level = 2, CreatedAt = now, CreatedBy = userId });

            // Fixed Assets
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1500", AccountName = "Fixed Assets", AccountType = "Asset", AccountGroup = "Fixed Assets", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1501", AccountName = "Land & Building", AccountType = "Asset", AccountGroup = "Fixed Assets", ParentAccountCode = "1500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1502", AccountName = "Machinery", AccountType = "Asset", AccountGroup = "Fixed Assets", ParentAccountCode = "1500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1503", AccountName = "Furniture & Fixtures", AccountType = "Asset", AccountGroup = "Fixed Assets", ParentAccountCode = "1500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1504", AccountName = "Vehicles", AccountType = "Asset", AccountGroup = "Fixed Assets", ParentAccountCode = "1500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "1505", AccountName = "Computer & Equipment", AccountType = "Asset", AccountGroup = "Fixed Assets", ParentAccountCode = "1500", Level = 2, CreatedAt = now, CreatedBy = userId });

            // ══════════════════════════════════════════════════════
            // LIABILITIES (2000-2999)
            // ══════════════════════════════════════════════════════

            // Current Liabilities
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2000", AccountName = "Current Liabilities", AccountType = "Liability", AccountGroup = "Current Liabilities", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2001", AccountName = "Accounts Payable", AccountType = "Liability", AccountGroup = "Current Liabilities", ParentAccountCode = "2000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2100", AccountName = "Short Term Loans", AccountType = "Liability", AccountGroup = "Current Liabilities", ParentAccountCode = "2000", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2200", AccountName = "Tax Payable", AccountType = "Liability", AccountGroup = "Current Liabilities", ParentAccountCode = "2000", IsGroup = true, Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2201", AccountName = "GST Payable", AccountType = "Liability", AccountGroup = "Current Liabilities", ParentAccountCode = "2200", Level = 3, TaxType = "GST", CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2202", AccountName = "TDS Payable", AccountType = "Liability", AccountGroup = "Current Liabilities", ParentAccountCode = "2200", Level = 3, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2300", AccountName = "Salary Payable", AccountType = "Liability", AccountGroup = "Current Liabilities", ParentAccountCode = "2000", Level = 2, CreatedAt = now, CreatedBy = userId });

            // Long Term Liabilities
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2500", AccountName = "Long Term Liabilities", AccountType = "Liability", AccountGroup = "Long Term Liabilities", IsGroup = true, Level = 1, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "2501", AccountName = "Long Term Loans", AccountType = "Liability", AccountGroup = "Long Term Liabilities", ParentAccountCode = "2500", Level = 2, CreatedAt = now, CreatedBy = userId });

            // ══════════════════════════════════════════════════════
            // EQUITY (3000-3999)
            // ══════════════════════════════════════════════════════

            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "3000", AccountName = "Equity", AccountType = "Equity", AccountGroup = "Equity", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "3001", AccountName = "Capital", AccountType = "Equity", AccountGroup = "Equity", ParentAccountCode = "3000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "3002", AccountName = "Retained Earnings", AccountType = "Equity", AccountGroup = "Equity", ParentAccountCode = "3000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "3003", AccountName = "Drawings", AccountType = "Equity", AccountGroup = "Equity", ParentAccountCode = "3000", Level = 2, CreatedAt = now, CreatedBy = userId });

            // ══════════════════════════════════════════════════════
            // INCOME (4000-4999)
            // ══════════════════════════════════════════════════════

            // Direct Income
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4000", AccountName = "Direct Income", AccountType = "Income", AccountGroup = "Direct Income", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4001", AccountName = "Sales", AccountType = "Income", AccountGroup = "Direct Income", ParentAccountCode = "4000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4002", AccountName = "Service Income", AccountType = "Income", AccountGroup = "Direct Income", ParentAccountCode = "4000", Level = 2, CreatedAt = now, CreatedBy = userId });

            // Indirect Income
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4500", AccountName = "Indirect Income", AccountType = "Income", AccountGroup = "Indirect Income", IsGroup = true, Level = 1, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4501", AccountName = "Interest Income", AccountType = "Income", AccountGroup = "Indirect Income", ParentAccountCode = "4500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4502", AccountName = "Other Income", AccountType = "Income", AccountGroup = "Indirect Income", ParentAccountCode = "4500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "4503", AccountName = "Discount Received", AccountType = "Income", AccountGroup = "Indirect Income", ParentAccountCode = "4500", Level = 2, CreatedAt = now, CreatedBy = userId });

            // ══════════════════════════════════════════════════════
            // EXPENSES (5000-5999)
            // ══════════════════════════════════════════════════════

            // Direct Expenses
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5000", AccountName = "Direct Expenses", AccountType = "Expense", AccountGroup = "Direct Expenses", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5001", AccountName = "Purchase", AccountType = "Expense", AccountGroup = "Direct Expenses", ParentAccountCode = "5000", Level = 2, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5002", AccountName = "Freight Inward", AccountType = "Expense", AccountGroup = "Direct Expenses", ParentAccountCode = "5000", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5003", AccountName = "Manufacturing Expenses", AccountType = "Expense", AccountGroup = "Direct Expenses", ParentAccountCode = "5000", Level = 2, CreatedAt = now, CreatedBy = userId });

            // Indirect Expenses
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5500", AccountName = "Indirect Expenses", AccountType = "Expense", AccountGroup = "Indirect Expenses", IsGroup = true, Level = 1, IsSystemAccount = true, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5501", AccountName = "Salary & Wages", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5502", AccountName = "Rent", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5503", AccountName = "Electricity", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5504", AccountName = "Telephone & Internet", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5505", AccountName = "Office Expenses", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5506", AccountName = "Printing & Stationery", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5507", AccountName = "Travelling Expenses", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5508", AccountName = "Depreciation", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5509", AccountName = "Bank Charges", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5510", AccountName = "Interest Expense", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5511", AccountName = "Discount Given", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });
            accounts.Add(new ChartOfAccount { CompanyId = companyId, AccountCode = "5512", AccountName = "Bad Debts", AccountType = "Expense", AccountGroup = "Indirect Expenses", ParentAccountCode = "5500", Level = 2, CreatedAt = now, CreatedBy = userId });

            return accounts;
        }
    }
}
