-- ============================================================
-- ERP PlugandPlay - Complete Database Setup Script v2
-- Run this in SSMS against: ERPPlugandPlayDB
-- Safe to re-run: all statements use IF NOT EXISTS guards
-- ============================================================

USE ERPPlugandPlayDB;
GO

-- ============================================================
-- SECTION 1: COLUMN PATCHES ON EXISTING TABLES
-- (Fix missing columns before any INSERT/SELECT uses them)
-- ============================================================

-- Permissions: add Description, Category if missing
IF COL_LENGTH('Permissions', 'Description') IS NULL
    ALTER TABLE Permissions ADD Description NVARCHAR(MAX) NULL;
IF COL_LENGTH('Permissions', 'Category') IS NULL
    ALTER TABLE Permissions ADD Category NVARCHAR(MAX) NULL;
PRINT 'Patched: Permissions columns';
GO

-- SubscriptionPlans: real column is MonthlyPrice (not Price), no DurationDays
IF COL_LENGTH('SubscriptionPlans', 'PricePerUser') IS NULL
    ALTER TABLE SubscriptionPlans ADD PricePerUser DECIMAL(18,2) NOT NULL DEFAULT 0;
IF COL_LENGTH('SubscriptionPlans', 'AllowedModules') IS NULL
    ALTER TABLE SubscriptionPlans ADD AllowedModules NVARCHAR(MAX) NOT NULL DEFAULT '';
IF COL_LENGTH('SubscriptionPlans', 'MaxModules') IS NULL
    ALTER TABLE SubscriptionPlans ADD MaxModules INT NOT NULL DEFAULT 0;
PRINT 'Patched: SubscriptionPlans columns';
GO

-- ChartOfAccounts: add all missing columns if table already exists
IF OBJECT_ID('ChartOfAccounts', 'U') IS NOT NULL
BEGIN
    IF COL_LENGTH('ChartOfAccounts', 'AccountGroup') IS NULL
        ALTER TABLE ChartOfAccounts ADD AccountGroup NVARCHAR(MAX) NOT NULL DEFAULT '';
    IF COL_LENGTH('ChartOfAccounts', 'IsGroup') IS NULL
        ALTER TABLE ChartOfAccounts ADD IsGroup BIT NOT NULL DEFAULT 0;
    IF COL_LENGTH('ChartOfAccounts', 'Level') IS NULL
        ALTER TABLE ChartOfAccounts ADD Level INT NOT NULL DEFAULT 1;
    IF COL_LENGTH('ChartOfAccounts', 'OpeningBalanceType') IS NULL
        ALTER TABLE ChartOfAccounts ADD OpeningBalanceType NVARCHAR(10) NOT NULL DEFAULT 'Debit';
    IF COL_LENGTH('ChartOfAccounts', 'Currency') IS NULL
        ALTER TABLE ChartOfAccounts ADD Currency NVARCHAR(10) NOT NULL DEFAULT 'INR';
    IF COL_LENGTH('ChartOfAccounts', 'IsSystemAccount') IS NULL
        ALTER TABLE ChartOfAccounts ADD IsSystemAccount BIT NOT NULL DEFAULT 0;
    IF COL_LENGTH('ChartOfAccounts', 'ParentAccountCode') IS NULL
        ALTER TABLE ChartOfAccounts ADD ParentAccountCode NVARCHAR(50) NULL;
    IF COL_LENGTH('ChartOfAccounts', 'TaxType') IS NULL
        ALTER TABLE ChartOfAccounts ADD TaxType NVARCHAR(50) NULL;
    IF COL_LENGTH('ChartOfAccounts', 'IsBankAccount') IS NULL
        ALTER TABLE ChartOfAccounts ADD IsBankAccount BIT NOT NULL DEFAULT 0;
    IF COL_LENGTH('ChartOfAccounts', 'UpdatedAt') IS NULL
        ALTER TABLE ChartOfAccounts ADD UpdatedAt DATETIME2 NULL;
    IF COL_LENGTH('ChartOfAccounts', 'UpdatedBy') IS NULL
        ALTER TABLE ChartOfAccounts ADD UpdatedBy INT NULL;
    PRINT 'Patched: ChartOfAccounts columns';
END
GO

-- Users: add CompanyId if missing
IF COL_LENGTH('Users', 'CompanyId') IS NULL
BEGIN
    ALTER TABLE Users ADD CompanyId INT NULL;
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Users_Companies')
        ALTER TABLE Users ADD CONSTRAINT FK_Users_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id);
    PRINT 'Patched: Users.CompanyId';
END
GO

-- Companies: add AdminPassword, Code if missing
IF COL_LENGTH('Companies', 'AdminPassword') IS NULL
    ALTER TABLE Companies ADD AdminPassword NVARCHAR(MAX) NULL;
IF COL_LENGTH('Companies', 'Code') IS NULL
    ALTER TABLE Companies ADD Code NVARCHAR(50) NOT NULL DEFAULT '';
GO

-- Products: add TaxTypeId if missing
IF OBJECT_ID('TaxTypes', 'U') IS NOT NULL AND COL_LENGTH('Products', 'TaxTypeId') IS NULL
BEGIN
    ALTER TABLE Products ADD TaxTypeId INT NULL;
    ALTER TABLE Products ADD CONSTRAINT FK_Products_TaxTypes FOREIGN KEY (TaxTypeId) REFERENCES TaxTypes(Id);
    PRINT 'Patched: Products.TaxTypeId';
END
GO

-- ============================================================
-- SECTION 2: NEW TABLES (create only if not exist)
-- ============================================================

-- FinancialYears
IF OBJECT_ID('FinancialYears', 'U') IS NULL
BEGIN
    CREATE TABLE FinancialYears (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId   INT NOT NULL,
        FYCode      NVARCHAR(30) NOT NULL DEFAULT '',
        YearName    NVARCHAR(100) NOT NULL,
        StartDate   DATETIME2 NOT NULL,
        EndDate     DATETIME2 NOT NULL,
        IsActive    BIT NOT NULL DEFAULT 1,
        IsClosed    BIT NOT NULL DEFAULT 0,
        ClosedAt    DATETIME2 NULL,
        ClosedBy    INT NULL,
        CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CreatedBy   INT NULL,
        UpdatedAt   DATETIME2 NULL,
        UpdatedBy   INT NULL,
        CONSTRAINT FK_FinancialYears_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
    );
    CREATE INDEX IX_FinancialYears_CompanyId ON FinancialYears(CompanyId);
    PRINT 'Created: FinancialYears';
END
ELSE
BEGIN
    IF COL_LENGTH('FinancialYears', 'FYCode') IS NULL
    BEGIN
        ALTER TABLE FinancialYears ADD FYCode NVARCHAR(30) NOT NULL DEFAULT '';
        PRINT 'Patched: FinancialYears.FYCode added';
    END
    PRINT 'Exists: FinancialYears';
END
GO

-- Backfill FYCode for existing rows
UPDATE FinancialYears
SET FYCode = 'FY' + CAST(YEAR(StartDate) AS NVARCHAR)
           + '-' + RIGHT('0' + CAST(YEAR(EndDate) % 100 AS NVARCHAR), 2)
           + '-C' + RIGHT('0000' + CAST(CompanyId AS NVARCHAR), 4)
WHERE FYCode = '' OR FYCode IS NULL;
PRINT 'Backfilled: FYCode';
GO

-- ChartOfAccounts (create if not exists — columns already patched above)
IF OBJECT_ID('ChartOfAccounts', 'U') IS NULL
BEGIN
    CREATE TABLE ChartOfAccounts (
        Id                  INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId           INT NOT NULL,
        AccountCode         NVARCHAR(50) NOT NULL,
        AccountName         NVARCHAR(255) NOT NULL,
        AccountType         NVARCHAR(50) NOT NULL,
        AccountGroup        NVARCHAR(100) NOT NULL DEFAULT '',
        ParentAccountCode   NVARCHAR(50) NULL,
        IsGroup             BIT NOT NULL DEFAULT 0,
        Level               INT NOT NULL DEFAULT 1,
        OpeningBalance      DECIMAL(18,2) NOT NULL DEFAULT 0,
        OpeningBalanceType  NVARCHAR(10) NOT NULL DEFAULT 'Debit',
        Currency            NVARCHAR(10) NOT NULL DEFAULT 'INR',
        TaxType             NVARCHAR(50) NULL,
        IsBankAccount       BIT NOT NULL DEFAULT 0,
        IsSystemAccount     BIT NOT NULL DEFAULT 0,
        IsActive            BIT NOT NULL DEFAULT 1,
        CreatedAt           DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CreatedBy           INT NULL,
        UpdatedAt           DATETIME2 NULL,
        UpdatedBy           INT NULL,
        CONSTRAINT FK_ChartOfAccounts_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
    );
    CREATE INDEX IX_ChartOfAccounts_CompanyId ON ChartOfAccounts(CompanyId);
    PRINT 'Created: ChartOfAccounts';
END
ELSE PRINT 'Exists: ChartOfAccounts';
GO

-- JournalVouchers
IF OBJECT_ID('JournalVouchers', 'U') IS NULL
BEGIN
    CREATE TABLE JournalVouchers (
        Id                  INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId           INT NOT NULL,
        FinancialYearId     INT NOT NULL,
        BranchId            INT NULL,
        VoucherNumber       NVARCHAR(50) NOT NULL,
        VoucherType         NVARCHAR(50) NOT NULL DEFAULT 'Journal',
        VoucherDate         DATETIME2 NOT NULL,
        ReferenceNumber     NVARCHAR(100) NULL,
        ReferenceType       NVARCHAR(100) NULL,
        ReferenceId         INT NULL,
        Description         NVARCHAR(500) NOT NULL DEFAULT '',
        TotalDebit          DECIMAL(18,2) NOT NULL DEFAULT 0,
        TotalCredit         DECIMAL(18,2) NOT NULL DEFAULT 0,
        Status              NVARCHAR(20) NOT NULL DEFAULT 'Draft',
        PostedAt            DATETIME2 NULL,
        PostedBy            INT NULL,
        CancelledAt         DATETIME2 NULL,
        CancelledBy         INT NULL,
        CancellationReason  NVARCHAR(500) NULL,
        CreatedAt           DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CreatedBy           INT NULL,
        UpdatedAt           DATETIME2 NULL,
        UpdatedBy           INT NULL,
        CONSTRAINT FK_JournalVouchers_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
        CONSTRAINT FK_JournalVouchers_FinancialYears FOREIGN KEY (FinancialYearId) REFERENCES FinancialYears(Id)
    );
    CREATE INDEX IX_JournalVouchers_CompanyId   ON JournalVouchers(CompanyId);
    CREATE INDEX IX_JournalVouchers_VoucherDate ON JournalVouchers(CompanyId, VoucherDate);
    CREATE INDEX IX_JournalVouchers_Status      ON JournalVouchers(CompanyId, Status);
    PRINT 'Created: JournalVouchers';
END
ELSE PRINT 'Exists: JournalVouchers';
GO

-- JournalVoucherEntries
IF OBJECT_ID('JournalVoucherEntries', 'U') IS NULL
BEGIN
    CREATE TABLE JournalVoucherEntries (
        Id               INT IDENTITY(1,1) PRIMARY KEY,
        JournalVoucherId INT NOT NULL,
        AccountId        INT NOT NULL,
        Type             NVARCHAR(10) NOT NULL,
        Amount           DECIMAL(18,2) NOT NULL,
        Narration        NVARCHAR(500) NULL,
        CostCenterId     INT NULL,
        ProjectId        INT NULL,
        CONSTRAINT FK_JVEntries_JournalVouchers FOREIGN KEY (JournalVoucherId) REFERENCES JournalVouchers(Id) ON DELETE CASCADE,
        CONSTRAINT FK_JVEntries_ChartOfAccounts FOREIGN KEY (AccountId) REFERENCES ChartOfAccounts(Id)
    );
    CREATE INDEX IX_JVEntries_VoucherId ON JournalVoucherEntries(JournalVoucherId);
    CREATE INDEX IX_JVEntries_AccountId ON JournalVoucherEntries(AccountId);
    PRINT 'Created: JournalVoucherEntries';
END
ELSE
BEGIN
    IF COL_LENGTH('JournalVoucherEntries', 'CostCenterId') IS NULL
        ALTER TABLE JournalVoucherEntries ADD CostCenterId INT NULL;
    IF COL_LENGTH('JournalVoucherEntries', 'ProjectId') IS NULL
        ALTER TABLE JournalVoucherEntries ADD ProjectId INT NULL;
    PRINT 'Exists: JournalVoucherEntries';
END
GO

-- PaymentVouchers
IF OBJECT_ID('PaymentVouchers', 'U') IS NULL
BEGIN
    CREATE TABLE PaymentVouchers (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId       INT NOT NULL,
        VoucherNumber   NVARCHAR(50) NOT NULL,
        VoucherDate     DATETIME2 NOT NULL,
        PayTo           NVARCHAR(255) NOT NULL,
        AccountId       INT NOT NULL,
        Amount          DECIMAL(18,2) NOT NULL,
        PaymentMode     NVARCHAR(50) NOT NULL,
        ReferenceNumber NVARCHAR(100) NULL,
        Description     NVARCHAR(500) NOT NULL DEFAULT '',
        Status          NVARCHAR(20) NOT NULL DEFAULT 'Pending',
        CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_PaymentVouchers_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
        CONSTRAINT FK_PaymentVouchers_Accounts  FOREIGN KEY (AccountId) REFERENCES ChartOfAccounts(Id)
    );
    PRINT 'Created: PaymentVouchers';
END
ELSE PRINT 'Exists: PaymentVouchers';
GO

-- ReceiptVouchers
IF OBJECT_ID('ReceiptVouchers', 'U') IS NULL
BEGIN
    CREATE TABLE ReceiptVouchers (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId       INT NOT NULL,
        VoucherNumber   NVARCHAR(50) NOT NULL,
        VoucherDate     DATETIME2 NOT NULL,
        ReceivedFrom    NVARCHAR(255) NOT NULL,
        AccountId       INT NOT NULL,
        Amount          DECIMAL(18,2) NOT NULL,
        PaymentMode     NVARCHAR(50) NOT NULL,
        ReferenceNumber NVARCHAR(100) NULL,
        Description     NVARCHAR(500) NOT NULL DEFAULT '',
        Status          NVARCHAR(20) NOT NULL DEFAULT 'Pending',
        CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_ReceiptVouchers_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
        CONSTRAINT FK_ReceiptVouchers_Accounts  FOREIGN KEY (AccountId) REFERENCES ChartOfAccounts(Id)
    );
    PRINT 'Created: ReceiptVouchers';
END
ELSE PRINT 'Exists: ReceiptVouchers';
GO

-- BankAccounts
IF OBJECT_ID('BankAccounts', 'U') IS NULL
BEGIN
    CREATE TABLE BankAccounts (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId       INT NOT NULL,
        AccountId       INT NOT NULL,
        BankName        NVARCHAR(100) NOT NULL,
        BranchName      NVARCHAR(100) NOT NULL,
        AccountNumber   NVARCHAR(50) NOT NULL,
        IFSCCode        NVARCHAR(20) NULL,
        SwiftCode       NVARCHAR(20) NULL,
        AccountType     NVARCHAR(30) NOT NULL DEFAULT 'Current',
        OpeningBalance  DECIMAL(18,2) NOT NULL DEFAULT 0,
        CurrentBalance  DECIMAL(18,2) NOT NULL DEFAULT 0,
        IsActive        BIT NOT NULL DEFAULT 1,
        CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CreatedBy       INT NULL,
        CONSTRAINT FK_BankAccounts_Companies       FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
        CONSTRAINT FK_BankAccounts_ChartOfAccounts FOREIGN KEY (AccountId) REFERENCES ChartOfAccounts(Id)
    );
    PRINT 'Created: BankAccounts';
END
ELSE PRINT 'Exists: BankAccounts';
GO

-- PaymentModes
IF OBJECT_ID('PaymentModes', 'U') IS NULL
BEGIN
    CREATE TABLE PaymentModes (
        Id               INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId        INT NOT NULL,
        ModeName         NVARCHAR(100) NOT NULL,
        Description      NVARCHAR(500) NULL,
        DefaultAccountId INT NULL,
        IsActive         BIT NOT NULL DEFAULT 1,
        CreatedAt        DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CreatedBy        INT NULL,
        CONSTRAINT FK_PaymentModes_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
        CONSTRAINT FK_PaymentModes_Accounts  FOREIGN KEY (DefaultAccountId) REFERENCES ChartOfAccounts(Id)
    );
    PRINT 'Created: PaymentModes';
END
ELSE PRINT 'Exists: PaymentModes';
GO

-- CostCenters
IF OBJECT_ID('CostCenters', 'U') IS NULL
BEGIN
    CREATE TABLE CostCenters (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId       INT NOT NULL,
        CostCenterCode  NVARCHAR(50) NOT NULL,
        CostCenterName  NVARCHAR(100) NOT NULL,
        Description     NVARCHAR(500) NULL,
        IsActive        BIT NOT NULL DEFAULT 1,
        CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CreatedBy       INT NULL,
        CONSTRAINT FK_CostCenters_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
    );
    PRINT 'Created: CostCenters';
END
ELSE PRINT 'Exists: CostCenters';
GO

-- AccountOpeningBalances
IF OBJECT_ID('AccountOpeningBalances', 'U') IS NULL
BEGIN
    CREATE TABLE AccountOpeningBalances (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId       INT NOT NULL,
        FinancialYearId INT NOT NULL,
        AccountId       INT NOT NULL,
        OpeningBalance  DECIMAL(18,2) NOT NULL DEFAULT 0,
        BalanceType     NVARCHAR(10) NOT NULL DEFAULT 'Debit',
        CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_AOB_Companies       FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
        CONSTRAINT FK_AOB_FinancialYears  FOREIGN KEY (FinancialYearId) REFERENCES FinancialYears(Id),
        CONSTRAINT FK_AOB_ChartOfAccounts FOREIGN KEY (AccountId) REFERENCES ChartOfAccounts(Id)
    );
    PRINT 'Created: AccountOpeningBalances';
END
ELSE PRINT 'Exists: AccountOpeningBalances';
GO

-- ============================================================
-- SECTION 3: SEED DATA (skip if already seeded)
-- ============================================================

-- Roles
IF NOT EXISTS (SELECT 1 FROM Roles)
BEGIN
    INSERT INTO Roles (RoleName) VALUES ('SuperAdmin'), ('Admin'), ('Manager'), ('Employee');
    PRINT 'Seeded: Roles';
END
GO

-- Permissions — uses correct columns (Description, Category now exist after patch above)
IF NOT EXISTS (SELECT 1 FROM Permissions)
BEGIN
    INSERT INTO Permissions (Name, Description, Category) VALUES
    ('Dashboard_View',    'View dashboard',                'General'),
    ('Inventory_View',    'View inventory',                'Inventory'),
    ('Inventory_Manage',  'Create/edit inventory',         'Inventory'),
    ('Inventory_Delete',  'Delete inventory records',      'Inventory'),
    ('Purchase_View',     'View purchase records',         'Purchase'),
    ('Purchase_Manage',   'Create/edit purchase records',  'Purchase'),
    ('Purchase_Delete',   'Delete purchase records',       'Purchase'),
    ('Purchase_Approve',  'Approve purchase returns',      'Purchase'),
    ('Sales_View',        'View sales records',            'Sales'),
    ('Sales_Manage',      'Create/edit sales records',     'Sales'),
    ('Sales_Delete',      'Delete sales records',          'Sales'),
    ('Sales_Approve',     'Approve sales returns',         'Sales'),
    ('Accounts_View',     'View accounts & reports',       'Finance'),
    ('Accounts_Manage',   'Create vouchers & accounts',    'Finance'),
    ('Accounts_Reports',  'Generate financial reports',    'Finance'),
    ('CRM_View',          'View CRM data',                 'CRM'),
    ('CRM_Manage',        'Create/edit CRM records',       'CRM'),
    ('HRM_View',          'View HR records',               'HRM'),
    ('HRM_Manage',        'Manage employees & attendance', 'HRM'),
    ('Payroll_Manage',    'Process payroll',               'HRM'),
    ('Projects_View',     'View projects',                 'Projects'),
    ('Projects_Manage',   'Create/edit projects',          'Projects'),
    ('Helpdesk_View',     'View helpdesk tickets',         'Helpdesk'),
    ('Helpdesk_Manage',   'Manage tickets',                'Helpdesk'),
    ('Assets_View',       'View assets',                   'Assets'),
    ('Assets_Manage',     'Create/edit assets',            'Assets'),
    ('Assets_Dispose',    'Dispose assets',                'Assets'),
    ('Logistics_View',    'View logistics',                'Logistics'),
    ('Logistics_Manage',  'Manage shipments',              'Logistics'),
    ('Production_View',   'View production orders',        'Production'),
    ('Production_Manage', 'Manage production & BOM',       'Production'),
    ('Billing_View',      'View billing invoices',         'Billing'),
    ('Billing_Manage',    'Create/edit billing invoices',  'Billing'),
    ('POS_View',          'View POS orders',               'POS'),
    ('POS_Manage',        'Process POS sales',             'POS'),
    ('Users_View',        'View users',                    'Admin'),
    ('Users_Manage',      'Create/edit users',             'Admin'),
    ('Roles_Manage',      'Manage roles & permissions',    'Admin'),
    ('AuditLogs_View',    'View audit logs',               'Admin'),
    ('Settings_Manage',   'Manage company settings',       'Admin');
    PRINT 'Seeded: Permissions';
END
GO

-- GlobalModules
IF NOT EXISTS (SELECT 1 FROM GlobalModules)
BEGIN
    INSERT INTO GlobalModules (ModuleId, Name, Description, Category, Icon, IsBuiltIn, IsActive, SortOrder, CreatedAt) VALUES
    ('inventory',  'Inventory Management', 'Products, stock, warehouses, transfers',       'Operations',    'Archive',      1,1, 1,GETUTCDATE()),
    ('purchase',   'Purchase Management',  'Vendors, POs, invoices, payments',             'Operations',    'ShoppingCart', 1,1, 2,GETUTCDATE()),
    ('sales',      'Sales Management',     'Customers, quotations, invoices',              'Operations',    'TrendingUp',   1,1, 3,GETUTCDATE()),
    ('accounts',   'Accounts & Finance',   'Chart of accounts, vouchers, reports',         'Finance',       'BookOpen',     1,1, 4,GETUTCDATE()),
    ('crm',        'CRM',                  'Leads, opportunities, follow-ups',             'Sales',         'Users',        1,1, 5,GETUTCDATE()),
    ('hrm',        'HRM',                  'Employees, attendance, payroll',               'HR',            'Users',        1,1, 6,GETUTCDATE()),
    ('projects',   'Projects',             'Project management, tasks, timesheets',        'Operations',    'Briefcase',    1,1, 7,GETUTCDATE()),
    ('helpdesk',   'Helpdesk',             'Ticket management, SLA monitoring',            'Support',       'Headphones',   1,1, 8,GETUTCDATE()),
    ('assets',     'Assets',               'Asset tracking, depreciation, maintenance',    'Finance',       'Package',      1,1, 9,GETUTCDATE()),
    ('logistics',  'Logistics',            'Shipment tracking, delivery management',       'Operations',    'Truck',        1,1,10,GETUTCDATE()),
    ('production', 'Production',           'BOM, work orders, quality control',            'Manufacturing', 'Factory',      1,1,11,GETUTCDATE()),
    ('billing',    'Billing',              'Invoice management, payment reminders',        'Finance',       'Receipt',      1,1,12,GETUTCDATE()),
    ('pos',        'POS',                  'Point of Sale, billing, payments',             'Operations',    'Receipt',      1,1,13,GETUTCDATE());
    PRINT 'Seeded: GlobalModules';
END
GO

-- SubscriptionPlans — uses correct column names: MonthlyPrice (not Price), no DurationDays
IF NOT EXISTS (SELECT 1 FROM SubscriptionPlans)
BEGIN
    INSERT INTO SubscriptionPlans (Name, Description, MonthlyPrice, PricePerUser, MaxSeats, MaxModules, AllowedModules, IsActive, CreatedAt)
    VALUES
    ('Trial',        'Free 30-day trial with all modules',       0,     0,   5,  13,
     'inventory,purchase,sales,accounts,crm,hrm,projects,helpdesk,assets,logistics,production,billing,pos',
     1, GETUTCDATE()),
    ('Starter',      'Essential modules for small businesses',   2999,  0,  10,   4,
     'inventory,purchase,sales,accounts',
     1, GETUTCDATE()),
    ('Professional', 'Full ERP suite for growing companies',     7999,  0,  25,  11,
     'inventory,purchase,sales,accounts,crm,hrm,projects,helpdesk,assets,billing,pos',
     1, GETUTCDATE()),
    ('Enterprise',   'All modules, unlimited users',             14999, 0, 999,  13,
     'inventory,purchase,sales,accounts,crm,hrm,projects,helpdesk,assets,logistics,production,billing,pos',
     1, GETUTCDATE());
    PRINT 'Seeded: SubscriptionPlans';
END
GO

-- ============================================================
-- SECTION 4: INITIALIZE ACCOUNTS FOR EXISTING COMPANIES
-- Runs for any company that has no ChartOfAccounts yet
-- ============================================================

DECLARE @CompanyId INT;
DECLARE company_cursor CURSOR FOR
    SELECT Id FROM Companies
    WHERE Id NOT IN (SELECT DISTINCT CompanyId FROM ChartOfAccounts);

OPEN company_cursor;
FETCH NEXT FROM company_cursor INTO @CompanyId;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Initializing accounts for CompanyId: ' + CAST(@CompanyId AS NVARCHAR);

    -- Financial Year with FYCode
    IF NOT EXISTS (SELECT 1 FROM FinancialYears WHERE CompanyId = @CompanyId)
    BEGIN
        DECLARE @StartDate DATE = DATEFROMPARTS(YEAR(GETDATE()), 4, 1);
        DECLARE @EndDate   DATE = DATEFROMPARTS(YEAR(GETDATE())+1, 3, 31);
        DECLARE @FYCode    NVARCHAR(30) =
            'FY' + CAST(YEAR(@StartDate) AS NVARCHAR)
            + '-' + RIGHT('0' + CAST(YEAR(@EndDate) % 100 AS NVARCHAR), 2)
            + '-C' + RIGHT('0000' + CAST(@CompanyId AS NVARCHAR), 4);

        INSERT INTO FinancialYears (CompanyId, FYCode, YearName, StartDate, EndDate, IsActive, IsClosed, CreatedAt)
        VALUES (@CompanyId, @FYCode,
                'FY ' + CAST(YEAR(GETDATE()) AS NVARCHAR) + '-' + RIGHT('0' + CAST((YEAR(GETDATE())+1) % 100 AS NVARCHAR), 2),
                @StartDate, @EndDate, 1, 0, GETUTCDATE());
    END

    -- Default 35 Chart of Accounts
    INSERT INTO ChartOfAccounts
        (CompanyId,AccountCode,AccountName,AccountType,AccountGroup,ParentAccountCode,IsGroup,Level,OpeningBalance,OpeningBalanceType,Currency,IsSystemAccount,IsActive,CreatedAt)
    VALUES
    (@CompanyId,'1000','Assets',               'Asset',    'Assets',              NULL,   1,1,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'1100','Current Assets',       'Asset',    'Current Assets',      '1000', 1,2,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'1110','Cash Account',         'Asset',    'Cash',                '1100', 0,3,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'1120','Bank Account',         'Asset',    'Bank',                '1100', 0,3,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'1130','Accounts Receivable',  'Asset',    'Accounts Receivable', '1100', 0,3,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'1140','Inventory Account',    'Asset',    'Inventory',           '1100', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'1150','Prepaid Expenses',     'Asset',    'Current Assets',      '1100', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'1200','Fixed Assets',         'Asset',    'Fixed Assets',        '1000', 1,2,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'1210','Property & Equipment', 'Asset',    'Fixed Assets',        '1200', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'1220','Accum. Depreciation',  'Asset',    'Fixed Assets',        '1200', 0,3,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'2000','Liabilities',          'Liability','Liabilities',         NULL,   1,1,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'2100','Current Liabilities',  'Liability','Current Liabilities', '2000', 1,2,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'2110','Accounts Payable',     'Liability','Accounts Payable',    '2100', 0,3,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'2120','Salary Payable',       'Liability','Current Liabilities', '2100', 0,3,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'2130','Tax Payable',          'Liability','Current Liabilities', '2100', 0,3,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'2140','GST Payable',          'Liability','Current Liabilities', '2100', 0,3,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'2200','Long-term Liabilities','Liability','Long-term Liabilities','2000',1,2,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'2210','Bank Loan',            'Liability','Long-term Liabilities','2200',0,3,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'3000','Equity',               'Equity',   'Equity',              NULL,   1,1,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'3100','Owner''s Capital',     'Equity',   'Equity',              '3000', 0,2,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'3200','Retained Earnings',    'Equity',   'Equity',              '3000', 0,2,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'4000','Income',               'Income',   'Income',              NULL,   1,1,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'4100','Sales Account',        'Income',   'Sales',               '4000', 0,2,0,'Credit','INR',1,1,GETUTCDATE()),
    (@CompanyId,'4200','Service Revenue',      'Income',   'Sales',               '4000', 0,2,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'4300','Other Income',         'Income',   'Other Income',        '4000', 0,2,0,'Credit','INR',0,1,GETUTCDATE()),
    (@CompanyId,'5000','Expenses',             'Expense',  'Expenses',            NULL,   1,1,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'5100','Direct Expenses',      'Expense',  'Direct Expenses',     '5000', 1,2,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'5110','Purchase Account',     'Expense',  'Purchase',            '5100', 0,3,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'5120','Cost of Goods Sold',   'Expense',  'Direct Expenses',     '5100', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'5200','Indirect Expenses',    'Expense',  'Indirect Expenses',   '5000', 1,2,0,'Debit', 'INR',1,1,GETUTCDATE()),
    (@CompanyId,'5210','Salary Expense',       'Expense',  'Indirect Expenses',   '5200', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'5220','Rent Expense',         'Expense',  'Indirect Expenses',   '5200', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'5230','Utilities Expense',    'Expense',  'Indirect Expenses',   '5200', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'5240','Freight Charges',      'Expense',  'Indirect Expenses',   '5200', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE()),
    (@CompanyId,'5250','Depreciation Expense', 'Expense',  'Indirect Expenses',   '5200', 0,3,0,'Debit', 'INR',0,1,GETUTCDATE());

    PRINT 'Done: CompanyId ' + CAST(@CompanyId AS NVARCHAR);
    FETCH NEXT FROM company_cursor INTO @CompanyId;
END

CLOSE company_cursor;
DEALLOCATE company_cursor;
GO

-- ============================================================
-- SECTION 5: VERIFICATION
-- ============================================================
PRINT '=== VERIFICATION ===';

SELECT t.TABLE_NAME, 'EXISTS' AS Status
FROM INFORMATION_SCHEMA.TABLES t
WHERE t.TABLE_NAME IN (
    'FinancialYears','ChartOfAccounts','JournalVouchers','JournalVoucherEntries',
    'PaymentVouchers','ReceiptVouchers','BankAccounts','PaymentModes',
    'CostCenters','AccountOpeningBalances'
)
ORDER BY t.TABLE_NAME;

SELECT 'Roles'             AS [Table], COUNT(*) AS Rows FROM Roles
UNION ALL SELECT 'Permissions',        COUNT(*) FROM Permissions
UNION ALL SELECT 'GlobalModules',      COUNT(*) FROM GlobalModules
UNION ALL SELECT 'SubscriptionPlans',  COUNT(*) FROM SubscriptionPlans
UNION ALL SELECT 'ChartOfAccounts',    COUNT(*) FROM ChartOfAccounts
UNION ALL SELECT 'FinancialYears',     COUNT(*) FROM FinancialYears;
GO

PRINT 'Setup complete. Restart your .NET API to apply all changes.';
GO
