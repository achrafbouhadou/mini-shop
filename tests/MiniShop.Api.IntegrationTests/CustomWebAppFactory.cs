using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MiniShop.Infrastructure.Persistence;

namespace MiniShop.Api.IntegrationTests;

public class CustomWebAppFactory : WebApplicationFactory<Program>
{
    private readonly string _cs;

    public CustomWebAppFactory(string connectionString) => _cs = connectionString;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            // Replace AppDbContext with container connection string
            var descriptor = services.Single(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(opt =>
                opt.UseNpgsql(_cs).UseSnakeCaseNamingConvention());

            // Build, migrate schema
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();
        });
    }
}
