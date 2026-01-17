import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import RecurringEventVolunteerModal from './RecurringEventVolunteerModal';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        joinGroupTitle: `Join ${params?.groupName} - ${params?.eventName}`,
        volunteerTitle: `Volunteer for ${params?.eventName}`,
        joinGroupQuestion: `Would you like to join "${params?.groupName}" for the entire series or just this instance?`,
        volunteerQuestion:
          'Would you like to volunteer for the entire series or just this instance?',
        volunteerForSeries: 'Volunteer for Entire Series',
        joinGroupForSeries:
          'You will join this group for all events in the recurring series',
        volunteerForSeriesDesc:
          'You will be volunteering for all events in this recurring series',
        volunteerForInstance: 'Volunteer for This Instance Only',
        joinGroupForInstance: `You will join this group only for the event on ${params?.date}`,
        volunteerForInstanceDesc: `You will only be volunteering for the event on ${params?.date}`,
        cancel: 'Cancel',
        submitRequest: 'Submit Request',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en-US',
    },
  }),
}));

const defaultProps = {
  show: true,
  onHide: vi.fn(),
  eventName: 'Weekly Cleanup',
  eventDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  onSelectSeries: vi.fn(),
  onSelectInstance: vi.fn(),
};

describe('RecurringEventVolunteerModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders modal with individual volunteering title, description and option texts', () => {
    // Make date formatting deterministic for this test
    // Make date formatting deterministic for this test
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(defaultProps.eventDate));

    render(<RecurringEventVolunteerModal {...defaultProps} />);

    // Modal exists
    expect(screen.getByTestId('recurringEventModal')).toBeInTheDocument();

    // Title for individual volunteering
    expect(
      screen.getByText(`Volunteer for ${defaultProps.eventName}`),
    ).toBeInTheDocument();

    // Main description (individual branch)
    expect(
      screen.getByText(
        'Would you like to volunteer for the entire series or just this instance?',
      ),
    ).toBeInTheDocument();

    // Series option description (individual branch)
    expect(
      screen.getByText(
        'You will be volunteering for all events in this recurring series',
      ),
    ).toBeInTheDocument();

    // Instance option description (individual branch, with formatted date)
    expect(
      screen.getByText(
        `You will only be volunteering for the event on ${formattedDate}`,
      ),
    ).toBeInTheDocument();

    // Default selection should be "series"
    const seriesRadio = screen.getByTestId('volunteerForSeriesOption');
    const instanceRadio = screen.getByTestId('volunteerForInstanceOption');
    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();
  });

  test('renders group volunteering title, description and option texts when isForGroup is true', () => {
    const groupName = 'Cleanup Crew';
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(defaultProps.eventDate));

    render(
      <RecurringEventVolunteerModal
        {...defaultProps}
        isForGroup={true}
        groupName={groupName}
      />,
    );

    // Title for group volunteering
    expect(
      screen.getByText(`Join ${groupName} - ${defaultProps.eventName}`),
    ).toBeInTheDocument();

    // Main description (group branch)
    expect(
      screen.getByText(
        `Would you like to join "${groupName}" for the entire series or just this instance?`,
      ),
    ).toBeInTheDocument();

    // Series option description (group branch)
    expect(
      screen.getByText(
        'You will join this group for all events in the recurring series',
      ),
    ).toBeInTheDocument();

    // Instance option description (group branch, with formatted date)
    expect(
      screen.getByText(
        `You will join this group only for the event on ${formattedDate}`,
      ),
    ).toBeInTheDocument();
  });

  test('allows switching between instance and series options (covers both onChange handlers)', () => {
    render(<RecurringEventVolunteerModal {...defaultProps} />);

    const seriesRadio = screen.getByTestId('volunteerForSeriesOption');
    const instanceRadio = screen.getByTestId('volunteerForInstanceOption');

    // Default is series
    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();

    // Switch to instance
    fireEvent.click(instanceRadio);
    expect(instanceRadio).toBeChecked();
    expect(seriesRadio).not.toBeChecked();

    // Switch back to series (exercises the series onChange handler branch)
    fireEvent.click(seriesRadio);
    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();
  });

  test('submit triggers onSelectSeries when "series" option is selected', () => {
    render(<RecurringEventVolunteerModal {...defaultProps} />);

    // Series is selected by default
    const submitBtn = screen.getByTestId('submitVolunteerBtn');
    fireEvent.click(submitBtn);

    expect(defaultProps.onSelectSeries).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelectInstance).not.toHaveBeenCalled();
  });

  test('submit triggers onSelectInstance when "instance" option is selected', () => {
    render(<RecurringEventVolunteerModal {...defaultProps} />);

    const instanceRadio = screen.getByTestId('volunteerForInstanceOption');
    const submitBtn = screen.getByTestId('submitVolunteerBtn');

    // Change selection to instance
    fireEvent.click(instanceRadio);
    fireEvent.click(submitBtn);

    expect(defaultProps.onSelectInstance).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelectSeries).not.toHaveBeenCalled();
  });

  test('cancel button calls onHide', () => {
    render(<RecurringEventVolunteerModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
  });
});
