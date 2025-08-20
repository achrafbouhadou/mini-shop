using Microsoft.EntityFrameworkCore;
using MiniShop.Infrastructure.Persistence;
using Stripe;
using Stripe.Checkout;

namespace MiniShop.Api.Endpoints;

public static class StripeWebhookEndpoints
{
    public static RouteGroupBuilder MapStripeWebhook(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/stripe").WithTags("Stripe");

        group.MapPost("/webhook", async Task<IResult> (
            HttpRequest request, IConfiguration cfg, AppDbContext db, CancellationToken ct) =>
        {
            var json = await new StreamReader(request.Body).ReadToEndAsync(ct);
            var sigHeader = request.Headers["Stripe-Signature"];
            var webhookSecret = cfg["Stripe:WebhookSecret"];

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, sigHeader, webhookSecret);
            }
            catch (Exception)
            {
                return Results.BadRequest();
            }

            if (stripeEvent.Type == Events.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;
                var orderIdStr = session?.Metadata?["orderId"];
                if (orderIdStr != null && Guid.TryParse(orderIdStr, out var orderId))
                {
                    var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == orderId, ct);
                    if (order != null)
                    {
                        order.Status = MiniShop.Domain.Sales.OrderStatus.Paid;
                        order.StripeSessionId ??= session!.Id;
                        order.AmountTotalCents = session!.AmountTotal ?? order.AmountTotalCents;
                        order.Currency = session!.Currency ?? order.Currency;
                        await db.SaveChangesAsync(ct);
                    }
                }
            }

            return Results.Ok();
        });

        return group;
    }
}
