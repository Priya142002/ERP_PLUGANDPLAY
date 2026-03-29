using ERPPlugandPlay.Data;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    /// <summary>
    /// Automatically posts double-entry journal vouchers for module transactions.
    /// All entries are created as "Posted" so they immediately affect balances.
    /// </summary>
    public interface IAutoAccountingService
    {
        // Purchase
        Task PostPurchaseInvoiceAsync(int companyId, int invoiceId, decimal amount, string vendorName, string paymentMode = "Credit");
        Task PostPurchaseReturnAsync(int companyId, int returnId, decimal amount, string vendorName);
        Task PostVendorPaymentAsync(int companyId, int paymentId, decimal amount, string vendorName, string paymentMode = "Cash");
        // Sales
        Task PostSalesInvoiceAsync(int companyId, int invoiceId, decimal amount, string customerName, string paymentMode = "Credit");
        Task PostSalesReturnAsync(int companyId, int returnId, decimal amount, string customerName);
        Task PostCustomerPaymentAsync(int companyId, int paymentId, decimal amount, string customerName, string paymentMode = "Cash");
        // POS
        Task PostPOSSaleAsync(int companyId, int posId, decimal amount, string paymentMode = "Cash");
        Task PostPOSRefundAsync(int companyId, int posId, decimal amount, string paymentMode = "Cash");
        // HRM / Payroll
        Task PostSalaryAsync(int companyId, int employeeId, decimal amount, string employeeName);
        // Assets
        Task PostAssetPurchaseAsync(int companyId, int assetId, decimal amount, string assetName);
        Task PostAssetDisposalAsync(int companyId, int disposalId, decimal bookValue, decimal saleValue, string assetName);
        Task PostMaintenanceCostAsync(int companyId, int maintenanceId, decimal cost, string assetName);
        // Production
        Task PostProductionCompletionAsync(int companyId, int orderId, decimal qty, string productName);
        // Billing
        Task PostBillingInvoiceAsync(int companyId, int invoiceId, decimal amount, string clientName);
        // Logistics
        Task PostFreightChargeAsync(int companyId, decimal amount, string reference);
    }

    public class AutoAccountingService : IAutoAccountingService
    {
        private readonly ERPDbContext _db;
        public AutoAccountingService(ERPDbContext db) => _db = db;

        // ── Helpers ──────────────────────────────────────────────────────────

        private async Task<int?> GetAccountIdAsync(int companyId, string accountCode)
            => await _db.ChartOfAccounts
                .Where(a => a.CompanyId == companyId && a.AccountCode == accountCode && a.IsActive)
                .Select(a => (int?)a.Id)
                .FirstOrDefaultAsync();

        private async Task<int> GetFinancialYearIdAsync(int companyId)
        {
            var fy = await _db.FinancialYears
                .Where(f => f.CompanyId == companyId && f.IsActive && !f.IsClosed)
                .OrderByDescending(f => f.StartDate)
                .FirstOrDefaultAsync();
            return fy?.Id ?? 0;
        }

        private async Task PostVoucherAsync(int companyId, string voucherType, string description,
            string refType, int refId, List<(int AccountId, string Type, decimal Amount, string Narration)> entries)
        {
            if (entries.Count < 2) return;
            var fyId = await GetFinancialYearIdAsync(companyId);
            if (fyId == 0) return; // No active financial year

            var totalDebit  = entries.Where(e => e.Type == "Debit").Sum(e => e.Amount);
            var totalCredit = entries.Where(e => e.Type == "Credit").Sum(e => e.Amount);
            if (Math.Abs(totalDebit - totalCredit) > 0.01m) return; // Unbalanced — skip

            var count = await _db.JournalVouchers.CountAsync(v => v.CompanyId == companyId && v.VoucherType == voucherType);
            var voucherNumber = $"{voucherType.Substring(0, 2).ToUpper()}-{DateTime.UtcNow:yyyyMM}-{count + 1:D4}";

            var voucher = new JournalVoucher
            {
                CompanyId      = companyId,
                FinancialYearId= fyId,
                VoucherNumber  = voucherNumber,
                VoucherType    = voucherType,
                VoucherDate    = DateTime.UtcNow,
                Description    = description,
                ReferenceType  = refType,
                ReferenceId    = refId,
                TotalDebit     = totalDebit,
                TotalCredit    = totalCredit,
                Status         = "Posted",
                PostedAt       = DateTime.UtcNow,
                CreatedAt      = DateTime.UtcNow
            };

            foreach (var (accountId, type, amount, narration) in entries)
                voucher.Entries.Add(new JournalVoucherEntry { AccountId = accountId, Type = type, Amount = amount, Narration = narration });

            _db.JournalVouchers.Add(voucher);
            await _db.SaveChangesAsync();
        }

        // ── Purchase Invoice ─────────────────────────────────────────────────
        // DR Purchase Account / CR Accounts Payable (credit) or Cash/Bank (cash)
        public async Task PostPurchaseInvoiceAsync(int companyId, int invoiceId, decimal amount, string vendorName, string paymentMode = "Credit")
        {
            var purchaseAccId = await GetAccountIdAsync(companyId, "5110"); // Purchase Account
            var payableAccId  = await GetAccountIdAsync(companyId, "2110"); // Accounts Payable
            var cashAccId     = await GetAccountIdAsync(companyId, "1110"); // Cash
            var bankAccId     = await GetAccountIdAsync(companyId, "1120"); // Bank

            if (purchaseAccId == null) return;

            int creditAccId = paymentMode == "Cash"  ? (cashAccId  ?? payableAccId!.Value)
                            : paymentMode == "Bank"  ? (bankAccId  ?? payableAccId!.Value)
                            : (payableAccId ?? cashAccId!.Value);

            await PostVoucherAsync(companyId, "Purchase",
                $"Purchase Invoice - {vendorName}", "PurchaseInvoice", invoiceId,
                new() {
                    (purchaseAccId.Value, "Debit",  amount, $"Purchase from {vendorName}"),
                    (creditAccId,         "Credit", amount, $"Payment to {vendorName} via {paymentMode}")
                });
        }

        // ── Sales Invoice ────────────────────────────────────────────────────
        // DR Accounts Receivable (credit) or Cash/Bank (cash) / CR Sales Account
        public async Task PostSalesInvoiceAsync(int companyId, int invoiceId, decimal amount, string customerName, string paymentMode = "Credit")
        {
            var salesAccId    = await GetAccountIdAsync(companyId, "4100"); // Sales Account
            var receivableId  = await GetAccountIdAsync(companyId, "1130"); // Accounts Receivable
            var cashAccId     = await GetAccountIdAsync(companyId, "1110"); // Cash
            var bankAccId     = await GetAccountIdAsync(companyId, "1120"); // Bank

            if (salesAccId == null) return;

            int debitAccId = paymentMode == "Cash" ? (cashAccId  ?? receivableId!.Value)
                           : paymentMode == "Bank" ? (bankAccId  ?? receivableId!.Value)
                           : (receivableId ?? cashAccId!.Value);

            await PostVoucherAsync(companyId, "Sales",
                $"Sales Invoice - {customerName}", "SalesInvoice", invoiceId,
                new() {
                    (debitAccId,       "Debit",  amount, $"Receivable from {customerName}"),
                    (salesAccId.Value, "Credit", amount, $"Sales to {customerName}")
                });
        }

        // ── Vendor Payment ───────────────────────────────────────────────────
        // DR Accounts Payable / CR Cash or Bank
        public async Task PostVendorPaymentAsync(int companyId, int paymentId, decimal amount, string vendorName, string paymentMode = "Cash")
        {
            var payableAccId = await GetAccountIdAsync(companyId, "2110");
            var cashAccId    = await GetAccountIdAsync(companyId, "1110");
            var bankAccId    = await GetAccountIdAsync(companyId, "1120");

            if (payableAccId == null) return;
            int creditAccId = paymentMode == "Bank" ? (bankAccId ?? cashAccId!.Value) : (cashAccId ?? bankAccId!.Value);

            await PostVoucherAsync(companyId, "Payment",
                $"Vendor Payment - {vendorName}", "VendorPayment", paymentId,
                new() {
                    (payableAccId.Value, "Debit",  amount, $"Payment to {vendorName}"),
                    (creditAccId,        "Credit", amount, $"Paid via {paymentMode}")
                });
        }

        // ── Customer Payment ─────────────────────────────────────────────────
        // DR Cash or Bank / CR Accounts Receivable
        public async Task PostCustomerPaymentAsync(int companyId, int paymentId, decimal amount, string customerName, string paymentMode = "Cash")
        {
            var receivableId = await GetAccountIdAsync(companyId, "1130");
            var cashAccId    = await GetAccountIdAsync(companyId, "1110");
            var bankAccId    = await GetAccountIdAsync(companyId, "1120");

            if (receivableId == null) return;
            int debitAccId = paymentMode == "Bank" ? (bankAccId ?? cashAccId!.Value) : (cashAccId ?? bankAccId!.Value);

            await PostVoucherAsync(companyId, "Receipt",
                $"Customer Receipt - {customerName}", "CustomerPayment", paymentId,
                new() {
                    (debitAccId,          "Debit",  amount, $"Received from {customerName} via {paymentMode}"),
                    (receivableId.Value,  "Credit", amount, $"Receipt from {customerName}")
                });
        }

        // ── Salary ───────────────────────────────────────────────────────────
        // DR Salary Expense / CR Salary Payable
        public async Task PostSalaryAsync(int companyId, int employeeId, decimal amount, string employeeName)
        {
            var salaryExpId  = await GetAccountIdAsync(companyId, "5210");
            var salaryPayId  = await GetAccountIdAsync(companyId, "2120");
            if (salaryExpId == null || salaryPayId == null) return;

            await PostVoucherAsync(companyId, "Journal",
                $"Salary - {employeeName}", "Salary", employeeId,
                new() {
                    (salaryExpId.Value, "Debit",  amount, $"Salary expense for {employeeName}"),
                    (salaryPayId.Value, "Credit", amount, $"Salary payable to {employeeName}")
                });
        }

        // ── Asset Purchase ───────────────────────────────────────────────────
        // DR Fixed Asset Account / CR Cash or Bank
        public async Task PostAssetPurchaseAsync(int companyId, int assetId, decimal amount, string assetName)
        {
            var assetAccId = await GetAccountIdAsync(companyId, "1210");
            var cashAccId  = await GetAccountIdAsync(companyId, "1110");
            if (assetAccId == null || cashAccId == null) return;

            await PostVoucherAsync(companyId, "Journal",
                $"Asset Purchase - {assetName}", "Asset", assetId,
                new() {
                    (assetAccId.Value, "Debit",  amount, $"Asset capitalization: {assetName}"),
                    (cashAccId.Value,  "Credit", amount, $"Payment for {assetName}")
                });
        }

        // ── Freight / Logistics ──────────────────────────────────────────────
        // DR Freight Charges Expense / CR Cash
        public async Task PostFreightChargeAsync(int companyId, decimal amount, string reference)
        {
            var freightAccId = await GetAccountIdAsync(companyId, "5240");
            var cashAccId    = await GetAccountIdAsync(companyId, "1110");
            if (freightAccId == null || cashAccId == null) return;

            await PostVoucherAsync(companyId, "Journal",
                $"Freight Charge - {reference}", "Logistics", 0,
                new() {
                    (freightAccId.Value, "Debit",  amount, $"Freight: {reference}"),
                    (cashAccId.Value,    "Credit", amount, $"Paid for freight: {reference}")
                });
        }

        // ── Purchase Return ──────────────────────────────────────────────────
        // Reversal of purchase: DR Accounts Payable / CR Purchase Account
        public async Task PostPurchaseReturnAsync(int companyId, int returnId, decimal amount, string vendorName)
        {
            var purchaseAccId = await GetAccountIdAsync(companyId, "5110");
            var payableAccId  = await GetAccountIdAsync(companyId, "2110");
            if (purchaseAccId == null || payableAccId == null) return;

            await PostVoucherAsync(companyId, "Purchase",
                $"Purchase Return - {vendorName}", "PurchaseReturn", returnId,
                new() {
                    (payableAccId.Value,  "Debit",  amount, $"Purchase return to {vendorName}"),
                    (purchaseAccId.Value, "Credit", amount, $"Purchase account reversal for {vendorName}")
                });
        }

        // ── Sales Return ─────────────────────────────────────────────────────
        // Reversal of sale: DR Sales Account / CR Accounts Receivable
        public async Task PostSalesReturnAsync(int companyId, int returnId, decimal amount, string customerName)
        {
            var salesAccId   = await GetAccountIdAsync(companyId, "4100");
            var receivableId = await GetAccountIdAsync(companyId, "1130");
            if (salesAccId == null || receivableId == null) return;

            await PostVoucherAsync(companyId, "Sales",
                $"Sales Return - {customerName}", "SalesReturn", returnId,
                new() {
                    (salesAccId.Value,   "Debit",  amount, $"Sales return from {customerName}"),
                    (receivableId.Value, "Credit", amount, $"Receivable reversal for {customerName}")
                });
        }

        // ── POS Sale ─────────────────────────────────────────────────────────
        // DR Cash/UPI/Card / CR Sales Account
        public async Task PostPOSSaleAsync(int companyId, int posId, decimal amount, string paymentMode = "Cash")
        {
            var salesAccId = await GetAccountIdAsync(companyId, "4100");
            var cashAccId  = await GetAccountIdAsync(companyId, "1110");
            var bankAccId  = await GetAccountIdAsync(companyId, "1120");
            if (salesAccId == null) return;

            int debitAccId = paymentMode == "Bank" || paymentMode == "Card" || paymentMode == "UPI"
                ? (bankAccId ?? cashAccId!.Value)
                : (cashAccId ?? bankAccId!.Value);

            await PostVoucherAsync(companyId, "Sales",
                $"POS Sale - {paymentMode}", "POSSale", posId,
                new() {
                    (debitAccId,       "Debit",  amount, $"POS receipt via {paymentMode}"),
                    (salesAccId.Value, "Credit", amount, "POS sales revenue")
                });
        }

        // ── POS Refund ───────────────────────────────────────────────────────
        // Reversal: DR Sales Account / CR Cash/Bank
        public async Task PostPOSRefundAsync(int companyId, int posId, decimal amount, string paymentMode = "Cash")
        {
            var salesAccId = await GetAccountIdAsync(companyId, "4100");
            var cashAccId  = await GetAccountIdAsync(companyId, "1110");
            var bankAccId  = await GetAccountIdAsync(companyId, "1120");
            if (salesAccId == null) return;

            int creditAccId = paymentMode == "Bank" || paymentMode == "Card" || paymentMode == "UPI"
                ? (bankAccId ?? cashAccId!.Value)
                : (cashAccId ?? bankAccId!.Value);

            await PostVoucherAsync(companyId, "Sales",
                $"POS Refund - {paymentMode}", "POSRefund", posId,
                new() {
                    (salesAccId.Value, "Debit",  amount, "POS refund — sales reversal"),
                    (creditAccId,      "Credit", amount, $"Refund via {paymentMode}")
                });
        }

        // ── Asset Disposal ───────────────────────────────────────────────────
        // DR Cash (sale proceeds) + DR Disposal Loss (if any) / CR Fixed Asset
        public async Task PostAssetDisposalAsync(int companyId, int disposalId, decimal bookValue, decimal saleValue, string assetName)
        {
            var assetAccId   = await GetAccountIdAsync(companyId, "1210"); // Fixed Assets
            var cashAccId    = await GetAccountIdAsync(companyId, "1110"); // Cash
            var otherIncId   = await GetAccountIdAsync(companyId, "4300"); // Other Income (gain)
            var indirectExpId= await GetAccountIdAsync(companyId, "5200"); // Indirect Expenses (loss)
            if (assetAccId == null) return;

            var entries = new List<(int, string, decimal, string)>();

            if (saleValue > 0 && cashAccId != null)
                entries.Add((cashAccId.Value, "Debit", saleValue, $"Proceeds from disposal of {assetName}"));

            if (bookValue > saleValue && indirectExpId != null)
                entries.Add((indirectExpId.Value, "Debit", bookValue - saleValue, $"Loss on disposal of {assetName}"));

            entries.Add((assetAccId.Value, "Credit", bookValue, $"Asset write-off: {assetName}"));

            if (saleValue > bookValue && otherIncId != null)
                entries.Add((otherIncId.Value, "Credit", saleValue - bookValue, $"Gain on disposal of {assetName}"));

            if (entries.Count >= 2)
                await PostVoucherAsync(companyId, "Journal", $"Asset Disposal - {assetName}", "AssetDisposal", disposalId, entries);
        }

        // ── Maintenance Cost ─────────────────────────────────────────────────
        // DR Indirect Expense / CR Cash
        public async Task PostMaintenanceCostAsync(int companyId, int maintenanceId, decimal cost, string assetName)
        {
            var expAccId  = await GetAccountIdAsync(companyId, "5200"); // Indirect Expenses
            var cashAccId = await GetAccountIdAsync(companyId, "1110");
            if (expAccId == null || cashAccId == null) return;

            await PostVoucherAsync(companyId, "Journal",
                $"Asset Maintenance - {assetName}", "AssetMaintenance", maintenanceId,
                new() {
                    (expAccId.Value,  "Debit",  cost, $"Maintenance cost for {assetName}"),
                    (cashAccId.Value, "Credit", cost, $"Paid for maintenance of {assetName}")
                });
        }

        // ── Production Completion ────────────────────────────────────────────
        // DR COGS (Cost of Goods Sold) / CR Inventory Account
        public async Task PostProductionCompletionAsync(int companyId, int orderId, decimal qty, string productName)
        {
            var cogsAccId  = await GetAccountIdAsync(companyId, "5120"); // COGS
            var invAccId   = await GetAccountIdAsync(companyId, "1140"); // Inventory
            if (cogsAccId == null || invAccId == null) return;

            // Use qty as a proxy for cost (real cost would come from BOM material prices)
            var estimatedCost = qty; // In a real system, multiply by unit cost from BOM
            if (estimatedCost <= 0) return;

            await PostVoucherAsync(companyId, "Journal",
                $"Production Completed - {productName}", "ProductionOrder", orderId,
                new() {
                    (cogsAccId.Value, "Debit",  estimatedCost, $"COGS for production of {productName}"),
                    (invAccId.Value,  "Credit", estimatedCost, $"Inventory consumed for {productName}")
                });
        }

        // ── Billing Invoice ──────────────────────────────────────────────────
        // DR Accounts Receivable / CR Service Revenue
        public async Task PostBillingInvoiceAsync(int companyId, int invoiceId, decimal amount, string clientName)
        {
            var receivableId  = await GetAccountIdAsync(companyId, "1130"); // Accounts Receivable
            var serviceRevId  = await GetAccountIdAsync(companyId, "4200"); // Service Revenue
            if (receivableId == null || serviceRevId == null) return;

            await PostVoucherAsync(companyId, "Sales",
                $"Billing Invoice - {clientName}", "BillingInvoice", invoiceId,
                new() {
                    (receivableId.Value, "Debit",  amount, $"Receivable from {clientName}"),
                    (serviceRevId.Value, "Credit", amount, $"Service revenue from {clientName}")
                });
        }
    }
}
