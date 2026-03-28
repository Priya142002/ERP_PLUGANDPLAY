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
builder.Services.AddHttpContextAccessor();

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
builder.Services.AddScoped<IAdminService, AdminService>();

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

// Auto-create DB and update schema on startup
DatabaseInitializer.Initialize(app.Services);

app.Run();
