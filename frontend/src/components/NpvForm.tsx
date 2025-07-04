import React, { useState } from 'react';
import { NpvCalculationRequest } from '../types';

interface NpvFormProps {
  onSubmit: (request: NpvCalculationRequest) => void;
  isLoading: boolean;
}

const NpvForm: React.FC<NpvFormProps> = ({ onSubmit, isLoading }) => {
  const [cashFlowsInput, setCashFlowsInput] = useState('-1000, 300, 400, 500');
  const [lowerBoundRate, setLowerBoundRate] = useState(1.0);
  const [upperBoundRate, setUpperBoundRate] = useState(15.0);
  const [rateIncrement, setRateIncrement] = useState(0.25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cashFlows = cashFlowsInput
      .split(',')
      .map(cf => parseFloat(cf.trim()))
      .filter(cf => !isNaN(cf));

    if (cashFlows.length === 0) {
      alert('Please enter valid cash flows');
      return;
    }

    onSubmit({
      cashFlows,
      lowerBoundRate,
      upperBoundRate,
      rateIncrement,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="npv-form">
      <h2>NPV Calculator</h2>
      
      <div className="form-group">
        <label htmlFor="cashFlows">Cash Flows (comma-separated):</label>
        <input
          id="cashFlows"
          type="text"
          value={cashFlowsInput}
          onChange={(e) => setCashFlowsInput(e.target.value)}
          placeholder="-1000, 300, 400, 500"
          required
        />
        <small className="form-hint">
          First cash flow is typically negative (initial investment)
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="lowerBound">Lower Bound Rate (%):</label>
        <input
          id="lowerBound"
          type="number"
          step="0.01"
          value={lowerBoundRate}
          onChange={(e) => setLowerBoundRate(parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="upperBound">Upper Bound Rate (%):</label>
        <input
          id="upperBound"
          type="number"
          step="0.01"
          value={upperBoundRate}
          onChange={(e) => setUpperBoundRate(parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="increment">Rate Increment (%):</label>
        <input
          id="increment"
          type="number"
          step="0.01"
          value={rateIncrement}
          onChange={(e) => setRateIncrement(parseFloat(e.target.value))}
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Calculate NPV'}
      </button>
    </form>
  );
};

export default NpvForm;