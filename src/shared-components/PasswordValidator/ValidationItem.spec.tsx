import React from 'react';
import { render, screen } from '@testing-library/react';
import ValidationItem from './ValidationItem';

describe('ValidationItem Component', () => {
  it('should render with failed validation (danger styling and Clear icon)', () => {
    render(<ValidationItem isValid={false} text="Password must be strong" />);

    const element = screen.getByTestId('validation-item');
    expect(element).toHaveClass('text-danger');
    expect(element).not.toHaveClass('text-success');
    expect(screen.getByText('Password must be strong')).toBeInTheDocument();
    const svg = element.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('data-testid')).toBe('ClearIcon');
  });

  it('should render with passed validation (success styling and Check icon)', () => {
    render(<ValidationItem isValid={true} text="Password is strong" />);

    const element = screen.getByTestId('validation-item');
    expect(element).toHaveClass('text-success');
    expect(element).not.toHaveClass('text-danger');
    expect(screen.getByText('Password is strong')).toBeInTheDocument();
    const svg = element.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('data-testid')).toBe('CheckIcon');
  });

  it('should apply custom className when provided', () => {
    render(
      <ValidationItem
        isValid={true}
        text="Custom class test"
        className="my-custom-class"
      />,
    );

    const element = screen.getByTestId('validation-item');
    expect(element).toHaveClass('form-text');
    expect(element).toHaveClass('text-success');
    expect(element).toHaveClass('my-custom-class');
  });

  it('should not break when className is not provided', () => {
    render(<ValidationItem isValid={false} text="No custom class" />);

    const element = screen.getByTestId('validation-item');
    expect(element).toHaveClass('form-text');
    expect(element).toHaveClass('text-danger');
  });

  it('should render different text content correctly', () => {
    const { rerender } = render(
      <ValidationItem isValid={false} text="First message" />,
    );

    expect(screen.getByText('First message')).toBeInTheDocument();

    rerender(<ValidationItem isValid={true} text="Second message" />);
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('should switch between icons based on isValid prop', () => {
    const { rerender } = render(
      <ValidationItem isValid={false} text="Test message" />,
    );

    let element = screen.getByTestId('validation-item');
    let svg = element.querySelector('svg');

    expect(svg?.getAttribute('data-testid')).toBe('ClearIcon');

    rerender(<ValidationItem isValid={true} text="Test message" />);
    element = screen.getByTestId('validation-item');
    svg = element.querySelector('svg');
    expect(svg?.getAttribute('data-testid')).toBe('CheckIcon');
  });
});
