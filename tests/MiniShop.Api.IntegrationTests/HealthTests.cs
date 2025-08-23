using System.Net;
using FluentAssertions;
using Xunit;

namespace MiniShop.Api.IntegrationTests;

public class HealthTests : IClassFixture<TestingDatabase>
{
    private readonly TestingDatabase _db;
    public HealthTests(TestingDatabase db) => _db = db;

    [Fact]
    public async Task Healthz_ReturnsOk()
    {
         await _db.ResetAsync();   
        using var factory = new CustomWebAppFactory(_db.ConnectionString);
        var client = factory.CreateClient();

        var res = await client.GetAsync("/healthz");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
    }

}
