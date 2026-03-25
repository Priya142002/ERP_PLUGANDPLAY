# ERP PlugandPlay - Backend Setup Guide

## Prerequisites
- .NET 8 SDK
- SQL Server (local or remote)
- Visual Studio 2022 / VS Code

## 1. Configure Connection String
Edit `ERPPlugandPlay/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ERPPlugandPlayDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

## 2. Install NuGet Packages
```bash
cd ERPPlugandPlay/ERPPlugandPlay
dotnet restore
```

## 3. Database Migration Commands
```bash
# Add initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update

# Or use the SQL script directly:
# SQL/CreateTables.sql
```

## 4. Run the API
```bash
dotnet run
```
Swagger UI: https://localhost:7xxx/swagger

## 5. Default Login
- Email: admin@erp.com
- Password: Admin@123

## API Endpoints Summary

### Auth (both roles)
- POST /api/auth/login
- POST /api/auth/register
- GET  /api/auth/users              [Admin, SuperAdmin]
- PUT  /api/auth/update-user        [Admin, SuperAdmin]
- DELETE /api/auth/delete-user/{id} [Admin, SuperAdmin]

---

### SuperAdmin — Company Management
- POST   /api/superadmin/companies
- GET    /api/superadmin/companies?page=1&status=active&industry=
- GET    /api/superadmin/companies/{id}
- PUT    /api/superadmin/companies/{id}
- DELETE /api/superadmin/companies/{id}
- PATCH  /api/superadmin/companies/{id}/toggle-status

### SuperAdmin — Subscription Plans
- GET    /api/superadmin/subscriptions/plans         (public)
- POST   /api/superadmin/subscriptions/plans
- PUT    /api/superadmin/subscriptions/plans/{id}
- DELETE /api/superadmin/subscriptions/plans/{id}

### SuperAdmin — Company Subscriptions (Subscription Ledger)
- GET    /api/superadmin/subscriptions
- GET    /api/superadmin/subscriptions/company/{companyId}
- POST   /api/superadmin/subscriptions/assign
- PUT    /api/superadmin/subscriptions/change-plan
- PUT    /api/superadmin/subscriptions/status

### SuperAdmin — Module Access
- GET    /api/superadmin/modules/company/{companyId}
- POST   /api/superadmin/modules/set
- PATCH  /api/superadmin/modules/toggle
- GET    /api/superadmin/modules/trial-defaults
- POST   /api/superadmin/modules/trial-defaults

### SuperAdmin — Analytics & Audit
- GET    /api/superadmin/analytics/platform
- GET    /api/superadmin/analytics/audit-logs

---

### Admin — Module Management
- GET    /api/admin/modules/{companyId}
- PATCH  /api/admin/modules/toggle
- GET    /api/admin/modules/{companyId}/subscription

### Admin — Company (simple)
- POST   /api/company/create
- GET    /api/company/list
- PUT    /api/company/update/{id}
- DELETE /api/company/delete/{id}

### Admin — Employee
- POST   /api/employee/create
- GET    /api/employee/list
- GET    /api/employee/{id}
- PUT    /api/employee/update/{id}
- DELETE /api/employee/delete/{id}

### Admin — Department & Designation
- POST   /api/department/create
- GET    /api/department/list?companyId=1
- PUT    /api/department/update/{id}
- DELETE /api/department/delete/{id}
- POST   /api/department/designation/create
- GET    /api/department/designation/list?companyId=1
- DELETE /api/department/designation/delete/{id}

### Admin — Payroll
- POST /api/payroll/generate
- GET  /api/payroll/employee/{employeeId}
- GET  /api/payroll/report?month=3&year=2026

### Admin — Inventory
- POST   /api/inventory/product/add
- PUT    /api/inventory/product/update/{id}
- GET    /api/inventory/product/list
- DELETE /api/inventory/product/delete/{id}
- POST   /api/inventory/stock/update
- GET    /api/inventory/stock/history/{productId}
- POST   /api/inventory/category/add
- GET    /api/inventory/category/list

### Admin — Visitor / GatePass
- POST /api/visitor/create
- GET  /api/visitor/list
- POST /api/visitor/gatepass/create
- PUT  /api/visitor/gatepass/approve
- GET  /api/visitor/gatepass/qr/{gatePassId}
- POST /api/visitor/gatepass/scan
- GET  /api/visitor/gatepass/list

### Admin — Reports (Excel Export)
- GET /api/report/employees?companyId=1
- GET /api/report/payroll?month=3&year=2026
- GET /api/report/inventory
- GET /api/report/visitors?from=2026-01-01&to=2026-03-31

### File Upload
- POST   /api/file/upload
- DELETE /api/file/delete
