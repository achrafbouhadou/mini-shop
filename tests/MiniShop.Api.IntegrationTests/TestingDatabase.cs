using System.Data.Common;
using Npgsql;
using Respawn;
using Testcontainers.PostgreSql;
using Xunit;

namespace MiniShop.Api.IntegrationTests;

public class TestingDatabase : IAsyncLifetime
{
    private readonly PostgreSqlContainer _pg = new PostgreSqlBuilder()
        .WithImage("postgres:16")
        .WithDatabase("minishop_test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    public string ConnectionString => _pg.GetConnectionString();

    private Respawner? _respawner;

    public async Task InitializeAsync()
    {
        await _pg.StartAsync();
        await using var conn = new NpgsqlConnection(ConnectionString + ";Include Error Detail=true");
        await conn.OpenAsync();
        _respawner = await Respawner.CreateAsync(conn, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = ["public"]
        });
    }

    public async Task ResetAsync()
    {
        await using var conn = new NpgsqlConnection(ConnectionString);
        await conn.OpenAsync();
        if (_respawner != null) await _respawner.ResetAsync(conn);
    }

    public Task DisposeAsync() => _pg.DisposeAsync().AsTask();
}
