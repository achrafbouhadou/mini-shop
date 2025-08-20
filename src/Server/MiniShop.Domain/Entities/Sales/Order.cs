using MiniShop.Domain.Common;

namespace MiniShop.Domain.Sales;

public enum OrderStatus { Pending, Paid, Cancelled }

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = default!;
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public long AmountTotalCents { get; set; }      
    public string Currency { get; set; } = "usd";   
    public string? StripeSessionId { get; set; } 
}
