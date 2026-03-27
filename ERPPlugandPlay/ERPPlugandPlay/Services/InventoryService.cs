using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ERPPlugandPlay.Services
{
    public interface IInventoryService
    {
        // Dashboard
        Task<ApiResponse<InventoryDashboardDto>> GetDashboardAsync(int companyId, int lowStockThreshold = 10);

        // Products
        Task<ApiResponse<ProductDto>> AddProductAsync(CreateProductDto dto);
        Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, UpdateProductDto dto);
        Task<ApiResponse<ProductDto>> GetProductAsync(int id);
        Task<ApiResponse<PagedResult<ProductDto>>> ListProductsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<bool>> DeleteProductAsync(int id);

        // Stock
        Task<ApiResponse<StockTransactionDto>> UpdateStockAsync(UpdateStockDto dto);
        Task<ApiResponse<List<StockTransactionDto>>> GetStockHistoryAsync(int productId);

        // Categories
        Task<ApiResponse<CategoryDto>> AddCategoryAsync(CreateCategoryDto dto);
        Task<ApiResponse<List<CategoryDto>>> ListCategoriesAsync(int companyId);

        // Brands
        Task<ApiResponse<List<BrandDto>>> ListBrandsAsync(int companyId);
        Task<ApiResponse<BrandDto>> AddBrandAsync(CreateBrandDto dto);

        // Units
        Task<ApiResponse<List<UnitDto>>> ListUnitsAsync(int companyId);
        Task<ApiResponse<UnitDto>> AddUnitAsync(CreateUnitDto dto);

        // Tax Types
        Task<ApiResponse<List<TaxTypeDto>>> ListTaxTypesAsync(int companyId);
        Task<ApiResponse<TaxTypeDto>> AddTaxTypeAsync(CreateTaxTypeDto dto);

        // Warehouses
        Task<ApiResponse<PagedResult<WarehouseDto>>> ListWarehousesAsync(int companyId, PaginationParams p);
        Task<ApiResponse<WarehouseDto>> AddWarehouseAsync(CreateWarehouseDto dto);
        Task<ApiResponse<WarehouseDto>> UpdateWarehouseAsync(int id, UpdateWarehouseDto dto);
        Task<ApiResponse<bool>> DeleteWarehouseAsync(int id);

        // Material Dispatch
        Task<ApiResponse<MaterialDispatchDto>> CreateDispatchAsync(CreateDispatchDto dto);
        Task<ApiResponse<MaterialDispatchDto>> GetDispatchAsync(int id);
        Task<ApiResponse<PagedResult<MaterialDispatchDto>>> ListDispatchesAsync(int companyId, PaginationParams p);
        Task<ApiResponse<bool>> UpdateDispatchStatusAsync(int id, string status);

        // Product Transfer
        Task<ApiResponse<ProductTransferDto>> CreateTransferAsync(CreateTransferDto dto);
        Task<ApiResponse<PagedResult<ProductTransferDto>>> ListTransfersAsync(int companyId, PaginationParams p);
        Task<ApiResponse<bool>> UpdateTransferStatusAsync(int id, string status);

        // Product Receive (GRN)
        Task<ApiResponse<ProductReceiveDto>> CreateReceiveAsync(CreateReceiveDto dto);
        Task<ApiResponse<PagedResult<ProductReceiveDto>>> ListReceivesAsync(int companyId, PaginationParams p);
    }

    public class InventoryService : IInventoryService
    {
        private readonly ERPDbContext _db;
        public InventoryService(ERPDbContext db) => _db = db;

        private static void DebugLog(string hypothesisId, string message, object data)
        {
            try
            {
                var line = JsonSerializer.Serialize(new
                {
                    sessionId = "53db90",
                    runId = "inventory-sku-debug-1",
                    hypothesisId,
                    location = "InventoryService.cs:AddProductAsync",
                    message,
                    data,
                    timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                });
                File.AppendAllText("debug-53db90.log", line + Environment.NewLine);
            }
            catch { }
        }

        // ── Dashboard ────────────────────────────────────────
        public async Task<ApiResponse<InventoryDashboardDto>> GetDashboardAsync(int companyId, int lowStockThreshold = 10)
        {
            var products = await _db.Products.Where(p => p.CompanyId == companyId).Include(p => p.Category).ToListAsync();
            var today = DateTime.UtcNow.Date;

            var dashboard = new InventoryDashboardDto
            {
                TotalProducts = products.Count,
                TotalCategories = await _db.Categories.CountAsync(c => c.CompanyId == companyId),
                LowStockCount = products.Count(p => p.StockQty > 0 && p.StockQty <= lowStockThreshold),
                OutOfStockCount = products.Count(p => p.StockQty == 0),
                TotalInventoryValue = products.Sum(p => p.Price * p.StockQty),
                TodayDispatches = await _db.MaterialDispatches.CountAsync(d => d.CompanyId == companyId && d.DispatchDate.Date == today),
                TodayReceives = await _db.ProductReceives.CountAsync(r => r.CompanyId == companyId && r.ReceiveDate.Date == today),
                LowStockItems = await _db.Products.Where(p => p.CompanyId == companyId && p.StockQty <= lowStockThreshold && p.StockQty > 0)
                    .Include(p => p.Category) // Include Category for CategoryName
                    .OrderBy(p => p.StockQty)
                    .Take(10)
                    .Select(p => new LowStockItemDto
                    {
                        ProductId = p.Id,
                        ProductName = p.Name,
                        CategoryName = p.Category.Name ?? "",
                        StockQty = p.StockQty,
                        Price = p.Price
                    }).ToListAsync(),
                RecentTransactions = await _db.StockTransactions.Include(t => t.Product)
                    .Where(t => t.CompanyId == companyId)
                    .OrderByDescending(t => t.Date).Take(10)
                    .Select(t => new StockTransactionDto
                    {
                        Id = t.Id,
                        CompanyId = t.CompanyId,
                        ProductId = t.ProductId,
                        ProductName = t.Product.Name,
                        Quantity = t.Quantity,
                        Type = t.Type,
                        Date = t.Date,
                        Remarks = t.Remarks
                    }).ToListAsync()
            };

            return ApiResponse<InventoryDashboardDto>.Ok(dashboard);
        }

        // ── Products ─────────────────────────────────────────
        private async Task<int> GetOrCreateCategory(int companyId, string name)
        {
            var cat = await _db.Categories.FirstOrDefaultAsync(c => c.CompanyId == companyId && c.Name.ToLower() == name.ToLower());
            if (cat == null) { cat = new Category { CompanyId = companyId, Name = name }; _db.Categories.Add(cat); await _db.SaveChangesAsync(); }
            return cat.Id;
        }

        private async Task<int?> GetOrCreateBrand(int companyId, string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return null;
            var b = await _db.Brands.FirstOrDefaultAsync(x => x.CompanyId == companyId && x.Name.ToLower() == name.ToLower());
            if (b == null) { b = new Brand { CompanyId = companyId, Name = name }; _db.Brands.Add(b); await _db.SaveChangesAsync(); }
            return b.Id;
        }

        private async Task<int?> GetOrCreateUnit(int companyId, string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return null;
            var u = await _db.Units.FirstOrDefaultAsync(x => x.CompanyId == companyId && x.Name.ToLower() == name.ToLower());
            if (u == null) { u = new Unit { CompanyId = companyId, Name = name, Abbreviation = name }; _db.Units.Add(u); await _db.SaveChangesAsync(); }
            return u.Id;
        }

        public async Task<ApiResponse<ProductDto>> AddProductAsync(CreateProductDto dto)
        {
            var globalSkuExists = await _db.Products.AnyAsync(p => p.SKU == dto.SKU && p.CompanyId == dto.CompanyId);
            
            if (globalSkuExists)
            {
                return ApiResponse<ProductDto>.Fail("SKU already exists.");
            }

            var categoryId = await GetOrCreateCategory(dto.CompanyId, dto.Category);
            var brandId = await GetOrCreateBrand(dto.CompanyId, dto.Brand);
            var unitId = await GetOrCreateUnit(dto.CompanyId, dto.Unit);

            var taxTypeId = !string.IsNullOrEmpty(dto.TaxType) ? await GetOrCreateTaxType(dto.CompanyId, dto.TaxType, dto.TaxPercentage) : (int?)null;

            var product = new Product
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name,
                SKU = dto.SKU,
                CategoryId = categoryId,
                BrandId = brandId,
                UnitId = unitId,
                TaxTypeId = taxTypeId,
                Price = dto.Price,
                SellingPrice = dto.SellingPrice,
                TaxPercentage = dto.TaxPercentage,
                StockQty = dto.Stock,
                Status = dto.Status,
                ImageUrl = dto.ImageUrl,
                AddedAt = DateTime.UtcNow
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            product = await _db.Products
                .Include(p => p.Category).Include(p => p.Brand).Include(p => p.Unit)
                .FirstAsync(p => p.Id == product.Id);

            return ApiResponse<ProductDto>.Ok(MapProduct(product), "Product added.");
        }

        public async Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, UpdateProductDto dto)
        {
            var product = await _db.Products
                .Include(p => p.Category).Include(p => p.Brand).Include(p => p.Unit)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return ApiResponse<ProductDto>.Fail("Product not found.");

            if (product.SKU != dto.SKU && await _db.Products.AnyAsync(p => p.SKU == dto.SKU && p.CompanyId == product.CompanyId))
                return ApiResponse<ProductDto>.Fail("SKU already exists.");

            product.Name = dto.Name;
            product.SKU = dto.SKU;
            product.CategoryId = await GetOrCreateCategory(product.CompanyId, dto.Category);
            product.BrandId = await GetOrCreateBrand(product.CompanyId, dto.Brand);
            product.UnitId = await GetOrCreateUnit(product.CompanyId, dto.Unit);
            product.TaxTypeId = !string.IsNullOrEmpty(dto.TaxType) ? await GetOrCreateTaxType(product.CompanyId, dto.TaxType, dto.TaxPercentage) : null;
            product.Price = dto.Price;
            product.SellingPrice = dto.SellingPrice;
            product.TaxPercentage = dto.TaxPercentage;
            product.StockQty = dto.Stock;
            product.Status = dto.Status;
            product.ImageUrl = dto.ImageUrl;
            
            await _db.SaveChangesAsync();

            product = await _db.Products
                .Include(p => p.Category).Include(p => p.Brand).Include(p => p.Unit)
                .FirstAsync(p => p.Id == product.Id);

            return ApiResponse<ProductDto>.Ok(MapProduct(product));
        }

        public async Task<ApiResponse<ProductDto>> GetProductAsync(int id)
        {
            var p = await _db.Products
                .Include(x => x.Category)
                .Include(x => x.Brand)
                .Include(x => x.Unit)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return ApiResponse<ProductDto>.Fail("Product not found.");
            return ApiResponse<ProductDto>.Ok(MapProduct(p));
        }

        public async Task<ApiResponse<PagedResult<ProductDto>>> ListProductsAsync(int companyId, PaginationParams p)
        {
            var query = _db.Products.Where(p => p.CompanyId == companyId)
                .Include(pr => pr.Category).Include(pr => pr.Brand).Include(pr => pr.Unit).Include(pr => pr.TaxType).AsQueryable();
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(pr => pr.Name.Contains(p.Search) || pr.SKU.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize)
                .Select(pr => MapProduct(pr)).ToListAsync();

            return ApiResponse<PagedResult<ProductDto>>.Ok(new PagedResult<ProductDto>
            { Items = items, TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return ApiResponse<bool>.Fail("Product not found.");
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Product deleted.");
        }

        // ── Stock ─────────────────────────────────────────────
        public async Task<ApiResponse<StockTransactionDto>> UpdateStockAsync(UpdateStockDto dto)
        {
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId && p.CompanyId == dto.CompanyId);
            if (product == null) return ApiResponse<StockTransactionDto>.Fail("Product not found or access denied.");
            if (dto.Type == "OUT" && product.StockQty < dto.Quantity)
                return ApiResponse<StockTransactionDto>.Fail("Insufficient stock.");

            product.StockQty += dto.Type == "IN" ? dto.Quantity : -dto.Quantity;
            var tx = new StockTransaction { CompanyId = dto.CompanyId, ProductId = dto.ProductId, Quantity = dto.Quantity, Type = dto.Type, Remarks = dto.Remarks };
            _db.StockTransactions.Add(tx);
            await _db.SaveChangesAsync();

            return ApiResponse<StockTransactionDto>.Ok(new StockTransactionDto
            {
                Id = tx.Id,
                CompanyId = tx.CompanyId,
                ProductId = tx.ProductId,
                ProductName = product.Name,
                Quantity = tx.Quantity,
                Type = tx.Type,
                Date = tx.Date,
                Remarks = tx.Remarks
            }, "Stock updated.");
        }

        public async Task<ApiResponse<List<StockTransactionDto>>> GetStockHistoryAsync(int productId)
        {
            var txs = await _db.StockTransactions.Include(t => t.Product)
                .Where(t => t.ProductId == productId).OrderByDescending(t => t.Date).ToListAsync();
            return ApiResponse<List<StockTransactionDto>>.Ok(txs.Select(t => new StockTransactionDto
            {
                Id = t.Id,
                CompanyId = t.CompanyId,
                ProductId = t.ProductId,
                ProductName = t.Product.Name,
                Quantity = t.Quantity,
                Type = t.Type,
                Date = t.Date,
                Remarks = t.Remarks
            }).ToList());
        }

        // ── Categories ────────────────────────────────────────
        public async Task<ApiResponse<CategoryDto>> AddCategoryAsync(CreateCategoryDto dto)
        {
            var cat = new Category { CompanyId = dto.CompanyId, Name = dto.Name };
            _db.Categories.Add(cat);
            await _db.SaveChangesAsync();
            return ApiResponse<CategoryDto>.Ok(new CategoryDto { Id = cat.Id, CompanyId = cat.CompanyId, Name = cat.Name }, "Category added.");
        }

        public async Task<ApiResponse<List<CategoryDto>>> ListCategoriesAsync(int companyId)
        {
            var cats = await _db.Categories.Where(c => c.CompanyId == companyId)
                .Select(c => new CategoryDto { Id = c.Id, CompanyId = c.CompanyId, Name = c.Name }).ToListAsync();
            return ApiResponse<List<CategoryDto>>.Ok(cats);
        }

        // ── Brands ───────────────────────────────────────────
        public async Task<ApiResponse<List<BrandDto>>> ListBrandsAsync(int companyId)
        {
            var brands = await _db.Brands.Where(b => b.CompanyId == companyId)
                .Select(b => new BrandDto { Id = b.Id, Name = b.Name }).ToListAsync();
            return ApiResponse<List<BrandDto>>.Ok(brands);
        }

        public async Task<ApiResponse<BrandDto>> AddBrandAsync(CreateBrandDto dto)
        {
            var brand = new Brand { CompanyId = dto.CompanyId, Name = dto.Name };
            _db.Brands.Add(brand);
            await _db.SaveChangesAsync();
            return ApiResponse<BrandDto>.Ok(new BrandDto { Id = brand.Id, Name = brand.Name }, "Brand added.");
        }

        // ── Units ────────────────────────────────────────────
        public async Task<ApiResponse<List<UnitDto>>> ListUnitsAsync(int companyId)
        {
            var units = await _db.Units.Where(u => u.CompanyId == companyId)
                .Select(u => new UnitDto { Id = u.Id, Name = u.Name, Abbreviation = u.Abbreviation }).ToListAsync();
            return ApiResponse<List<UnitDto>>.Ok(units);
        }

        public async Task<ApiResponse<UnitDto>> AddUnitAsync(CreateUnitDto dto)
        {
            var unit = new Unit { CompanyId = dto.CompanyId, Name = dto.Name, Abbreviation = dto.Abbreviation ?? dto.Name };
            _db.Units.Add(unit);
            await _db.SaveChangesAsync();
            return ApiResponse<UnitDto>.Ok(new UnitDto { Id = unit.Id, Name = unit.Name, Abbreviation = unit.Abbreviation }, "Unit added.");
        }

        // ── Warehouses ─────────────────────────────────────────
        public async Task<ApiResponse<PagedResult<WarehouseDto>>> ListWarehousesAsync(int companyId, PaginationParams p)
        {
            var query = _db.Warehouses.Where(w => w.CompanyId == companyId).AsQueryable();

            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(w => w.Name.Contains(p.Search) || w.Location.Contains(p.Search) || w.Status.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query
                .Skip((p.Page - 1) * p.PageSize)
                .Take(p.PageSize)
                .Select(w => new WarehouseDto
                {
                    Id = w.Id,
                    Name = w.Name,
                    Location = w.Location,
                    Status = w.Status
                })
                .ToListAsync();

            return ApiResponse<PagedResult<WarehouseDto>>.Ok(new PagedResult<WarehouseDto>
            {
                Items = items,
                TotalCount = total,
                Page = p.Page,
                PageSize = p.PageSize
            });
        }

        public async Task<ApiResponse<WarehouseDto>> AddWarehouseAsync(CreateWarehouseDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return ApiResponse<WarehouseDto>.Fail("Warehouse name is required.");

            if (string.IsNullOrWhiteSpace(dto.Location))
                return ApiResponse<WarehouseDto>.Fail("Warehouse location is required.");

            var nameLower = dto.Name.ToLower();
            var location = dto.Location.Trim();
            var status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status;

            if (await _db.Warehouses.AnyAsync(w => w.CompanyId == dto.CompanyId && w.Name.ToLower() == nameLower))
                return ApiResponse<WarehouseDto>.Fail("Warehouse already exists for this company.");

            var wh = new Warehouse
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name.Trim(),
                Location = location,
                Status = status
            };

            _db.Warehouses.Add(wh);
            await _db.SaveChangesAsync();

            return ApiResponse<WarehouseDto>.Ok(MapWarehouse(wh), "Warehouse added.");
        }

        public async Task<ApiResponse<WarehouseDto>> UpdateWarehouseAsync(int id, UpdateWarehouseDto dto)
        {
            var wh = await _db.Warehouses.FirstOrDefaultAsync(w => w.Id == id);
            if (wh == null) return ApiResponse<WarehouseDto>.Fail("Warehouse not found.");

            wh.Name = dto.Name.Trim();
            wh.Location = dto.Location.Trim();
            wh.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status;

            await _db.SaveChangesAsync();
            return ApiResponse<WarehouseDto>.Ok(MapWarehouse(wh));
        }

        public async Task<ApiResponse<bool>> DeleteWarehouseAsync(int id)
        {
            var wh = await _db.Warehouses.FirstOrDefaultAsync(w => w.Id == id);
            if (wh == null) return ApiResponse<bool>.Fail("Warehouse not found.");

            _db.Warehouses.Remove(wh);
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true, "Warehouse deleted.");
        }

        // ── Material Dispatch ─────────────────────────────────
        public async Task<ApiResponse<MaterialDispatchDto>> CreateDispatchAsync(CreateDispatchDto dto)
        {
            var dispatchNumber = $"DSP-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var dispatch = new MaterialDispatch
            {
                CompanyId = dto.CompanyId,
                DispatchNumber = dispatchNumber,
                DispatchedTo = dto.DispatchedTo,
                Notes = dto.Notes,
                DispatchDate = dto.DispatchDate
            };

            foreach (var item in dto.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product == null) return ApiResponse<MaterialDispatchDto>.Fail($"Product {item.ProductId} not found.");
                if (product.StockQty < item.Quantity) return ApiResponse<MaterialDispatchDto>.Fail($"Insufficient stock for {product.Name}.");

                dispatch.Items.Add(new MaterialDispatchItem { ProductId = item.ProductId, Quantity = item.Quantity });
                product.StockQty -= item.Quantity;
                _db.StockTransactions.Add(new StockTransaction
                {
                    CompanyId = dto.CompanyId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Type = "OUT",
                    Remarks = $"Dispatch {dispatchNumber} to {dto.DispatchedTo}"
                });
            }

            dispatch.Status = "Dispatched";
            _db.MaterialDispatches.Add(dispatch);
            await _db.SaveChangesAsync();
            return ApiResponse<MaterialDispatchDto>.Ok(await GetDispatchDtoAsync(dispatch.Id), "Dispatch created.");
        }

        public async Task<ApiResponse<MaterialDispatchDto>> GetDispatchAsync(int id)
        {
            var dispatch = await _db.MaterialDispatches.Include(d => d.Items).ThenInclude(i => i.Product).FirstOrDefaultAsync(d => d.Id == id);
            if (dispatch == null) return ApiResponse<MaterialDispatchDto>.Fail("Dispatch not found.");
            return ApiResponse<MaterialDispatchDto>.Ok(MapDispatch(dispatch));
        }

        public async Task<ApiResponse<PagedResult<MaterialDispatchDto>>> ListDispatchesAsync(int companyId, PaginationParams p)
        {
            var query = _db.MaterialDispatches.Where(d => d.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(d => d.DispatchNumber.Contains(p.Search) || d.DispatchedTo.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Include(d => d.Items).ThenInclude(i => i.Product)
                .OrderByDescending(d => d.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return ApiResponse<PagedResult<MaterialDispatchDto>>.Ok(new PagedResult<MaterialDispatchDto>
            { Items = items.Select(MapDispatch).ToList(), TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<bool>> UpdateDispatchStatusAsync(int id, string status)
        {
            var dispatch = await _db.MaterialDispatches.FindAsync(id);
            if (dispatch == null) return ApiResponse<bool>.Fail("Dispatch not found.");
            dispatch.Status = status;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        // ── Product Transfer ──────────────────────────────────
        public async Task<ApiResponse<ProductTransferDto>> CreateTransferAsync(CreateTransferDto dto)
        {
            var transferNumber = $"TRF-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var transfer = new ProductTransfer
            {
                CompanyId = dto.CompanyId,
                TransferNumber = transferNumber,
                FromLocation = dto.FromLocation,
                ToLocation = dto.ToLocation,
                TransferDate = dto.TransferDate,
                Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product == null) return ApiResponse<ProductTransferDto>.Fail($"Product {item.ProductId} not found.");
                if (product.StockQty < item.Quantity) return ApiResponse<ProductTransferDto>.Fail($"Insufficient stock for {product.Name}.");

                transfer.Items.Add(new ProductTransferItem { ProductId = item.ProductId, Quantity = item.Quantity });
                _db.StockTransactions.Add(new StockTransaction
                {
                    CompanyId = dto.CompanyId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Type = "OUT",
                    Remarks = $"Transfer {transferNumber}: {dto.FromLocation} → {dto.ToLocation}"
                });
            }

            transfer.Status = "Transferred";
            _db.ProductTransfers.Add(transfer);
            await _db.SaveChangesAsync();
            return ApiResponse<ProductTransferDto>.Ok(await GetTransferDtoAsync(transfer.Id), "Transfer created.");
        }

        public async Task<ApiResponse<PagedResult<ProductTransferDto>>> ListTransfersAsync(int companyId, PaginationParams p)
        {
            var query = _db.ProductTransfers.Where(t => t.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(t => t.TransferNumber.Contains(p.Search) || t.FromLocation.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Include(t => t.Items).ThenInclude(i => i.Product)
                .OrderByDescending(t => t.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return ApiResponse<PagedResult<ProductTransferDto>>.Ok(new PagedResult<ProductTransferDto>
            { Items = items.Select(MapTransfer).ToList(), TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<bool>> UpdateTransferStatusAsync(int id, string status)
        {
            var transfer = await _db.ProductTransfers.FindAsync(id);
            if (transfer == null) return ApiResponse<bool>.Fail("Transfer not found.");
            transfer.Status = status;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        // ── Product Receive (GRN) ─────────────────────────────
        public async Task<ApiResponse<ProductReceiveDto>> CreateReceiveAsync(CreateReceiveDto dto)
        {
            var grnNumber = $"GRN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var receive = new ProductReceive
            {
                CompanyId = dto.CompanyId,
                GrnNumber = grnNumber,
                ReceivedFrom = dto.ReceivedFrom,
                PurchaseOrderRef = dto.PurchaseOrderRef,
                ReceiveDate = dto.ReceiveDate,
                Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                receive.Items.Add(new ProductReceiveItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitCost = item.UnitCost
                });

                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQty += item.Quantity;
                    _db.StockTransactions.Add(new StockTransaction
                    {
                        CompanyId = dto.CompanyId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Type = "IN",
                        Remarks = $"GRN {grnNumber}"
                    });
                }
            }

            _db.ProductReceives.Add(receive);
            await _db.SaveChangesAsync();
            return ApiResponse<ProductReceiveDto>.Ok(await GetReceiveDtoAsync(receive.Id), "GRN created.");
        }

        public async Task<ApiResponse<PagedResult<ProductReceiveDto>>> ListReceivesAsync(int companyId, PaginationParams p)
        {
            var query = _db.ProductReceives.Where(r => r.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(r => r.GrnNumber.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.Include(r => r.Vendor).Include(r => r.Items).ThenInclude(i => i.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return ApiResponse<PagedResult<ProductReceiveDto>>.Ok(new PagedResult<ProductReceiveDto>
            { Items = items.Select(MapReceive).ToList(), TotalCount = total, Page = p.Page, PageSize = p.PageSize });
        }

        public async Task<ApiResponse<List<TaxTypeDto>>> ListTaxTypesAsync(int companyId)
        {
            var items = await _db.TaxTypes.Where(x => x.CompanyId == companyId).ToListAsync();
            return ApiResponse<List<TaxTypeDto>>.Ok(items.Select(x => new TaxTypeDto { Id = x.Id, Name = x.Name, Percentage = x.Percentage }).ToList());
        }

        public async Task<ApiResponse<TaxTypeDto>> AddTaxTypeAsync(CreateTaxTypeDto dto)
        {
            var item = new TaxType { CompanyId = dto.CompanyId, Name = dto.Name, Percentage = dto.Percentage };
            _db.TaxTypes.Add(item);
            await _db.SaveChangesAsync();
            return ApiResponse<TaxTypeDto>.Ok(new TaxTypeDto { Id = item.Id, Name = item.Name, Percentage = item.Percentage });
        }

        // ── Helpers ───────────────────────────────────────────
        private async Task<int> GetOrCreateTaxType(int companyId, string name, decimal percentage)
        {
            var item = await _db.TaxTypes.FirstOrDefaultAsync(x => x.CompanyId == companyId && x.Name.ToLower() == name.ToLower());
            if (item != null) return item.Id;
            item = new TaxType { CompanyId = companyId, Name = name, Percentage = percentage };
            _db.TaxTypes.Add(item);
            await _db.SaveChangesAsync();
            return item.Id;
        }
        private async Task<MaterialDispatchDto> GetDispatchDtoAsync(int id)
        {
            var d = await _db.MaterialDispatches.Include(x => x.Items).ThenInclude(i => i.Product).FirstAsync(x => x.Id == id);
            return MapDispatch(d);
        }

        private async Task<ProductTransferDto> GetTransferDtoAsync(int id)
        {
            var t = await _db.ProductTransfers.Include(x => x.Items).ThenInclude(i => i.Product).FirstAsync(x => x.Id == id);
            return MapTransfer(t);
        }

        private async Task<ProductReceiveDto> GetReceiveDtoAsync(int id)
        {
            var r = await _db.ProductReceives.Include(x => x.Vendor).Include(x => x.Items).ThenInclude(i => i.Product).FirstAsync(x => x.Id == id);
            return MapReceive(r);
        }

        private static ProductDto MapProduct(Product p) => new()
        {
            Id = p.Id.ToString(),
            CompanyId = p.CompanyId,
            Name = p.Name,
            SKU = p.SKU,
            Category = p.Category?.Name ?? "",
            Brand = p.Brand?.Name ?? "",
            Unit = p.Unit?.Name ?? "",
            TaxType = p.TaxType?.Name ?? "",
            Price = p.Price,
            SellingPrice = p.SellingPrice,
            TaxPercentage = p.TaxPercentage,
            Stock = p.StockQty,
            Status = p.Status,
            ImageUrl = p.ImageUrl,
            AddedAt = p.AddedAt
        };

        private static MaterialDispatchDto MapDispatch(MaterialDispatch d) => new()
        {
            Id = d.Id,
            CompanyId = d.CompanyId,
            DispatchNumber = d.DispatchNumber,
            DispatchedTo = d.DispatchedTo,
            Status = d.Status,
            DispatchDate = d.DispatchDate,
            Notes = d.Notes,
            CreatedAt = d.CreatedAt,
            Items = d.Items.Select(i => new DispatchItemResultDto
            { ProductId = i.ProductId, ProductName = i.Product?.Name ?? "", Quantity = i.Quantity }).ToList()
        };

        private static ProductTransferDto MapTransfer(ProductTransfer t) => new()
        {
            Id = t.Id,
            CompanyId = t.CompanyId,
            TransferNumber = t.TransferNumber,
            FromLocation = t.FromLocation,
            ToLocation = t.ToLocation,
            Status = t.Status,
            TransferDate = t.TransferDate,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt,
            Items = t.Items.Select(i => new TransferItemResultDto
            { ProductId = i.ProductId, ProductName = i.Product?.Name ?? "", Quantity = i.Quantity }).ToList()
        };

        private static ProductReceiveDto MapReceive(ProductReceive r) => new()
        {
            Id = r.Id,
            CompanyId = r.CompanyId,
            GrnNumber = r.GrnNumber,
            VendorId = r.VendorId,
            VendorName = r.Vendor?.Name,
            ReceivedFrom = r.ReceivedFrom,
            PurchaseOrderRef = r.PurchaseOrderRef,
            Status = r.Status,
            ReceiveDate = r.ReceiveDate,
            Notes = r.Notes,
            CreatedAt = r.CreatedAt,
            Items = r.Items.Select(i => new ReceiveItemResultDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? "",
                Quantity = i.Quantity,
                UnitCost = i.UnitCost
            }).ToList()
        };

        private static WarehouseDto MapWarehouse(Warehouse w) => new()
        {
            Id = w.Id,
            Name = w.Name,
            Location = w.Location,
            Status = w.Status
        };
    }
}
