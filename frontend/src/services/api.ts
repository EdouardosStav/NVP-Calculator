import axios from 'axios';
import { NpvCalculationRequest, NpvCalculationResponse } from '../types';

const API_BASE_URL = 'http://localhost:5077/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const npvApi = {
  calculateNpv: async (request: NpvCalculationRequest): Promise<NpvCalculationResponse> => {
    try {
      const response = await api.post<NpvCalculationResponse>('/npv/calculate', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data;
      }
      throw new Error('Failed to calculate NPV. Please ensure the backend is running.');
    }
  },

  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/npv/health');
    return response.data;
  },
};