namespace ERPPlugandPlay.Models
{
    public class Carrier
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ShipmentOrder
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public int? CarrierId { get; set; }
        public Carrier? Carrier { get; set; }
        public string Status { get; set; } = "Pending"; // Pending | Processing | Shipped | Delivered | Cancelled
        public string? TrackingNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDelivery { get; set; }
        public DateTime? ActualDelivery { get; set; }
        public decimal ShippingCost { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class DeliveryRoute
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string RouteName { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public decimal EstimatedDistance { get; set; }
        public decimal EstimatedTime { get; set; } // hours
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class DeliveryFeedback
    {
        public int Id { get; set; }
        public int ShipmentOrderId { get; set; }
        public ShipmentOrder ShipmentOrder { get; set; } = null!;
        public string CustomerName { get; set; } = string.Empty;
        public int Rating { get; set; } // 1-5
        public string? Comments { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
