import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { NpvCalculationResult } from '../types';

Chart.register(...registerables);

interface NpvChartProps {
  results: NpvCalculationResult[];
}

const NpvChart: React.FC<NpvChartProps> = ({ results }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || results.length === 0) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: results.map(r => `${r.discountRate}%`),
        datasets: [{
          label: 'NPV ($)',
          data: results.map(r => r.npv),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          pointBackgroundColor: results.map(r => r.npv >= 0 ? '#28a745' : '#dc3545'),
          pointBorderColor: results.map(r => r.npv >= 0 ? '#28a745' : '#dc3545'),
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'NPV vs Discount Rate',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'NPV ($)',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Discount Rate (%)',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [results]);

  if (results.length === 0) return null;

  return (
    <div className="npv-chart">
      <canvas ref={chartRef} />
    </div>
  );
};

export default NpvChart;