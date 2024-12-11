/**
 * Unit tests for the AddOn component.
 *
 * This file contains tests for the OrgContribution to ensure it behaves as expected
 * under various scenarios.
 */
import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrgContribution from './OrgContribution';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
const link = new StaticMockLink([], true);
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
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

describe('Organisation Contribution Page', () => {
  test('should render props and text elements test for the screen', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgContribution />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();

    expect(container.textContent).toMatch('Filter by Name');
    expect(container.textContent).toMatch('Filter by Trans. ID');
    expect(container.textContent).toMatch('Recent Stats');
    expect(container.textContent).toMatch('Contribution');
    expect(window.location).toBeAt('/orglist');
  });
});
