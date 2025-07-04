// src/components/NpvResults.tsx
import React from 'react';
import { NpvCalculationResult } from '../types';

interface NpvResultsProps {
  results: NpvCalculationResult[];
}

const NpvResults: React.FC<NpvResultsProps> = ({ results }) => {
  if (results.length === 0) return null;

  const positiveNpvCount = results.filter(r => r.npv > 0).length;
  const negativeNpvCount = results.filter(r => r.npv < 0).length;
  const maxNpv = Math.max(...results.map(r => r.npv));
  const minNpv = Math.min(...results.map(r => r.npv));

  return (
    <div className="npv-results">
      <h3>NPV Results</h3>
      
      <div className="results-summary">
        <div className="summary-item">
          <span className="label">Total Calculations:</span>
          <span className="value">{results.length}</span>
        </div>
        <div className="summary-item">
          <span className="label">Positive NPV:</span>
          <span className="value positive">{positiveNpvCount}</span>
        </div>
        <div className="summary-item">
          <span className="label">Negative NPV:</span>
          <span className="value negative">{negativeNpvCount}</span>
        </div>
        <div className="summary-item">
          <span className="label">Max NPV:</span>
          <span className="value">${maxNpv.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Min NPV:</span>
          <span className="value">${minNpv.toFixed(2)}</span>
        </div>
      </div>

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Discount Rate (%)</th>
              <th>NPV ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={result.npv >= 0 ? 'positive-row' : 'negative-row'}>
                <td>{result.discountRate}%</td>
                <td>${result.npv.toFixed(2)}</td>
                <td>
                  <span className={`status ${result.npv >= 0 ? 'profitable' : 'loss'}`}>
                    {result.npv >= 0 ? 'Profitable' : 'Loss'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NpvResults;