using MiniShop.Domain.Common;

namespace MiniShop.Domain.Products;

public class Category : BaseEntity
{
    public string Name { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
