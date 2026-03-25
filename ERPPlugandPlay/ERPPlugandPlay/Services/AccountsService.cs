using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface IAccountsService
    {
        // Chart of Accounts
        Task<ApiResponse<AccountDto>> CreateAccountAsync(CreateAccountDto dto);
        Task<ApiResponse<List<AccountDto>>> ListAccountsAsync(int companyId);
        Task<ApiResponse<AccountDto>> UpdateAccountAsync(int id, CreateAccountDto dto);
        Task<ApiResponse<bool>> DeleteAccountAsync(int id);

        // Journal Voucher
        Task<ApiResponse<JournalVoucherDto>> CreateJournalVoucherAsync(CreateJournalVoucherDto dto);
        Task<ApiResponse<List<JournalVoucherDto>>> ListJournalVouchersAsync(int companyId);
        Task<ApiResponse<JournalVoucherDto>> GetJournalVoucherAsync(int id);

        // Payment Voucher
        Task<ApiResponse<PaymentVoucherDto>> CreatePaymentVoucherAsync(CreatePaymentVoucherDto dto);
        Task<ApiResponse<List<PaymentVoucherDto>>> ListPaymentVouchersAsync(int companyId);

        // Receipt Voucher
        Task<ApiResponse<ReceiptVoucherDto>> CreateReceiptVoucherAsync(CreateReceiptVoucherDto dto);
        Task<ApiResponse<List<ReceiptVoucherDto>>> ListReceiptVouchersAsync(int companyId);
    }

    public class AccountsService : IAccountsService
    {
        private readonly ERPDbContext _db;
        public AccountsService(ERPDbContext db) => _db = db;

        // ── Chart of Accounts ────────────────────────────────
        public async Task<ApiResponse<AccountDto>> CreateAccountAsync(CreateAccountDto dto)
        {
            var account = new ChartOfAccount
            {
                CompanyId = dto.CompanyId,
                AccountCode = dto.AccountCode,
                AccountName = dto.AccountName,
                AccountType = dto.AccountType,
                ParentAccountCode = dto.ParentAccountCode,
                OpeningBalance = dto.OpeningBalance
            };
            _db.ChartOfAccounts.Add(account);
            await _db.SaveChangesAsync();
            return ApiResponse<AccountDto>.Ok(MapAccount(account), "Account created.");
        }

        public async Task<ApiResponse<List<AccountDto>>> ListAccountsAsync(int companyId)
        {
            var accounts = await _db.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && a.IsActive)
                .OrderBy(a => a.AccountCode)
                .ToListAsync();
            return ApiResponse<List<AccountDto>>.Ok(accounts.Select(MapAccount).ToList());
        }

        public async Task<ApiResponse<AccountDto>> UpdateAccountAsync(int id, CreateAccountDto dto)
        {
            var account = await _db.ChartOfAccounts.FindAsync(id);
            if (account == null) return ApiResponse<AccountDto>.Fail("Account not found.");
            
            account.AccountCode = dto.AccountCode;
            account.AccountName = dto.AccountName;
            account.AccountType = dto.AccountType;
            account.ParentAccountCode = dto.ParentAccountCode;
            account.OpeningBalance = dto.OpeningBalance;
            
            await _db.SaveChangesAsync();
            return ApiResponse<AccountDto>.Ok(MapAccount(account));
        }

        public async Task<ApiResponse<bool>> DeleteAccountAsync(int id)
        {
            var account = await _db.ChartOfAccounts.FindAsync(id);
            if (account == null) return ApiResponse<bool>.Fail("Account not found.");
            account.IsActive = false;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Account deleted.");
        }

        // ── Journal Voucher ──────────────────────────────────
        public async Task<ApiResponse<JournalVoucherDto>> CreateJournalVoucherAsync(CreateJournalVoucherDto dto)
        {
            var voucherNumber = $"JV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            
            var voucher = new JournalVoucher
            {
                CompanyId = dto.CompanyId,
                VoucherNumber = voucherNumber,
                VoucherDate = dto.VoucherDate,
                Description = dto.Description
            };

            decimal totalDebit = 0, totalCredit = 0;
            foreach (var entry in dto.Entries)
            {
                voucher.Entries.Add(new JournalVoucherEntry
                {
                    AccountId = entry.AccountId,
                    Type = entry.Type,
                    Amount = entry.Amount,
                    Narration = entry.Narration
                });

                if (entry.Type == "Debit") totalDebit += entry.Amount;
                else totalCredit += entry.Amount;
            }

            voucher.TotalDebit = totalDebit;
            voucher.TotalCredit = totalCredit;

            if (totalDebit != totalCredit)
                return ApiResponse<JournalVoucherDto>.Fail("Total debit and credit must be equal.");

            _db.JournalVouchers.Add(voucher);
            await _db.SaveChangesAsync();
            return ApiResponse<JournalVoucherDto>.Ok(await GetJournalVoucherDtoAsync(voucher.Id), "Journal voucher created.");
        }

        public async Task<ApiResponse<List<JournalVoucherDto>>> ListJournalVouchersAsync(int companyId)
        {
            var vouchers = await _db.JournalVouchers
                .Include(v => v.Entries).ThenInclude(e => e.Account)
                .Where(v => v.CompanyId == companyId)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();
            return ApiResponse<List<JournalVoucherDto>>.Ok(vouchers.Select(MapJournalVoucher).ToList());
        }

        public async Task<ApiResponse<JournalVoucherDto>> GetJournalVoucherAsync(int id)
            => ApiResponse<JournalVoucherDto>.Ok(await GetJournalVoucherDtoAsync(id));

        // ── Payment Voucher ──────────────────────────────────
        public async Task<ApiResponse<PaymentVoucherDto>> CreatePaymentVoucherAsync(CreatePaymentVoucherDto dto)
        {
            var voucherNumber = $"PV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            
            var voucher = new PaymentVoucher
            {
                CompanyId = dto.CompanyId,
                VoucherNumber = voucherNumber,
                VoucherDate = dto.VoucherDate,
                PayTo = dto.PayTo,
                AccountId = dto.AccountId,
                Amount = dto.Amount,
                PaymentMode = dto.PaymentMode,
                ReferenceNumber = dto.ReferenceNumber,
                Description = dto.Description
            };

            _db.PaymentVouchers.Add(voucher);
            await _db.SaveChangesAsync();

            var account = await _db.ChartOfAccounts.FindAsync(dto.AccountId);
            return ApiResponse<PaymentVoucherDto>.Ok(new PaymentVoucherDto
            {
                Id = voucher.Id,
                CompanyId = voucher.CompanyId,
                VoucherNumber = voucher.VoucherNumber,
                VoucherDate = voucher.VoucherDate,
                PayTo = voucher.PayTo,
                AccountId = voucher.AccountId,
                AccountName = account?.AccountName ?? "",
                Amount = voucher.Amount,
                PaymentMode = voucher.PaymentMode,
                ReferenceNumber = voucher.ReferenceNumber,
                Description = voucher.Description,
                Status = voucher.Status,
                CreatedAt = voucher.CreatedAt
            }, "Payment voucher created.");
        }

        public async Task<ApiResponse<List<PaymentVoucherDto>>> ListPaymentVouchersAsync(int companyId)
        {
            var vouchers = await _db.PaymentVouchers
                .Include(v => v.Account)
                .Where(v => v.CompanyId == companyId)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            return ApiResponse<List<PaymentVoucherDto>>.Ok(vouchers.Select(v => new PaymentVoucherDto
            {
                Id = v.Id,
                CompanyId = v.CompanyId,
                VoucherNumber = v.VoucherNumber,
                VoucherDate = v.VoucherDate,
                PayTo = v.PayTo,
                AccountId = v.AccountId,
                AccountName = v.Account?.AccountName ?? "",
                Amount = v.Amount,
                PaymentMode = v.PaymentMode,
                ReferenceNumber = v.ReferenceNumber,
                Description = v.Description,
                Status = v.Status,
                CreatedAt = v.CreatedAt
            }).ToList());
        }

        // ── Receipt Voucher ──────────────────────────────────
        public async Task<ApiResponse<ReceiptVoucherDto>> CreateReceiptVoucherAsync(CreateReceiptVoucherDto dto)
        {
            var voucherNumber = $"RV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            
            var voucher = new ReceiptVoucher
            {
                CompanyId = dto.CompanyId,
                VoucherNumber = voucherNumber,
                VoucherDate = dto.VoucherDate,
                ReceivedFrom = dto.ReceivedFrom,
                AccountId = dto.AccountId,
                Amount = dto.Amount,
                PaymentMode = dto.PaymentMode,
                ReferenceNumber = dto.ReferenceNumber,
                Description = dto.Description
            };

            _db.ReceiptVouchers.Add(voucher);
            await _db.SaveChangesAsync();

            var account = await _db.ChartOfAccounts.FindAsync(dto.AccountId);
            return ApiResponse<ReceiptVoucherDto>.Ok(new ReceiptVoucherDto
            {
                Id = voucher.Id,
                CompanyId = voucher.CompanyId,
                VoucherNumber = voucher.VoucherNumber,
                VoucherDate = voucher.VoucherDate,
                ReceivedFrom = voucher.ReceivedFrom,
                AccountId = voucher.AccountId,
                AccountName = account?.AccountName ?? "",
                Amount = voucher.Amount,
                PaymentMode = voucher.PaymentMode,
                ReferenceNumber = voucher.ReferenceNumber,
                Description = voucher.Description,
                Status = voucher.Status,
                CreatedAt = voucher.CreatedAt
            }, "Receipt voucher created.");
        }

        public async Task<ApiResponse<List<ReceiptVoucherDto>>> ListReceiptVouchersAsync(int companyId)
        {
            var vouchers = await _db.ReceiptVouchers
                .Include(v => v.Account)
                .Where(v => v.CompanyId == companyId)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            return ApiResponse<List<ReceiptVoucherDto>>.Ok(vouchers.Select(v => new ReceiptVoucherDto
            {
                Id = v.Id,
                CompanyId = v.CompanyId,
                VoucherNumber = v.VoucherNumber,
                VoucherDate = v.VoucherDate,
                ReceivedFrom = v.ReceivedFrom,
                AccountId = v.AccountId,
                AccountName = v.Account?.AccountName ?? "",
                Amount = v.Amount,
                PaymentMode = v.PaymentMode,
                ReferenceNumber = v.ReferenceNumber,
                Description = v.Description,
                Status = v.Status,
                CreatedAt = v.CreatedAt
            }).ToList());
        }

        // ── Helpers ──────────────────────────────────────────
        private async Task<JournalVoucherDto> GetJournalVoucherDtoAsync(int id)
        {
            var voucher = await _db.JournalVouchers
                .Include(v => v.Entries).ThenInclude(e => e.Account)
                .FirstAsync(v => v.Id == id);
            return MapJournalVoucher(voucher);
        }

        private static AccountDto MapAccount(ChartOfAccount a) => new()
        {
            Id = a.Id,
            CompanyId = a.CompanyId,
            AccountCode = a.AccountCode,
            AccountName = a.AccountName,
            AccountType = a.AccountType,
            ParentAccountCode = a.ParentAccountCode,
            OpeningBalance = a.OpeningBalance,
            IsActive = a.IsActive
        };

        private static JournalVoucherDto MapJournalVoucher(JournalVoucher v) => new()
        {
            Id = v.Id,
            CompanyId = v.CompanyId,
            VoucherNumber = v.VoucherNumber,
            VoucherDate = v.VoucherDate,
            Description = v.Description,
            TotalDebit = v.TotalDebit,
            TotalCredit = v.TotalCredit,
            Status = v.Status,
            CreatedAt = v.CreatedAt,
            Entries = v.Entries.Select(e => new JournalEntryResultDto
            {
                AccountId = e.AccountId,
                AccountName = e.Account?.AccountName ?? "",
                AccountCode = e.Account?.AccountCode ?? "",
                Type = e.Type,
                Amount = e.Amount,
                Narration = e.Narration
            }).ToList()
        };
    }
}
