using Serilog;
using MiniShop.Infrastructure;
using MiniShop.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
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

app.MapGet("/api/products", async (AppDbContext db) =>
{
    var list = await db.Products
        .OrderBy(p => p.Name)
        .Select(p => new { p.Id, p.Name, p.Sku, p.Price })
        .ToListAsync();
    return Results.Ok(list);
}).WithTags("Products");

await app.RunAsync();
