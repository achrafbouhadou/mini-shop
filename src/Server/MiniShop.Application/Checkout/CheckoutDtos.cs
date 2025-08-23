namespace MiniShop.Application.Checkout;

public sealed record CheckoutItemDto(Guid ProductId, int Quantity);
public sealed record CheckoutSessionResponse(string Url, Guid OrderId);
