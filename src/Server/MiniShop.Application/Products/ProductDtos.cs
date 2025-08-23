namespace MiniShop.Application.Products;

public sealed record ProductSummaryDto(Guid Id, string Name, string Sku, decimal Price, bool IsActive);
public sealed record ProductDetailsDto(Guid Id, string Name, string Sku, decimal Price, string? Description, Guid CategoryId, bool IsActive);

public sealed record CreateProductRequest(string Name, string Sku, decimal Price, string? Description, Guid CategoryId);
public sealed record UpdateProductRequest(string Name, string Sku, decimal Price, string? Description, Guid CategoryId, bool IsActive);
