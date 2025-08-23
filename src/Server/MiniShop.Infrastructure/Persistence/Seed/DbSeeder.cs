using Microsoft.EntityFrameworkCore;
using MiniShop.Domain.Products;

namespace MiniShop.Infrastructure.Persistence.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (!await db.Categories.AnyAsync())
        {
            var cat = new Category { Name = "T-Shirts", Slug = "t-shirts" };
            db.Categories.Add(cat);

            db.Products.AddRange(
                new Product { Name = "Basic Tee", Sku = "TS-BASE-001", Price = 19.99m, Category = cat },
                new Product { Name = "Premium Tee", Sku = "TS-PREM-001", Price = 29.99m, Category = cat }
            );

            await db.SaveChangesAsync();
        }
    }
}
