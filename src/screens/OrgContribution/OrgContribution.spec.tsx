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
    const { container } = renderComponent();

    expect(document.title).toBe('Talawa Contributions');
    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Filter by Name');
    expect(container.textContent).toMatch('Filter by Trans. ID');
    expect(container.textContent).toMatch('Recent Stats');
    expect(container.textContent).toMatch('Contribution');
  });

  test('renders ContriStats with correct props', () => {
    renderComponent();

    // Verify ContriStats component is rendered with the correct props
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('6000')).toBeInTheDocument();
  });

  test('renders OrgContriCards with correct props', () => {
    renderComponent();
    // Verify OrgContriCards component is rendered with the correct props
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('20/7/2021')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getByText('21WE98YU')).toBeInTheDocument();
    expect(screen.getByText('johndoexyz@gmail.com')).toBeInTheDocument();
  });

  test('updates org name and transaction filter when typing in search', () => {
    renderComponent();

    const orgInput = screen.getByTestId('filterOrgName');
    fireEvent.input(orgInput, { target: { value: 'Test Org' } });
    fireEvent.keyDown(orgInput, { key: 'Enter' });
    const txnInput = screen.getByTestId('filterTransaction');
    fireEvent.input(txnInput, { target: { value: 'TXN123' } });
    fireEvent.keyDown(txnInput, { key: 'Enter' });
    expect(orgInput).toHaveValue('Test Org');
    expect(txnInput).toHaveValue('TXN123');
  });
});
