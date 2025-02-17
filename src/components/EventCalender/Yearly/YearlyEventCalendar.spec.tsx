import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import Calendar from './YearlyEventCalender';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MOCKS } from '../EventCalenderMocks';

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 200): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Calendar Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the year view with months', async () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <Calendar eventData={[]} />
      </I18nextProvider>,
    );
    await wait();

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    months.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  it('initializes with the current year', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <Calendar eventData={[]} />
      </I18nextProvider>,
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(currentYear.toString())).toBeInTheDocument();
  });

  it('navigates to the previous and next year', async () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <Calendar eventData={[]} />
      </I18nextProvider>,
    );

    const prevButton = screen.getByTestId('prevYear');
    const nextButton = screen.getByTestId('nextYear');
    const currentYearElement = screen.getByText(
      new Date().getFullYear().toString(),
    );

    fireEvent.click(prevButton);
    await wait();
    expect(Number(currentYearElement.textContent)).toBeLessThan(
      new Date().getFullYear(),
    );

    fireEvent.click(nextButton);
    await wait();
    expect(Number(currentYearElement.textContent)).toBe(
      new Date().getFullYear(),
    );
  });

  it('handles expanding and collapsing event lists', () => {
    render(
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={[]} />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const expandButton = screen.queryAllByRole('button', {
      name: /view more/i,
    });
    if (expandButton.length) {
      fireEvent.click(expandButton[0]);
      expect(screen.getByText(/close/i)).toBeInTheDocument();
      fireEvent.click(screen.getByText(/close/i));
    }
  });

  it('responds to window resize events', async () => {
    render(
      <Router>
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar eventData={[]} />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    await act(async () => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });
  });
});
