using ERPPlugandPlay.Data;
using ERPPlugandPlay.Models;
using ERPPlugandPlay.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IAccountingService
    {
        Task<JournalVoucher> CreateJournalEntryAsync(CreateJournalVoucherDto dto, int userId);
        Task<JournalVoucher> PostJournalVoucherAsync(int voucherId, int userId);
        Task<bool> ValidateDoubleEntryAsync(List<JournalEntryDto> entries);
        Task<string> GenerateVoucherNumberAsync(int companyId, string voucherType, DateTime voucherDate);
        Task<decimal> GetAccountBalanceAsync(int accountId, DateTime? asOnDate = null);
        Task<AccountLedgerDto> GetAccountLedgerAsync(int accountId, DateTime fromDate, DateTime toDate);
        Task<TrialBalanceDto> GetTrialBalanceAsync(int companyId, int financialYearId, DateTime asOnDate);
        Task<bool> ValidateFinancialYearAsync(int financialYearId, DateTime transactionDate);
    }

    public class AccountingService : IAccountingService
    {
        private readonly ERPDbContext _context;

        public AccountingService(ERPDbContext context)
        {
            _context = context;
        }

        public async Task<JournalVoucher> CreateJournalEntryAsync(CreateJournalVoucherDto dto, int userId)
        {
            // Validate double entry
            if (!await ValidateDoubleEntryAsync(dto.Entries))
            {
                throw new Exception("Total Debit must equal Total Credit");
            }

            // Validate financial year
            if (!await ValidateFinancialYearAsync(dto.FinancialYearId, dto.VoucherDate))
            {
                throw new Exception("Transaction date is outside the financial year or year is closed");
            }

            // Validate group accounts
            var accountIds = dto.Entries.Select(e => e.AccountId).ToList();
            var groupAccounts = await _context.ChartOfAccounts
                .Where(a => accountIds.Contains(a.Id) && a.IsGroup)
                .Select(a => a.AccountName)
                .ToListAsync();

            if (groupAccounts.Any())
            {
                throw new Exception($"Cannot post to group accounts: {string.Join(", ", groupAccounts)}");
            }

            // Generate voucher number
            var voucherNumber = await GenerateVoucherNumberAsync(dto.CompanyId, dto.VoucherType, dto.VoucherDate);

            // Calculate totals
            var totalDebit = dto.Entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
            var totalCredit = dto.Entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);

            var voucher = new JournalVoucher
            {
                CompanyId = dto.CompanyId,
                FinancialYearId = dto.FinancialYearId,
                BranchId = dto.BranchId,
                VoucherNumber = voucherNumber,
                VoucherType = dto.VoucherType,
                VoucherDate = dto.VoucherDate,
                ReferenceNumber = dto.ReferenceNumber,
                ReferenceType = dto.ReferenceType,
                ReferenceId = dto.ReferenceId,
                Description = dto.Description,
                TotalDebit = totalDebit,
                TotalCredit = totalCredit,
                Status = "Draft",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId
            };

            foreach (var entry in dto.Entries)
            {
                voucher.Entries.Add(new JournalVoucherEntry
                {
                    AccountId = entry.AccountId,
                    Type = entry.Type,
                    Amount = entry.Amount,
                    Narration = entry.Narration,
                    CostCenterId = entry.CostCenterId,
                    ProjectId = entry.ProjectId
                });
            }

            _context.JournalVouchers.Add(voucher);
            await _context.SaveChangesAsync();

            return voucher;
        }

        public async Task<JournalVoucher> PostJournalVoucherAsync(int voucherId, int userId)
        {
            var voucher = await _context.JournalVouchers
                .Include(v => v.Entries)
                .FirstOrDefaultAsync(v => v.Id == voucherId);

            if (voucher == null)
                throw new Exception("Voucher not found");

            if (voucher.Status == "Posted")
                throw new Exception("Voucher is already posted");

            if (voucher.Status == "Cancelled")
                throw new Exception("Cannot post a cancelled voucher");

            voucher.Status = "Posted";
            voucher.PostedAt = DateTime.UtcNow;
            voucher.PostedBy = userId;
            voucher.UpdatedAt = DateTime.UtcNow;
            voucher.UpdatedBy = userId;

            await _context.SaveChangesAsync();

            return voucher;
        }

        public async Task<bool> ValidateDoubleEntryAsync(List<JournalEntryDto> entries)
        {
            var totalDebit = entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
            var totalCredit = entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);

            return Math.Abs(totalDebit - totalCredit) < 0.01m; // Allow for rounding errors
        }

        public async Task<string> GenerateVoucherNumberAsync(int companyId, string voucherType, DateTime voucherDate)
        {
            var prefix = voucherType switch
            {
                "Journal" => "JV",
                "Payment" => "PV",
                "Receipt" => "RV",
                "Contra" => "CV",
                "Sales" => "SV",
                "Purchase" => "PUV",
                _ => "JV"
            };

            var year = voucherDate.Year;
            var month = voucherDate.Month;

            var lastVoucher = await _context.JournalVouchers
                .Where(v => v.CompanyId == companyId && 
                           v.VoucherType == voucherType &&
                           v.VoucherDate.Year == year &&
                           v.VoucherDate.Month == month)
                .OrderByDescending(v => v.Id)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastVoucher != null)
            {
                var parts = lastVoucher.VoucherNumber.Split('-');
                if (parts.Length > 0 && int.TryParse(parts[^1], out int lastSeq))
                {
                    sequence = lastSeq + 1;
                }
            }

            return $"{prefix}-{year}{month:D2}-{sequence:D4}";
        }

        public async Task<decimal> GetAccountBalanceAsync(int accountId, DateTime? asOnDate = null)
        {
            var query = _context.JournalVoucherEntries
                .Include(e => e.JournalVoucher)
                .Where(e => e.AccountId == accountId && e.JournalVoucher.Status == "Posted");

            if (asOnDate.HasValue)
            {
                query = query.Where(e => e.JournalVoucher.VoucherDate <= asOnDate.Value);
            }

            var entries = await query.ToListAsync();

            var totalDebit = entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
            var totalCredit = entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);

            var account = await _context.ChartOfAccounts.FindAsync(accountId);
            if (account == null) return 0;

            // Add opening balance
            if (account.OpeningBalanceType == "Debit")
                totalDebit += account.OpeningBalance;
            else
                totalCredit += account.OpeningBalance;

            // Calculate balance based on account type
            if (account.AccountType == "Asset" || account.AccountType == "Expense")
                return totalDebit - totalCredit;
            else
                return totalCredit - totalDebit;
        }

        public async Task<AccountLedgerDto> GetAccountLedgerAsync(int accountId, DateTime fromDate, DateTime toDate)
        {
            var account = await _context.ChartOfAccounts.FindAsync(accountId);
            if (account == null)
                throw new Exception("Account not found");

            var entries = await _context.JournalVoucherEntries
                .Include(e => e.JournalVoucher)
                .Where(e => e.AccountId == accountId && 
                           e.JournalVoucher.Status == "Posted" &&
                           e.JournalVoucher.VoucherDate >= fromDate &&
                           e.JournalVoucher.VoucherDate <= toDate)
                .OrderBy(e => e.JournalVoucher.VoucherDate)
                .ToListAsync();

            var ledgerEntries = new List<LedgerEntryDto>();
            decimal runningBalance = account.OpeningBalance;

            foreach (var entry in entries)
            {
                if (entry.Type == "Debit")
                    runningBalance += entry.Amount;
                else
                    runningBalance -= entry.Amount;

                ledgerEntries.Add(new LedgerEntryDto
                {
                    Date = entry.JournalVoucher.VoucherDate,
                    VoucherNumber = entry.JournalVoucher.VoucherNumber,
                    VoucherType = entry.JournalVoucher.VoucherType,
                    Narration = entry.Narration ?? entry.JournalVoucher.Description,
                    Debit = entry.Type == "Debit" ? entry.Amount : 0,
                    Credit = entry.Type == "Credit" ? entry.Amount : 0,
                    Balance = runningBalance
                });
            }

            return new AccountLedgerDto
            {
                AccountId = account.Id,
                AccountCode = account.AccountCode,
                AccountName = account.AccountName,
                OpeningBalance = account.OpeningBalance,
                OpeningBalanceType = account.OpeningBalanceType,
                Entries = ledgerEntries,
                ClosingBalance = runningBalance,
                ClosingBalanceType = runningBalance >= 0 ? "Debit" : "Credit"
            };
        }

        public async Task<TrialBalanceDto> GetTrialBalanceAsync(int companyId, int financialYearId, DateTime asOnDate)
        {
            var accounts = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && !a.IsGroup && a.IsActive)
                .ToListAsync();

            var items = new List<TrialBalanceItemDto>();
            decimal totalDebit = 0;
            decimal totalCredit = 0;

            foreach (var account in accounts)
            {
                var balance = await GetAccountBalanceAsync(account.Id, asOnDate);

                if (balance != 0)
                {
                    var item = new TrialBalanceItemDto
                    {
                        AccountCode = account.AccountCode,
                        AccountName = account.AccountName,
                        AccountType = account.AccountType,
                        Debit = balance > 0 ? balance : 0,
                        Credit = balance < 0 ? Math.Abs(balance) : 0
                    };

                    items.Add(item);
                    totalDebit += item.Debit;
                    totalCredit += item.Credit;
                }
            }

            return new TrialBalanceDto
            {
                AsOnDate = asOnDate,
                Items = items.OrderBy(i => i.AccountCode).ToList(),
                TotalDebit = totalDebit,
                TotalCredit = totalCredit
            };
        }

        public async Task<bool> ValidateFinancialYearAsync(int financialYearId, DateTime transactionDate)
        {
            var financialYear = await _context.FinancialYears.FindAsync(financialYearId);
            
            if (financialYear == null)
                return false;

            if (financialYear.IsClosed)
                return false;

            if (transactionDate < financialYear.StartDate || transactionDate > financialYear.EndDate)
                return false;

            return true;
        }
    }
}
