import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

import DonationCard from './DonationCard';
import type { InterfaceDonationCardProps } from 'types/Donation/interface';

const link = new StaticMockLink([], true);

async function wait(ms = 50): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

const defaultProps: InterfaceDonationCardProps = {
  id: '1',
  name: 'John Doe',
  amount: '20',
  userId: '1234',
  payPalId: 'paypal-id',
  updatedAt: new Date('2024-01-01T10:00:00Z').toISOString(),
};

const renderComponent = (props = defaultProps) =>
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <DonationCard {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

describe('DonationCard [User Portal]', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the donation card container', async () => {
    renderComponent();
    await wait();

    expect(
      screen.getByTestId(`donation-card-${defaultProps.id}`),
    ).toBeInTheDocument();
  });

  it('renders donor name', async () => {
    renderComponent();
    await wait();

    expect(screen.getByTestId('DonorName')).toHaveTextContent('John Doe');
  });

  it('renders donation amount', async () => {
    renderComponent();
    await wait();

    const amountRow = screen.getByTestId('donation-amount');
    expect(amountRow).toHaveTextContent('20');
  });

  it('renders formatted donation date', async () => {
    renderComponent();
    await wait();
    expect(screen.getByTestId('donation-date')).toBeInTheDocument();
  });

  it('renders view button with addButton class', async () => {
    renderComponent();
    await wait();

    const viewButton = screen.getByRole('button', { name: /view/i });
    expect(viewButton).toBeInTheDocument();
    expect(viewButton).toHaveClass('addButton');
  });

  it('renders avatar image slot', async () => {
    renderComponent();
    await wait();

    expect(
      screen.getByTestId(`donation-${defaultProps.id}-avatar`),
    ).toBeInTheDocument();
  });

  it('does not crash when updatedAt is missing', async () => {
    renderComponent({ ...defaultProps, updatedAt: '' });
    await wait();

    expect(
      screen.getByTestId(`donation-card-${defaultProps.id}`),
    ).toBeInTheDocument();
  });
});
