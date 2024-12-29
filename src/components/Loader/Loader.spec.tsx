import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { describe, it, expect } from 'vitest';

describe('Testing Loader component', () => {
  it('Component should be rendered properly', () => {
    render(<Loader />);

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Component should render on custom sizes', () => {
    render(<Loader size="sm" />);

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Component should render with large size', () => {
    render(<Loader size="lg" />);

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
