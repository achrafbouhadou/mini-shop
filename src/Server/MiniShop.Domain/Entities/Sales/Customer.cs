using MiniShop.Domain.Common;

namespace MiniShop.Domain.Sales;

public class Customer : BaseEntity
{
    public string FirstName { get; set; } = default!;
    public string LastName  { get; set; } = default!;
    public string Email     { get; set; } = default!;
}
