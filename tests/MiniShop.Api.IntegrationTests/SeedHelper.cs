using MiniShop.Domain.Products;
using MiniShop.Infrastructure.Persistence;

namespace MiniShop.Api.IntegrationTests;

public static class SeedHelper
{
    public static async Task<(Category cat, List<Product> products)> SeedProductsAsync(AppDbContext db)
    {
        var cat = new Category { Name = "T-Shirts", Slug = "t-shirts" };
        db.Categories.Add(cat);
        var products = new List<Product>
        {
            new() { Name = "Basic Tee",   Sku = "TS-BASE-001", Price = 19.99m, Category = cat },
            new() { Name = "Premium Tee", Sku = "TS-PREM-001", Price = 29.99m, Category = cat },
            new() { Name = "Logo Tee",    Sku = "TS-LOGO-001", Price = 24.99m, Category = cat }
        };
        db.Products.AddRange(products);
        await db.SaveChangesAsync();
        return (cat, products);
    }
}
