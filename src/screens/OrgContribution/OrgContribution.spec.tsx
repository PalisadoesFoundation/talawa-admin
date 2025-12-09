import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { vi, describe, test, expect } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import OrgContribution from './OrgContribution';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
const link = new StaticMockLink([], true);
async function wait(ms = 100): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const renderComponent = () => {
  return render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgContribution />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Organisation Contribution Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render props and text elements test for the screen', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: vi.fn(),
      },
      writable: true,
    });

    window.location.assign('/orglist');

    const { container } = renderComponent();

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Filter by Name');
    expect(container.textContent).toMatch('Filter by Trans. ID');
    expect(container.textContent).toMatch('Recent Stats');
    expect(container.textContent).toMatch('Contribution');
    expect(window.location.assign).toHaveBeenCalledWith('/orglist');
  });

  test('onsearch called in initial render', () => {
    renderComponent();

    const orgInput = screen.getByTestId('filterOrgName');
    fireEvent.keyDown(orgInput, { key: 'Enter' });
    expect(orgInput).toBeInTheDocument();

    const txnInput = screen.getByTestId('filterTransaction');
    fireEvent.keyDown(txnInput, { key: 'Enter' });
    expect(txnInput).toBeInTheDocument();
  });
});
