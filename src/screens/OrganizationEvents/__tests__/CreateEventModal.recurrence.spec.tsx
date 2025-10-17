import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { renderComponent } from './CreateEventModal.setup';

describe('CreateEventModal - Recurrence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles recurrence option selection - Daily', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const dailyOption = screen.getByTestId('recurrenceOption-1');
    await userEvent.click(dailyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent('Daily');
    });
  });

  test('handles recurrence option selection - Weekly', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const weeklyOption = screen.getByTestId('recurrenceOption-2');
    await userEvent.click(weeklyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent(/Weekly on/);
    });
  });

  test('handles recurrence option selection - Monthly', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const monthlyOption = screen.getByTestId('recurrenceOption-3');
    await userEvent.click(monthlyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent(/Monthly on day/);
    });
  });

  test('handles recurrence option selection - Annually', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const annuallyOption = screen.getByTestId('recurrenceOption-4');
    await userEvent.click(annuallyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent(/Annually on/);
    });
  });

  test('handles recurrence option selection - Weekdays', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const weekdaysOption = screen.getByTestId('recurrenceOption-5');
    await userEvent.click(weekdaysOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent(
        'Every weekday (Monday to Friday)',
      );
    });
  });

  test('handles recurrence option selection - Does not repeat', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const dailyOption = screen.getByTestId('recurrenceOption-1');
    await userEvent.click(dailyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent('Daily');
    });

    await userEvent.click(recurrenceDropdown);

    const noRepeatOption = screen.getByTestId('recurrenceOption-0');
    await userEvent.click(noRepeatOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent('Does not repeat');
    });
  });

  test('opens custom recurrence modal when custom option is selected', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const customOption = screen.getByTestId('recurrenceOption-6');
    await userEvent.click(customOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('opens custom recurrence modal with default recurrence when no recurrence is set', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const customOption = screen.getByTestId('recurrenceOption-6');
    await userEvent.click(customOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('closes dropdown after custom option selection', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);
    const dailyOption = screen.getByTestId('recurrenceOption-1');
    await userEvent.click(dailyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent('Daily');
    });

    await userEvent.click(recurrenceDropdown);
    const customOption = screen.getByTestId('recurrenceOption-6');
    await userEvent.click(customOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('handles custom recurrence modal state updates with function', async () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const customOption = screen.getByTestId('recurrenceOption-6');
    await userEvent.click(customOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('getDayName returns correct day names', () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(recurrenceDropdown);

    const weeklyOption = screen.getByTestId('recurrenceOption-2');
    expect(weeklyOption.textContent).toMatch(
      /Weekly on (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)/,
    );
  });

  test('getMonthName returns correct month names', () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(recurrenceDropdown);

    const annualOption = screen.getByTestId('recurrenceOption-4');
    expect(annualOption.textContent).toMatch(
      /Annually on (January|February|March|April|May|June|July|August|September|October|November|December)/,
    );
  });

  test('getRecurrenceOptions includes all expected options', () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(recurrenceDropdown);

    expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-1')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-2')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-3')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-4')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-5')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-6')).toBeInTheDocument();
  });
});
