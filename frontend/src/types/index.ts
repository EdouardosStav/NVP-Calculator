export interface NpvCalculationRequest {
  cashFlows: number[];
  lowerBoundRate: number;
  upperBoundRate: number;
  rateIncrement: number;
}

export interface NpvCalculationResult {
  discountRate: number;
  npv: number;
}

export interface NpvCalculationResponse {
  results: NpvCalculationResult[];
  isSuccess: boolean;
  errorMessage?: string;
}