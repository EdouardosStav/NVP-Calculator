using NPVCalculator.API.Models;

namespace NPVCalculator.API.Interfaces
{
    public interface INpvCalculatorService
    {
        NpvCalculationResponse CalculateNpvRange(NpvCalculationRequest request);
        double CalculateNpv(double[] cashFlows, double discountRate);
    }
}