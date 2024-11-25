/**
 * Unit tests for the AddOn component.
 *
 * This file contains tests for the AddOn component to ensure it behaves as expected
 * under various scenarios.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { store } from 'state/store';

import AddOn from './AddOn';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

const link = new StaticMockLink([], true);

vi.mock('state/store', () => ({
  store: {
    // Mock store configuration if needed
    getState: vi.fn(),
    subscribe: vi.fn(),
    dispatch: vi.fn(),
  },
}));

vi.mock('utils/i18nForTest', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

describe('Testing AddOn component', () => {
  const props = {
    children: 'This is a dummy text',
  };

  test('should render with default props', () => {
    const { getByTestId } = render(<AddOn />);
    const container = getByTestId('pluginContainer');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('plugin-container');
    expect(container).toHaveTextContent('Default text');
  });

  test('should render props and text elements test for the page component', () => {
    const { getByTestId, getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AddOn {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(getByTestId('pluginContainer')).toBeInTheDocument();
    expect(getByText(props.children)).toBeInTheDocument();
  });
});
