# Accounts Module - Complete Implementation Guide

## ✅ What Has Been Implemented

### Phase 1: Enhanced Models & Database

#### New Models Created:
1. **FinancialYear.cs** - Fiscal year management
2. **BankAccount.cs** - Bank account details
3. **PaymentMode.cs** - Payment method master
4. **CostCenter.cs** - Department/project-wise expense tracking
5. **AccountOpeningBalance.cs** - Opening balance per financial year

#### Enhanced Existing Models:
1. **ChartOfAccount.cs** - Added 10+ new fields:
   - AccountGroup, IsGroup, Level
   - OpeningBalanceType, Currency, TaxType
   - IsBankAccount, IsSystemAccount
   - CreatedBy, UpdatedBy, UpdatedAt

2. **JournalVoucher.cs** - Added 15+ new fields:
   - FinancialYearId, BranchId
   - VoucherType, ReferenceNumber, ReferenceType, ReferenceId
   - PostedAt, PostedBy, CancelledAt, CancelledBy
   - CreatedBy, UpdatedBy, UpdatedAt

3. **JournalVoucherEntry.cs** - Added:
   - CostCenterId, ProjectId (for cost tracking)

### Phase 2: Core Accounting APIs

#### Services Created:
1. **AccountingService.cs** - Complete business logic:
   - CreateJournalEntryAsync - Create journal vouchers with validation
   - PostJournalVoucherAsync - Post vouchers
   - ValidateDoubleEntryAsync - Debit = Credit validation
   - GenerateVoucherNumberAsync - Auto voucher numbering
   - GetAccountBalanceAsync - Calculate account balance
   - GetAccountLedgerAsync - Generate account ledger
   - GetTrialBalanceAsync - Generate trial balance
   - ValidateFinancialYearAsync - Financial year validation

2. **ChartOfAccountsInitializer.cs** - Default COA setup:
   - 50+ pre-configured accounts
   - Proper hierarchy (Assets, Liabilities, Equity, Income, Expenses)
   - System accounts protection

#### Controller Created:
**AccountsControllerEnhanced.cs** - 25+ API endpoints:

##### Financial Year APIs:
- POST `/api/accounts/financial-years` - Create financial year
- GET `/api/accounts/financial-years/{companyId}` - List financial years
- PUT `/api/accounts/financial-years/{id}/close` - Close financial year

##### Chart of Accounts APIs:
- POST `/api/accounts/chart` - Create account
- GET `/api/accounts/chart/{companyId}` - List all accounts
- GET `/api/accounts/chart/detail/{id}` - Get account with balance
- PUT `/api/accounts/chart/{id}` - Update account
- DELETE `/api/accounts/chart/{id}` - Delete account

##### Journal Voucher APIs:
- POST `/api/accounts/journal-vouchers` - Create journal voucher
- GET `/api/accounts/journal-vouchers/{companyId}` - List vouchers
- GET `/api/accounts/journal-vouchers/detail/{id}` - Get voucher detail
- PUT `/api/accounts/journal-vouchers/{id}/post` - Post voucher
- PUT `/api/accounts/journal-vouchers/{id}/cancel` - Cancel voucher

##### Report APIs:
- GET `/api/accounts/ledger/{accountId}` - Account ledger
- GET `/api/accounts/trial-balance/{companyId}/{financialYearId}` - Trial balance
- GET `/api/accounts/balance/{accountId}` - Account balance

##### Bank Account APIs:
- POST `/api/accounts/bank-accounts` - Create bank account
- GET `/api/accounts/bank-accounts/{companyId}` - List bank accounts

##### Payment Mode APIs:
- POST `/api/accounts/payment-modes` - Create payment mode
- GET `/api/accounts/payment-modes/{companyId}` - List payment modes

##### Cost Center APIs:
- POST `/api/accounts/cost-centers` - Create cost center
- GET `/api/accounts/cost-centers/{companyId}` - List cost centers

---

## 🔧 Next Steps - What You Need to Do

### 1. Register Services in Program.cs

Add these lines to your `Program.cs`:

```csharp
// Add Accounting Services
builder.Services.AddScoped<IAccountingService, AccountingService>();
builder.Services.AddScoped<IChartOfAccountsInitializer, ChartOfAccountsInitializer>();
```

### 2. Create Database Migration

Run these commands in your terminal:

```bash
cd ERPPlugandPlay/ERPPlugandPlay
dotnet ef migrations add AddAccountsModuleEnhancements
dotnet ef database update
```

### 3. Initialize Default Chart of Accounts

When a new company is created, call the initializer:

```csharp
// In CompanyController.cs after creating company
await _chartOfAccountsInitializer.InitializeDefaultAccountsAsync(company.Id, userId);
```

### 4. Replace Old Controller (Optional)

You have two options:
- **Option A**: Rename `AccountsControllerEnhanced.cs` to `AccountsController.cs` and delete the old one
- **Option B**: Keep both and gradually migrate endpoints

---

## 📊 Default Chart of Accounts Structure

### Assets (1000-1999)
```
1000 - Current Assets (Group)
  1001 - Cash
  1100 - Bank Accounts (Group)
  1200 - Accounts Receivable
  1300 - Inventory
  1400 - Prepaid Expenses

1500 - Fixed Assets (Group)
  1501 - Land & Building
  1502 - Machinery
  1503 - Furniture & Fixtures
  1504 - Vehicles
  1505 - Computer & Equipment
```

### Liabilities (2000-2999)
```
2000 - Current Liabilities (Group)
  2001 - Accounts Payable
  2100 - Short Term Loans
  2200 - Tax Payable (Group)
    2201 - GST Payable
    2202 - TDS Payable
  2300 - Salary Payable

2500 - Long Term Liabilities (Group)
  2501 - Long Term Loans
```

### Equity (3000-3999)
```
3000 - Equity (Group)
  3001 - Capital
  3002 - Retained Earnings
  3003 - Drawings
```

### Income (4000-4999)
```
4000 - Direct Income (Group)
  4001 - Sales
  4002 - Service Income

4500 - Indirect Income (Group)
  4501 - Interest Income
  4502 - Other Income
  4503 - Discount Received
```

### Expenses (5000-5999)
```
5000 - Direct Expenses (Group)
  5001 - Purchase
  5002 - Freight Inward
  5003 - Manufacturing Expenses

5500 - Indirect Expenses (Group)
  5501 - Salary & Wages
  5502 - Rent
  5503 - Electricity
  5504 - Telephone & Internet
  5505 - Office Expenses
  5506 - Printing & Stationery
  5507 - Travelling Expenses
  5508 - Depreciation
  5509 - Bank Charges
  5510 - Interest Expense
  5511 - Discount Given
  5512 - Bad Debts
```

---

## 🔄 How to Integrate with Other Modules

### Purchase Module Integration

When a purchase invoice is created, automatically create journal entry:

```csharp
// In PurchaseController after creating invoice
var journalDto = new CreateJournalVoucherDto
{
    CompanyId = invoice.CompanyId,
    FinancialYearId = activeFinancialYearId,
    VoucherType = "Purchase",
    VoucherDate = invoice.InvoiceDate,
    ReferenceNumber = invoice.InvoiceNumber,
    ReferenceType = "PurchaseInvoice",
    ReferenceId = invoice.Id,
    Description = $"Purchase from {vendor.VendorName}",
    Entries = new List<JournalEntryDto>
    {
        // Debit: Purchase Account
        new JournalEntryDto
        {
            AccountId = purchaseAccountId, // 5001
            Type = "Debit",
            Amount = invoice.TotalAmount,
            Narration = $"Purchase Invoice {invoice.InvoiceNumber}"
        },
        // Credit: Accounts Payable
        new JournalEntryDto
        {
            AccountId = accountsPayableId, // 2001
            Type = "Credit",
            Amount = invoice.TotalAmount,
            Narration = $"Vendor: {vendor.VendorName}"
        }
    }
};

await _accountingService.CreateJournalEntryAsync(journalDto, userId);
```

### Sales Module Integration

When a sales invoice is created:

```csharp
var journalDto = new CreateJournalVoucherDto
{
    CompanyId = invoice.CompanyId,
    FinancialYearId = activeFinancialYearId,
    VoucherType = "Sales",
    VoucherDate = invoice.InvoiceDate,
    ReferenceNumber = invoice.InvoiceNumber,
    ReferenceType = "SalesInvoice",
    ReferenceId = invoice.Id,
    Description = $"Sales to {customer.CustomerName}",
    Entries = new List<JournalEntryDto>
    {
        // Debit: Accounts Receivable
        new JournalEntryDto
        {
            AccountId = accountsReceivableId, // 1200
            Type = "Debit",
            Amount = invoice.TotalAmount,
            Narration = $"Customer: {customer.CustomerName}"
        },
        // Credit: Sales Account
        new JournalEntryDto
        {
            AccountId = salesAccountId, // 4001
            Type = "Credit",
            Amount = invoice.TotalAmount,
            Narration = $"Sales Invoice {invoice.InvoiceNumber}"
        }
    }
};

await _accountingService.CreateJournalEntryAsync(journalDto, userId);
```

### Payment Entry Integration

When a payment is made:

```csharp
var journalDto = new CreateJournalVoucherDto
{
    CompanyId = payment.CompanyId,
    FinancialYearId = activeFinancialYearId,
    VoucherType = "Payment",
    VoucherDate = payment.PaymentDate,
    ReferenceNumber = payment.PaymentNumber,
    ReferenceType = "VendorPayment",
    ReferenceId = payment.Id,
    Description = $"Payment to {vendor.VendorName}",
    Entries = new List<JournalEntryDto>
    {
        // Debit: Accounts Payable
        new JournalEntryDto
        {
            AccountId = accountsPayableId, // 2001
            Type = "Debit",
            Amount = payment.Amount,
            Narration = $"Payment to {vendor.VendorName}"
        },
        // Credit: Bank/Cash Account
        new JournalEntryDto
        {
            AccountId = bankAccountId, // 1100 or 1001
            Type = "Credit",
            Amount = payment.Amount,
            Narration = $"Payment via {payment.PaymentMode}"
        }
    }
};

await _accountingService.CreateJournalEntryAsync(journalDto, userId);
```

### Payroll Module Integration

When salary is processed:

```csharp
var journalDto = new CreateJournalVoucherDto
{
    CompanyId = payroll.CompanyId,
    FinancialYearId = activeFinancialYearId,
    VoucherType = "Journal",
    VoucherDate = payroll.PaymentDate,
    Description = $"Salary for {payroll.Month}",
    Entries = new List<JournalEntryDto>
    {
        // Debit: Salary Expense
        new JournalEntryDto
        {
            AccountId = salaryAccountId, // 5501
            Type = "Debit",
            Amount = payroll.TotalSalary,
            Narration = $"Salary expense for {payroll.Month}"
        },
        // Credit: Salary Payable
        new JournalEntryDto
        {
            AccountId = salaryPayableId, // 2300
            Type = "Credit",
            Amount = payroll.TotalSalary,
            Narration = $"Salary payable for {payroll.Month}"
        }
    }
};

await _accountingService.CreateJournalEntryAsync(journalDto, userId);
```

---

## 🧪 Testing the APIs

### 1. Create Financial Year

```http
POST /api/accounts/financial-years
Content-Type: application/json

{
  "companyId": 1,
  "yearName": "FY 2024-25",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "isActive": true
}
```

### 2. Create Journal Voucher

```http
POST /api/accounts/journal-vouchers
Content-Type: application/json

{
  "companyId": 1,
  "financialYearId": 1,
  "voucherType": "Journal",
  "voucherDate": "2024-12-01",
  "description": "Test journal entry",
  "entries": [
    {
      "accountId": 5,
      "type": "Debit",
      "amount": 10000,
      "narration": "Rent expense"
    },
    {
      "accountId": 2,
      "type": "Credit",
      "amount": 10000,
      "narration": "Cash payment"
    }
  ]
}
```

### 3. Post Journal Voucher

```http
PUT /api/accounts/journal-vouchers/1/post
```

### 4. Get Account Ledger

```http
GET /api/accounts/ledger/5?fromDate=2024-04-01&toDate=2025-03-31
```

### 5. Get Trial Balance

```http
GET /api/accounts/trial-balance/1/1?asOnDate=2024-12-31
```

---

## 🎯 Key Features Implemented

✅ Double-entry bookkeeping validation
✅ Financial year validation
✅ Auto voucher number generation
✅ Group account protection (can't post to groups)
✅ System account protection (can't delete)
✅ Account balance calculation
✅ Account ledger generation
✅ Trial balance generation
✅ Multi-branch support
✅ Cost center tracking
✅ Project-wise accounting
✅ Bank account management
✅ Payment mode master
✅ Voucher posting workflow
✅ Voucher cancellation
✅ Reference tracking (link to source documents)

---

## 📝 Important Notes

1. **Always validate financial year** before creating transactions
2. **Always post vouchers** to make them effective in reports
3. **Use system accounts** for automated entries (Purchase, Sales, etc.)
4. **Don't delete accounts** with transactions
5. **Initialize default COA** when creating new company
6. **Use ReferenceType and ReferenceId** to link vouchers to source documents

---

## 🚀 What's Next (Phase 3 & 4)

### Phase 3: Advanced Features
- Bank reconciliation
- Recurring journal entries
- Budget management
- Multi-currency support
- Tax calculation automation

### Phase 4: Financial Reports
- Profit & Loss Statement
- Balance Sheet
- Cash Flow Statement
- Aging reports
- GST reports

---

## 📞 Support

If you encounter any issues:
1. Check database migration is applied
2. Verify services are registered in Program.cs
3. Ensure financial year is created and active
4. Check account codes exist in Chart of Accounts
5. Validate debit = credit in journal entries

---

**Implementation Date**: March 28, 2026
**Status**: Phase 1 & 2 Complete ✅
