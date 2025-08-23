using Microsoft.EntityFrameworkCore;
using MiniShop.Domain.Products;
using MiniShop.Infrastructure.Persistence;

namespace MiniShop.Api.IntegrationTests;

public static class SeedHelper
{
    public static async Task<(Category cat, List<Product> products)> SeedProductsAsync(AppDbContext db)
    {
        var cat = await db.Categories.FirstOrDefaultAsync(c => c.Slug == "t-shirts");
        if (cat is null)
        {
            cat = new Category { Name = "T-Shirts", Slug = "t-shirts" };
            db.Categories.Add(cat);
            await db.SaveChangesAsync();
        }

        async Task AddIfMissingAsync(Product p)
        {
            if (!await db.Products.AnyAsync(x => x.Sku == p.Sku))
                db.Products.Add(p);
        }

        await AddIfMissingAsync(new Product { Name = "Basic Tee",   Sku = "TS-BASE-001", Price = 19.99m, Category = cat });
        await AddIfMissingAsync(new Product { Name = "Premium Tee", Sku = "TS-PREM-001", Price = 29.99m, Category = cat });
        await AddIfMissingAsync(new Product { Name = "Logo Tee",    Sku = "TS-LOGO-001", Price = 24.99m, Category = cat });

        await db.SaveChangesAsync();

        var products = await db.Products.Where(p => p.CategoryId == cat.Id).ToListAsync();
        return (cat, products);
    }
}
