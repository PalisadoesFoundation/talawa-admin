import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrgContribution from './OrgContribution';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
const link = new StaticMockLink([], true);
async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

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
      </MockedProvider>
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
