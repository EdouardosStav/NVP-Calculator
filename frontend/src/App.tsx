import React, { useState } from 'react';
import NpvForm from './components/NpvForm';
import NpvChart from './components/NpvChart';
import NpvResults from './components/NpvResults';
import { npvApi } from './services/api';
import { NpvCalculationRequest, NpvCalculationResult } from './types';
import './App.css';

const App: React.FC = () => {
  const [results, setResults] = useState<NpvCalculationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (request: NpvCalculationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await npvApi.calculateNpv(request);
      
      if (response.isSuccess) {
        setResults(response.results);
      } else {
        setError(response.errorMessage || 'Calculation failed');
        setResults([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>NPV Calculator</h1>
          <p>Calculate Net Present Value across a range of discount rates</p>
        </header>
        
        <div className="main-content">
          <div className="input-section">
            <NpvForm onSubmit={handleCalculate} isLoading={isLoading} />
            
            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          <div className="results-section">
            {results.length > 0 && (
              <>
                <NpvChart results={results} />
                <NpvResults results={results} />
              </>
            )}
            
            {results.length === 0 && !isLoading && !error && (
              <div className="empty-state">
                <h3>Welcome to NPV Calculator</h3>
                <p>Enter your cash flows and discount rate parameters to get started.</p>
                <ul>
                  <li>Enter cash flows separated by commas</li>
                  <li>Set your discount rate range</li>
                  <li>Choose the increment step</li>
                  <li>Click "Calculate NPV" to see results</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;