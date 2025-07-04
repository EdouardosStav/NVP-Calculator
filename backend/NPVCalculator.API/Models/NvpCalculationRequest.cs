namespace NPVCalculator.API.Models
{
    public class NpvCalculationRequest
    {
        public double[] CashFlows { get; set; } = Array.Empty<double>();
        public double LowerBoundRate { get; set; }
        public double UpperBoundRate { get; set; }
        public double RateIncrement { get; set; }
    }
}
