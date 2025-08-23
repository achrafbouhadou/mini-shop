using FluentAssertions;
using FluentValidation.TestHelper;
using MiniShop.Application.Products;
using Xunit;

namespace MiniShop.Application.Tests;

public class ProductValidatorsTests
{
    [Fact]
    public void CreateProductValidator_Valid_OK()
    {
        var v = new CreateProductValidator();
        var req = new CreateProductRequest("Basic Tee", "TS-BASE-001", 19.99m, "Cotton", Guid.NewGuid());

        var result = v.TestValidate(req);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateProductValidator_MissingName_Fails()
    {
        var v = new CreateProductValidator();
        var req = new CreateProductRequest("", "SKU", 10m, null, Guid.NewGuid());

        var result = v.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void UpdateProductValidator_NegativePrice_Fails()
    {
        var v = new UpdateProductValidator();
        var req = new UpdateProductRequest("Name", "SKU", -1m, null, Guid.NewGuid(), true);

        var result = v.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.Price);
    }
}
