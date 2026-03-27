using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using System.Text;
using ERPPlugandPlay.Data;
using ERPPlugandPlay.Helpers;
using ERPPlugandPlay.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ERP PlugandPlay API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Enter: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5000",
            "https://api.vivifysoft.in",
            "https://vivifysoft.in",
            "https://www.vivifysoft.in")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
    });
});

// Database
builder.Services.AddDbContext<ERPDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Helpers
builder.Services.AddScoped<JwtHelper>();

// Services — Admin
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IPayrollService, PayrollService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<ISalesService, SalesService>();
builder.Services.AddScoped<IAccountsService, AccountsService>();
builder.Services.AddScoped<ICRMService, CRMService>();
builder.Services.AddScoped<IHRMService, HRMService>();
builder.Services.AddScoped<IProjectsService, ProjectsService>();
builder.Services.AddScoped<IHelpdeskService, HelpdeskService>();
builder.Services.AddScoped<IAssetsService, AssetsService>();
builder.Services.AddScoped<ILogisticsService, LogisticsService>();
builder.Services.AddScoped<IProductionService, ProductionService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IPOSService, POSService>();
builder.Services.AddScoped<IReportService, ReportService>();

// Services — SuperAdmin
builder.Services.AddScoped<ISuperAdminCompanyService, SuperAdminCompanyService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IModuleAccessService, ModuleAccessService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<ERPPlugandPlay.Services.ISystemSettingsService, ERPPlugandPlay.Services.SystemSettingsService>();

// Background Services
builder.Services.AddHostedService<InvoiceReminderService>();
builder.Services.AddHostedService<StockAlertService>();
builder.Services.AddHostedService<SubscriptionExpiryService>();

var app = builder.Build();

// Global Exception Handler — always return real error for debugging
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        await context.Response.WriteAsJsonAsync(new
        {
            success = false,
            message = "An internal server error occurred.",
            details = ex?.Message,
            innerDetails = ex?.InnerException?.Message,
            timestamp = DateTime.UtcNow
        });
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Serve uploaded files
var physicalPath = builder.Configuration["FileUpload:PhysicalRoot"] ?? "C:\\ERPPlugandPlay\\uploads";
var folderName = builder.Configuration["FileUpload:FolderName"] ?? "documents";
var uploadPath = Path.Combine(physicalPath, folderName);
Directory.CreateDirectory(uploadPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(physicalPath),
    RequestPath = "/api/documents"
});

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ERPPlugandPlay.Middleware.TrialAccessMiddleware>();
app.MapControllers();

// Auto-create DB on startup (safe — does nothing if DB already exists)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ERPDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        db.Database.EnsureCreated();
        logger.LogInformation("Database ensured/created successfully.");
        
        // Execute schema update for TaxType and TaxTypeId
        try 
        { 
            db.Database.SetCommandTimeout(300); // 5 minutes to allow for altering large tables
            db.Database.ExecuteSqlRaw(@"
                -- Create TaxTypes table if missing
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

                -- Add TaxTypeId column to Products if missing
                IF COL_LENGTH('Products', 'TaxTypeId') IS NULL
                BEGIN
                    ALTER TABLE Products ADD TaxTypeId INT NULL;
                    ALTER TABLE Products ADD CONSTRAINT FK_Products_TaxTypes FOREIGN KEY (TaxTypeId) REFERENCES TaxTypes(Id);
                END
            ");
        } 
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to update schema for TaxTypes/Products.TaxTypeId.");
        }

        // Ensure ProductReceives has PurchaseOrderRef and ReceivedDate columns
        try
        {
            db.Database.ExecuteSqlRaw(@"
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
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to update schema for ProductReceives columns.");
        }

        // Ensure ProductReceiveItems has ProductReceiveId and Quantity columns
        try
        {
            db.Database.ExecuteSqlRaw(@"
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
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to update schema for ProductReceiveItems columns.");
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "EnsureCreated failed (DB may already exist with different schema). Continuing startup.");
    }
}

app.Run();
