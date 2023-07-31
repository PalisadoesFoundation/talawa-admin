import React from 'react';
import { render, screen } from '@testing-library/react';
import 'jest-localstorage-mock';
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
});
