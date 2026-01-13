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
        isOpen={false}
        onToggle={vi.fn()}
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
    expect(screen.getByText('Does not repeat')).toBeInTheDocument();
  });

  it('shows options when dropdown is open', () => {
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        isOpen={true}
        onToggle={vi.fn()}
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-1')).toBeInTheDocument();
    expect(screen.getByTestId('recurrenceOption-2')).toBeInTheDocument();
  });

  it('calls onToggle when dropdown toggle is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        isOpen={false}
        onToggle={onToggle}
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrenceDropdown'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('calls onSelect when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        isOpen={true}
        onToggle={vi.fn()}
        onSelect={onSelect}
        t={mockT}
      />,
    );

    await user.click(screen.getByTestId('recurrenceOption-1'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Daily' }),
    );
  });

  it('renders correct aria-label from translation', () => {
    render(
      <RecurrenceDropdown
        recurrenceOptions={mockOptions}
        currentLabel="Does not repeat"
        isOpen={false}
        onToggle={vi.fn()}
        onSelect={vi.fn()}
        t={mockT}
      />,
    );

    expect(mockT).toHaveBeenCalledWith('recurring');
  });
});
