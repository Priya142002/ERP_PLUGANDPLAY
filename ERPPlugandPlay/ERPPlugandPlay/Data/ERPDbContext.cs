using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Data
{
    public class ERPDbContext : DbContext
    {
        public ERPDbContext(DbContextOptions<ERPDbContext> options) : base(options) { }

        // ── Auth ──────────────────────────────────────────────
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        // ── Company & HR ──────────────────────────────────────
        public DbSet<Company> Companies { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<Employee> Employees { get; set; }

        // ── Subscriptions & Modules ───────────────────────────
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public DbSet<CompanySubscription> CompanySubscriptions { get; set; }
        public DbSet<CompanyModule> CompanyModules { get; set; }

        // ── Payroll ───────────────────────────────────────────
        public DbSet<Salary> Salaries { get; set; }

        // ── Inventory ─────────────────────────────────────────
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<TaxType> TaxTypes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set; }
        public DbSet<MaterialDispatch> MaterialDispatches { get; set; }
        public DbSet<MaterialDispatchItem> MaterialDispatchItems { get; set; }
        public DbSet<ProductTransfer> ProductTransfers { get; set; }
        public DbSet<ProductTransferItem> ProductTransferItems { get; set; }
        public DbSet<ProductReceive> ProductReceives { get; set; }
        public DbSet<ProductReceiveItem> ProductReceiveItems { get; set; }

        // ── Purchase ──────────────────────────────────────────
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }
        public DbSet<PurchaseInvoiceItem> PurchaseInvoiceItems { get; set; }
        public DbSet<PurchaseReturn> PurchaseReturns { get; set; }
        public DbSet<PurchaseReturnItem> PurchaseReturnItems { get; set; }
        public DbSet<VendorPayment> VendorPayments { get; set; }
        public DbSet<VendorCreditNote> VendorCreditNotes { get; set; }
        public DbSet<VendorDebitNote> VendorDebitNotes { get; set; }

        // ── Sales ─────────────────────────────────────────────
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<QuotationItem> QuotationItems { get; set; }
        public DbSet<SalesInvoice> SalesInvoices { get; set; }
        public DbSet<SalesInvoiceItem> SalesInvoiceItems { get; set; }
        public DbSet<SalesReturn> SalesReturns { get; set; }
        public DbSet<SalesReturnItem> SalesReturnItems { get; set; }
        public DbSet<CustomerPayment> CustomerPayments { get; set; }
        public DbSet<CustomerCreditNote> CustomerCreditNotes { get; set; }
        public DbSet<CustomerDebitNote> CustomerDebitNotes { get; set; }

        // ── Accounts ──────────────────────────────────────────
        public DbSet<FinancialYear> FinancialYears { get; set; }
        public DbSet<ChartOfAccount> ChartOfAccounts { get; set; }
        public DbSet<JournalVoucher> JournalVouchers { get; set; }
        public DbSet<JournalVoucherEntry> JournalVoucherEntries { get; set; }
        public DbSet<PaymentVoucher> PaymentVouchers { get; set; }
        public DbSet<ReceiptVoucher> ReceiptVouchers { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<PaymentMode> PaymentModes { get; set; }
        public DbSet<CostCenter> CostCenters { get; set; }
        public DbSet<AccountOpeningBalance> AccountOpeningBalances { get; set; }

        // ── CRM ───────────────────────────────────────────────
        public DbSet<Lead> Leads { get; set; }
        public DbSet<Opportunity> Opportunities { get; set; }
        public DbSet<CrmActivity> CrmActivities { get; set; }

        // ── HRM ───────────────────────────────────────────────
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        // ── Projects ──────────────────────────────────────────
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<Timesheet> Timesheets { get; set; }

        // ── Helpdesk ──────────────────────────────────────────
        public DbSet<HelpdeskTicket> HelpdeskTickets { get; set; }
        public DbSet<TicketComment> TicketComments { get; set; }

        // ── Assets ────────────────────────────────────────────
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetMaintenance> AssetMaintenances { get; set; }
        public DbSet<AssetDisposal> AssetDisposals { get; set; }

        // ── Logistics ─────────────────────────────────────────
        public DbSet<Carrier> Carriers { get; set; }
        public DbSet<ShipmentOrder> ShipmentOrders { get; set; }
        public DbSet<DeliveryRoute> DeliveryRoutes { get; set; }
        public DbSet<DeliveryFeedback> DeliveryFeedbacks { get; set; }

        // ── Production ────────────────────────────────────────
        public DbSet<BillOfMaterial> BillsOfMaterial { get; set; }
        public DbSet<BomItem> BomItems { get; set; }
        public DbSet<ProductionOrder> ProductionOrders { get; set; }
        public DbSet<QualityCheck> QualityChecks { get; set; }

        // ── Billing ───────────────────────────────────────────
        public DbSet<BillingInvoice> BillingInvoices { get; set; }
        public DbSet<BillingInvoiceItem> BillingInvoiceItems { get; set; }
        public DbSet<PaymentReminder> PaymentReminders { get; set; }

        // ── POS ───────────────────────────────────────────────
        public DbSet<PosSession> PosSessions { get; set; }
        public DbSet<PosOrder> PosOrders { get; set; }
        public DbSet<PosOrderItem> PosOrderItems { get; set; }

        // ── Audit ─────────────────────────────────────────────
        public DbSet<AuditLog> AuditLogs { get; set; }

        // ── Global Modules ────────────────────────────────────
        public DbSet<GlobalModule> GlobalModules { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Unique constraints ────────────────────────────
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Role>().HasIndex(r => r.RoleName).IsUnique();
            modelBuilder.Entity<Company>().HasIndex(c => c.Email).IsUnique();
            modelBuilder.Entity<Company>().HasIndex(c => c.Name).IsUnique();

            modelBuilder.Entity<Branch>()
                .HasOne(b => b.Company)
                .WithMany(c => c.Branches)
                .HasForeignKey(b => b.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            // ── Decimal precision ─────────────────────────────
            modelBuilder.Entity<Employee>().Property(e => e.Salary).HasPrecision(18, 2);
            modelBuilder.Entity<Salary>().Property(s => s.Basic).HasPrecision(18, 2);
            modelBuilder.Entity<Salary>().Property(s => s.HRA).HasPrecision(18, 2);
            modelBuilder.Entity<Salary>().Property(s => s.Allowances).HasPrecision(18, 2);
            modelBuilder.Entity<Salary>().Property(s => s.Deductions).HasPrecision(18, 2);
            modelBuilder.Entity<Salary>().Property(s => s.NetSalary).HasPrecision(18, 2);
            modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
            modelBuilder.Entity<SubscriptionPlan>().Property(p => p.MonthlyPrice).HasPrecision(18, 2);
            modelBuilder.Entity<CompanySubscription>().Property(s => s.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Purchase decimals
            modelBuilder.Entity<PurchaseInvoice>().Property(p => p.SubTotal).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoice>().Property(p => p.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoice>().Property(p => p.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoice>().Property(p => p.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoice>().Property(p => p.PaidAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoice>().Property(p => p.BalanceAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoiceItem>().Property(p => p.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseInvoiceItem>().Property(p => p.TaxPercent).HasPrecision(5, 2);
            modelBuilder.Entity<PurchaseInvoiceItem>().Property(p => p.DiscountPercent).HasPrecision(5, 2);
            modelBuilder.Entity<PurchaseInvoiceItem>().Property(p => p.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseReturn>().Property(p => p.ReturnAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseReturnItem>().Property(p => p.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseReturnItem>().Property(p => p.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<VendorPayment>().Property(p => p.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<VendorCreditNote>().Property(p => p.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<VendorDebitNote>().Property(p => p.Amount).HasPrecision(18, 2);

            // Sales decimals
            modelBuilder.Entity<Customer>().Property(c => c.CreditLimit).HasPrecision(18, 2);
            modelBuilder.Entity<Quotation>().Property(q => q.SubTotal).HasPrecision(18, 2);
            modelBuilder.Entity<Quotation>().Property(q => q.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Quotation>().Property(q => q.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Quotation>().Property(q => q.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<QuotationItem>().Property(q => q.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<QuotationItem>().Property(q => q.TaxPercent).HasPrecision(5, 2);
            modelBuilder.Entity<QuotationItem>().Property(q => q.DiscountPercent).HasPrecision(5, 2);
            modelBuilder.Entity<QuotationItem>().Property(q => q.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoice>().Property(s => s.SubTotal).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoice>().Property(s => s.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoice>().Property(s => s.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoice>().Property(s => s.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoice>().Property(s => s.PaidAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoice>().Property(s => s.BalanceAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoiceItem>().Property(s => s.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<SalesInvoiceItem>().Property(s => s.TaxPercent).HasPrecision(5, 2);
            modelBuilder.Entity<SalesInvoiceItem>().Property(s => s.DiscountPercent).HasPrecision(5, 2);
            modelBuilder.Entity<SalesInvoiceItem>().Property(s => s.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<SalesReturn>().Property(s => s.ReturnAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SalesReturnItem>().Property(s => s.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<SalesReturnItem>().Property(s => s.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<CustomerPayment>().Property(p => p.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<CustomerCreditNote>().Property(p => p.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<CustomerDebitNote>().Property(p => p.Amount).HasPrecision(18, 2);

            // Accounts decimals
            modelBuilder.Entity<ChartOfAccount>().Property(a => a.OpeningBalance).HasPrecision(18, 2);
            modelBuilder.Entity<JournalVoucher>().Property(j => j.TotalDebit).HasPrecision(18, 2);
            modelBuilder.Entity<JournalVoucher>().Property(j => j.TotalCredit).HasPrecision(18, 2);
            modelBuilder.Entity<JournalVoucherEntry>().Property(j => j.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<PaymentVoucher>().Property(p => p.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<ReceiptVoucher>().Property(r => r.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<BankAccount>().Property(b => b.OpeningBalance).HasPrecision(18, 2);
            modelBuilder.Entity<BankAccount>().Property(b => b.CurrentBalance).HasPrecision(18, 2);
            modelBuilder.Entity<AccountOpeningBalance>().Property(a => a.OpeningBalance).HasPrecision(18, 2);

            // CRM decimals
            modelBuilder.Entity<Opportunity>().Property(o => o.Value).HasPrecision(18, 2);

            // Inventory extended decimals
            modelBuilder.Entity<ProductReceiveItem>().Property(i => i.UnitCost).HasPrecision(18, 2);

            // Projects decimals
            modelBuilder.Entity<Project>().Property(p => p.Budget).HasPrecision(18, 2);
            modelBuilder.Entity<Timesheet>().Property(t => t.HoursWorked).HasPrecision(8, 2);
            modelBuilder.Entity<Timesheet>().Property(t => t.BillableAmount).HasPrecision(18, 2);

            // Assets decimals
            modelBuilder.Entity<Asset>().Property(a => a.PurchasePrice).HasPrecision(18, 2);
            modelBuilder.Entity<Asset>().Property(a => a.CurrentValue).HasPrecision(18, 2);
            modelBuilder.Entity<Asset>().Property(a => a.DepreciationRate).HasPrecision(5, 2);
            modelBuilder.Entity<AssetMaintenance>().Property(m => m.Cost).HasPrecision(18, 2);
            modelBuilder.Entity<AssetDisposal>().Property(d => d.SaleValue).HasPrecision(18, 2);

            // Logistics decimals
            modelBuilder.Entity<ShipmentOrder>().Property(s => s.ShippingCost).HasPrecision(18, 2);
            modelBuilder.Entity<DeliveryRoute>().Property(r => r.EstimatedDistance).HasPrecision(10, 2);
            modelBuilder.Entity<DeliveryRoute>().Property(r => r.EstimatedTime).HasPrecision(8, 2);

            // Production decimals
            modelBuilder.Entity<BillOfMaterial>().Property(b => b.Quantity).HasPrecision(10, 2);
            modelBuilder.Entity<BomItem>().Property(b => b.Quantity).HasPrecision(10, 2);
            modelBuilder.Entity<ProductionOrder>().Property(p => p.PlannedQty).HasPrecision(10, 2);
            modelBuilder.Entity<ProductionOrder>().Property(p => p.ProducedQty).HasPrecision(10, 2);
            modelBuilder.Entity<QualityCheck>().Property(q => q.SampleSize).HasPrecision(10, 2);
            modelBuilder.Entity<QualityCheck>().Property(q => q.PassedQty).HasPrecision(10, 2);
            modelBuilder.Entity<QualityCheck>().Property(q => q.RejectedQty).HasPrecision(10, 2);

            // Billing decimals
            modelBuilder.Entity<BillingInvoice>().Property(b => b.SubTotal).HasPrecision(18, 2);
            modelBuilder.Entity<BillingInvoice>().Property(b => b.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<BillingInvoice>().Property(b => b.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<BillingInvoice>().Property(b => b.PaidAmount).HasPrecision(18, 2);
            modelBuilder.Entity<BillingInvoiceItem>().Property(b => b.Quantity).HasPrecision(10, 2);
            modelBuilder.Entity<BillingInvoiceItem>().Property(b => b.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<BillingInvoiceItem>().Property(b => b.TaxPercent).HasPrecision(5, 2);
            modelBuilder.Entity<BillingInvoiceItem>().Property(b => b.TotalPrice).HasPrecision(18, 2);

            // POS decimals
            modelBuilder.Entity<PosSession>().Property(s => s.OpeningCash).HasPrecision(18, 2);
            modelBuilder.Entity<PosSession>().Property(s => s.ClosingCash).HasPrecision(18, 2);
            modelBuilder.Entity<PosOrder>().Property(o => o.SubTotal).HasPrecision(18, 2);
            modelBuilder.Entity<PosOrder>().Property(o => o.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PosOrder>().Property(o => o.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PosOrder>().Property(o => o.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PosOrderItem>().Property(o => o.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PosOrderItem>().Property(o => o.TaxPercent).HasPrecision(5, 2);
            modelBuilder.Entity<PosOrderItem>().Property(o => o.DiscountPercent).HasPrecision(5, 2);
            modelBuilder.Entity<PosOrderItem>().Property(o => o.TotalPrice).HasPrecision(18, 2);

            // Configure Delete Behaviors to avoid Multiple Cascade Path errors
            modelBuilder.Entity<ProductTransferItem>()
                .HasOne(i => i.Transfer)
                .WithMany(t => t.Items)
                .HasForeignKey(i => i.TransferId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductTransferItem>()
                .HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // ── Cascade delete rules ──────────────────────────
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Company)
                .WithMany(c => c.Employees)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PurchaseInvoice>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.PurchaseInvoices)
                .HasForeignKey(p => p.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VendorPayment>()
                .HasOne(p => p.PurchaseInvoice)
                .WithMany()
                .HasForeignKey(p => p.PurchaseInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VendorCreditNote>()
                .HasOne<PurchaseInvoice>()
                .WithMany()
                .HasForeignKey(n => n.PurchaseInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VendorDebitNote>()
                .HasOne<PurchaseInvoice>()
                .WithMany()
                .HasForeignKey(n => n.PurchaseInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SalesInvoice>()
                .HasOne(s => s.Customer)
                .WithMany(c => c.SalesInvoices)
                .HasForeignKey(s => s.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustomerPayment>()
                .HasOne(p => p.SalesInvoice)
                .WithMany()
                .HasForeignKey(p => p.SalesInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustomerCreditNote>()
                .HasOne<SalesInvoice>()
                .WithMany()
                .HasForeignKey(n => n.SalesInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustomerDebitNote>()
                .HasOne<SalesInvoice>()
                .WithMany()
                .HasForeignKey(n => n.SalesInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // ── Seed Roles ────────────────────────────────────
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, RoleName = "SuperAdmin" },
                new Role { Id = 2, RoleName = "Admin" },
                new Role { Id = 3, RoleName = "Manager" },
                new Role { Id = 4, RoleName = "Employee" }
            );

            // ── Seed Subscription Plans ───────────────────────
            modelBuilder.Entity<SubscriptionPlan>().HasData(
                new SubscriptionPlan { Id = 1, Name = "Basic", MonthlyPrice = 49, MaxSeats = 50, MaxModules = 4, Description = "Inventory, Purchase, Sales, Accounts", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new SubscriptionPlan { Id = 2, Name = "Pro", MonthlyPrice = 149, MaxSeats = 200, MaxModules = 12, Description = "All 12 modules", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new SubscriptionPlan { Id = 3, Name = "Enterprise", MonthlyPrice = 499, MaxSeats = 0, MaxModules = 12, Description = "All modules + Premium support", IsActive = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed Global Modules ───────────────────────────
            modelBuilder.Entity<GlobalModule>().HasData(
                new GlobalModule { Id=1,  ModuleId="inventory",  Name="Inventory Management", Description="Products, stock, warehouses, transfers", Category="Operations", Icon="Archive",      IsBuiltIn=true, IsActive=true, SortOrder=1,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=2,  ModuleId="purchase",   Name="Purchase Management",  Description="Vendors, POs, invoices, payments",       Category="Operations", Icon="ShoppingCart", IsBuiltIn=true, IsActive=true, SortOrder=2,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=3,  ModuleId="sales",      Name="Sales Management",     Description="Customers, quotations, invoices",         Category="Operations", Icon="TrendingUp",   IsBuiltIn=true, IsActive=true, SortOrder=3,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=4,  ModuleId="accounts",   Name="Accounts & Finance",   Description="Chart of accounts, vouchers, reports",    Category="Finance",    Icon="BookOpen",     IsBuiltIn=true, IsActive=true, SortOrder=4,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=5,  ModuleId="crm",        Name="CRM",                  Description="Leads, opportunities, follow-ups",        Category="Sales",      Icon="Users",        IsBuiltIn=true, IsActive=true, SortOrder=5,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=6,  ModuleId="hrm",        Name="HRM",                  Description="Employees, attendance, payroll",          Category="HR",         Icon="Users",        IsBuiltIn=true, IsActive=true, SortOrder=6,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=7,  ModuleId="projects",   Name="Projects",             Description="Project management, tasks, timesheets",   Category="Operations", Icon="Briefcase",    IsBuiltIn=true, IsActive=true, SortOrder=7,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=8,  ModuleId="helpdesk",   Name="Helpdesk",             Description="Ticket management, SLA monitoring",       Category="Support",    Icon="Headphones",   IsBuiltIn=true, IsActive=true, SortOrder=8,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=9,  ModuleId="assets",     Name="Assets",               Description="Asset tracking, depreciation, maintenance",Category="Finance",   Icon="Package",      IsBuiltIn=true, IsActive=true, SortOrder=9,  CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=10, ModuleId="logistics",  Name="Logistics",            Description="Shipment tracking, delivery management",  Category="Operations", Icon="Truck",        IsBuiltIn=true, IsActive=true, SortOrder=10, CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=11, ModuleId="production", Name="Production",           Description="BOM, work orders, quality control",       Category="Manufacturing",Icon="Factory",    IsBuiltIn=true, IsActive=true, SortOrder=11, CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=12, ModuleId="billing",    Name="Billing",              Description="Invoice management, payment reminders",   Category="Finance",    Icon="Receipt",      IsBuiltIn=true, IsActive=true, SortOrder=12, CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) },
                new GlobalModule { Id=13, ModuleId="pos",        Name="POS",                  Description="Point of Sale, billing, payments",        Category="Operations", Icon="Receipt",      IsBuiltIn=true, IsActive=true, SortOrder=13, CreatedAt=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc) }
            );

            // ── Seed Default SuperAdmin User (password: Admin@123) ──
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Name = "Super Admin",
                Email = "admin@erp.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                PlainPassword = "Admin@123",
                RoleId = 1,
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }
    }
}
