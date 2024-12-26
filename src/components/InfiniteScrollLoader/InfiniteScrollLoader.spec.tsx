import React from 'react';
import { render, screen } from '@testing-library/react';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import { describe, test, expect } from 'vitest';

describe('Testing InfiniteScrollLoader component', () => {
  test('Component should be rendered properly', () => {
    render(<InfiniteScrollLoader />);

    expect(screen.getByTestId('infiniteScrollLoader')).toBeInTheDocument();
    expect(
      screen.getByTestId('infiniteScrollLoaderSpinner'),
    ).toBeInTheDocument();
  });
});
