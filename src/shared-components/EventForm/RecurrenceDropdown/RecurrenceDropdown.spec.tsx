/**
 * Tests for RecurrenceDropdown sub-component.
 */
import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RecurrenceDropdown from './RecurrenceDropdown';
import { Frequency } from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceOption } from '../utils';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';

const mockOptions: InterfaceRecurrenceOption[] = [
  { label: 'Does not repeat', value: null },
  {
    label: 'Daily',
    value: { frequency: Frequency.DAILY, interval: 1, never: true },
  },
  { label: 'Custom', value: 'custom' },
];

const renderWithI18n = (ui: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
};

describe('RecurrenceDropdown', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the dropdown with current label', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId('recurrence-container')).toBeInTheDocument();
    expect(screen.getByText('Does not repeat')).toBeInTheDocument();
  });

  it('shows options when dropdown toggle is clicked', async () => {
    const user = userEvent.setup();

    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrence-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('recurrence-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('recurrence-item-2')).toBeInTheDocument();
    });
  });

  it('calls onSelect with correct option', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));
    await user.click(await screen.findByTestId('recurrence-item-1'));

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Daily' }),
      );
    });
  });

  it('renders correct aria-label from translation', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
      />,
    );

    const toggle = screen.getByTestId('recurrence-toggle');
    expect(toggle).toHaveAttribute('aria-label', 'Recurring');
  });

  it('displays selected option label on toggle', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Daily"
        onSelect={vi.fn()}
      />,
    );

    const toggle = screen.getByTestId('recurrence-toggle');
    expect(toggle).toHaveTextContent('Daily');
  });

  it('renders with empty options array', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={[]}
        currentLabel="No options"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId('recurrence-container')).toBeInTheDocument();
    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('handles multiple rapid selections', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));
    await user.click(await screen.findByTestId('recurrence-item-1'));

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByTestId('recurrence-toggle'));
    await user.click(await screen.findByTestId('recurrence-item-2'));

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledTimes(2);
    });
  });
});

describe('RecurrenceDropdown Edge Cases', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock('shared-components/DropDownButton', () => ({
      __esModule: true,
      default: ({ onSelect }: { onSelect: (value: string) => void }) => (
        <button
          data-testid="trigger-invalid"
          type="button"
          onClick={() => onSelect('999')}
        >
          Trigger Invalid
        </button>
      ),
    }));
  });

  afterEach(() => {
    vi.doUnmock('shared-components/DropDownButton');
    cleanup();
    vi.restoreAllMocks();
  });

  it('does not call onSelect when invalid index selected', async () => {
    const user = userEvent.setup();
    const { default: RecurrenceDropdown } =
      await import('./RecurrenceDropdown');

    const onSelect = vi.fn();

    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={[]}
        currentLabel="Test"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByTestId('trigger-invalid'));

    await waitFor(() => {
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
