using ERPPlugandPlay.Data;
using ERPPlugandPlay.DTOs;
using ERPPlugandPlay.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPPlugandPlay.Services
{
    public interface ILogisticsService
    {
        Task<ApiResponse<CarrierDto>> CreateCarrierAsync(CreateCarrierDto dto);
        Task<ApiResponse<List<CarrierDto>>> ListCarriersAsync(int companyId);
        Task<ApiResponse<bool>> DeleteCarrierAsync(int id);

        Task<ApiResponse<ShipmentDto>> CreateShipmentAsync(CreateShipmentDto dto);
        Task<ApiResponse<PagedResult<ShipmentDto>>> ListShipmentsAsync(int companyId, PaginationParams p);
        Task<ApiResponse<bool>> UpdateShipmentStatusAsync(int id, string status, string? trackingNumber);

        Task<ApiResponse<RouteDto>> CreateRouteAsync(CreateRouteDto dto);
        Task<ApiResponse<List<RouteDto>>> ListRoutesAsync(int companyId);

        Task<ApiResponse<FeedbackDto>> AddFeedbackAsync(CreateFeedbackDto dto);
        Task<ApiResponse<List<FeedbackDto>>> ListFeedbackAsync(int companyId);
    }

    public class LogisticsService : ILogisticsService
    {
        private readonly ERPDbContext _db;
        private readonly IAutoAccountingService _accounting;
        public LogisticsService(ERPDbContext db, IAutoAccountingService accounting)
        {
            _db = db;
            _accounting = accounting;
        }

        public async Task<ApiResponse<CarrierDto>> CreateCarrierAsync(CreateCarrierDto dto)
        {
            var carrier = new Carrier
            {
                CompanyId = dto.CompanyId, Name = dto.Name, ContactPerson = dto.ContactPerson,
                Phone = dto.Phone, Email = dto.Email
            };
            _db.Carriers.Add(carrier);
            await _db.SaveChangesAsync();
            return ApiResponse<CarrierDto>.Ok(MapCarrier(carrier), "Carrier created.");
        }

        public async Task<ApiResponse<List<CarrierDto>>> ListCarriersAsync(int companyId)
        {
            var carriers = await _db.Carriers.Where(c => c.CompanyId == companyId && c.IsActive).ToListAsync();
            return ApiResponse<List<CarrierDto>>.Ok(carriers.Select(MapCarrier).ToList());
        }

        public async Task<ApiResponse<bool>> DeleteCarrierAsync(int id)
        {
            var carrier = await _db.Carriers.FindAsync(id);
            if (carrier == null) return ApiResponse<bool>.Fail("Carrier not found.");
            carrier.IsActive = false;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<ShipmentDto>> CreateShipmentAsync(CreateShipmentDto dto)
        {
            var orderNumber = $"SHP-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
            var shipment = new ShipmentOrder
            {
                CompanyId = dto.CompanyId, OrderNumber = orderNumber,
                CustomerName = dto.CustomerName, DeliveryAddress = dto.DeliveryAddress,
                CarrierId = dto.CarrierId, OrderDate = dto.OrderDate,
                ExpectedDelivery = dto.ExpectedDelivery, ShippingCost = dto.ShippingCost, Notes = dto.Notes
            };
            _db.ShipmentOrders.Add(shipment);
            await _db.SaveChangesAsync();

            // Auto-post freight charge: DR Freight Expense / CR Cash (if cost > 0)
            if (dto.ShippingCost > 0)
                try { await _accounting.PostFreightChargeAsync(dto.CompanyId, dto.ShippingCost, shipment.OrderNumber); }
                catch { /* Non-blocking */ }

            var carrier = dto.CarrierId.HasValue ? await _db.Carriers.FindAsync(dto.CarrierId.Value) : null;
            return ApiResponse<ShipmentDto>.Ok(MapShipment(shipment, carrier?.Name), "Shipment created.");
        }

        public async Task<ApiResponse<PagedResult<ShipmentDto>>> ListShipmentsAsync(int companyId, PaginationParams p)
        {
            var query = _db.ShipmentOrders.Include(s => s.Carrier).Where(s => s.CompanyId == companyId);
            if (!string.IsNullOrEmpty(p.Search))
                query = query.Where(s => s.OrderNumber.Contains(p.Search) || s.CustomerName.Contains(p.Search));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(s => s.CreatedAt)
                .Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return ApiResponse<PagedResult<ShipmentDto>>.Ok(new PagedResult<ShipmentDto>
            {
                Items = items.Select(s => MapShipment(s, s.Carrier?.Name)).ToList(),
                TotalCount = total, Page = p.Page, PageSize = p.PageSize
            });
        }

        public async Task<ApiResponse<bool>> UpdateShipmentStatusAsync(int id, string status, string? trackingNumber)
        {
            var shipment = await _db.ShipmentOrders.FindAsync(id);
            if (shipment == null) return ApiResponse<bool>.Fail("Shipment not found.");
            shipment.Status = status;
            if (!string.IsNullOrEmpty(trackingNumber)) shipment.TrackingNumber = trackingNumber;
            if (status == "Delivered") shipment.ActualDelivery = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<RouteDto>> CreateRouteAsync(CreateRouteDto dto)
        {
            var route = new DeliveryRoute
            {
                CompanyId = dto.CompanyId, RouteName = dto.RouteName,
                Origin = dto.Origin, Destination = dto.Destination,
                EstimatedDistance = dto.EstimatedDistance, EstimatedTime = dto.EstimatedTime
            };
            _db.DeliveryRoutes.Add(route);
            await _db.SaveChangesAsync();
            return ApiResponse<RouteDto>.Ok(MapRoute(route), "Route created.");
        }

        public async Task<ApiResponse<List<RouteDto>>> ListRoutesAsync(int companyId)
        {
            var routes = await _db.DeliveryRoutes.Where(r => r.CompanyId == companyId && r.IsActive).ToListAsync();
            return ApiResponse<List<RouteDto>>.Ok(routes.Select(MapRoute).ToList());
        }

        public async Task<ApiResponse<FeedbackDto>> AddFeedbackAsync(CreateFeedbackDto dto)
        {
            var feedback = new DeliveryFeedback
            {
                ShipmentOrderId = dto.ShipmentOrderId, CustomerName = dto.CustomerName,
                Rating = dto.Rating, Comments = dto.Comments
            };
            _db.DeliveryFeedbacks.Add(feedback);
            await _db.SaveChangesAsync();
            var shipment = await _db.ShipmentOrders.FindAsync(dto.ShipmentOrderId);
            return ApiResponse<FeedbackDto>.Ok(new FeedbackDto
            {
                Id = feedback.Id, ShipmentOrderId = feedback.ShipmentOrderId,
                OrderNumber = shipment?.OrderNumber ?? "", CustomerName = feedback.CustomerName,
                Rating = feedback.Rating, Comments = feedback.Comments, CreatedAt = feedback.CreatedAt
            }, "Feedback submitted.");
        }

        public async Task<ApiResponse<List<FeedbackDto>>> ListFeedbackAsync(int companyId)
        {
            var feedbacks = await _db.DeliveryFeedbacks.Include(f => f.ShipmentOrder)
                .Where(f => f.ShipmentOrder.CompanyId == companyId)
                .OrderByDescending(f => f.CreatedAt).ToListAsync();
            return ApiResponse<List<FeedbackDto>>.Ok(feedbacks.Select(f => new FeedbackDto
            {
                Id = f.Id, ShipmentOrderId = f.ShipmentOrderId,
                OrderNumber = f.ShipmentOrder?.OrderNumber ?? "", CustomerName = f.CustomerName,
                Rating = f.Rating, Comments = f.Comments, CreatedAt = f.CreatedAt
            }).ToList());
        }

        private static CarrierDto MapCarrier(Carrier c) => new()
        {
            Id = c.Id, CompanyId = c.CompanyId, Name = c.Name, ContactPerson = c.ContactPerson,
            Phone = c.Phone, Email = c.Email, IsActive = c.IsActive, CreatedAt = c.CreatedAt
        };

        private static ShipmentDto MapShipment(ShipmentOrder s, string? carrierName) => new()
        {
            Id = s.Id, CompanyId = s.CompanyId, OrderNumber = s.OrderNumber,
            CustomerName = s.CustomerName, DeliveryAddress = s.DeliveryAddress,
            CarrierId = s.CarrierId, CarrierName = carrierName, Status = s.Status,
            TrackingNumber = s.TrackingNumber, OrderDate = s.OrderDate,
            ExpectedDelivery = s.ExpectedDelivery, ActualDelivery = s.ActualDelivery,
            ShippingCost = s.ShippingCost, Notes = s.Notes, CreatedAt = s.CreatedAt
        };

        private static RouteDto MapRoute(DeliveryRoute r) => new()
        {
            Id = r.Id, CompanyId = r.CompanyId, RouteName = r.RouteName,
            Origin = r.Origin, Destination = r.Destination,
            EstimatedDistance = r.EstimatedDistance, EstimatedTime = r.EstimatedTime,
            IsActive = r.IsActive, CreatedAt = r.CreatedAt
        };
    }
}
