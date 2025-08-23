namespace MiniShop.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id = Guid.NewGuid();

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset UpdatedAtUtc { get; set; }
}