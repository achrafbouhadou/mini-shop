using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MiniShop.Application.Common;
using MiniShop.Application.Products;
using MiniShop.Domain.Products;

namespace MiniShop.Api.Endpoints;

public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/products").WithTags("Products");

        // GET /api/products?page=1&pageSize=20&search=tee&sort=-price&activeOnly=true
        group.MapGet("/", async Task<Ok<PagedResult<ProductSummaryDto>>> (
            IProductRepository repo, int page = 1, int pageSize = 20, string? search = null, string? sort = null, bool? activeOnly = null, CancellationToken ct = default) =>
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = await repo.GetPagedAsync(search, sort, activeOnly, page, pageSize, ct);
            var mapped = new PagedResult<ProductSummaryDto>(
                result.Items.Select(p => new ProductSummaryDto(p.Id, p.Name, p.Sku, p.Price, p.IsActive)).ToList(),
                result.Page, result.PageSize, result.TotalCount);
            return TypedResults.Ok(mapped);
        });

        // GET /api/products/{id}
        group.MapGet("/{id:guid}", async Task<Results<Ok<ProductDetailsDto>, NotFound>> (
            Guid id, IProductRepository repo, CancellationToken ct) =>
        {
            var p = await repo.GetByIdAsync(id, ct);
            if (p is null) return TypedResults.NotFound();

            return TypedResults.Ok(
                new ProductDetailsDto(p.Id, p.Name, p.Sku, p.Price, p.Description, p.CategoryId, p.IsActive));
        });

        // POST /api/products
        group.MapPost("/", async Task<Results<Created<ProductDetailsDto>, ValidationProblem, Conflict<string>>> (
            CreateProductRequest req, IValidator<CreateProductRequest> validator, IProductRepository repo, CancellationToken ct) =>
        {
            var vr = await validator.ValidateAsync(req, ct);
            if (!vr.IsValid)
                return TypedResults.ValidationProblem(vr.ToDictionary());

            if (await repo.SkuExistsAsync(req.Sku, null, ct))
                return TypedResults.Conflict("SKU already exists.");

            var entity = new Product
            {
                Name = req.Name.Trim(),
                Sku = req.Sku.Trim(),
                Price = req.Price,
                Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim(),
                CategoryId = req.CategoryId,
                IsActive = true
            };

            entity = await repo.AddAsync(entity, ct);

            var dto = new ProductDetailsDto(entity.Id, entity.Name, entity.Sku, entity.Price, entity.Description, entity.CategoryId, entity.IsActive);
            return TypedResults.Created($"/api/products/{entity.Id}", dto);
        });

        // PUT /api/products/{id}
        group.MapPut("/{id:guid}", async Task<Results<Ok<ProductDetailsDto>, ValidationProblem, NotFound, Conflict<string>>> (
            Guid id, UpdateProductRequest req, IValidator<UpdateProductRequest> validator, IProductRepository repo, CancellationToken ct) =>
        {
            var vr = await validator.ValidateAsync(req, ct);
            if (!vr.IsValid)
                return TypedResults.ValidationProblem(vr.ToDictionary());

            var existing = await repo.GetByIdAsync(id, ct);
            if (existing is null) return TypedResults.NotFound();

            if (await repo.SkuExistsAsync(req.Sku, id, ct))
                return TypedResults.Conflict("SKU already exists.");

            existing.Name = req.Name.Trim();
            existing.Sku = req.Sku.Trim();
            existing.Price = req.Price;
            existing.Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim();
            existing.CategoryId = req.CategoryId;
            existing.IsActive = req.IsActive;

            await repo.UpdateAsync(existing, ct);

            var dto = new ProductDetailsDto(existing.Id, existing.Name, existing.Sku, existing.Price, existing.Description, existing.CategoryId, existing.IsActive);
            return TypedResults.Ok(dto);
        });

        // DELETE /api/products/{id}
        group.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound>> (Guid id, IProductRepository repo, CancellationToken ct) =>
        {
            var existing = await repo.GetByIdAsync(id, ct);
            if (existing is null) return TypedResults.NotFound();

            await repo.DeleteAsync(existing, ct);
            return TypedResults.NoContent();
        });

        return group;
    }
}
