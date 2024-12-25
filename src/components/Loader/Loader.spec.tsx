import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { describe, it, expect } from 'vitest';

describe('Testing Loader component', () => {
  it('should render the component properly', () => {
    render(<Loader />);
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render the component with custom sizes', () => {
    render(<Loader size="sm" />);
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render the component with large size', () => {
    render(<Loader size="lg" />);
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
