using Npgsql;
using Respawn;
using Testcontainers.PostgreSql;
using Microsoft.EntityFrameworkCore;
using MiniShop.Infrastructure.Persistence; // AppDbContext

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
        // 1) Start test Postgres
        await _pg.StartAsync();

        // 2) Apply EF migrations to create tables
        var options = new DbContextOptionsBuilder<AppDbContext>()
                        .UseNpgsql(
                            ConnectionString + ";Include Error Detail=true",
                            npg => npg.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
                        .UseSnakeCaseNamingConvention()    
                        .Options;

        await using (var db = new AppDbContext(options))
        {
            await db.Database.MigrateAsync();
        }

        // 3) Create Respawner now that tables exist
        await using var conn = new NpgsqlConnection(ConnectionString);
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
        if (_respawner != null)
            await _respawner.ResetAsync(conn);
    }

    public Task DisposeAsync() => _pg.DisposeAsync().AsTask();
}
