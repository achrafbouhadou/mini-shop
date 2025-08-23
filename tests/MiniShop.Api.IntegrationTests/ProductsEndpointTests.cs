using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using MiniShop.Infrastructure.Persistence;
using Xunit;

namespace MiniShop.Api.IntegrationTests;

public class ProductsEndpointTests : IClassFixture<TestingDatabase>
{
    private readonly TestingDatabase _dbFixture;

    public ProductsEndpointTests(TestingDatabase dbFixture) => _dbFixture = dbFixture;

    private CustomWebAppFactory CreateFactory() => new(_dbFixture.ConnectionString);

    [Fact]
    public async Task ListProducts_ReturnsSeeded()
    {
        var factory = CreateFactory();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await SeedHelper.SeedProductsAsync(db);

        var client = factory.CreateClient();
        var res = await client.GetAsync("/api/products?page=1&pageSize=10");
        res.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await res.Content.ReadFromJsonAsync<dynamic>();
        ((int)body!.GetProperty("totalCount").GetInt32()).Should().BeGreaterOrEqualTo(1);
    }

    [Fact]
    public async Task CreateProduct_Then_GetById_Works()
    {
        var factory = CreateFactory();
        var client = factory.CreateClient();

        // Need a category first
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var (cat, _) = await SeedHelper.SeedProductsAsync(db);

            var createPayload = new
            {
                name = "New Tee",
                sku = "TS-NEW-001",
                price = 17.99m,
                description = "Nice",
                categoryId = cat.Id
            };

            var createRes = await client.PostAsJsonAsync("/api/products", createPayload);
            createRes.StatusCode.Should().Be(HttpStatusCode.Created);

            var created = await createRes.Content.ReadFromJsonAsync<dynamic>();
            var id = created!.GetProperty("id").GetString();

            var getRes = await client.GetAsync($"/api/products/{id}");
            getRes.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }

    [Fact]
    public async Task DuplicateSku_ReturnsConflict()
    {
        var factory = CreateFactory();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var (cat, prods) = await SeedHelper.SeedProductsAsync(db);

        var client = factory.CreateClient();
        var payload = new { name = "Dup", sku = prods[0].Sku, price = 1m, description = "", categoryId = cat.Id };
        var res = await client.PostAsJsonAsync("/api/products", payload);
        res.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
