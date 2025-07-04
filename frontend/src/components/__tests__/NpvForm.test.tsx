import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NpvForm from '../NpvForm';

describe('NpvForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnClear.mockClear();
  });

  test('renders form fields', () => {
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
    expect(screen.getByLabelText(/cash flows/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lower bound rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upper bound rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rate increment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate npv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
  });

  test('renders with correct default values', () => {
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
    const cashFlowInput = screen.getByLabelText(/cash flows/i) as HTMLInputElement;
    const lowerBoundInput = screen.getByLabelText(/lower bound rate/i) as HTMLInputElement;
    const upperBoundInput = screen.getByLabelText(/upper bound rate/i) as HTMLInputElement;
    const incrementInput = screen.getByLabelText(/rate increment/i) as HTMLInputElement;
    
    expect(cashFlowInput.value).toBe('-1000, 300, 400, 500');
    expect(lowerBoundInput.value).toBe('1');
    expect(upperBoundInput.value).toBe('15');
    expect(incrementInput.value).toBe('0.25');
  });

  test('submits form with default values', () => {
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
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
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /calculating/i });
    expect(submitButton).toBeDisabled();
  });

  test('disables clear button when loading', () => {
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={true} />);
    
    const clearButton = screen.getByRole('button', { name: /clear all/i });
    expect(clearButton).toBeDisabled();
  });

  test('handles cash flow input changes', () => {
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
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
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
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

  test('shows validation alert for empty cash flows', () => {
    // Mock alert
    window.alert = jest.fn();
    
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
    const cashFlowInput = screen.getByLabelText(/cash flows/i);
    fireEvent.change(cashFlowInput, { target: { value: '' } });
    
    const submitButton = screen.getByRole('button', { name: /calculate npv/i });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('Please enter valid cash flows');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('clears form when clear button is clicked', () => {
    render(<NpvForm onSubmit={mockOnSubmit} onClear={mockOnClear} isLoading={false} />);
    
    // Change some values first
    const cashFlowInput = screen.getByLabelText(/cash flows/i);
    const lowerBoundInput = screen.getByLabelText(/lower bound rate/i);
    
    fireEvent.change(cashFlowInput, { target: { value: '-5000, 1000' } });
    fireEvent.change(lowerBoundInput, { target: { value: '5' } });
    
    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearButton);
    
    // Check that values are reset to defaults
    expect((cashFlowInput as HTMLInputElement).value).toBe('-1000, 300, 400, 500');
    expect((lowerBoundInput as HTMLInputElement).value).toBe('1');
    
    // Check that onClear was called
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});