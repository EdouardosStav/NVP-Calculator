import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NpvForm from '../NpvForm';

describe('NpvForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders form fields', () => {
    render(<NpvForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    expect(screen.getByLabelText(/cash flows/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lower bound rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upper bound rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rate increment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate npv/i })).toBeInTheDocument();
  });

  test('submits form with default values', () => {
    render(<NpvForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const submitButton = screen.getByRole('button', { name: /calculate npv/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      cashFlows: [-1000, 300, 400, 500],
      lowerBoundRate: 1.0,
      upperBoundRate: 15.0,
      rateIncrement: 0.25,
    });
  });

  test('disables submit button when loading', () => {
    render(<NpvForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /calculating/i });
    expect(submitButton).toBeDisabled();
  });

  test('handles cash flow input changes', () => {
    render(<NpvForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const cashFlowInput = screen.getByLabelText(/cash flows/i);
    fireEvent.change(cashFlowInput, { target: { value: '-2000, 500, 600, 700' } });
    
    const submitButton = screen.getByRole('button', { name: /calculate npv/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      cashFlows: [-2000, 500, 600, 700],
      lowerBoundRate: 1.0,
      upperBoundRate: 15.0,
      rateIncrement: 0.25,
    });
  });

  test('handles rate input changes', () => {
    render(<NpvForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const lowerBoundInput = screen.getByLabelText(/lower bound rate/i);
    const upperBoundInput = screen.getByLabelText(/upper bound rate/i);
    const incrementInput = screen.getByLabelText(/rate increment/i);
    
    fireEvent.change(lowerBoundInput, { target: { value: '2.0' } });
    fireEvent.change(upperBoundInput, { target: { value: '20.0' } });
    fireEvent.change(incrementInput, { target: { value: '0.5' } });
    
    const submitButton = screen.getByRole('button', { name: /calculate npv/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      cashFlows: [-1000, 300, 400, 500],
      lowerBoundRate: 2.0,
      upperBoundRate: 20.0,
      rateIncrement: 0.5,
    });
  });
});