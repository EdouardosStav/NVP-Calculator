namespace NPVCalculator.API.Models
{
    public class NpvCalculationResponse
    {
        public List<NpvCalculationResult> Results { get; set; } = new();
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }
}