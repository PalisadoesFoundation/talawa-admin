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

const mockT = vi.fn((key: string) => key);

const mockOptions: InterfaceRecurrenceOption[] = [
  { label: 'Does not repeat', value: null },
  {
    label: 'Daily',
    value: { frequency: Frequency.DAILY, interval: 1, never: true },
  },
  { label: 'Custom', value: 'custom' },
];

describe('RecurrenceDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropdown with current label', () => {
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    // DropDownButton uses dataTestIdPrefix + '-toggle'
    expect(screen.getByTestId('recurrence-toggle')).toBeInTheDocument();
    expect(screen.getByText('Does not repeat')).toBeInTheDocument();
  });

  it('shows options when dropdown is open', async () => {
    const user = userEvent.setup();
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    // Open the dropdown
    await user.click(screen.getByTestId('recurrence-toggle'));

    // Check for options (DropDownButton uses dataTestIdPrefix + '-item-' + value)
    expect(screen.getByTestId('recurrence-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('recurrence-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('recurrence-item-2')).toBeInTheDocument();
  });

  it('calls onSelect when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={onSelect}
        t={mockT}
      />,
    );

    // Open dropdown
    await user.click(screen.getByTestId('recurrence-toggle'));
    // Click option 1 (Daily)
    await user.click(screen.getByTestId('recurrence-item-1'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Daily' }),
    );
  });

  it('renders correct aria-label from translation', () => {
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    // Check aria-label on the toggle button
    expect(screen.getByTestId('recurrence-toggle')).toHaveAttribute(
      'aria-label',
      'recurring',
    );
  });
});
