using Microsoft.EntityFrameworkCore;
using MiniShop.Application.Common;
using MiniShop.Application.Products;
using MiniShop.Domain.Products;

namespace MiniShop.Infrastructure.Persistence.Repositories;

public sealed class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<PagedResult<Product>> GetPagedAsync(string? search, string? sort, bool? activeOnly, int page, int pageSize, CancellationToken ct)
    {
        var q = db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            q = q.Where(p => EF.Functions.ILike(p.Name, $"%{s}%") || EF.Functions.ILike(p.Sku, $"%{s}%"));
        }

        if (activeOnly is true) q = q.Where(p => p.IsActive);

        q = sort?.ToLowerInvariant() switch
        {
            "price"       => q.OrderBy(p => p.Price).ThenBy(p => p.Name),
            "-price"      => q.OrderByDescending(p => p.Price).ThenBy(p => p.Name),
            "name"        => q.OrderBy(p => p.Name),
            "-name"       => q.OrderByDescending(p => p.Name),
            "created"     => q.OrderBy(p => p.CreatedAtUtc),
            "-created"    => q.OrderByDescending(p => p.CreatedAtUtc),
            _             => q.OrderBy(p => p.Name)
        };

        var total = await q.CountAsync(ct);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        return new PagedResult<Product>(items, page, pageSize, total);
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct) =>
        db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<Product> AddAsync(Product entity, CancellationToken ct)
    {
        db.Products.Add(entity);
        await db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task UpdateAsync(Product entity, CancellationToken ct)
    {
        db.Products.Update(entity);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Product entity, CancellationToken ct)
    {
        db.Products.Remove(entity);
        await db.SaveChangesAsync(ct);
    }

    public Task<bool> SkuExistsAsync(string sku, Guid? excludeId, CancellationToken ct) =>
        db.Products.AnyAsync(p => p.Sku == sku && (excludeId == null || p.Id != excludeId), ct);
}
