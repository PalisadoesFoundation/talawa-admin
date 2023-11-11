import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Testing Loader component', () => {
  test('Component should be rendered properly', () => {
    render(<Loader />);

    const spinnerWrapper = screen.getByTestId('spinner-wrapper');
    expect(spinnerWrapper).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(spinnerWrapper).toHaveClass('_spinner_wrapper_1vy2z_1');
  });

  test('Component should render on custom sizes', () => {
    render(<Loader size="sm" />);

    expect(screen.getByTestId('spinner')).toHaveClass(
      '_spinnerSm_1vy2z_21 spinner-border text-primary'
    );
  });

  test('Component should render with large size', () => {
    render(<Loader size="lg" />);

    expect(screen.getByTestId('spinner')).toHaveClass(
      '_spinnerLg_1vy2z_15 spinner-border text-primary'
    );
  });
});
