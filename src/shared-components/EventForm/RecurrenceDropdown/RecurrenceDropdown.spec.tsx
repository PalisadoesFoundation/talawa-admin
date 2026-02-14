/**
 * Tests for RecurrenceDropdown sub-component.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RecurrenceDropdown from './RecurrenceDropdown';
import { Frequency } from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceOption } from '../utils';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';

const mockT = vi.fn((key: string) => key);

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
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropdown with current label', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
        t={mockT}
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
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));

    expect(screen.getByTestId('recurrence-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('recurrence-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('recurrence-item-2')).toBeInTheDocument();
  });

  it('calls onSelect with the correct option when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={onSelect}
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));

    await user.click(screen.getByTestId('recurrence-item-1'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Daily' }),
    );
  });

  it('calls onSelect with the custom option', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={onSelect}
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));

    await user.click(screen.getByTestId('recurrence-item-2'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Custom', value: 'custom' }),
    );
  });

  it('calls onSelect with null value option', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Daily"
        onSelect={onSelect}
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));

    await user.click(screen.getByTestId('recurrence-item-0'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Does not repeat', value: null }),
    );
  });

  it('renders correct aria-label from translation', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    expect(mockT).toHaveBeenCalledWith('recurring');
  });

  it('highlights the currently selected option based on currentLabel', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Daily"
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    expect(screen.getByText('Daily')).toBeInTheDocument();
  });

  it('renders with empty options array', () => {
    renderWithI18n(
      <RecurrenceDropdown
        recurrenceOptions={[]}
        currentLabel="No options"
        onSelect={vi.fn()}
        t={mockT}
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
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrence-toggle'));
    await user.click(screen.getByTestId('recurrence-item-1'));

    await user.click(screen.getByTestId('recurrence-toggle'));
    await user.click(screen.getByTestId('recurrence-item-2'));

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ label: 'Daily' }),
    );
    expect(onSelect).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ label: 'Custom' }),
    );
  });
});
