-- ============================================================
-- ERP PlugandPlay - Full SQL Server Setup Script
-- Safe to re-run: drops all FKs first, then drops & recreates all tables
-- ============================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ERPPlugandPlayDB')
BEGIN
    CREATE DATABASE ERPPlugandPlayDB;
    PRINT 'Database ERPPlugandPlayDB created.';
END
ELSE
    PRINT 'Database ERPPlugandPlayDB already exists.';
GO

USE ERPPlugandPlayDB;
GO

-- ============================================================
-- STEP 1: DROP ALL FOREIGN KEY CONSTRAINTS
-- ============================================================
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
             + '.' + QUOTENAME(OBJECT_NAME(parent_object_id))
             + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys;
IF LEN(@sql) > 0 EXEC sp_executesql @sql;
PRINT 'All foreign key constraints dropped.';
GO

-- ============================================================
-- STEP 2: DROP ALL TABLES
-- ============================================================
IF OBJECT_ID('PosOrderItems',         'U') IS NOT NULL DROP TABLE PosOrderItems;
IF OBJECT_ID('PosOrders',             'U') IS NOT NULL DROP TABLE PosOrders;
IF OBJECT_ID('PosSessions',           'U') IS NOT NULL DROP TABLE PosSessions;
IF OBJECT_ID('PaymentReminders',      'U') IS NOT NULL DROP TABLE PaymentReminders;
IF OBJECT_ID('BillingInvoiceItems',   'U') IS NOT NULL DROP TABLE BillingInvoiceItems;
IF OBJECT_ID('BillingInvoices',       'U') IS NOT NULL DROP TABLE BillingInvoices;
IF OBJECT_ID('QualityChecks',         'U') IS NOT NULL DROP TABLE QualityChecks;
IF OBJECT_ID('ProductionOrders',      'U') IS NOT NULL DROP TABLE ProductionOrders;
IF OBJECT_ID('BomItems',              'U') IS NOT NULL DROP TABLE BomItems;
IF OBJECT_ID('BillsOfMaterial',       'U') IS NOT NULL DROP TABLE BillsOfMaterial;
IF OBJECT_ID('DeliveryFeedbacks',     'U') IS NOT NULL DROP TABLE DeliveryFeedbacks;
IF OBJECT_ID('DeliveryRoutes',        'U') IS NOT NULL DROP TABLE DeliveryRoutes;
IF OBJECT_ID('ShipmentOrders',        'U') IS NOT NULL DROP TABLE ShipmentOrders;
IF OBJECT_ID('Carriers',              'U') IS NOT NULL DROP TABLE Carriers;
IF OBJECT_ID('AssetDisposals',        'U') IS NOT NULL DROP TABLE AssetDisposals;
IF OBJECT_ID('AssetMaintenances',     'U') IS NOT NULL DROP TABLE AssetMaintenances;
IF OBJECT_ID('Assets',                'U') IS NOT NULL DROP TABLE Assets;
IF OBJECT_ID('TicketComments',        'U') IS NOT NULL DROP TABLE TicketComments;
IF OBJECT_ID('HelpdeskTickets',       'U') IS NOT NULL DROP TABLE HelpdeskTickets;
IF OBJECT_ID('Timesheets',            'U') IS NOT NULL DROP TABLE Timesheets;
IF OBJECT_ID('ProjectTasks',          'U') IS NOT NULL DROP TABLE ProjectTasks;
IF OBJECT_ID('Projects',              'U') IS NOT NULL DROP TABLE Projects;
IF OBJECT_ID('LeaveRequests',         'U') IS NOT NULL DROP TABLE LeaveRequests;
IF OBJECT_ID('LeaveTypes',            'U') IS NOT NULL DROP TABLE LeaveTypes;
IF OBJECT_ID('Attendances',           'U') IS NOT NULL DROP TABLE Attendances;
IF OBJECT_ID('CrmActivities',         'U') IS NOT NULL DROP TABLE CrmActivities;
IF OBJECT_ID('Opportunities',         'U') IS NOT NULL DROP TABLE Opportunities;
IF OBJECT_ID('Leads',                 'U') IS NOT NULL DROP TABLE Leads;
IF OBJECT_ID('ProductReceiveItems',   'U') IS NOT NULL DROP TABLE ProductReceiveItems;
IF OBJECT_ID('ProductReceives',       'U') IS NOT NULL DROP TABLE ProductReceives;
IF OBJECT_ID('ProductTransferItems',  'U') IS NOT NULL DROP TABLE ProductTransferItems;
IF OBJECT_ID('ProductTransfers',      'U') IS NOT NULL DROP TABLE ProductTransfers;
IF OBJECT_ID('MaterialDispatchItems', 'U') IS NOT NULL DROP TABLE MaterialDispatchItems;
IF OBJECT_ID('MaterialDispatches',    'U') IS NOT NULL DROP TABLE MaterialDispatches;
IF OBJECT_ID('ReceiptVouchers',       'U') IS NOT NULL DROP TABLE ReceiptVouchers;
IF OBJECT_ID('PaymentVouchers',       'U') IS NOT NULL DROP TABLE PaymentVouchers;
IF OBJECT_ID('JournalVoucherEntries', 'U') IS NOT NULL DROP TABLE JournalVoucherEntries;
IF OBJECT_ID('JournalVouchers',       'U') IS NOT NULL DROP TABLE JournalVouchers;
IF OBJECT_ID('ChartOfAccounts',       'U') IS NOT NULL DROP TABLE ChartOfAccounts;
IF OBJECT_ID('CustomerDebitNotes',    'U') IS NOT NULL DROP TABLE CustomerDebitNotes;
IF OBJECT_ID('CustomerCreditNotes',   'U') IS NOT NULL DROP TABLE CustomerCreditNotes;
IF OBJECT_ID('CustomerPayments',      'U') IS NOT NULL DROP TABLE CustomerPayments;
IF OBJECT_ID('SalesReturnItems',      'U') IS NOT NULL DROP TABLE SalesReturnItems;
IF OBJECT_ID('SalesReturns',          'U') IS NOT NULL DROP TABLE SalesReturns;
IF OBJECT_ID('SalesInvoiceItems',     'U') IS NOT NULL DROP TABLE SalesInvoiceItems;
IF OBJECT_ID('SalesInvoices',         'U') IS NOT NULL DROP TABLE SalesInvoices;
IF OBJECT_ID('QuotationItems',        'U') IS NOT NULL DROP TABLE QuotationItems;
IF OBJECT_ID('Quotations',            'U') IS NOT NULL DROP TABLE Quotations;
IF OBJECT_ID('Customers',             'U') IS NOT NULL DROP TABLE Customers;
IF OBJECT_ID('VendorDebitNotes',      'U') IS NOT NULL DROP TABLE VendorDebitNotes;
IF OBJECT_ID('VendorCreditNotes',     'U') IS NOT NULL DROP TABLE VendorCreditNotes;
IF OBJECT_ID('VendorPayments',        'U') IS NOT NULL DROP TABLE VendorPayments;
IF OBJECT_ID('PurchaseReturnItems',   'U') IS NOT NULL DROP TABLE PurchaseReturnItems;
IF OBJECT_ID('PurchaseReturns',       'U') IS NOT NULL DROP TABLE PurchaseReturns;
IF OBJECT_ID('PurchaseInvoiceItems',  'U') IS NOT NULL DROP TABLE PurchaseInvoiceItems;
IF OBJECT_ID('PurchaseInvoices',      'U') IS NOT NULL DROP TABLE PurchaseInvoices;
IF OBJECT_ID('Vendors',               'U') IS NOT NULL DROP TABLE Vendors;
IF OBJECT_ID('StockTransactions',     'U') IS NOT NULL DROP TABLE StockTransactions;
IF OBJECT_ID('Products',              'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Categories',            'U') IS NOT NULL DROP TABLE Categories;
IF OBJECT_ID('Salaries',              'U') IS NOT NULL DROP TABLE Salaries;
IF OBJECT_ID('Employees',             'U') IS NOT NULL DROP TABLE Employees;
IF OBJECT_ID('Designations',          'U') IS NOT NULL DROP TABLE Designations;
IF OBJECT_ID('Departments',           'U') IS NOT NULL DROP TABLE Departments;
IF OBJECT_ID('CompanyModules',        'U') IS NOT NULL DROP TABLE CompanyModules;
IF OBJECT_ID('CompanySubscriptions',  'U') IS NOT NULL DROP TABLE CompanySubscriptions;
IF OBJECT_ID('SubscriptionPlans',     'U') IS NOT NULL DROP TABLE SubscriptionPlans;
IF OBJECT_ID('Companies',             'U') IS NOT NULL DROP TABLE Companies;
IF OBJECT_ID('AuditLogs',             'U') IS NOT NULL DROP TABLE AuditLogs;
IF OBJECT_ID('GlobalModules',         'U') IS NOT NULL DROP TABLE GlobalModules;
IF OBJECT_ID('RolePermissions',       'U') IS NOT NULL DROP TABLE RolePermissions;
IF OBJECT_ID('Permissions',           'U') IS NOT NULL DROP TABLE Permissions;
IF OBJECT_ID('Users',                 'U') IS NOT NULL DROP TABLE Users;
IF OBJECT_ID('Roles',                 'U') IS NOT NULL DROP TABLE Roles;
PRINT 'All tables dropped.';
GO

-- ============================================================
-- STEP 3: CREATE ALL TABLES
-- ============================================================

-- AUTH
CREATE TABLE Roles (
    Id       INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Permissions (
    Id   INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL
);

CREATE TABLE RolePermissions (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    RoleId       INT NOT NULL REFERENCES Roles(Id)       ON DELETE CASCADE,
    PermissionId INT NOT NULL REFERENCES Permissions(Id) ON DELETE CASCADE
);

CREATE TABLE Users (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    Name          NVARCHAR(200) NOT NULL,
    Email         NVARCHAR(200) NOT NULL UNIQUE,
    PasswordHash  NVARCHAR(500) NOT NULL,
    PlainPassword NVARCHAR(200),
    RoleId        INT NOT NULL REFERENCES Roles(Id),
    IsActive      BIT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- COMPANY & SUBSCRIPTIONS
CREATE TABLE Companies (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    Code           NVARCHAR(50),
    Name           NVARCHAR(300) NOT NULL,
    CompanyType    NVARCHAR(50)  NOT NULL DEFAULT 'private_limited',
    Industry       NVARCHAR(100),
    Email          NVARCHAR(200) NOT NULL UNIQUE,
    Phone          NVARCHAR(50),
    Street         NVARCHAR(500),
    City           NVARCHAR(100),
    State          NVARCHAR(100),
    Country        NVARCHAR(100),
    PostalCode     NVARCHAR(20),
    GSTNumber      NVARCHAR(50),
    TaxNumber      NVARCHAR(50),
    Status         NVARCHAR(20)  NOT NULL DEFAULT 'active',
    Logo           NVARCHAR(MAX),
    AdminName      NVARCHAR(200),
    AdminEmail     NVARCHAR(200),
    AdminPhone     NVARCHAR(50),
    AdminPassword  NVARCHAR(200),
    IsTrialActive  BIT           NOT NULL DEFAULT 1,
    TrialStartDate DATETIME2,
    TrialEndDate   DATETIME2,
    CreatedAt      DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt      DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE SubscriptionPlans (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Name         NVARCHAR(100) NOT NULL,
    MonthlyPrice DECIMAL(18,2) NOT NULL,
    MaxSeats     INT NOT NULL DEFAULT 0,
    MaxModules   INT NOT NULL DEFAULT 12,
    Description  NVARCHAR(500),
    IsActive     BIT NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE CompanySubscriptions (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    PlanId          INT NOT NULL REFERENCES SubscriptionPlans(Id),
    Status          NVARCHAR(20) NOT NULL DEFAULT 'Active',
    StartDate       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    EndDate         DATETIME2,
    NextBillingDate DATETIME2 NOT NULL,
    UsedSeats       INT NOT NULL DEFAULT 0,
    IsProrated      BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE CompanyModules (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    ModuleId      NVARCHAR(50) NOT NULL,
    IsEnabled     BIT NOT NULL DEFAULT 1,
    IsTrialAccess BIT NOT NULL DEFAULT 0,
    UpdatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- HR / PAYROLL
CREATE TABLE Departments (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    Name      NVARCHAR(200) NOT NULL,
    CompanyId INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE
);

CREATE TABLE Designations (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    Name      NVARCHAR(200) NOT NULL,
    CompanyId INT NOT NULL
);

CREATE TABLE Employees (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id),
    Name          NVARCHAR(200) NOT NULL,
    Email         NVARCHAR(200),
    Phone         NVARCHAR(50),
    DepartmentId  INT NOT NULL REFERENCES Departments(Id),
    DesignationId INT NOT NULL REFERENCES Designations(Id),
    JoinDate      DATETIME2 NOT NULL,
    Salary        DECIMAL(18,2) NOT NULL DEFAULT 0
);

CREATE TABLE Salaries (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId  INT NOT NULL REFERENCES Employees(Id) ON DELETE CASCADE,
    Basic       DECIMAL(18,2) NOT NULL,
    HRA         DECIMAL(18,2) NOT NULL,
    Allowances  DECIMAL(18,2) NOT NULL,
    Deductions  DECIMAL(18,2) NOT NULL,
    NetSalary   DECIMAL(18,2) NOT NULL,
    Month       INT NOT NULL,
    Year        INT NOT NULL,
    GeneratedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- INVENTORY
CREATE TABLE Categories (
    Id   INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL
);

CREATE TABLE Products (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    Name       NVARCHAR(300) NOT NULL,
    CategoryId INT NOT NULL REFERENCES Categories(Id),
    Price      DECIMAL(18,2) NOT NULL DEFAULT 0,
    StockQty   INT NOT NULL DEFAULT 0
);

CREATE TABLE StockTransactions (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL REFERENCES Products(Id) ON DELETE CASCADE,
    Quantity  INT NOT NULL,
    Type      NVARCHAR(10) NOT NULL,
    Date      DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Remarks   NVARCHAR(500)
);

CREATE TABLE MaterialDispatches (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    DispatchNumber NVARCHAR(50) NOT NULL UNIQUE,
    DispatchDate  DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ToLocation    NVARCHAR(300) NOT NULL,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    Notes         NVARCHAR(500),
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE MaterialDispatchItems (
    Id                 INT IDENTITY(1,1) PRIMARY KEY,
    MaterialDispatchId INT NOT NULL REFERENCES MaterialDispatches(Id) ON DELETE CASCADE,
    ProductId          INT NOT NULL REFERENCES Products(Id),
    Quantity           INT NOT NULL
);

CREATE TABLE ProductTransfers (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId      INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    TransferNumber NVARCHAR(50) NOT NULL UNIQUE,
    TransferDate   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FromLocation   NVARCHAR(300) NOT NULL,
    ToLocation     NVARCHAR(300) NOT NULL,
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    Notes          NVARCHAR(500),
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE ProductTransferItems (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    ProductTransferId INT NOT NULL REFERENCES ProductTransfers(Id) ON DELETE CASCADE,
    ProductId         INT NOT NULL REFERENCES Products(Id),
    Quantity          INT NOT NULL
);

CREATE TABLE ProductReceives (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    GRNNumber     NVARCHAR(50) NOT NULL UNIQUE,
    ReceiveDate   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    VendorId      INT NULL,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Received',
    Notes         NVARCHAR(500),
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE ProductReceiveItems (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    ProductReceiveId INT NOT NULL REFERENCES ProductReceives(Id) ON DELETE CASCADE,
    ProductId        INT NOT NULL REFERENCES Products(Id),
    Quantity         INT NOT NULL,
    UnitCost         DECIMAL(18,2) NOT NULL DEFAULT 0
);

-- PURCHASE
CREATE TABLE Vendors (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    Name          NVARCHAR(300) NOT NULL,
    Email         NVARCHAR(200),
    Phone         NVARCHAR(50),
    Address       NVARCHAR(500),
    GSTNumber     NVARCHAR(50),
    ContactPerson NVARCHAR(200),
    IsActive      BIT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Add FK now that Vendors exists
ALTER TABLE ProductReceives
    ADD CONSTRAINT FK_ProductReceives_Vendors
    FOREIGN KEY (VendorId) REFERENCES Vendors(Id);

CREATE TABLE PurchaseInvoices (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId      INT NOT NULL REFERENCES Companies(Id),
    VendorId       INT NOT NULL REFERENCES Vendors(Id),
    InvoiceNumber  NVARCHAR(50) NOT NULL UNIQUE,
    InvoiceDate    DATETIME2 NOT NULL,
    DueDate        DATETIME2,
    SubTotal       DECIMAL(18,2) NOT NULL DEFAULT 0,
    TaxAmount      DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount    DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaidAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    BalanceAmount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    Notes          NVARCHAR(MAX),
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE PurchaseInvoiceItems (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    PurchaseInvoiceId INT NOT NULL REFERENCES PurchaseInvoices(Id) ON DELETE CASCADE,
    ProductId         INT NOT NULL REFERENCES Products(Id),
    Quantity          INT NOT NULL,
    UnitPrice         DECIMAL(18,2) NOT NULL,
    TaxPercent        DECIMAL(5,2)  NOT NULL DEFAULT 0,
    DiscountPercent   DECIMAL(5,2)  NOT NULL DEFAULT 0,
    TotalPrice        DECIMAL(18,2) NOT NULL
);

CREATE TABLE PurchaseReturns (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    PurchaseInvoiceId INT NOT NULL REFERENCES PurchaseInvoices(Id),
    ReturnNumber      NVARCHAR(50) NOT NULL UNIQUE,
    ReturnDate        DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ReturnAmount      DECIMAL(18,2) NOT NULL DEFAULT 0,
    Reason            NVARCHAR(500),
    Status            NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE PurchaseReturnItems (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    PurchaseReturnId INT NOT NULL REFERENCES PurchaseReturns(Id) ON DELETE CASCADE,
    ProductId        INT NOT NULL REFERENCES Products(Id),
    Quantity         INT NOT NULL,
    UnitPrice        DECIMAL(18,2) NOT NULL,
    TotalPrice       DECIMAL(18,2) NOT NULL
);

CREATE TABLE VendorPayments (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    VendorId          INT NOT NULL REFERENCES Vendors(Id),
    PurchaseInvoiceId INT NOT NULL REFERENCES PurchaseInvoices(Id),
    Amount            DECIMAL(18,2) NOT NULL,
    PaymentMode       NVARCHAR(50) NOT NULL,
    ReferenceNumber   NVARCHAR(100),
    PaymentDate       DATETIME2 NOT NULL,
    Notes             NVARCHAR(500),
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE VendorCreditNotes (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    VendorId          INT NOT NULL REFERENCES Vendors(Id),
    PurchaseInvoiceId INT REFERENCES PurchaseInvoices(Id),
    NoteNumber        NVARCHAR(50) NOT NULL UNIQUE,
    NoteDate          DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Amount            DECIMAL(18,2) NOT NULL,
    Reason            NVARCHAR(500),
    Status            NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE VendorDebitNotes (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    VendorId          INT NOT NULL REFERENCES Vendors(Id),
    PurchaseInvoiceId INT REFERENCES PurchaseInvoices(Id),
    NoteNumber        NVARCHAR(50) NOT NULL UNIQUE,
    NoteDate          DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Amount            DECIMAL(18,2) NOT NULL,
    Reason            NVARCHAR(500),
    Status            NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- SALES
CREATE TABLE Customers (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    Name          NVARCHAR(300) NOT NULL,
    Email         NVARCHAR(200),
    Phone         NVARCHAR(50),
    Address       NVARCHAR(500),
    GSTNumber     NVARCHAR(50),
    ContactPerson NVARCHAR(200),
    CreditLimit   DECIMAL(18,2) NOT NULL DEFAULT 0,
    IsActive      BIT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE Quotations (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL REFERENCES Companies(Id),
    CustomerId      INT NOT NULL REFERENCES Customers(Id),
    QuotationNumber NVARCHAR(50) NOT NULL UNIQUE,
    QuotationDate   DATETIME2 NOT NULL,
    ValidUntil      DATETIME2,
    SubTotal        DECIMAL(18,2) NOT NULL DEFAULT 0,
    TaxAmount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'Draft',
    Notes           NVARCHAR(MAX),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE QuotationItems (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    QuotationId     INT NOT NULL REFERENCES Quotations(Id) ON DELETE CASCADE,
    ProductId       INT NOT NULL REFERENCES Products(Id),
    Quantity        INT NOT NULL,
    UnitPrice       DECIMAL(18,2) NOT NULL,
    TaxPercent      DECIMAL(5,2)  NOT NULL DEFAULT 0,
    DiscountPercent DECIMAL(5,2)  NOT NULL DEFAULT 0,
    TotalPrice      DECIMAL(18,2) NOT NULL
);

CREATE TABLE SalesInvoices (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId      INT NOT NULL REFERENCES Companies(Id),
    CustomerId     INT NOT NULL REFERENCES Customers(Id),
    QuotationId    INT REFERENCES Quotations(Id),
    InvoiceNumber  NVARCHAR(50) NOT NULL UNIQUE,
    InvoiceDate    DATETIME2 NOT NULL,
    DueDate        DATETIME2,
    SubTotal       DECIMAL(18,2) NOT NULL DEFAULT 0,
    TaxAmount      DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount    DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaidAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    BalanceAmount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    Notes          NVARCHAR(MAX),
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE SalesInvoiceItems (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    SalesInvoiceId  INT NOT NULL REFERENCES SalesInvoices(Id) ON DELETE CASCADE,
    ProductId       INT NOT NULL REFERENCES Products(Id),
    Quantity        INT NOT NULL,
    UnitPrice       DECIMAL(18,2) NOT NULL,
    TaxPercent      DECIMAL(5,2)  NOT NULL DEFAULT 0,
    DiscountPercent DECIMAL(5,2)  NOT NULL DEFAULT 0,
    TotalPrice      DECIMAL(18,2) NOT NULL
);

CREATE TABLE SalesReturns (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    SalesInvoiceId INT NOT NULL REFERENCES SalesInvoices(Id),
    ReturnNumber   NVARCHAR(50) NOT NULL UNIQUE,
    ReturnDate     DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ReturnAmount   DECIMAL(18,2) NOT NULL DEFAULT 0,
    Reason         NVARCHAR(500),
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE SalesReturnItems (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    SalesReturnId INT NOT NULL REFERENCES SalesReturns(Id) ON DELETE CASCADE,
    ProductId     INT NOT NULL REFERENCES Products(Id),
    Quantity      INT NOT NULL,
    UnitPrice     DECIMAL(18,2) NOT NULL,
    TotalPrice    DECIMAL(18,2) NOT NULL
);

CREATE TABLE CustomerPayments (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId      INT NOT NULL REFERENCES Customers(Id),
    SalesInvoiceId  INT NOT NULL REFERENCES SalesInvoices(Id),
    Amount          DECIMAL(18,2) NOT NULL,
    PaymentMode     NVARCHAR(50) NOT NULL,
    ReferenceNumber NVARCHAR(100),
    PaymentDate     DATETIME2 NOT NULL,
    Notes           NVARCHAR(500),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE CustomerCreditNotes (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId     INT NOT NULL REFERENCES Customers(Id),
    SalesInvoiceId INT REFERENCES SalesInvoices(Id),
    NoteNumber     NVARCHAR(50) NOT NULL UNIQUE,
    NoteDate       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Amount         DECIMAL(18,2) NOT NULL,
    Reason         NVARCHAR(500),
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE CustomerDebitNotes (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId     INT NOT NULL REFERENCES Customers(Id),
    SalesInvoiceId INT REFERENCES SalesInvoices(Id),
    NoteNumber     NVARCHAR(50) NOT NULL UNIQUE,
    NoteDate       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Amount         DECIMAL(18,2) NOT NULL,
    Reason         NVARCHAR(500),
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- ACCOUNTS
CREATE TABLE ChartOfAccounts (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId         INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    AccountCode       NVARCHAR(20) NOT NULL,
    AccountName       NVARCHAR(200) NOT NULL,
    AccountType       NVARCHAR(50) NOT NULL,
    ParentAccountCode NVARCHAR(20),
    OpeningBalance    DECIMAL(18,2) NOT NULL DEFAULT 0,
    IsActive          BIT NOT NULL DEFAULT 1,
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE JournalVouchers (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    VoucherNumber NVARCHAR(50) NOT NULL UNIQUE,
    VoucherDate   DATETIME2 NOT NULL,
    Description   NVARCHAR(500) NOT NULL,
    TotalDebit    DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalCredit   DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Posted',
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE JournalVoucherEntries (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    JournalVoucherId INT NOT NULL REFERENCES JournalVouchers(Id) ON DELETE CASCADE,
    AccountId        INT NOT NULL REFERENCES ChartOfAccounts(Id),
    Type             NVARCHAR(10) NOT NULL,
    Amount           DECIMAL(18,2) NOT NULL,
    Narration        NVARCHAR(500)
);

CREATE TABLE PaymentVouchers (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    VoucherNumber   NVARCHAR(50) NOT NULL UNIQUE,
    VoucherDate     DATETIME2 NOT NULL,
    PayTo           NVARCHAR(200) NOT NULL,
    AccountId       INT NOT NULL REFERENCES ChartOfAccounts(Id),
    Amount          DECIMAL(18,2) NOT NULL,
    PaymentMode     NVARCHAR(50) NOT NULL,
    ReferenceNumber NVARCHAR(100),
    Description     NVARCHAR(500) NOT NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'Posted',
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE ReceiptVouchers (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    VoucherNumber   NVARCHAR(50) NOT NULL UNIQUE,
    VoucherDate     DATETIME2 NOT NULL,
    ReceivedFrom    NVARCHAR(200) NOT NULL,
    AccountId       INT NOT NULL REFERENCES ChartOfAccounts(Id),
    Amount          DECIMAL(18,2) NOT NULL,
    PaymentMode     NVARCHAR(50) NOT NULL,
    ReferenceNumber NVARCHAR(100),
    Description     NVARCHAR(500) NOT NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'Posted',
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- CRM
CREATE TABLE Leads (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId        INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    Name             NVARCHAR(200) NOT NULL,
    Email            NVARCHAR(200),
    Phone            NVARCHAR(50),
    Company2         NVARCHAR(200),
    Source           NVARCHAR(100),
    Status           NVARCHAR(50) NOT NULL DEFAULT 'New',
    Notes            NVARCHAR(MAX),
    AssignedToUserId INT,
    CreatedAt        DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE Opportunities (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    LeadId    INT REFERENCES Leads(Id),
    Name      NVARCHAR(200) NOT NULL,
    Stage     NVARCHAR(50) NOT NULL DEFAULT 'Prospecting',
    Value     DECIMAL(18,2) NOT NULL DEFAULT 0,
    CloseDate DATETIME2,
    Notes     NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE CrmActivities (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    LeadId        INT REFERENCES Leads(Id),
    OpportunityId INT REFERENCES Opportunities(Id),
    Type          NVARCHAR(50) NOT NULL,
    Subject       NVARCHAR(200) NOT NULL,
    Notes         NVARCHAR(MAX),
    ScheduledAt   DATETIME2,
    IsDone        BIT NOT NULL DEFAULT 0,
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- HRM
CREATE TABLE Attendances (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId INT NOT NULL REFERENCES Employees(Id) ON DELETE CASCADE,
    Date       DATETIME2 NOT NULL,
    CheckIn    DATETIME2,
    CheckOut   DATETIME2,
    Status     NVARCHAR(20) NOT NULL DEFAULT 'Present',
    Remarks    NVARCHAR(500),
    CreatedAt  DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE LeaveTypes (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId      INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    Name           NVARCHAR(100) NOT NULL,
    MaxDays        INT NOT NULL DEFAULT 0,
    MaxDaysPerYear INT NOT NULL DEFAULT 0,
    IsPaid         BIT NOT NULL DEFAULT 1,
    IsActive       BIT NOT NULL DEFAULT 1
);

CREATE TABLE LeaveRequests (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId  INT NOT NULL REFERENCES Employees(Id),
    LeaveTypeId INT NOT NULL REFERENCES LeaveTypes(Id),
    FromDate    DATETIME2 NOT NULL,
    ToDate      DATETIME2 NOT NULL,
    TotalDays   INT NOT NULL DEFAULT 1,
    Reason      NVARCHAR(500),
    Status      NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    ApprovedBy  INT REFERENCES Employees(Id),
    ApproverRemarks NVARCHAR(500),
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- PROJECTS
CREATE TABLE Projects (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId  INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    Name       NVARCHAR(300) NOT NULL,
    ClientName NVARCHAR(200),
    Status     NVARCHAR(50) NOT NULL DEFAULT 'Active',
    StartDate  DATETIME2,
    EndDate    DATETIME2,
    Budget     DECIMAL(18,2) NOT NULL DEFAULT 0,
    Notes      NVARCHAR(MAX),
    CreatedAt  DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE ProjectTasks (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId   INT NOT NULL REFERENCES Projects(Id) ON DELETE CASCADE,
    Title       NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    AssignedTo  INT REFERENCES Employees(Id),
    Status      NVARCHAR(50) NOT NULL DEFAULT 'Todo',
    Priority    NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    DueDate     DATETIME2,
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE Timesheets (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId      INT NOT NULL REFERENCES Projects(Id) ON DELETE CASCADE,
    EmployeeId     INT NOT NULL REFERENCES Employees(Id),
    TaskId         INT REFERENCES ProjectTasks(Id),
    WorkDate       DATETIME2 NOT NULL,
    HoursWorked    DECIMAL(8,2) NOT NULL DEFAULT 0,
    BillableAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Notes          NVARCHAR(500),
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- HELPDESK
CREATE TABLE HelpdeskTickets (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    TicketNumber    NVARCHAR(50) NOT NULL UNIQUE,
    Subject         NVARCHAR(300) NOT NULL,
    Description     NVARCHAR(MAX),
    Priority        NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    Status          NVARCHAR(30) NOT NULL DEFAULT 'Open',
    Category        NVARCHAR(100),
    AssignedTo      INT REFERENCES Employees(Id),
    AssignedToUserId INT,
    RaisedByUserId  INT,
    SlaDeadline     DATETIME2,
    ResolvedAt      DATETIME2,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE TicketComments (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    TicketId  INT NOT NULL REFERENCES HelpdeskTickets(Id) ON DELETE CASCADE,
    UserId    INT NOT NULL,
    UserName  NVARCHAR(200) NOT NULL,
    Comment   NVARCHAR(MAX) NOT NULL,
    IsInternal BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- ASSETS
CREATE TABLE Assets (
    Id                   INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId            INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    AssetCode            NVARCHAR(50) NOT NULL,
    Name                 NVARCHAR(300) NOT NULL,
    Category             NVARCHAR(100) NOT NULL,
    Description          NVARCHAR(MAX),
    PurchasePrice        DECIMAL(18,2) NOT NULL DEFAULT 0,
    PurchaseDate         DATETIME2 NOT NULL,
    CurrentValue         DECIMAL(18,2) NOT NULL DEFAULT 0,
    DepreciationMethod   NVARCHAR(50) NOT NULL DEFAULT 'StraightLine',
    DepreciationRate     DECIMAL(5,2) NOT NULL DEFAULT 0,
    Status               NVARCHAR(30) NOT NULL DEFAULT 'Active',
    AssignedToEmployeeId INT REFERENCES Employees(Id),
    Location             NVARCHAR(200),
    CreatedAt            DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE AssetMaintenances (
    Id                  INT IDENTITY(1,1) PRIMARY KEY,
    AssetId             INT NOT NULL REFERENCES Assets(Id) ON DELETE CASCADE,
    MaintenanceDate     DATETIME2 NOT NULL,
    Type                NVARCHAR(50) NOT NULL,
    Description         NVARCHAR(MAX) NOT NULL,
    Cost                DECIMAL(18,2) NOT NULL DEFAULT 0,
    ServiceProvider     NVARCHAR(200),
    NextMaintenanceDate DATETIME2,
    CreatedAt           DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE AssetDisposals (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    AssetId     INT NOT NULL REFERENCES Assets(Id) ON DELETE CASCADE,
    DisposalDate DATETIME2 NOT NULL,
    Method      NVARCHAR(50) NOT NULL,
    SaleValue   DECIMAL(18,2) NOT NULL DEFAULT 0,
    Remarks     NVARCHAR(500),
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- LOGISTICS
CREATE TABLE Carriers (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    Name          NVARCHAR(300) NOT NULL,
    ContactPerson NVARCHAR(200),
    Phone         NVARCHAR(50),
    Email         NVARCHAR(200),
    IsActive      BIT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE ShipmentOrders (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId        INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    OrderNumber      NVARCHAR(50) NOT NULL UNIQUE,
    CustomerName     NVARCHAR(300) NOT NULL,
    DeliveryAddress  NVARCHAR(500) NOT NULL,
    CarrierId        INT REFERENCES Carriers(Id),
    Status           NVARCHAR(30) NOT NULL DEFAULT 'Pending',
    TrackingNumber   NVARCHAR(100),
    OrderDate        DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ExpectedDelivery DATETIME2,
    ActualDelivery   DATETIME2,
    ShippingCost     DECIMAL(18,2) NOT NULL DEFAULT 0,
    Notes            NVARCHAR(500),
    CreatedAt        DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE DeliveryRoutes (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId         INT NOT NULL,
    RouteName         NVARCHAR(200) NOT NULL,
    Origin            NVARCHAR(200) NOT NULL,
    Destination       NVARCHAR(200) NOT NULL,
    EstimatedDistance DECIMAL(10,2) NOT NULL DEFAULT 0,
    EstimatedTime     DECIMAL(8,2) NOT NULL DEFAULT 0,
    IsActive          BIT NOT NULL DEFAULT 1,
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE DeliveryFeedbacks (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    ShipmentOrderId INT NOT NULL REFERENCES ShipmentOrders(Id) ON DELETE CASCADE,
    CustomerName    NVARCHAR(300) NOT NULL,
    Rating          INT NOT NULL DEFAULT 5,
    Comments        NVARCHAR(MAX),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- PRODUCTION
CREATE TABLE BillsOfMaterial (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId         INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    FinishedProductId INT NOT NULL REFERENCES Products(Id),
    BomCode           NVARCHAR(50) NOT NULL,
    Quantity          DECIMAL(10,2) NOT NULL DEFAULT 1,
    IsActive          BIT NOT NULL DEFAULT 1,
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE BomItems (
    Id                   INT IDENTITY(1,1) PRIMARY KEY,
    BomId                INT NOT NULL REFERENCES BillsOfMaterial(Id) ON DELETE CASCADE,
    RawMaterialProductId INT NOT NULL REFERENCES Products(Id),
    Quantity             DECIMAL(10,2) NOT NULL,
    Unit                 NVARCHAR(20) NOT NULL DEFAULT 'pcs'
);

CREATE TABLE ProductionOrders (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId        INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    OrderNumber      NVARCHAR(50) NOT NULL UNIQUE,
    BomId            INT NOT NULL REFERENCES BillsOfMaterial(Id),
    PlannedQty       DECIMAL(10,2) NOT NULL DEFAULT 0,
    ProducedQty      DECIMAL(10,2) NOT NULL DEFAULT 0,
    Status           NVARCHAR(20) NOT NULL DEFAULT 'Draft',
    PlannedStartDate DATETIME2 NOT NULL,
    PlannedEndDate   DATETIME2 NOT NULL,
    ActualStartDate  DATETIME2,
    ActualEndDate    DATETIME2,
    CreatedAt        DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE QualityChecks (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    ProductionOrderId INT NOT NULL REFERENCES ProductionOrders(Id) ON DELETE CASCADE,
    CheckDate         DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    SampleSize        DECIMAL(10,2) NOT NULL DEFAULT 0,
    PassedQty         DECIMAL(10,2) NOT NULL DEFAULT 0,
    RejectedQty       DECIMAL(10,2) NOT NULL DEFAULT 0,
    Result            NVARCHAR(20) NOT NULL DEFAULT 'Pass',
    Remarks           NVARCHAR(500),
    CreatedAt         DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- BILLING
CREATE TABLE BillingInvoices (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId     INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    InvoiceNumber NVARCHAR(50) NOT NULL UNIQUE,
    ClientName    NVARCHAR(300) NOT NULL,
    ClientEmail   NVARCHAR(200),
    InvoiceDate   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    DueDate       DATETIME2,
    SubTotal      DECIMAL(18,2) NOT NULL DEFAULT 0,
    TaxAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount   DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaidAmount    DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Draft',
    Notes         NVARCHAR(MAX),
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE BillingInvoiceItems (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    BillingInvoiceId INT NOT NULL REFERENCES BillingInvoices(Id) ON DELETE CASCADE,
    Description      NVARCHAR(300) NOT NULL,
    Quantity         DECIMAL(10,2) NOT NULL DEFAULT 1,
    UnitPrice        DECIMAL(18,2) NOT NULL,
    TaxPercent       DECIMAL(5,2) NOT NULL DEFAULT 0,
    TotalPrice       DECIMAL(18,2) NOT NULL
);

CREATE TABLE PaymentReminders (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    BillingInvoiceId INT NOT NULL REFERENCES BillingInvoices(Id) ON DELETE CASCADE,
    ReminderDate     DATETIME2 NOT NULL,
    Message          NVARCHAR(500),
    IsSent           BIT NOT NULL DEFAULT 0,
    CreatedAt        DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- POS
CREATE TABLE PosSessions (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId   INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    OpenedBy    INT NOT NULL,
    OpenedAt    DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ClosedAt    DATETIME2,
    OpeningCash DECIMAL(18,2) NOT NULL DEFAULT 0,
    ClosingCash DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status      NVARCHAR(20) NOT NULL DEFAULT 'Open'
);

CREATE TABLE PosOrders (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId      INT NOT NULL REFERENCES Companies(Id) ON DELETE CASCADE,
    SessionId      INT NOT NULL REFERENCES PosSessions(Id),
    OrderNumber    NVARCHAR(50) NOT NULL UNIQUE,
    CustomerName   NVARCHAR(200),
    SubTotal       DECIMAL(18,2) NOT NULL DEFAULT 0,
    TaxAmount      DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount    DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaymentMode    NVARCHAR(50) NOT NULL DEFAULT 'Cash',
    Status         NVARCHAR(20) NOT NULL DEFAULT 'Completed',
    CreatedAt      DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE PosOrderItems (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    PosOrderId      INT NOT NULL REFERENCES PosOrders(Id) ON DELETE CASCADE,
    ProductId       INT NOT NULL REFERENCES Products(Id),
    Quantity        INT NOT NULL,
    UnitPrice       DECIMAL(18,2) NOT NULL,
    TaxPercent      DECIMAL(5,2) NOT NULL DEFAULT 0,
    DiscountPercent DECIMAL(5,2) NOT NULL DEFAULT 0,
    TotalPrice      DECIMAL(18,2) NOT NULL
);

-- GLOBAL MODULES
CREATE TABLE GlobalModules (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    ModuleId    NVARCHAR(50)  NOT NULL UNIQUE,
    Name        NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    Category    NVARCHAR(100) NOT NULL DEFAULT 'Operations',
    Icon        NVARCHAR(50)  NOT NULL DEFAULT 'Puzzle',
    IsActive    BIT NOT NULL DEFAULT 1,
    IsBuiltIn   BIT NOT NULL DEFAULT 1,
    SortOrder   INT NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- AUDIT
CREATE TABLE AuditLogs (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId  INT,
    UserId     INT,
    Action     NVARCHAR(100) NOT NULL,
    Entity     NVARCHAR(100) NOT NULL,
    EntityId   INT,
    OldValues  NVARCHAR(MAX),
    NewValues  NVARCHAR(MAX),
    IpAddress  NVARCHAR(50),
    CreatedAt  DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

PRINT 'All tables created.';
GO

-- ============================================================
-- STEP 4: SEED DATA
-- ============================================================

-- Roles
IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = 'SuperAdmin')
    INSERT INTO Roles (RoleName) VALUES ('SuperAdmin'),('Admin'),('Manager'),('Employee');

-- Subscription Plans
IF NOT EXISTS (SELECT 1 FROM SubscriptionPlans WHERE Name = 'Basic')
BEGIN
    INSERT INTO SubscriptionPlans (Name, MonthlyPrice, MaxSeats, MaxModules, Description, IsActive)
    VALUES
        ('Basic',      49,  50,  4,  'Inventory, Purchase, Sales, Accounts', 1),
        ('Pro',       149, 200, 12,  'All 12 modules',                       1),
        ('Enterprise',499,   0, 12,  'All modules + Premium support',        1);
END

-- Default SuperAdmin user (password: Admin@123)
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@erp.com')
BEGIN
    DECLARE @roleId INT = (SELECT Id FROM Roles WHERE RoleName = 'SuperAdmin');
    -- Real BCrypt hash of 'Admin@123' (cost=11)
    INSERT INTO Users (Name, Email, PasswordHash, PlainPassword, RoleId, IsActive)
    VALUES ('Super Admin', 'admin@erp.com',
            '$2a$11$SmlsztMXoRCpk2F7Kp4OB.0Tj6hfIlsXtr53J2jnGGuKf4RFyGDA.',
            'Admin@123',
            @roleId, 1);
END

-- Global Modules
IF NOT EXISTS (SELECT 1 FROM GlobalModules WHERE ModuleId = 'inventory')
BEGIN
    INSERT INTO GlobalModules (ModuleId, Name, Description, Category, Icon, IsActive, IsBuiltIn, SortOrder) VALUES
    ('inventory',  'Inventory Management', 'Products, stock, warehouses, transfers',      'Operations',    'Archive',      1, 1, 1),
    ('purchase',   'Purchase Management',  'Vendors, POs, invoices, payments',            'Operations',    'ShoppingCart', 1, 1, 2),
    ('sales',      'Sales Management',     'Customers, quotations, invoices',             'Operations',    'TrendingUp',   1, 1, 3),
    ('accounts',   'Accounts & Finance',   'Chart of accounts, vouchers, reports',        'Finance',       'BookOpen',     1, 1, 4),
    ('crm',        'CRM',                  'Leads, opportunities, follow-ups',            'Sales',         'Users',        1, 1, 5),
    ('hrm',        'HRM',                  'Employees, attendance, payroll',              'HR',            'Users',        1, 1, 6),
    ('projects',   'Projects',             'Project management, tasks, timesheets',       'Operations',    'Briefcase',    1, 1, 7),
    ('helpdesk',   'Helpdesk',             'Ticket management, SLA monitoring',           'Support',       'Headphones',   1, 1, 8),
    ('assets',     'Assets',               'Asset tracking, depreciation, maintenance',   'Finance',       'Package',      1, 1, 9),
    ('logistics',  'Logistics',            'Shipment tracking, delivery management',      'Operations',    'Truck',        1, 1, 10),
    ('production', 'Production',           'BOM, work orders, quality control',           'Manufacturing', 'Factory',      1, 1, 11),
    ('billing',    'Billing',              'Invoice management, payment reminders',       'Finance',       'Receipt',      1, 1, 12),
    ('pos',        'POS',                  'Point of Sale, billing, payments',            'Operations',    'Receipt',      1, 1, 13);
END

PRINT 'Seed data inserted.';
GO
