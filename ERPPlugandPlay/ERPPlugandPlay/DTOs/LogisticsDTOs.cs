using System.ComponentModel.DataAnnotations;

namespace ERPPlugandPlay.DTOs
{
    public class CreateCarrierDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class CarrierDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateShipmentDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string CustomerName { get; set; } = string.Empty;
        [Required] public string DeliveryAddress { get; set; } = string.Empty;
        public int? CarrierId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpectedDelivery { get; set; }
        public decimal ShippingCost { get; set; }
        public string? Notes { get; set; }
    }

    public class ShipmentDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public int? CarrierId { get; set; }
        public string? CarrierName { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? TrackingNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDelivery { get; set; }
        public DateTime? ActualDelivery { get; set; }
        public decimal ShippingCost { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateRouteDto
    {
        [Required] public int CompanyId { get; set; }
        [Required] public string RouteName { get; set; } = string.Empty;
        [Required] public string Origin { get; set; } = string.Empty;
        [Required] public string Destination { get; set; } = string.Empty;
        public decimal EstimatedDistance { get; set; }
        public decimal EstimatedTime { get; set; }
    }

    public class RouteDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string RouteName { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public decimal EstimatedDistance { get; set; }
        public decimal EstimatedTime { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateFeedbackDto
    {
        [Required] public int ShipmentOrderId { get; set; }
        [Required] public string CustomerName { get; set; } = string.Empty;
        [Required] public int Rating { get; set; }
        public string? Comments { get; set; }
    }

    public class FeedbackDto
    {
        public int Id { get; set; }
        public int ShipmentOrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comments { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
