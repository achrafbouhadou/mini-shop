using FluentValidation;

namespace MiniShop.Application.Products;

public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Sku).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CategoryId).NotEmpty();
    }
}
