using Serilog;
using MiniShop.Infrastructure;
using MiniShop.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using MiniShop.Api.Endpoints;
using MiniShop.Application.Products;


var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog((ctx, lc) =>
    lc.ReadFrom.Configuration(ctx.Configuration).Enrich.FromLogContext());

// Services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", p => p.AllowAnyHeader().AllowAnyMethod().WithOrigins(
        "http://localhost:5173","http://127.0.0.1:5173"));
});

// >>> Add Infrastructure (DbContext)
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();


var app = builder.Build();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.MapGet("/debug/stripe", (IConfiguration cfg) =>
    {
        var hasKey = !string.IsNullOrWhiteSpace(cfg["Stripe:SecretKey"]);
        var hasWebhook = !string.IsNullOrWhiteSpace(cfg["Stripe:WebhookSecret"]);
        return Results.Ok(new { secretLoaded = hasKey, webhookLoaded = hasWebhook });
    }).ExcludeFromDescription();
    app.UseSwagger();
    app.UseSwaggerUI();

    // Auto-migrate in Dev for convenience
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await MiniShop.Infrastructure.Persistence.Seed.DbSeeder.SeedAsync(db);
}

app.UseCors("web");

app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/healthz", () => Results.Ok(new { status = "OK", time = DateTimeOffset.UtcNow }))
   .WithName("Health")
   .WithTags("System");

app.MapGet("/api/categories", async (AppDbContext db) =>
{
    var cats = await db.Categories
        .AsNoTracking()
        .OrderBy(c => c.Name)
        .Select(c => new { c.Id, c.Name })
        .ToListAsync();
    return Results.Ok(cats);
}).WithTags("Categories");


app.MapGet("/api/products/by-ids", async (string ids, AppDbContext db, CancellationToken ct) =>
{
    var parsed = ids.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(x => Guid.TryParse(x, out var g) ? g : (Guid?)null)
                    .Where(g => g.HasValue).Select(g => g!.Value).ToList();
    if (parsed.Count == 0) return Results.Ok(Array.Empty<object>());

    var list = await db.Products.AsNoTracking()
        .Where(p => parsed.Contains(p.Id))
        .OrderBy(p => p.Name)
        .Select(p => new { p.Id, p.Name, p.Sku, p.Price, p.IsActive })
        .ToListAsync(ct);

    return Results.Ok(list);
}).WithTags("Products");


app.MapProductEndpoints();
app.MapCheckoutEndpoints();
app.MapStripeWebhook();

await app.RunAsync();
