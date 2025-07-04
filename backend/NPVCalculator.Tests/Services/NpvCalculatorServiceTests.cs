using NPVCalculator.API.Models;
using NPVCalculator.API.Services;
using Xunit;

namespace NPVCalculator.Tests.Services
{
    public class NpvCalculatorServiceTests
    {
        private readonly NpvCalculatorService _service;

        public NpvCalculatorServiceTests()
        {
            _service = new NpvCalculatorService();
        }

        [Fact]
        public void CalculateNpv_WithValidInputs_ReturnsCorrectNpv()
        {
            // Arrange
            var cashFlows = new double[] { -1000, 300, 400, 500 };
            var discountRate = 0.10; // 10%

            // Act
            var result = _service.CalculateNpv(cashFlows, discountRate);

            // Assert
            var expected = -1000 + 300 / 1.1 + 400 / Math.Pow(1.1, 2) + 500 / Math.Pow(1.1, 3);
            Assert.Equal(expected, result, 2);
        }

        [Fact]
        public void CalculateNpv_WithZeroDiscountRate_ReturnsSum()
        {
            // Arrange
            var cashFlows = new double[] { -1000, 300, 400, 500 };
            var discountRate = 0.0;

            // Act
            var result = _service.CalculateNpv(cashFlows, discountRate);

            // Assert
            Assert.Equal(200, result); // -1000 + 300 + 400 + 500
        }

        [Fact]
        public void CalculateNpv_WithEmptyArray_ThrowsException()
        {
            // Arrange
            var cashFlows = new double[] { };
            var discountRate = 0.10;

            // Act & Assert
            Assert.Throws<ArgumentException>(() => _service.CalculateNpv(cashFlows, discountRate));
        }

        [Fact]
        public void CalculateNpvRange_WithValidRequest_ReturnsMultipleResults()
        {
            // Arrange
            var request = new NpvCalculationRequest
            {
                CashFlows = new double[] { -1000, 300, 400, 500 },
                LowerBoundRate = 5.0,
                UpperBoundRate = 15.0,
                RateIncrement = 5.0
            };

            // Act
            var result = _service.CalculateNpvRange(request);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(3, result.Results.Count); // 5%, 10%, 15%
            Assert.Equal(5.0, result.Results[0].DiscountRate);
            Assert.Equal(10.0, result.Results[1].DiscountRate);
            Assert.Equal(15.0, result.Results[2].DiscountRate);
        }

        [Fact]
        public void CalculateNpvRange_WithInvalidRateBounds_ReturnsError()
        {
            // Arrange
            var request = new NpvCalculationRequest
            {
                CashFlows = new double[] { -1000, 300, 400, 500 },
                LowerBoundRate = 15.0,
                UpperBoundRate = 5.0,
                RateIncrement = 1.0
            };

            // Act
            var result = _service.CalculateNpvRange(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Contains("Lower bound rate must be less than upper bound rate", result.ErrorMessage);
        }
    }
}