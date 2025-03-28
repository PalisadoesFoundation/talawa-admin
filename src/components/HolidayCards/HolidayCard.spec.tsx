import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HolidayCard from './HolidayCard';
import styles from 'style/app-fixed.module.css';

describe('HolidayCard Component', () => {
  test('renders without crashing', () => {
    render(<HolidayCard holidayName="Christmas" />);
    expect(screen.getByTestId('holiday-card')).toBeDefined();
  });

  test('displays the provided holiday name', () => {
    const testHolidayName = 'New Year';
    render(<HolidayCard holidayName={testHolidayName} />);

    const cardElement = screen.getByTestId('holiday-card');
    expect(cardElement.textContent).toBe(testHolidayName);
  });

  test('applies the correct CSS class', () => {
    render(<HolidayCard holidayName="Easter" />);

    const cardElement = screen.getByTestId('holiday-card');
    expect(cardElement.className).toBe(styles.holidayCard);
  });

  test('handles empty holiday name', () => {
    render(<HolidayCard holidayName="" />);

    const cardElement = screen.getByTestId('holiday-card');
    expect(cardElement.textContent).toBe('');
  });

  test('handles long holiday names', () => {
    const longHolidayName = 'International Talk Like a Pirate Day Celebration';
    render(<HolidayCard holidayName={longHolidayName} />);

    const cardElement = screen.getByTestId('holiday-card');
    expect(cardElement.textContent).toBe(longHolidayName);
  });

  // TypeScript compile-time tests
  test('TypeScript props validation', () => {
    // @ts-expect-error - Testing TypeScript validation for missing required prop
    render(<HolidayCard />);

    // @ts-expect-error - Testing TypeScript validation for wrong prop type
    render(<HolidayCard holidayName={123} />);
  });
});
