using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Helpers;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;

namespace ERPPlugandPlay.Services
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto);
        Task<ApiResponse<AuthResponseDto>> GoogleLoginAsync(string idToken);
        Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto dto);
        Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(PaginationParams p);
        Task<ApiResponse<UserDto>> UpdateUserAsync(UpdateUserDto dto);
        Task<ApiResponse<bool>> DeleteUserAsync(int id);
    }

    public class AuthService : IAuthService
    {
        private readonly ERPDbContext _db;
        private readonly JwtHelper _jwt;

        public AuthService(ERPDbContext db, JwtHelper jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        // ── Login ─────────────────────────────────────────────
        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            var user = await _db.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                // Auto-register new user with Admin role + 30-day trial
                var adminRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Admin");
                if (adminRole == null) return ApiResponse<AuthResponseDto>.Fail("System roles not configured.");

                user = new User
                {
                    Name          = dto.Email.Split('@')[0],
                    Email         = dto.Email,
                    PasswordHash  = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    PlainPassword = dto.Password,
                    RoleId        = adminRole.Id,
                    IsActive      = true
                };

                // Create a trial company for this user
                var company = new Company
                {
                    Name = user.Name + " Company",
                    Email = user.Email,
                    AdminEmail = user.Email,
                    AdminName = user.Name,
                    AdminPassword = user.PlainPassword,
                    IsTrialActive = true,
                    TrialStartDate = DateTime.UtcNow,
                    TrialEndDate = DateTime.UtcNow.AddDays(30),
                    Status = "active",
                    Code = "TRL-" + Guid.NewGuid().ToString("N")[..6].ToUpper()
                };
                _db.Companies.Add(company);
                await _db.SaveChangesAsync();

                // Link user to company
                user.CompanyId = company.Id;
                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                // Assign default trial modules
                var defaultTrialModules = new List<string> { "inventory", "sales", "purchase", "accounts" };
                foreach (var moduleId in defaultTrialModules)
                {
                    _db.CompanyModules.Add(new CompanyModule
                    {
                        CompanyId = company.Id,
                        ModuleId = moduleId,
                        IsEnabled = true,
                        IsTrialAccess = true
                    });
                }
                await _db.SaveChangesAsync();

                await _db.Entry(user).Reference(u => u.Role).LoadAsync();
            }
            else
            {
                if (!user.IsActive)
                    return ApiResponse<AuthResponseDto>.Fail("Your account has been deactivated.");

                bool passwordValid;
                try { passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash); }
                catch
                {
                    // Hash is plain text (legacy) — compare directly then re-hash
                    passwordValid = user.PasswordHash == dto.Password;
                    if (passwordValid)
                    {
                        user.PasswordHash  = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                        user.PlainPassword = dto.Password;
                        await _db.SaveChangesAsync();
                    }
                }

                if (!passwordValid)
                    return ApiResponse<AuthResponseDto>.Fail("Invalid email or password.");
            }

            return await LoginWithUserAsync(user);
        }

        // ── Google Login ──────────────────────────────────────
        public async Task<ApiResponse<AuthResponseDto>> GoogleLoginAsync(string idToken)
        {
            using var http = new System.Net.Http.HttpClient();
            var verifyRes = await http.GetAsync(
                $"https://oauth2.googleapis.com/tokeninfo?id_token={idToken}");

            if (!verifyRes.IsSuccessStatusCode)
                return ApiResponse<AuthResponseDto>.Fail("Invalid Google token.");

            var payload = await verifyRes.Content.ReadFromJsonAsync<GoogleTokenPayload>();
            if (payload == null || string.IsNullOrEmpty(payload.Email))
                return ApiResponse<AuthResponseDto>.Fail("Could not read Google account info.");

            const string expectedClientId = "195081320528-v0hos2n43vu3v9j1jclqrp8c1fumecq7.apps.googleusercontent.com";
            if (payload.Aud != expectedClientId)
                return ApiResponse<AuthResponseDto>.Fail("Token audience mismatch.");

            var user = await _db.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user == null)
            {
                var adminRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Admin");
                if (adminRole == null) return ApiResponse<AuthResponseDto>.Fail("Admin role not found.");

                var tempPassword = Guid.NewGuid().ToString("N")[..12]; // readable temp password
                user = new User
                {
                    Name          = payload.Name ?? payload.Email,
                    Email         = payload.Email,
                    PasswordHash  = BCrypt.Net.BCrypt.HashPassword(tempPassword),
                    PlainPassword = tempPassword,
                    RoleId        = adminRole.Id,
                    IsActive      = true
                };

                // Create a trial company for this user
                var company = new Company
                {
                    Name = user.Name + " Company",
                    Email = user.Email,
                    AdminEmail = user.Email,
                    AdminName = user.Name,
                    AdminPassword = user.PlainPassword,
                    IsTrialActive = true,
                    TrialStartDate = DateTime.UtcNow,
                    TrialEndDate = DateTime.UtcNow.AddDays(30),
                    Status = "active",
                    Code = "TRL-" + Guid.NewGuid().ToString("N")[..6].ToUpper()
                };
                _db.Companies.Add(company);
                await _db.SaveChangesAsync();

                // Link user to company
                user.CompanyId = company.Id;
                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                // Assign default trial modules
                var defaultTrialModules = new List<string> { "inventory", "sales", "purchase", "accounts" };
                foreach (var moduleId in defaultTrialModules)
                {
                    _db.CompanyModules.Add(new CompanyModule
                    {
                        CompanyId = company.Id,
                        ModuleId = moduleId,
                        IsEnabled = true,
                        IsTrialAccess = true
                    });
                }
                await _db.SaveChangesAsync();

                await _db.Entry(user).Reference(u => u.Role).LoadAsync();
            }

            if (!user.IsActive)
                return ApiResponse<AuthResponseDto>.Fail("Your account has been deactivated.");

            return await LoginWithUserAsync(user);
        }

        // ── Shared login logic ────────────────────────────────
        private async Task<ApiResponse<AuthResponseDto>> LoginWithUserAsync(User user)
        {
            if (user.Role.RoleName == "SuperAdmin")
            {
                var (superToken, superExpiry) = _jwt.GenerateToken(user);
                return ApiResponse<AuthResponseDto>.Ok(new AuthResponseDto
                {
                    Token = superToken, Name = user.Name, Email = user.Email,
                    Role = user.Role.RoleName, Expiry = superExpiry,
                    HasActiveSubscription = true, DaysRemaining = 9999,
                    AllowedModules = await AllModulesAsync()
                });
            }

            // Find company by CompanyId
            Company? company = null;
            if (user.CompanyId.HasValue)
            {
                company = await _db.Companies
                    .Include(c => c.Modules)
                    .FirstOrDefaultAsync(c => c.Id == user.CompanyId.Value);
            }
            
            // Fallback for legacy data (admin email or employee lookup)
            if (company == null)
            {
                company = await _db.Companies
                    .Include(c => c.Modules)
                    .FirstOrDefaultAsync(c => c.AdminEmail == user.Email);

                if (company == null)
                {
                    var employee = await _db.Employees.FirstOrDefaultAsync(e => e.Email == user.Email);
                    if (employee != null)
                        company = await _db.Companies.Include(c => c.Modules)
                            .FirstOrDefaultAsync(c => c.Id == employee.CompanyId);
                }

                if (company != null && !user.CompanyId.HasValue)
                {
                    user.CompanyId = company.Id;
                    await _db.SaveChangesAsync();
                }
            }

            bool hasActiveSub = false;
            bool isTrialActive = false;
            DateTime? trialEndDate = null;
            int daysRemaining = 0;
            List<string> allowedModules = new();

            if (company != null)
            {
                var activeSub = await _db.CompanySubscriptions
                    .FirstOrDefaultAsync(s => s.CompanyId == company.Id && s.Status == "Active" &&
                                              (!s.EndDate.HasValue || s.EndDate.Value >= DateTime.UtcNow));
                hasActiveSub = activeSub != null;

                if (!hasActiveSub)
                {
                    if (company.IsTrialActive && company.TrialEndDate.HasValue)
                    {
                        if (company.TrialEndDate.Value >= DateTime.UtcNow)
                        {
                            isTrialActive = true;
                            trialEndDate = company.TrialEndDate;
                            daysRemaining = (int)(company.TrialEndDate.Value - DateTime.UtcNow).TotalDays + 1;
                        }
                        else
                        {
                            company.IsTrialActive = false;
                            await _db.SaveChangesAsync();
                            return ApiResponse<AuthResponseDto>.Fail(
                                "Your 30-day free trial has expired. Please subscribe to continue.");
                        }
                    }
                    else
                        return ApiResponse<AuthResponseDto>.Fail(
                            "Your trial has expired. Please subscribe to continue.");
                }
                else
                    daysRemaining = activeSub!.EndDate.HasValue
                        ? (int)(activeSub.EndDate.Value - DateTime.UtcNow).TotalDays + 1 : 9999;

                allowedModules = hasActiveSub
                    ? (company.Modules.Where(m => m.IsEnabled).Select(m => m.ModuleId).ToList() is { Count: > 0 } ml
                        ? ml : await AllModulesAsync())
                    : company.Modules.Where(m => m.IsEnabled && m.IsTrialAccess).Select(m => m.ModuleId).ToList();

                // For sub-users (non-admin role), further restrict to their assigned permissions
                if (user.Role.RoleName != "Admin" && user.Role.RoleName != "SuperAdmin")
                {
                    var userPermissions = await _db.RolePermissions
                        .Include(rp => rp.Permission)
                        .Where(rp => rp.RoleId == user.RoleId)
                        .Select(rp => rp.Permission.Name)
                        .ToListAsync();

                    // Extract module IDs from permission names (e.g. "Inventory_View" → "inventory")
                    var permittedModules = userPermissions
                        .Select(p => p.Split('_')[0].ToLower())
                        .Distinct()
                        .ToList();

                    // Intersect: only show modules that are both company-enabled AND user-permitted
                    if (permittedModules.Any())
                        allowedModules = allowedModules.Intersect(permittedModules).ToList();
                }
            }
            else
            {
                isTrialActive = true;
                trialEndDate = DateTime.UtcNow.AddDays(30);
                daysRemaining = 30;
                allowedModules = await AllModulesAsync();
            }

            var (token, expiry) = _jwt.GenerateToken(user);
            return ApiResponse<AuthResponseDto>.Ok(new AuthResponseDto
            {
                Token = token, Name = user.Name, Email = user.Email,
                Role = user.Role.RoleName, Expiry = expiry,
                CompanyId = company?.Id, CompanyName = company?.Name,
                IsTrialActive = isTrialActive, TrialEndDate = trialEndDate,
                HasActiveSubscription = hasActiveSub,
                DaysRemaining = daysRemaining, AllowedModules = allowedModules
            });
        }

        private async Task<List<string>> AllModulesAsync() =>
            await _db.GlobalModules.Where(m => m.IsActive).Select(m => m.ModuleId).ToListAsync();
        
        private static List<string> AllModules() =>
        [
            "inventory", "purchase", "sales", "accounts",
            "crm", "hrm", "projects", "helpdesk",
            "assets", "logistics", "production", "billing", "pos"
        ];

        private class GoogleTokenPayload
        {
            [System.Text.Json.Serialization.JsonPropertyName("email")]
            public string Email { get; set; } = string.Empty;
            [System.Text.Json.Serialization.JsonPropertyName("name")]
            public string Name { get; set; } = string.Empty;
            [System.Text.Json.Serialization.JsonPropertyName("aud")]
            public string Aud { get; set; } = string.Empty;
            [System.Text.Json.Serialization.JsonPropertyName("email_verified")]
            public bool EmailVerified { get; set; }
        }

        // ── User CRUD ─────────────────────────────────────────
        public async Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return ApiResponse<UserDto>.Fail("Email already registered.");

            var role = await _db.Roles.FindAsync(dto.RoleId);
            if (role == null) return ApiResponse<UserDto>.Fail("Invalid role.");

            var user = new User
            {
                Name = dto.Name, Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = dto.RoleId
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return ApiResponse<UserDto>.Ok(MapUserDto(user, role.RoleName), "User registered successfully.");
        }

        public async Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(PaginationParams p)
        {
            var query = _db.Users.Include(u => u.Role).AsQueryable();
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(u => u.Name.Contains(p.Search) || u.Email.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(u => MapUserDto(u, u.Role.RoleName)).ToListAsync();

            return ApiResponse<PagedResult<UserDto>>.Ok(new PagedResult<UserDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<UserDto>> UpdateUserAsync(UpdateUserDto dto)
        {
            var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == dto.Id);
            if (user == null) return ApiResponse<UserDto>.Fail("User not found.");

            if (dto.Name != null) user.Name = dto.Name;
            if (dto.Email != null) user.Email = dto.Email;
            if (dto.RoleId.HasValue) user.RoleId = dto.RoleId.Value;
            if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            await _db.Entry(user).Reference(u => u.Role).LoadAsync();
            return ApiResponse<UserDto>.Ok(MapUserDto(user, user.Role.RoleName));
        }

        public async Task<ApiResponse<bool>> DeleteUserAsync(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return ApiResponse<bool>.Fail("User not found.");
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "User deleted.");
        }

        private static UserDto MapUserDto(User u, string roleName) => new()
        {
            Id = u.Id, Name = u.Name, Email = u.Email,
            Role = roleName, IsActive = u.IsActive, CreatedAt = u.CreatedAt
        };
    }
}
