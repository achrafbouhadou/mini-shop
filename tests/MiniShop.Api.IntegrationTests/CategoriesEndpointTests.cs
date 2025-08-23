using System.Net;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using MiniShop.Infrastructure.Persistence;
using Xunit;

namespace MiniShop.Api.IntegrationTests;

public class CategoriesEndpointTests : IClassFixture<TestingDatabase>
{
    private readonly TestingDatabase _dbFixture;
    public CategoriesEndpointTests(TestingDatabase dbFixture) => _dbFixture = dbFixture;

    [Fact]
    public async Task Categories_List_ReturnsOk()
    {
        await _dbFixture.ResetAsync(); 
        
        using var factory = new CustomWebAppFactory(_dbFixture.ConnectionString);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await SeedHelper.SeedProductsAsync(db);

        var client = factory.CreateClient();
        var res = await client.GetAsync("/api/categories");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
