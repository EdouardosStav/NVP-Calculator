using NPVCalculator.API.Interfaces;
using NPVCalculator.API.Models;

namespace NPVCalculator.API.Services
{
    public class NpvCalculatorService : INpvCalculatorService
    {
        public NpvCalculationResponse CalculateNpvRange(NpvCalculationRequest request)
        {
            try
            {
                var results = new List<NpvCalculationResult>();

                // Validate inputs
                if (request.CashFlows?.Length == 0)
                {
                    return new NpvCalculationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Cash flows cannot be empty"
                    };
                }

                if (request.LowerBoundRate >= request.UpperBoundRate)
                {
                    return new NpvCalculationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Lower bound rate must be less than upper bound rate"
                    };
                }

                if (request.RateIncrement <= 0)
                {
                    return new NpvCalculationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Rate increment must be positive"
                    };
                }

                // Calculate NPV for each discount rate
                for (double rate = request.LowerBoundRate;
                     rate <= request.UpperBoundRate;
                     rate += request.RateIncrement)
                {
                    var npv = CalculateNpv(request.CashFlows, rate / 100.0); // Convert percentage to decimal
                    results.Add(new NpvCalculationResult
                    {
                        DiscountRate = Math.Round(rate, 2),
                        NPV = Math.Round(npv, 2)
                    });
                }

                return new NpvCalculationResponse
                {
                    Results = results,
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                return new NpvCalculationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public double CalculateNpv(double[] cashFlows, double discountRate)
        {
            if (cashFlows == null || cashFlows.Length == 0)
                throw new ArgumentException("Cash flows cannot be null or empty");

            double npv = 0;

            // NPV = Σ(Ct / (1 + r)^t) for t = 0 to n
            for (int t = 0; t < cashFlows.Length; t++)
            {
                npv += cashFlows[t] / Math.Pow(1 + discountRate, t);
            }

            return npv;
        }
    }
}