using Microsoft.EntityFrameworkCore;
using ERPPlugandPlay.Data;
using ERPPlugandPlay.Models;

namespace ERPPlugandPlay.Helpers
{
    public static class DatabaseInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ERPDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            try
            {
                db.Database.SetCommandTimeout(600);
                db.Database.EnsureCreated();
                logger.LogInformation("Database ensured/created successfully.");

                // 1. TaxTypes and Products.TaxTypeId Patch
                ExecutePatch(db, logger, "TaxTypes/Products.TaxTypeId", @"
                    IF OBJECT_ID('TaxTypes', 'U') IS NULL
                    BEGIN
                        CREATE TABLE TaxTypes (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            CompanyId INT NOT NULL,
                            Name NVARCHAR(MAX) NOT NULL,
                            Percentage DECIMAL(18,2) NOT NULL,
                            CONSTRAINT FK_TaxTypes_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
                        );
                    END

                    IF COL_LENGTH('Products', 'TaxTypeId') IS NULL
                    BEGIN
                        ALTER TABLE Products ADD TaxTypeId INT NULL;
                        ALTER TABLE Products ADD CONSTRAINT FK_Products_TaxTypes FOREIGN KEY (TaxTypeId) REFERENCES TaxTypes(Id);
                    END
                ");

                // 2. ProductReceives Patch
                ExecutePatch(db, logger, "ProductReceives columns", @"
                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProductReceives') AND name = 'PurchaseOrderRef')
                    BEGIN
                        ALTER TABLE ProductReceives ADD PurchaseOrderRef NVARCHAR(MAX) NULL;
                    END

                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProductReceives') AND name = 'ReceivedFrom')
                    BEGIN
                        ALTER TABLE ProductReceives ADD ReceivedFrom NVARCHAR(MAX) NULL;
                    END

                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProductReceives') AND name = 'ReceiveDate')
                    BEGIN
                        ALTER TABLE ProductReceives ADD ReceiveDate DATETIME2 NOT NULL DEFAULT GETUTCDATE();
                    END
                ");

                // 3. ProductReceiveItems Patch
                ExecutePatch(db, logger, "ProductReceiveItems columns", @"
                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProductReceiveItems') AND name = 'ProductReceiveId')
                    BEGIN
                        ALTER TABLE ProductReceiveItems ADD ProductReceiveId INT NULL;
                        IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProductReceiveItems_ProductReceives')
                        BEGIN
                            ALTER TABLE ProductReceiveItems ADD CONSTRAINT FK_ProductReceiveItems_ProductReceives 
                            FOREIGN KEY (ProductReceiveId) REFERENCES ProductReceives(Id);
                        END
                    END

                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ProductReceiveItems') AND name = 'Quantity')
                    BEGIN
                        ALTER TABLE ProductReceiveItems ADD Quantity INT NOT NULL DEFAULT 0;
                    END
                ");

                // 4. Branches Patch
                ExecutePatch(db, logger, "Branches table", @"
                    IF OBJECT_ID('Branches', 'U') IS NULL
                    BEGIN
                        CREATE TABLE Branches (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            CompanyId INT NOT NULL,
                            BranchName NVARCHAR(MAX) NOT NULL,
                            Address NVARCHAR(MAX) NOT NULL,
                            ContactPhone NVARCHAR(MAX) NOT NULL,
                            Email NVARCHAR(MAX) NOT NULL,
                            IsActive BIT NOT NULL DEFAULT 1,
                            CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
                            CONSTRAINT FK_Branches_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                        );
                    END
                ");

                // 5. User CompanyId and AdminPassword Patch
                ExecutePatch(db, logger, "User CompanyId columns", @"
                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'CompanyId')
                    BEGIN
                        ALTER TABLE Users ADD CompanyId INT NULL;
                        IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Users_Companies')
                        BEGIN
                            ALTER TABLE Users ADD CONSTRAINT FK_Users_Companies FOREIGN KEY (CompanyId) REFERENCES Companies(Id);
                        END
                    END

                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Companies') AND name = 'AdminPassword')
                    BEGIN
                        ALTER TABLE Companies ADD AdminPassword NVARCHAR(MAX) NULL;
                    END

                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Companies') AND name = 'Code')
                    BEGIN
                        ALTER TABLE Companies ADD Code NVARCHAR(MAX) NOT NULL DEFAULT '';
                    END
                ");

                // 6. Subscription plans Patch
                ExecutePatch(db, logger, "SubscriptionPlans updates", @"
                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('SubscriptionPlans') AND name = 'PricePerUser')
                    BEGIN
                        ALTER TABLE SubscriptionPlans ADD PricePerUser DECIMAL(18,2) NOT NULL DEFAULT 0;
                    END

                    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('SubscriptionPlans') AND name = 'AllowedModules')
                    BEGIN
                        ALTER TABLE SubscriptionPlans ADD AllowedModules NVARCHAR(MAX) NOT NULL DEFAULT '';
                    END
                ");

                // 7. GlobalModules and SystemSettings Patch
                ExecutePatch(db, logger, "GlobalModules and SystemSettings tables", @"
                    IF OBJECT_ID('GlobalModules', 'U') IS NULL
                    BEGIN
                        CREATE TABLE GlobalModules (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            ModuleId NVARCHAR(MAX) NOT NULL,
                            Name NVARCHAR(MAX) NOT NULL,
                            Description NVARCHAR(MAX) NOT NULL,
                            Category NVARCHAR(MAX) NOT NULL,
                            Icon NVARCHAR(MAX) NOT NULL DEFAULT 'Puzzle',
                            IsActive BIT NOT NULL DEFAULT 1,
                            IsBuiltIn BIT NOT NULL DEFAULT 1,
                            SortOrder INT NOT NULL DEFAULT 0,
                            CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
                        );
                    END

                    IF OBJECT_ID('SystemSettings', 'U') IS NULL
                    BEGIN
                        CREATE TABLE SystemSettings (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            [Key] NVARCHAR(450) NOT NULL,
                            Value NVARCHAR(MAX) NOT NULL,
                            Description NVARCHAR(MAX) NULL,
                            Group NVARCHAR(MAX) NULL,
                            UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
                        );
                        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('SystemSettings') AND name = 'IX_SystemSettings_Key')
                        BEGIN
                             CREATE UNIQUE INDEX IX_SystemSettings_Key ON SystemSettings ([Key]);
                        END
                    END
                ");

                // 8. Seed GlobalModules if empty
                if (!db.GlobalModules.Any())
                {
                    logger.LogInformation("Seeding default GlobalModules...");
                    var defaults = new List<GlobalModule>
                    {
                        new GlobalModule { ModuleId="inventory",  Name="Inventory Management", Description="Products, stock, warehouses, transfers", Category="Operations", Icon="Archive",      IsBuiltIn=true, IsActive=true, SortOrder=1,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="purchase",   Name="Purchase Management",  Description="Vendors, POs, invoices, payments",       Category="Operations", Icon="ShoppingCart", IsBuiltIn=true, IsActive=true, SortOrder=2,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="sales",      Name="Sales Management",     Description="Customers, quotations, invoices",         Category="Operations", Icon="TrendingUp",   IsBuiltIn=true, IsActive=true, SortOrder=3,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="accounts",   Name="Accounts & Finance",   Description="Chart of accounts, vouchers, reports",    Category="Finance",    Icon="BookOpen",     IsBuiltIn=true, IsActive=true, SortOrder=4,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="crm",        Name="CRM",                  Description="Leads, opportunities, follow-ups",        Category="Sales",      Icon="Users",        IsBuiltIn=true, IsActive=true, SortOrder=5,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="hrm",        Name="HRM",                  Description="Employees, attendance, payroll",          Category="HR",         Icon="Users",        IsBuiltIn=true, IsActive=true, SortOrder=6,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="projects",   Name="Projects",             Description="Project management, tasks, timesheets",   Category="Operations", Icon="Briefcase",    IsBuiltIn=true, IsActive=true, SortOrder=7,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="helpdesk",   Name="Helpdesk",             Description="Ticket management, SLA monitoring",       Category="Support",    Icon="Headphones",   IsBuiltIn=true, IsActive=true, SortOrder=8,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="assets",     Name="Assets",               Description="Asset tracking, depreciation, maintenance",Category="Finance",   Icon="Package",      IsBuiltIn=true, IsActive=true, SortOrder=9,  CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="logistics",  Name="Logistics",            Description="Shipment tracking, delivery management",  Category="Operations", Icon="Truck",        IsBuiltIn=true, IsActive=true, SortOrder=10, CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="production", Name="Production",           Description="BOM, work orders, quality control",       Category="Manufacturing",Icon="Factory",    IsBuiltIn=true, IsActive=true, SortOrder=11, CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="billing",    Name="Billing",              Description="Invoice management, payment reminders",   Category="Finance",    Icon="Receipt",      IsBuiltIn=true, IsActive=true, SortOrder=12, CreatedAt=DateTime.UtcNow },
                        new GlobalModule { ModuleId="pos",        Name="POS",                  Description="Point of Sale, billing, payments",        Category="Operations", Icon="Receipt",      IsBuiltIn=true, IsActive=true, SortOrder=13, CreatedAt=DateTime.UtcNow }
                    };
                    db.GlobalModules.AddRange(defaults);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Critical failure during database initialization.");
            }
        }

        private static void ExecutePatch(ERPDbContext db, ILogger logger, string patchName, string sql)
        {
            try
            {
                db.Database.ExecuteSqlRaw(sql);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, $"Failed to apply batch: {patchName}");
            }
        }
    }
}
