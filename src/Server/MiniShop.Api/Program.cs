using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog((ctx, lc) =>
    lc.ReadFrom.Configuration(ctx.Configuration)
      .Enrich.FromLogContext());

// Services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("web", p =>
        p.AllowAnyHeader().AllowAnyMethod().WithOrigins(
            "http://localhost:5173", 
            "http://127.0.0.1:5173"
        ));
});

var app = builder.Build();

// Middlewares
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("web");

app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapGet("/healthz", () => Results.Ok(new { status = "OK", time = DateTimeOffset.UtcNow }))
   .WithName("Health")
   .WithTags("System");

app.Run();
