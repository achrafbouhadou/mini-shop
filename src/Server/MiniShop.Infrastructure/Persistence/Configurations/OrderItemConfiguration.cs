using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniShop.Domain.Sales;

namespace MiniShop.Infrastructure.Persistence.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> b)
    {
        b.ToTable("order_items");
        b.HasKey(x => x.Id);
        b.Property(x => x.Quantity).IsRequired();
        b.Property(x => x.UnitPrice).HasPrecision(18, 2);
        b.HasOne(x => x.Order).WithMany(o => o.Items).HasForeignKey(x => x.OrderId);
        b.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId);
    }
}
