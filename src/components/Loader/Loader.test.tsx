import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Testing Loader component', () => {
  test('Component should be rendered properly', () => {
    render(<Loader />);

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('Component should render on custom sizes', () => {
    render(<Loader size="sm" />);

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('Component should render with large size', () => {
    render(<Loader size="lg" />);

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
