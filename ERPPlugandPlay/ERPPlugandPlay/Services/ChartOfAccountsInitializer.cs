using ERPPlugandPlay.Data;
using ERPPlugandPlay.Helpers;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IChartOfAccountsInitializer
    {
        Task InitializeForCompanyAsync(int companyId);
    }

    public class ChartOfAccountsInitializer : IChartOfAccountsInitializer
    {
        private readonly ERPDbContext _db;
        public ChartOfAccountsInitializer(ERPDbContext db) => _db = db;

        public async Task InitializeForCompanyAsync(int companyId)
        {
            // Skip if already initialized
            if (await _db.ChartOfAccounts.AnyAsync(a => a.CompanyId == companyId)) return;

            var accounts = new List<ChartOfAccount>
            {
                // ── ASSETS ────────────────────────────────────────────
                new() { CompanyId=companyId, AccountCode="1000", AccountName="Assets",              AccountType="Asset",     AccountGroup="Assets",              IsGroup=true,  Level=1, IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="1100", AccountName="Current Assets",      AccountType="Asset",     AccountGroup="Current Assets",      IsGroup=true,  Level=2, ParentAccountCode="1000", IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="1110", AccountName="Cash Account",        AccountType="Asset",     AccountGroup="Cash",                IsGroup=false, Level=3, ParentAccountCode="1100", IsSystemAccount=true, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="1120", AccountName="Bank Account",        AccountType="Asset",     AccountGroup="Bank",                IsGroup=false, Level=3, ParentAccountCode="1100", IsSystemAccount=true, IsBankAccount=true, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="1130", AccountName="Accounts Receivable", AccountType="Asset",     AccountGroup="Accounts Receivable", IsGroup=false, Level=3, ParentAccountCode="1100", IsSystemAccount=true, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="1140", AccountName="Inventory Account",   AccountType="Asset",     AccountGroup="Inventory",           IsGroup=false, Level=3, ParentAccountCode="1100", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="1150", AccountName="Prepaid Expenses",    AccountType="Asset",     AccountGroup="Current Assets",      IsGroup=false, Level=3, ParentAccountCode="1100", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="1200", AccountName="Fixed Assets",        AccountType="Asset",     AccountGroup="Fixed Assets",        IsGroup=true,  Level=2, ParentAccountCode="1000", IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="1210", AccountName="Property & Equipment",AccountType="Asset",     AccountGroup="Fixed Assets",        IsGroup=false, Level=3, ParentAccountCode="1200", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="1220", AccountName="Accumulated Depreciation",AccountType="Asset", AccountGroup="Fixed Assets",       IsGroup=false, Level=3, ParentAccountCode="1200", IsSystemAccount=false, OpeningBalanceType="Credit" },

                // ── LIABILITIES ───────────────────────────────────────
                new() { CompanyId=companyId, AccountCode="2000", AccountName="Liabilities",         AccountType="Liability", AccountGroup="Liabilities",         IsGroup=true,  Level=1, IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="2100", AccountName="Current Liabilities", AccountType="Liability", AccountGroup="Current Liabilities", IsGroup=true,  Level=2, ParentAccountCode="2000", IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="2110", AccountName="Accounts Payable",    AccountType="Liability", AccountGroup="Accounts Payable",    IsGroup=false, Level=3, ParentAccountCode="2100", IsSystemAccount=true, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="2120", AccountName="Salary Payable",      AccountType="Liability", AccountGroup="Current Liabilities", IsGroup=false, Level=3, ParentAccountCode="2100", IsSystemAccount=false, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="2130", AccountName="Tax Payable",         AccountType="Liability", AccountGroup="Current Liabilities", IsGroup=false, Level=3, ParentAccountCode="2100", IsSystemAccount=false, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="2140", AccountName="GST Payable",         AccountType="Liability", AccountGroup="Current Liabilities", IsGroup=false, Level=3, ParentAccountCode="2100", IsSystemAccount=false, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="2200", AccountName="Long-term Liabilities",AccountType="Liability",AccountGroup="Long-term Liabilities",IsGroup=true, Level=2, ParentAccountCode="2000", IsSystemAccount=false },
                new() { CompanyId=companyId, AccountCode="2210", AccountName="Bank Loan",           AccountType="Liability", AccountGroup="Long-term Liabilities",IsGroup=false,Level=3, ParentAccountCode="2200", IsSystemAccount=false, OpeningBalanceType="Credit" },

                // ── EQUITY ────────────────────────────────────────────
                new() { CompanyId=companyId, AccountCode="3000", AccountName="Equity",              AccountType="Equity",    AccountGroup="Equity",              IsGroup=true,  Level=1, IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="3100", AccountName="Owner's Capital",     AccountType="Equity",    AccountGroup="Equity",              IsGroup=false, Level=2, ParentAccountCode="3000", IsSystemAccount=false, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="3200", AccountName="Retained Earnings",   AccountType="Equity",    AccountGroup="Equity",              IsGroup=false, Level=2, ParentAccountCode="3000", IsSystemAccount=true, OpeningBalanceType="Credit" },

                // ── INCOME ────────────────────────────────────────────
                new() { CompanyId=companyId, AccountCode="4000", AccountName="Income",              AccountType="Income",    AccountGroup="Income",              IsGroup=true,  Level=1, IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="4100", AccountName="Sales Account",       AccountType="Income",    AccountGroup="Sales",               IsGroup=false, Level=2, ParentAccountCode="4000", IsSystemAccount=true, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="4200", AccountName="Service Revenue",     AccountType="Income",    AccountGroup="Sales",               IsGroup=false, Level=2, ParentAccountCode="4000", IsSystemAccount=false, OpeningBalanceType="Credit" },
                new() { CompanyId=companyId, AccountCode="4300", AccountName="Other Income",        AccountType="Income",    AccountGroup="Other Income",        IsGroup=false, Level=2, ParentAccountCode="4000", IsSystemAccount=false, OpeningBalanceType="Credit" },

                // ── EXPENSES ──────────────────────────────────────────
                new() { CompanyId=companyId, AccountCode="5000", AccountName="Expenses",            AccountType="Expense",   AccountGroup="Expenses",            IsGroup=true,  Level=1, IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="5100", AccountName="Direct Expenses",     AccountType="Expense",   AccountGroup="Direct Expenses",     IsGroup=true,  Level=2, ParentAccountCode="5000", IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="5110", AccountName="Purchase Account",    AccountType="Expense",   AccountGroup="Purchase",            IsGroup=false, Level=3, ParentAccountCode="5100", IsSystemAccount=true, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="5120", AccountName="Cost of Goods Sold",  AccountType="Expense",   AccountGroup="Direct Expenses",     IsGroup=false, Level=3, ParentAccountCode="5100", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="5200", AccountName="Indirect Expenses",   AccountType="Expense",   AccountGroup="Indirect Expenses",   IsGroup=true,  Level=2, ParentAccountCode="5000", IsSystemAccount=true },
                new() { CompanyId=companyId, AccountCode="5210", AccountName="Salary Expense",      AccountType="Expense",   AccountGroup="Indirect Expenses",   IsGroup=false, Level=3, ParentAccountCode="5200", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="5220", AccountName="Rent Expense",        AccountType="Expense",   AccountGroup="Indirect Expenses",   IsGroup=false, Level=3, ParentAccountCode="5200", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="5230", AccountName="Utilities Expense",   AccountType="Expense",   AccountGroup="Indirect Expenses",   IsGroup=false, Level=3, ParentAccountCode="5200", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="5240", AccountName="Freight Charges",     AccountType="Expense",   AccountGroup="Indirect Expenses",   IsGroup=false, Level=3, ParentAccountCode="5200", IsSystemAccount=false, OpeningBalanceType="Debit" },
                new() { CompanyId=companyId, AccountCode="5250", AccountName="Depreciation Expense",AccountType="Expense",   AccountGroup="Indirect Expenses",   IsGroup=false, Level=3, ParentAccountCode="5200", IsSystemAccount=false, OpeningBalanceType="Debit" },
            };

            _db.ChartOfAccounts.AddRange(accounts);

            // Create default financial year with FYCode
            var currentYear = DateTime.UtcNow.Year;
            var startDate = new DateTime(currentYear, 4, 1);
            var endDate   = new DateTime(currentYear + 1, 3, 31);
            _db.FinancialYears.Add(new FinancialYear
            {
                CompanyId = companyId,
                FYCode    = FYCodeGenerator.Generate(companyId, startDate, endDate),
                YearName  = $"FY {currentYear}-{(currentYear + 1) % 100:D2}",
                StartDate = startDate,
                EndDate   = endDate,
                IsActive  = true,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
        }
    }
}
