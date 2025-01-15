import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import HolidayCard from './HolidayCard';

// Mock styles for testing
vi.mock('./../../style/app.module.css', () => ({
  default: {},
  holidayCard: 'holidayCard',
}));

describe('HolidayCard Component', () => {
  it('renders correctly with the given holiday name', () => {
    const holidayName = 'Christmas';
    render(<HolidayCard holidayName={holidayName} />);
    const cardElement = screen.getByText(holidayName);
    expect(cardElement).toBeInTheDocument();
  });

  it('handles empty holiday name gracefully', () => {
    render(<HolidayCard holidayName="" />);
    const cardElement = screen.getByTestId('holiday-card');
    expect(cardElement).toBeInTheDocument();
  });

  it('handles long holiday names appropriately', () => {
    const longName = 'Very Long Holiday Name That Might Cause Wrapping Issues';
    render(<HolidayCard holidayName={longName} />);
    const cardElement = screen.getByText(longName);
    expect(cardElement).toBeInTheDocument();
  });
});
