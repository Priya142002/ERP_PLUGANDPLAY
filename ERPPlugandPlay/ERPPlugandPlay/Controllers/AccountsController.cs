using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using ERPPlugandPlay.Services;
using ERPPlugandPlay.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ERPPlugandPlay.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly ERPDbContext _context;
        private readonly IAccountsService _accountsService;

        public AccountsController(ERPDbContext context, IAccountsService accountsService)
        {
            _context = context;
            _accountsService = accountsService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // ══════════════════════════════════════════════════════
        // FINANCIAL YEAR
        // ══════════════════════════════════════════════════════

        [HttpPost("financial-years")]
        public async Task<IActionResult> CreateFinancialYear([FromBody] CreateFinancialYearDto dto)
        {
            // Prevent duplicate FY for same company + same start year
            var duplicate = await _context.FinancialYears
                .AnyAsync(f => f.CompanyId == dto.CompanyId
                            && f.StartDate.Year == dto.StartDate.Year);
            if (duplicate)
                return BadRequest(new { success = false, message = "A financial year starting in that year already exists for this company." });

            var fyCode = FYCodeGenerator.Generate(dto.CompanyId, dto.StartDate, dto.EndDate);

            // Deactivate all other years if this one is set active
            if (dto.IsActive)
            {
                var others = await _context.FinancialYears
                    .Where(f => f.CompanyId == dto.CompanyId).ToListAsync();
                foreach (var o in others) o.IsActive = false;
            }

            var financialYear = new FinancialYear
            {
                CompanyId = dto.CompanyId,
                FYCode    = fyCode,
                YearName  = dto.YearName,
                StartDate = dto.StartDate,
                EndDate   = dto.EndDate,
                IsActive  = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = GetUserId()
            };

            _context.FinancialYears.Add(financialYear);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = MapFY(financialYear) });
        }

        [HttpGet("financial-years/{companyId}")]
        public async Task<IActionResult> GetFinancialYears(int companyId)
        {
            var years = await _context.FinancialYears
                .Where(f => f.CompanyId == companyId)
                .OrderByDescending(f => f.StartDate)
                .ToListAsync();

            return Ok(new { success = true, data = years.Select(MapFY).ToList() });
        }

        private static FinancialYearDto MapFY(FinancialYear f) => new()
        {
            Id        = f.Id,
            CompanyId = f.CompanyId,
            FYCode    = f.FYCode,
            YearName  = f.YearName,
            StartDate = f.StartDate,
            EndDate   = f.EndDate,
            IsActive  = f.IsActive,
            IsClosed  = f.IsClosed,
            ClosedAt  = f.ClosedAt
        };

        [HttpPut("financial-years/{id}/close")]
        public async Task<IActionResult> CloseFinancialYear(int id)
        {
            var year = await _context.FinancialYears.FindAsync(id);
            if (year == null)
                return NotFound(new { success = false, message = "Financial year not found" });

            year.IsClosed = true;
            year.ClosedAt = DateTime.UtcNow;
            year.ClosedBy = GetUserId();

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Financial year closed successfully" });
        }

        /// <summary>
        /// Year-End Rollover:
        ///   1. Closes the current financial year
        ///   2. Creates the next financial year
        ///   3. Carries forward closing balances of Balance Sheet accounts (Assets/Liabilities/Equity)
        ///      as opening balances in the new year
        ///   4. Transfers net P&L to Retained Earnings
        ///   5. Optionally carries forward master data (vendors, customers, accounts, products)
        ///      — they are always company-scoped so they carry forward automatically
        /// </summary>
        [HttpPost("financial-years/{id}/year-end-close")]
        public async Task<IActionResult> YearEndClose(int id, [FromBody] YearEndCloseDto dto)
        {
            var currentYear = await _context.FinancialYears.FindAsync(id);
            if (currentYear == null)
                return NotFound(new { success = false, message = "Financial year not found" });
            if (currentYear.IsClosed)
                return BadRequest(new { success = false, message = "Financial year is already closed" });

            var companyId = currentYear.CompanyId;
            var userId    = GetUserId();

            // ── Step 1: Close current year ────────────────────────────────
            currentYear.IsClosed  = true;
            currentYear.ClosedAt  = DateTime.UtcNow;
            currentYear.ClosedBy  = userId;
            currentYear.IsActive  = false;

            // ── Step 2: Create next financial year ────────────────────────
            var nextStart = currentYear.EndDate.AddDays(1);
            var nextEnd   = nextStart.AddYears(1).AddDays(-1);
            var nextYear  = new FinancialYear
            {
                CompanyId = companyId,
                FYCode    = FYCodeGenerator.Generate(companyId, nextStart, nextEnd),
                YearName  = dto.NewYearName ?? $"FY {nextStart.Year}-{nextEnd.Year % 100:D2}",
                StartDate = nextStart,
                EndDate   = nextEnd,
                IsActive  = true,
                IsClosed  = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId
            };
            _context.FinancialYears.Add(nextYear);
            await _context.SaveChangesAsync(); // get nextYear.Id

            // ── Step 3: Calculate closing balances for B/S accounts ───────
            var bsAccounts = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && !a.IsGroup && a.IsActive
                         && (a.AccountType == "Asset" || a.AccountType == "Liability" || a.AccountType == "Equity"))
                .ToListAsync();

            var openingBalances = new List<AccountOpeningBalance>();

            foreach (var acc in bsAccounts)
            {
                var entries = await _context.JournalVoucherEntries
                    .Include(e => e.JournalVoucher)
                    .Where(e => e.AccountId == acc.Id
                             && e.JournalVoucher.Status == "Posted"
                             && e.JournalVoucher.VoucherDate >= currentYear.StartDate
                             && e.JournalVoucher.VoucherDate <= currentYear.EndDate)
                    .ToListAsync();

                var debit  = entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
                var credit = entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);

                // Net balance considering opening balance
                decimal openingDebit  = acc.OpeningBalanceType == "Debit"  ? acc.OpeningBalance : 0;
                decimal openingCredit = acc.OpeningBalanceType == "Credit" ? acc.OpeningBalance : 0;

                var totalDebit  = openingDebit  + debit;
                var totalCredit = openingCredit + credit;

                decimal closingBalance;
                string  closingType;

                if (acc.AccountType == "Asset" || acc.AccountType == "Expense")
                {
                    closingBalance = totalDebit - totalCredit;
                    closingType    = closingBalance >= 0 ? "Debit" : "Credit";
                }
                else
                {
                    closingBalance = totalCredit - totalDebit;
                    closingType    = closingBalance >= 0 ? "Credit" : "Debit";
                }

                if (Math.Abs(closingBalance) < 0.01m) continue;

                openingBalances.Add(new AccountOpeningBalance
                {
                    CompanyId       = companyId,
                    FinancialYearId = nextYear.Id,
                    AccountId       = acc.Id,
                    OpeningBalance  = Math.Abs(closingBalance),
                    BalanceType     = closingType,
                    CreatedAt       = DateTime.UtcNow
                });

                // Also update the account's opening balance for quick access
                acc.OpeningBalance     = Math.Abs(closingBalance);
                acc.OpeningBalanceType = closingType;
            }

            if (openingBalances.Any())
                _context.AccountOpeningBalances.AddRange(openingBalances);

            // ── Step 4: Transfer net P&L to Retained Earnings ─────────────
            var incomeAccounts  = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && !a.IsGroup && a.AccountType == "Income").ToListAsync();
            var expenseAccounts = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && !a.IsGroup && a.AccountType == "Expense").ToListAsync();

            decimal totalIncome = 0, totalExpense = 0;

            foreach (var acc in incomeAccounts)
            {
                var entries = await _context.JournalVoucherEntries
                    .Include(e => e.JournalVoucher)
                    .Where(e => e.AccountId == acc.Id && e.JournalVoucher.Status == "Posted"
                             && e.JournalVoucher.VoucherDate >= currentYear.StartDate
                             && e.JournalVoucher.VoucherDate <= currentYear.EndDate)
                    .ToListAsync();
                totalIncome += entries.Where(e => e.Type == "Credit").Sum(e => e.Amount)
                             - entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
            }

            foreach (var acc in expenseAccounts)
            {
                var entries = await _context.JournalVoucherEntries
                    .Include(e => e.JournalVoucher)
                    .Where(e => e.AccountId == acc.Id && e.JournalVoucher.Status == "Posted"
                             && e.JournalVoucher.VoucherDate >= currentYear.StartDate
                             && e.JournalVoucher.VoucherDate <= currentYear.EndDate)
                    .ToListAsync();
                totalExpense += entries.Where(e => e.Type == "Debit").Sum(e => e.Amount)
                              - entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);
            }

            var netProfit = totalIncome - totalExpense;

            // Post closing entry to Retained Earnings
            var retainedEarningsAcc = await _context.ChartOfAccounts
                .FirstOrDefaultAsync(a => a.CompanyId == companyId && a.AccountCode == "3200");

            if (retainedEarningsAcc != null && Math.Abs(netProfit) > 0.01m)
            {
                retainedEarningsAcc.OpeningBalance += Math.Abs(netProfit);
                retainedEarningsAcc.OpeningBalanceType = netProfit >= 0 ? "Credit" : "Debit";
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = $"Year-end close completed. New financial year '{nextYear.YearName}' created.",
                data = new
                {
                    closedYearId    = currentYear.Id,
                    closedYearName  = currentYear.YearName,
                    closedYearFYCode= currentYear.FYCode,
                    newYearId       = nextYear.Id,
                    newYearName     = nextYear.YearName,
                    newYearFYCode   = nextYear.FYCode,
                    newYearStart    = nextYear.StartDate,
                    newYearEnd      = nextYear.EndDate,
                    openingBalancesCarriedForward = openingBalances.Count,
                    netProfitTransferred = netProfit,
                    vendorsCarriedForward   = dto.CarryForwardVendors,
                    customersCarriedForward = dto.CarryForwardCustomers,
                    productsCarriedForward  = dto.CarryForwardProducts,
                    accountsCarriedForward  = dto.CarryForwardAccounts
                }
            });
        }

        [HttpPut("financial-years/{id}/set-active")]
        public async Task<IActionResult> SetActiveFinancialYear(int id)
        {
            var year = await _context.FinancialYears.FindAsync(id);
            if (year == null)
                return NotFound(new { success = false, message = "Financial year not found" });

            // Deactivate all other years for this company
            var others = await _context.FinancialYears
                .Where(f => f.CompanyId == year.CompanyId && f.Id != id)
                .ToListAsync();
            foreach (var other in others) other.IsActive = false;

            year.IsActive = true;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = $"'{year.YearName}' is now the active financial year" });
        }

        // ══════════════════════════════════════════════════════
        // CHART OF ACCOUNTS
        // ══════════════════════════════════════════════════════

        [HttpPost("chart")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
        {
            // Check if account code already exists
            var exists = await _context.ChartOfAccounts
                .AnyAsync(a => a.CompanyId == dto.CompanyId && a.AccountCode == dto.AccountCode);

            if (exists)
                return BadRequest(new { success = false, message = "Account code already exists" });

            var account = new ChartOfAccount
            {
                CompanyId = dto.CompanyId,
                AccountCode = dto.AccountCode,
                AccountName = dto.AccountName,
                AccountType = dto.AccountType,
                AccountGroup = dto.AccountGroup,
                ParentAccountCode = dto.ParentAccountCode,
                IsGroup = dto.IsGroup,
                Level = dto.Level,
                OpeningBalance = dto.OpeningBalance,
                OpeningBalanceType = dto.OpeningBalanceType,
                Currency = dto.Currency,
                TaxType = dto.TaxType,
                IsBankAccount = dto.IsBankAccount,
                IsSystemAccount = dto.IsSystemAccount,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = GetUserId()
            };

            _context.ChartOfAccounts.Add(account);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = account });
        }

        [HttpGet("chart/{companyId}")]
        public async Task<IActionResult> GetChartOfAccounts(int companyId)
        {
            var accounts = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId)
                .OrderBy(a => a.AccountCode)
                .Select(a => new AccountDto
                {
                    Id = a.Id,
                    CompanyId = a.CompanyId,
                    AccountCode = a.AccountCode,
                    AccountName = a.AccountName,
                    AccountType = a.AccountType,
                    AccountGroup = a.AccountGroup,
                    ParentAccountCode = a.ParentAccountCode,
                    IsGroup = a.IsGroup,
                    Level = a.Level,
                    OpeningBalance = a.OpeningBalance,
                    OpeningBalanceType = a.OpeningBalanceType,
                    Currency = a.Currency,
                    TaxType = a.TaxType,
                    IsBankAccount = a.IsBankAccount,
                    IsSystemAccount = a.IsSystemAccount,
                    IsActive = a.IsActive,
                    CurrentBalance = 0 // Will be calculated separately if needed
                })
                .ToListAsync();

            return Ok(new { success = true, data = accounts });
        }

        [HttpGet("chart/detail/{id}")]
        public async Task<IActionResult> GetAccountDetail(int id)
        {
            var account = await _context.ChartOfAccounts.FindAsync(id);
            if (account == null)
                return NotFound(new { success = false, message = "Account not found" });

            var balance = await _accountsService.GetAccountBalanceAsync(id);

            var dto = new AccountDto
            {
                Id = account.Id,
                CompanyId = account.CompanyId,
                AccountCode = account.AccountCode,
                AccountName = account.AccountName,
                AccountType = account.AccountType,
                AccountGroup = account.AccountGroup,
                ParentAccountCode = account.ParentAccountCode,
                IsGroup = account.IsGroup,
                Level = account.Level,
                OpeningBalance = account.OpeningBalance,
                OpeningBalanceType = account.OpeningBalanceType,
                Currency = account.Currency,
                TaxType = account.TaxType,
                IsBankAccount = account.IsBankAccount,
                IsSystemAccount = account.IsSystemAccount,
                IsActive = account.IsActive,
                CurrentBalance = balance
            };

            return Ok(new { success = true, data = dto });
        }

        [HttpPut("chart/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountDto dto)
        {
            var account = await _context.ChartOfAccounts.FindAsync(id);
            if (account == null)
                return NotFound(new { success = false, message = "Account not found" });

            if (account.IsSystemAccount)
                return BadRequest(new { success = false, message = "Cannot modify system account" });

            account.AccountName = dto.AccountName;
            account.AccountGroup = dto.AccountGroup;
            account.ParentAccountCode = dto.ParentAccountCode;
            account.IsGroup = dto.IsGroup;
            account.OpeningBalance = dto.OpeningBalance;
            account.OpeningBalanceType = dto.OpeningBalanceType;
            account.TaxType = dto.TaxType;
            account.IsBankAccount = dto.IsBankAccount;
            account.IsActive = dto.IsActive;
            account.UpdatedAt = DateTime.UtcNow;
            account.UpdatedBy = GetUserId();

            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = account });
        }

        [HttpDelete("chart/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var account = await _context.ChartOfAccounts.FindAsync(id);
            if (account == null)
                return NotFound(new { success = false, message = "Account not found" });

            if (account.IsSystemAccount)
                return BadRequest(new { success = false, message = "Cannot delete system account" });

            // Check if account has transactions
            var hasTransactions = await _context.JournalVoucherEntries
                .AnyAsync(e => e.AccountId == id);

            if (hasTransactions)
                return BadRequest(new { success = false, message = "Cannot delete account with transactions" });

            _context.ChartOfAccounts.Remove(account);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Account deleted successfully" });
        }

        // ══════════════════════════════════════════════════════
        // JOURNAL VOUCHERS
        // ══════════════════════════════════════════════════════

        [HttpPost("journal-vouchers")]
        public async Task<IActionResult> CreateJournalVoucher([FromBody] CreateJournalVoucherDto dto)
        {
            try
            {
                var voucher = await _accountsService.CreateJournalEntryAsync(dto, GetUserId());
                return Ok(new { success = true, data = voucher });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("journal-vouchers/{companyId}")]
        public async Task<IActionResult> GetJournalVouchers(int companyId, [FromQuery] string? status = null)
        {
            var query = _context.JournalVouchers
                .Include(v => v.FinancialYear)
                .Include(v => v.Branch)
                .Include(v => v.Entries)
                    .ThenInclude(e => e.Account)
                .Where(v => v.CompanyId == companyId);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(v => v.Status == status);

            var vouchers = await query
                .OrderByDescending(v => v.VoucherDate)
                .Select(v => new JournalVoucherDto
                {
                    Id = v.Id,
                    CompanyId = v.CompanyId,
                    FinancialYearId = v.FinancialYearId,
                    FinancialYearName = v.FinancialYear.YearName,
                    BranchId = v.BranchId,
                    BranchName = v.Branch != null ? v.Branch.BranchName : null,
                    VoucherNumber = v.VoucherNumber,
                    VoucherType = v.VoucherType,
                    VoucherDate = v.VoucherDate,
                    ReferenceNumber = v.ReferenceNumber,
                    ReferenceType = v.ReferenceType,
                    ReferenceId = v.ReferenceId,
                    Description = v.Description,
                    TotalDebit = v.TotalDebit,
                    TotalCredit = v.TotalCredit,
                    Status = v.Status,
                    PostedAt = v.PostedAt,
                    CreatedAt = v.CreatedAt,
                    Entries = v.Entries.Select(e => new JournalEntryResultDto
                    {
                        Id = e.Id,
                        AccountId = e.AccountId,
                        AccountName = e.Account.AccountName,
                        AccountCode = e.Account.AccountCode,
                        Type = e.Type,
                        Amount = e.Amount,
                        Narration = e.Narration,
                        CostCenterId = e.CostCenterId,
                        ProjectId = e.ProjectId
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new { success = true, data = vouchers });
        }

        [HttpGet("journal-vouchers/detail/{id}")]
        public async Task<IActionResult> GetJournalVoucherDetail(int id)
        {
            var voucher = await _context.JournalVouchers
                .Include(v => v.FinancialYear)
                .Include(v => v.Branch)
                .Include(v => v.Entries)
                    .ThenInclude(e => e.Account)
                .Include(v => v.Entries)
                    .ThenInclude(e => e.CostCenter)
                .Include(v => v.Entries)
                    .ThenInclude(e => e.Project)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (voucher == null)
                return NotFound(new { success = false, message = "Voucher not found" });

            var dto = new JournalVoucherDto
            {
                Id = voucher.Id,
                CompanyId = voucher.CompanyId,
                FinancialYearId = voucher.FinancialYearId,
                FinancialYearName = voucher.FinancialYear.YearName,
                BranchId = voucher.BranchId,
                BranchName = voucher.Branch?.BranchName,
                VoucherNumber = voucher.VoucherNumber,
                VoucherType = voucher.VoucherType,
                VoucherDate = voucher.VoucherDate,
                ReferenceNumber = voucher.ReferenceNumber,
                ReferenceType = voucher.ReferenceType,
                ReferenceId = voucher.ReferenceId,
                Description = voucher.Description,
                TotalDebit = voucher.TotalDebit,
                TotalCredit = voucher.TotalCredit,
                Status = voucher.Status,
                PostedAt = voucher.PostedAt,
                CreatedAt = voucher.CreatedAt,
                Entries = voucher.Entries.Select(e => new JournalEntryResultDto
                {
                    Id = e.Id,
                    AccountId = e.AccountId,
                    AccountName = e.Account.AccountName,
                    AccountCode = e.Account.AccountCode,
                    Type = e.Type,
                    Amount = e.Amount,
                    Narration = e.Narration,
                    CostCenterId = e.CostCenterId,
                    CostCenterName = e.CostCenter?.CostCenterName,
                    ProjectId = e.ProjectId,
                    ProjectName = e.Project?.ProjectName
                }).ToList()
            };

            return Ok(new { success = true, data = dto });
        }

        [HttpPut("journal-vouchers/{id}/post")]
        public async Task<IActionResult> PostJournalVoucher(int id)
        {
            try
            {
                var voucher = await _accountsService.PostJournalVoucherAsync(id, GetUserId());
                return Ok(new { success = true, message = "Voucher posted successfully", data = voucher });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("journal-vouchers/{id}/cancel")]
        public async Task<IActionResult> CancelJournalVoucher(int id, [FromBody] string reason)
        {
            var voucher = await _context.JournalVouchers.FindAsync(id);
            if (voucher == null)
                return NotFound(new { success = false, message = "Voucher not found" });

            if (voucher.Status == "Cancelled")
                return BadRequest(new { success = false, message = "Voucher is already cancelled" });

            voucher.Status = "Cancelled";
            voucher.CancelledAt = DateTime.UtcNow;
            voucher.CancelledBy = GetUserId();
            voucher.CancellationReason = reason;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Voucher cancelled successfully" });
        }

        // ══════════════════════════════════════════════════════
        // REPORTS
        // ══════════════════════════════════════════════════════

        [HttpGet("ledger/{accountId}")]
        public async Task<IActionResult> GetAccountLedger(int accountId, [FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            try
            {
                var ledger = await _accountsService.GetAccountLedgerAsync(accountId, fromDate, toDate);
                return Ok(new { success = true, data = ledger });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("trial-balance/{companyId}/{financialYearId}")]
        public async Task<IActionResult> GetTrialBalance(int companyId, int financialYearId, [FromQuery] DateTime asOnDate)
        {
            try
            {
                var trialBalance = await _accountsService.GetTrialBalanceAsync(companyId, financialYearId, asOnDate);
                return Ok(new { success = true, data = trialBalance });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("balance/{accountId}")]
        public async Task<IActionResult> GetAccountBalance(int accountId, [FromQuery] DateTime? asOnDate = null)
        {
            try
            {
                var balance = await _accountsService.GetAccountBalanceAsync(accountId, asOnDate);
                return Ok(new { success = true, data = new { accountId, balance, asOnDate = asOnDate ?? DateTime.UtcNow } });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // ══════════════════════════════════════════════════════
        // BANK ACCOUNTS
        // ══════════════════════════════════════════════════════

        [HttpPost("bank-accounts")]
        public async Task<IActionResult> CreateBankAccount([FromBody] CreateBankAccountDto dto)
        {
            var bankAccount = new BankAccount
            {
                CompanyId = dto.CompanyId,
                AccountId = dto.AccountId,
                BankName = dto.BankName,
                BranchName = dto.BranchName,
                AccountNumber = dto.AccountNumber,
                IFSCCode = dto.IFSCCode,
                SwiftCode = dto.SwiftCode,
                AccountType = dto.AccountType,
                OpeningBalance = dto.OpeningBalance,
                CurrentBalance = dto.OpeningBalance,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = GetUserId()
            };

            _context.BankAccounts.Add(bankAccount);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = bankAccount });
        }

        [HttpGet("bank-accounts/{companyId}")]
        public async Task<IActionResult> GetBankAccounts(int companyId)
        {
            var bankAccounts = await _context.BankAccounts
                .Include(b => b.Account)
                .Where(b => b.CompanyId == companyId)
                .Select(b => new BankAccountDto
                {
                    Id = b.Id,
                    CompanyId = b.CompanyId,
                    AccountId = b.AccountId,
                    AccountName = b.Account.AccountName,
                    BankName = b.BankName,
                    BranchName = b.BranchName,
                    AccountNumber = b.AccountNumber,
                    IFSCCode = b.IFSCCode,
                    SwiftCode = b.SwiftCode,
                    AccountType = b.AccountType,
                    OpeningBalance = b.OpeningBalance,
                    CurrentBalance = b.CurrentBalance,
                    IsActive = b.IsActive
                })
                .ToListAsync();

            return Ok(new { success = true, data = bankAccounts });
        }

        // ══════════════════════════════════════════════════════
        // PAYMENT MODES
        // ══════════════════════════════════════════════════════

        [HttpPost("payment-modes")]
        public async Task<IActionResult> CreatePaymentMode([FromBody] CreatePaymentModeDto dto)
        {
            var paymentMode = new PaymentMode
            {
                CompanyId = dto.CompanyId,
                ModeName = dto.ModeName,
                Description = dto.Description,
                DefaultAccountId = dto.DefaultAccountId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = GetUserId()
            };

            _context.PaymentModes.Add(paymentMode);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = paymentMode });
        }

        [HttpGet("payment-modes/{companyId}")]
        public async Task<IActionResult> GetPaymentModes(int companyId)
        {
            var modes = await _context.PaymentModes
                .Include(p => p.DefaultAccount)
                .Where(p => p.CompanyId == companyId)
                .Select(p => new PaymentModeDto
                {
                    Id = p.Id,
                    CompanyId = p.CompanyId,
                    ModeName = p.ModeName,
                    Description = p.Description,
                    DefaultAccountId = p.DefaultAccountId,
                    DefaultAccountName = p.DefaultAccount != null ? p.DefaultAccount.AccountName : null,
                    IsActive = p.IsActive
                })
                .ToListAsync();

            return Ok(new { success = true, data = modes });
        }

        // ══════════════════════════════════════════════════════
        // COST CENTERS
        // ══════════════════════════════════════════════════════

        [HttpPost("cost-centers")]
        public async Task<IActionResult> CreateCostCenter([FromBody] CreateCostCenterDto dto)
        {
            var costCenter = new CostCenter
            {
                CompanyId = dto.CompanyId,
                CostCenterCode = dto.CostCenterCode,
                CostCenterName = dto.CostCenterName,
                Description = dto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = GetUserId()
            };

            _context.CostCenters.Add(costCenter);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = costCenter });
        }

        [HttpGet("cost-centers/{companyId}")]
        public async Task<IActionResult> GetCostCenters(int companyId)
        {
            var costCenters = await _context.CostCenters
                .Where(c => c.CompanyId == companyId)
                .Select(c => new CostCenterDto
                {
                    Id = c.Id,
                    CompanyId = c.CompanyId,
                    CostCenterCode = c.CostCenterCode,
                    CostCenterName = c.CostCenterName,
                    Description = c.Description,
                    IsActive = c.IsActive
                })
                .ToListAsync();

            return Ok(new { success = true, data = costCenters });
        }

        // ══════════════════════════════════════════════════════
        // PAYMENT & RECEIPT VOUCHERS
        // ══════════════════════════════════════════════════════

        [HttpPost("payment-vouchers")]
        public async Task<IActionResult> CreatePaymentVoucher([FromBody] CreatePaymentVoucherDto dto)
        {
            var result = await _accountsService.CreatePaymentVoucherAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("payment-vouchers/{companyId}")]
        public async Task<IActionResult> GetPaymentVouchers(int companyId)
        {
            var result = await _accountsService.ListPaymentVouchersAsync(companyId);
            return Ok(result);
        }

        [HttpPost("receipt-vouchers")]
        public async Task<IActionResult> CreateReceiptVoucher([FromBody] CreateReceiptVoucherDto dto)
        {
            var result = await _accountsService.CreateReceiptVoucherAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("receipt-vouchers/{companyId}")]
        public async Task<IActionResult> GetReceiptVouchers(int companyId)
        {
            var result = await _accountsService.ListReceiptVouchersAsync(companyId);
            return Ok(result);
        }

        // ══════════════════════════════════════════════════════
        // PROFIT & LOSS REPORT
        // ══════════════════════════════════════════════════════

        [HttpGet("profit-loss/{companyId}")]
        public async Task<IActionResult> GetProfitLoss(int companyId, [FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            var accounts = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && !a.IsGroup && a.IsActive
                         && (a.AccountType == "Income" || a.AccountType == "Expense"))
                .ToListAsync();

            var incomeLines  = new List<ProfitLossLineDto>();
            var expenseLines = new List<ProfitLossLineDto>();

            foreach (var acc in accounts)
            {
                var entries = await _context.JournalVoucherEntries
                    .Include(e => e.JournalVoucher)
                    .Where(e => e.AccountId == acc.Id
                             && e.JournalVoucher.Status == "Posted"
                             && e.JournalVoucher.VoucherDate >= fromDate
                             && e.JournalVoucher.VoucherDate <= toDate)
                    .ToListAsync();

                var debit  = entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
                var credit = entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);
                var amount = acc.AccountType == "Income" ? credit - debit : debit - credit;
                if (amount == 0) continue;

                var line = new ProfitLossLineDto
                {
                    AccountCode  = acc.AccountCode,
                    AccountName  = acc.AccountName,
                    AccountGroup = acc.AccountGroup,
                    Amount       = amount
                };

                if (acc.AccountType == "Income")  incomeLines.Add(line);
                else                              expenseLines.Add(line);
            }

            var totalIncome  = incomeLines.Sum(l => l.Amount);
            var totalExpense = expenseLines.Sum(l => l.Amount);

            return Ok(new { success = true, data = new ProfitLossDto
            {
                FromDate     = fromDate,
                ToDate       = toDate,
                IncomeLines  = incomeLines.OrderBy(l => l.AccountCode).ToList(),
                ExpenseLines = expenseLines.OrderBy(l => l.AccountCode).ToList(),
                TotalIncome  = totalIncome,
                TotalExpense = totalExpense,
                NetProfit    = totalIncome - totalExpense
            }});
        }

        // ══════════════════════════════════════════════════════
        // BALANCE SHEET REPORT
        // ══════════════════════════════════════════════════════

        [HttpGet("balance-sheet/{companyId}")]
        public async Task<IActionResult> GetBalanceSheet(int companyId, [FromQuery] DateTime asOnDate)
        {
            var accounts = await _context.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && !a.IsGroup && a.IsActive)
                .ToListAsync();

            var assetLines     = new List<BalanceSheetLineDto>();
            var liabilityLines = new List<BalanceSheetLineDto>();
            var equityLines    = new List<BalanceSheetLineDto>();

            foreach (var acc in accounts)
            {
                var balance = await _accountsService.GetAccountBalanceAsync(acc.Id, asOnDate);
                if (balance == 0) continue;

                var line = new BalanceSheetLineDto
                {
                    AccountCode  = acc.AccountCode,
                    AccountName  = acc.AccountName,
                    AccountGroup = acc.AccountGroup,
                    Balance      = Math.Abs(balance)
                };

                switch (acc.AccountType)
                {
                    case "Asset":     assetLines.Add(line);     break;
                    case "Liability": liabilityLines.Add(line); break;
                    case "Equity":    equityLines.Add(line);    break;
                }
            }

            var totalAssets = assetLines.Sum(l => l.Balance);
            var totalLiabEq = liabilityLines.Sum(l => l.Balance) + equityLines.Sum(l => l.Balance);

            return Ok(new { success = true, data = new BalanceSheetDto
            {
                AsOnDate               = asOnDate,
                Assets                 = assetLines.OrderBy(l => l.AccountCode).ToList(),
                Liabilities            = liabilityLines.OrderBy(l => l.AccountCode).ToList(),
                Equity                 = equityLines.OrderBy(l => l.AccountCode).ToList(),
                TotalAssets            = totalAssets,
                TotalLiabilitiesAndEquity = totalLiabEq
            }});
        }
    }
}
