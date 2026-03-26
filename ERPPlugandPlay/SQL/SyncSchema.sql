-- ============================================================
-- SQL Migration: Sync Database with New Models
-- ============================================================

USE ERPPlugandPlayDB;
GO

-- 3. Inventory: Warehouses / Brands / Units (if missing)
IF OBJECT_ID('Warehouses', 'U') IS NULL
BEGIN
    CREATE TABLE Warehouses (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId INT NOT NULL DEFAULT 1,
        Name NVARCHAR(200) NOT NULL,
        Location NVARCHAR(300) NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT 'Active'
    );
    PRINT 'Created Warehouses table.';
END
GO

IF OBJECT_ID('Brands', 'U') IS NULL
BEGIN
    CREATE TABLE Brands (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId INT NOT NULL DEFAULT 1,
        Name NVARCHAR(200) NOT NULL
    );
    PRINT 'Created Brands table.';
END
GO

IF OBJECT_ID('Units', 'U') IS NULL
BEGIN
    CREATE TABLE Units (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CompanyId INT NOT NULL DEFAULT 1,
        Name NVARCHAR(200) NOT NULL,
        Abbreviation NVARCHAR(100) NOT NULL
    );
    PRINT 'Created Units table.';
END
GO

-- 4. Inventory: Categories.CompanyId (if missing)
IF OBJECT_ID('Categories', 'U') IS NOT NULL
    AND NOT EXISTS (
        SELECT 1
        FROM sys.columns
        WHERE object_id = OBJECT_ID('Categories') AND name = 'CompanyId'
    )
BEGIN
    ALTER TABLE Categories ADD CompanyId INT NOT NULL DEFAULT 1;
    PRINT 'Added Categories.CompanyId.';
END
GO

-- 5. Inventory: Products columns required by EF models
IF OBJECT_ID('Products', 'U') IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('Products') AND name = 'CompanyId'
    )
    BEGIN
        ALTER TABLE Products ADD CompanyId INT NOT NULL DEFAULT 1;
        PRINT 'Added Products.CompanyId.';
    END

    IF NOT EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('Products') AND name = 'SKU'
    )
    BEGIN
        ALTER TABLE Products ADD SKU NVARCHAR(200) NOT NULL DEFAULT '';
        PRINT 'Added Products.SKU.';
    END

    IF NOT EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('Products') AND name = 'BrandId'
    )
    BEGIN
        ALTER TABLE Products ADD BrandId INT NULL;
        PRINT 'Added Products.BrandId.';
    END

    IF NOT EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('Products') AND name = 'UnitId'
    )
    BEGIN
        ALTER TABLE Products ADD UnitId INT NULL;
        PRINT 'Added Products.UnitId.';
    END

    IF NOT EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('Products') AND name = 'Status'
    )
    BEGIN
        ALTER TABLE Products ADD Status NVARCHAR(20) NOT NULL DEFAULT 'Active';
        PRINT 'Added Products.Status.';
    END

    IF NOT EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('Products') AND name = 'AddedAt'
    )
    BEGIN
        ALTER TABLE Products ADD AddedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE();
        PRINT 'Added Products.AddedAt.';
    END
END
GO

-- 6. Inventory: StockTransactions.CompanyId (if missing)
IF OBJECT_ID('StockTransactions', 'U') IS NOT NULL
    AND NOT EXISTS (
        SELECT 1
        FROM sys.columns
        WHERE object_id = OBJECT_ID('StockTransactions') AND name = 'CompanyId'
    )
BEGIN
    ALTER TABLE StockTransactions ADD CompanyId INT NOT NULL DEFAULT 1;
    PRINT 'Added StockTransactions.CompanyId.';
END
GO

-- 7. Indexes (best-effort)
-- Unique SKU per company (attempt, but don't fail the whole script if it errors)
BEGIN TRY
    IF OBJECT_ID('Products', 'U') IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM sys.indexes
            WHERE name = 'UX_Products_CompanyId_SKU' AND object_id = OBJECT_ID('Products')
        )
        BEGIN
            CREATE UNIQUE INDEX UX_Products_CompanyId_SKU
                ON Products(CompanyId, SKU);
            PRINT 'Created UX_Products_CompanyId_SKU.';
        END
    END
END TRY
BEGIN CATCH
    PRINT 'Skipping unique index UX_Products_CompanyId_SKU (may conflict with existing data).';
END CATCH
GO

-- 1. Add PlanType to SubscriptionPlans if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('SubscriptionPlans') AND name = 'PlanType')
BEGIN
    ALTER TABLE SubscriptionPlans ADD PlanType NVARCHAR(50) NOT NULL DEFAULT 'Monthly';
    PRINT 'Added PlanType column to SubscriptionPlans.';
END
GO

-- 2. Create SystemSettings table if it doesn't exist
IF OBJECT_ID('SystemSettings', 'U') IS NULL
BEGIN
    CREATE TABLE SystemSettings (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        [Key]     NVARCHAR(100) NOT NULL UNIQUE,
        Value     NVARCHAR(MAX) NOT NULL,
        [Group]   NVARCHAR(50)  NOT NULL DEFAULT 'General',
        UpdatedAt DATETIME2     NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT 'Created SystemSettings table.';
    
    -- Seed initial settings
    INSERT INTO SystemSettings ([Key], Value, [Group]) VALUES ('PlatformName', 'Vivify ERP', 'General');
    INSERT INTO SystemSettings ([Key], Value, [Group]) VALUES ('MaintenanceMode', 'false', 'General');
    INSERT INTO SystemSettings ([Key], Value, [Group]) VALUES ('DefaultCurrency', 'INR', 'General');
END
GO
