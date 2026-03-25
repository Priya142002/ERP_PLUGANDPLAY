-- ============================================================
-- SQL Migration: Sync Database with New Models
-- ============================================================

USE ERPPlugandPlayDB;
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
