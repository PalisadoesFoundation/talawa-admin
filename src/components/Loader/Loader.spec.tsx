import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { describe, it, expect } from 'vitest';

describe('Testing Loader component', () => {
  it('Component should be rendered properly', () => {
    render(<Loader />);
    // Use the combined test id as specified in the Loader component.
    expect(screen.getByTestId('spinner-wrapper loader')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Component should render on custom sizes', () => {
    render(<Loader size="sm" />);
    expect(screen.getByTestId('spinner-wrapper loader')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Component should render with large size', () => {
    render(<Loader size="lg" />);
    expect(screen.getByTestId('spinner-wrapper loader')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
