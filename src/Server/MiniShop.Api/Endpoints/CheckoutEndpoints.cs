using Microsoft.EntityFrameworkCore;
using MiniShop.Application.Checkout;
using MiniShop.Infrastructure.Persistence;
using MiniShop.Domain.Sales;
using Stripe;
using Stripe.Checkout;

namespace MiniShop.Api.Endpoints;

public static class CheckoutEndpoints
{
    public static RouteGroupBuilder MapCheckoutEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/checkout").WithTags("Checkout");

        group.MapPost("/session", async Task<IResult> (
            List<CheckoutItemDto> items,
            IConfiguration cfg,
            AppDbContext db,
            HttpRequest req,
            CancellationToken ct) =>
        {
            if (items.Count == 0) return Results.BadRequest("Cart is empty.");

            // Load products
            var ids = items.Select(i => i.ProductId).ToHashSet();
            var products = await db.Products.Where(p => ids.Contains(p.Id)).ToListAsync(ct);
            if (products.Count != ids.Count) return Results.BadRequest("Some products not found.");

            // Build order (Pending)
            var order = new Order
            {
                OrderNumber = $"ORD-{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(100,999)}",
                CustomerId = null, // guest checkout
                Status = OrderStatus.Pending,
                Currency = "usd",
                AmountTotalCents = 0
            };

            foreach (var it in items)
            {
                var p = products.First(x => x.Id == it.ProductId);
                order.Items.Add(new OrderItem {
                    ProductId = p.Id, Quantity = it.Quantity, UnitPrice = p.Price
                });
                order.AmountTotalCents += (long)(p.Price * 100m) * it.Quantity;
            }

            db.Orders.Add(order);
            await db.SaveChangesAsync(ct);

            // Stripe config
            var secretKey = cfg["Stripe:SecretKey"] ?? throw new InvalidOperationException("Stripe:SecretKey missing");
            StripeConfiguration.ApiKey = secretKey;

            var origin = $"{req.Scheme}://{req.Host}";
            var successUrl = $"{origin}/?success=1&orderId={order.Id}";
            var cancelUrl  = $"{origin}/?canceled=1";

            // Create Stripe Checkout Session
            var lineItems = new List<SessionLineItemOptions>();
            foreach (var it in items)
            {
                var p = products.First(x => x.Id == it.ProductId);
                lineItems.Add(new SessionLineItemOptions
                {
                    Quantity = it.Quantity,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = order.Currency,
                        UnitAmount = (long)(p.Price * 100m),
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = p.Name,
                            Metadata = new Dictionary<string, string> { ["productId"] = p.Id.ToString() }
                        }
                    }
                });
            }

            var service = new SessionService();
            var session = await service.CreateAsync(new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl  = cancelUrl,
                LineItems = lineItems,
                Metadata = new Dictionary<string, string> { ["orderId"] = order.Id.ToString() }
            }, cancellationToken: ct);

            // Save session id on order
            order.StripeSessionId = session.Id;
            await db.SaveChangesAsync(ct);

            return Results.Ok(new CheckoutSessionResponse(session.Url!, order.Id));
        });

        return group;
    }
}
