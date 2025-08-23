using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MiniShop.Infrastructure.Persistence;
using MiniShop.Application.Products;
using MiniShop.Infrastructure.Persistence.Repositories;
using Npgsql;

namespace MiniShop.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var cs = config.GetConnectionString("Default")
                 ?? throw new InvalidOperationException("ConnectionStrings:Default is missing");

        services.AddDbContext<AppDbContext>(opt =>
            opt.UseNpgsql(cs, npg => npg.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
               .UseSnakeCaseNamingConvention()); 
               
        services.AddScoped<IProductRepository, ProductRepository>();

        return services;
    }
}
