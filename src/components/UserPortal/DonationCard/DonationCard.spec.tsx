import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

import DonationCard from './DonationCard';
import type { InterfaceDonationCardProps } from 'types/UserPortal/Donation/interface';

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
  updatedAt: dayjs.utc().toISOString(),
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
  beforeEach(async () => {
    // Ensure language is reset to English before each test
    await i18nForTest.changeLanguage('en');
  });

  afterEach(async () => {
    vi.clearAllMocks();
    // Reset language to English to ensure consistent test state
    await i18nForTest.changeLanguage('en');
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

  it('renders avatar image slot with aria-hidden attribute', async () => {
    renderComponent();
    await wait();

    const avatar = screen.getByTestId(`donation-${defaultProps.id}-avatar`);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
  });

  it('correctly interpolates the ID in data-testid via donation.card_test_id', async () => {
    const customId = 'custom-id-123';
    renderComponent({ ...defaultProps, id: customId });
    await wait();

    expect(screen.getByTestId(`donation-card-${customId}`)).toBeInTheDocument();
  });

  it('has correct aria-label from donation.card_aria', async () => {
    renderComponent();
    await wait();

    const card = screen.getByTestId(`donation-card-${defaultProps.id}`);
    // Use the translation function to get the expected value based on current locale
    const expectedAriaLabel = i18nForTest.t(
      'donation.card_aria',
      'Donation card',
    );
    expect(card).toHaveAttribute('aria-label', expectedAriaLabel);
  });

  it('formats donation date correctly for English locale', async () => {
    const testDate = dayjs.utc().subtract(10, 'days');
    const date = testDate.toISOString();
    renderComponent({ ...defaultProps, updatedAt: date });
    await wait();

    // Check that the formatted date contains expected parts (month abbreviation and year)
    const dateElement = screen.getByTestId('donation-date');
    expect(dateElement).toHaveTextContent(testDate.format('YYYY'));
    expect(dateElement).toHaveTextContent(testDate.format('MMM'));
  });

  it('formats donation date correctly for a different locale (e.g., Hindi)', async () => {
    // Change language to Hindi
    await act(async () => {
      await i18nForTest.changeLanguage('hi');
    });

    const testDate = dayjs.utc().subtract(10, 'days');
    const date = testDate.toISOString();
    renderComponent({ ...defaultProps, updatedAt: date });
    await wait();

    const dateElement = screen.getByTestId('donation-date');

    // Generate expected Hindi-localized string using the same Intl.DateTimeFormat as the component
    const expectedFormattedDate = new Intl.DateTimeFormat('hi', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));

    // Verify the full Hindi-localized date is present in the formatted output
    expect(dateElement).toHaveTextContent(expectedFormattedDate);

    // Reset language after test
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  it('does not crash when updatedAt is missing', async () => {
    renderComponent({ ...defaultProps, updatedAt: '' });
    await wait();

    expect(
      screen.getByTestId(`donation-card-${defaultProps.id}`),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('donation-date')).not.toBeInTheDocument();
  });
});
