import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecurrenceSection } from './RecurrenceSection';
import { vi } from 'vitest';
import { Frequency, createDefaultRecurrenceRule } from 'utils/recurrenceUtils';

describe('RecurrenceSection', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockT = (key: string) => key;
  const mockCurrentRecurrenceLabel = vi.fn(() => 'doesNotRepeat');
  const mockHandleRecurrenceSelect = vi.fn();
  const mockSetRecurrenceDropdownOpen = vi.fn();

  const mockRecurrenceOptions = [
    { label: 'doesNotRepeat', value: null },
    {
      label: 'daily',
      value: createDefaultRecurrenceRule(
        new Date('2025-01-01'),
        Frequency.DAILY,
      ),
    },
    {
      label: 'weekly',
      value: createDefaultRecurrenceRule(
        new Date('2025-01-01'),
        Frequency.WEEKLY,
      ),
    },
    { label: 'custom', value: 'custom' as const },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders recurrence dropdown with current label', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={false}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
    expect(mockCurrentRecurrenceLabel).toHaveBeenCalled();
  });

  test('renders all recurrence options when dropdown is open', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={true}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    mockRecurrenceOptions.forEach((option, index) => {
      const optionElement = screen.getByTestId(`recurrenceOption-${index}`);
      expect(optionElement).toBeInTheDocument();
      expect(optionElement).toHaveTextContent(option.label);
    });
  });

  test('calls handleRecurrenceSelect when option is clicked', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={true}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    const dailyOption = screen.getByTestId('recurrenceOption-1');
    fireEvent.click(dailyOption);

    expect(mockHandleRecurrenceSelect).toHaveBeenCalledWith({
      label: 'daily',
      value: expect.objectContaining({
        frequency: Frequency.DAILY,
      }),
    });
  });

  test('calls handleRecurrenceSelect with null value for "does not repeat" option', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={true}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    const noRepeatOption = screen.getByTestId('recurrenceOption-0');
    fireEvent.click(noRepeatOption);

    expect(mockHandleRecurrenceSelect).toHaveBeenCalledWith({
      label: 'doesNotRepeat',
      value: null,
    });
  });

  test('calls handleRecurrenceSelect with "custom" value for custom option', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={true}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    const customOption = screen.getByTestId('recurrenceOption-3');
    fireEvent.click(customOption);

    expect(mockHandleRecurrenceSelect).toHaveBeenCalledWith({
      label: 'custom',
      value: 'custom',
    });
  });

  test('dropdown toggle calls setRecurrenceDropdownOpen', () => {
    const { rerender } = render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={false}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdownToggle);

    expect(mockSetRecurrenceDropdownOpen).toHaveBeenCalled();

    // Rerender with dropdown open
    rerender(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={true}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    // Verify options are visible
    expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument();
  });

  test('dropdown is closed when recurrenceDropdownOpen is false', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={false}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    // Options should not be visible when dropdown is closed
    expect(screen.queryByTestId('recurrenceOption-0')).not.toBeInTheDocument();
  });

  test('renders with empty recurrence options array', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={[]}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={true}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
    // No options should be rendered
    expect(screen.queryByTestId('recurrenceOption-0')).not.toBeInTheDocument();
  });

  test('dropdown has correct aria-label', () => {
    render(
      <RecurrenceSection
        recurrenceOptions={mockRecurrenceOptions}
        currentRecurrenceLabel={mockCurrentRecurrenceLabel}
        handleRecurrenceSelect={mockHandleRecurrenceSelect}
        recurrenceDropdownOpen={false}
        setRecurrenceDropdownOpen={mockSetRecurrenceDropdownOpen}
        t={mockT}
      />,
    );

    const dropdown = screen.getByTestId('recurrenceDropdown');
    expect(dropdown).toHaveAttribute('aria-label', 'recurring');
  });
});
