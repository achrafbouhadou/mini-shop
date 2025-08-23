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

    [Fact]
    public async Task ListProducts_ReturnsSeeded()
    {
        await _dbFixture.ResetAsync();            // ← reset first

        using var factory = new CustomWebAppFactory(_dbFixture.ConnectionString);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await SeedHelper.SeedProductsAsync(db);

        var client = factory.CreateClient();
        var res = await client.GetAsync("/api/products?page=1&pageSize=10");
        res.StatusCode.Should().Be(HttpStatusCode.OK);

        var doc = await res.Content.ReadFromJsonAsync<System.Text.Json.JsonDocument>();
        var total = doc!.RootElement.GetProperty("totalCount").GetInt32();
        total.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task CreateProduct_Then_GetById_Works()
    {
        await _dbFixture.ResetAsync();            // ← reset first

        using var factory = new CustomWebAppFactory(_dbFixture.ConnectionString);
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var (cat, _) = await SeedHelper.SeedProductsAsync(db);

            var client = factory.CreateClient();
            var createPayload = new { name = "New Tee", sku = "TS-NEW-001", price = 17.99m, description = "Nice", categoryId = cat.Id };

            var createRes = await client.PostAsJsonAsync("/api/products", createPayload);
            createRes.StatusCode.Should().Be(HttpStatusCode.Created);

            var created = await createRes.Content.ReadFromJsonAsync<System.Text.Json.JsonDocument>();
            var id = created!.RootElement.GetProperty("id").GetString();

            var getRes = await client.GetAsync($"/api/products/{id}");
            getRes.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }

    [Fact]
    public async Task DuplicateSku_ReturnsConflict()
    {
        await _dbFixture.ResetAsync();            // ← reset first

        using var factory = new CustomWebAppFactory(_dbFixture.ConnectionString);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var (cat, prods) = await SeedHelper.SeedProductsAsync(db);

        var client = factory.CreateClient();
        var payload = new { name = "Dup", sku = prods[0].Sku, price = 1m, description = "", categoryId = cat.Id };
        var res = await client.PostAsJsonAsync("/api/products", payload);
        res.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
