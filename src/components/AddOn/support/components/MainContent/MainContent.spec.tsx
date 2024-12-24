import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from 'state/store';
import MainContent from './MainContent';

describe('Testing MainContent component', () => {
  const props = {
    children: 'This is a dummy text',
  };

  it('should render props and children for the Main Content', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <MainContent {...props} />
        </Provider>
      </BrowserRouter>,
    );

    expect(getByTestId('mainContentCheck')).toBeInTheDocument();
    expect(getByText(props.children)).toBeInTheDocument();
  });
});
