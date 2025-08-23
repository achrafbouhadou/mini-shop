using MiniShop.Application.Common;
using MiniShop.Domain.Products;

namespace MiniShop.Application.Products;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetPagedAsync(string? search, string? sort, bool? activeOnly, int page, int pageSize, CancellationToken ct);
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Product> AddAsync(Product entity, CancellationToken ct);
    Task UpdateAsync(Product entity, CancellationToken ct);
    Task DeleteAsync(Product entity, CancellationToken ct);
    Task<bool> SkuExistsAsync(string sku, Guid? excludeId, CancellationToken ct);
}
