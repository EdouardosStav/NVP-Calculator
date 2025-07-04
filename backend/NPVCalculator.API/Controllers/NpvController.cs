using Microsoft.AspNetCore.Mvc;
using NPVCalculator.API.Interfaces;
using NPVCalculator.API.Models;

namespace NPVCalculator.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class NpvController : ControllerBase
	{
		private readonly INpvCalculatorService _npvService;

		public NpvController(INpvCalculatorService npvService)
		{
			_npvService = npvService;
		}

		[HttpPost("calculate")]
		public ActionResult<NpvCalculationResponse> CalculateNpv([FromBody] NpvCalculationRequest request)
		{
			if (request == null)
			{
				return BadRequest(new NpvCalculationResponse
				{
					IsSuccess = false,
					ErrorMessage = "Request cannot be null"
				});
			}

			var result = _npvService.CalculateNpvRange(request);

			if (!result.IsSuccess)
			{
				return BadRequest(result);
			}

			return Ok(result);
		}

		[HttpGet("health")]
		public IActionResult Health()
		{
			return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow });
		}
	}
}