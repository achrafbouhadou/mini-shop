using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniShop.Domain.Products;

namespace MiniShop.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> b)
    {
        b.ToTable("products");
        b.HasKey(x => x.Id);
        b.Property(x => x.Name).IsRequired().HasMaxLength(200);
        b.Property(x => x.Sku).IsRequired().HasMaxLength(64);
        b.HasIndex(x => x.Sku).IsUnique();
        b.Property(x => x.Price).HasPrecision(18, 2);
        b.Property(x => x.IsActive).HasDefaultValue(true);
        b.HasOne(x => x.Category).WithMany(c => c.Products).HasForeignKey(x => x.CategoryId);
    }
}
