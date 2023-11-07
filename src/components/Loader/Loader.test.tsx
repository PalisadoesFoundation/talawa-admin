import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Loader from './Loader';

describe('Testing Loader component', () => {
  test('Component should be rendered properly', () => {
    render(
      <BrowserRouter>
        <Loader />
      </BrowserRouter>
    );

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('Component should render on custom sizes', () => {
    render(
      <BrowserRouter>
        <Loader size="sm" />
      </BrowserRouter>
    );

    const spinner = screen.getByTestId('spinner');
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      '_spinnerSm_1vy2z_21 spinner-border text-primary'
    );
  });

  test('Component should render with large size', () => {
    render(
      <BrowserRouter>
        <Loader size="lg" />
      </BrowserRouter>
    );

    const spinner = screen.getByTestId('spinner');
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      '_spinnerLg_1vy2z_15 spinner-border text-primary'
    );
  });

  test('renders with extra-large size', () => {
    render(
      <BrowserRouter>
        <Loader size="xl" />
      </BrowserRouter>
    );

    const spinner = screen.getByTestId('spinner');
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      '_spinnerXl_1vy2z_9 spinner-border text-primary'
    );
  });
});
