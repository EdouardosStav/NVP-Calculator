import React, { useState, useEffect, useCallback } from 'react';
import { NpvCalculationRequest } from '../types';

interface NpvFormProps {
  onSubmit: (request: NpvCalculationRequest) => void;
  onClear: () => void;
  isLoading: boolean;
}

// Default values moved outside component for better performance
const DEFAULT_VALUES = {
  cashFlowsInput: '-1000, 300, 400, 500',
  lowerBoundRate: 1.0,
  upperBoundRate: 15.0,
  rateIncrement: 0.25,
};

const NpvForm: React.FC<NpvFormProps> = ({ onSubmit, onClear, isLoading }) => {
  const [cashFlowsInput, setCashFlowsInput] = useState(DEFAULT_VALUES.cashFlowsInput);
  const [lowerBoundRate, setLowerBoundRate] = useState(DEFAULT_VALUES.lowerBoundRate);
  const [upperBoundRate, setUpperBoundRate] = useState(DEFAULT_VALUES.upperBoundRate);
  const [rateIncrement, setRateIncrement] = useState(DEFAULT_VALUES.rateIncrement);

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

  const handleClear = useCallback(() => {
    setCashFlowsInput(DEFAULT_VALUES.cashFlowsInput);
    setLowerBoundRate(DEFAULT_VALUES.lowerBoundRate);
    setUpperBoundRate(DEFAULT_VALUES.upperBoundRate);
    setRateIncrement(DEFAULT_VALUES.rateIncrement);
    onClear(); // Clear results in parent component
  }, [onClear]);

  // Keyboard shortcut for clear (Ctrl+R / Cmd+R)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        handleClear();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClear]);

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
      
      <button 
        type="button" 
        onClick={handleClear} 
        disabled={isLoading}
        className="clear-btn"
        title="Clear all fields and results"
      >
        Clear All
      </button>
    </form>
  );
};

export default NpvForm;