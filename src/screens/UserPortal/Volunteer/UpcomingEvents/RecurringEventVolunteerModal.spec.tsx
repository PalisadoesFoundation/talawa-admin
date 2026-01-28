import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import dayjs from 'dayjs';
import i18n from 'utils/i18nForTest';
import RecurringEventVolunteerModal from './RecurringEventVolunteerModal';

const defaultProps = {
  show: true,
  onHide: vi.fn(),
  eventName: 'Weekly Cleanup',
  eventDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  onSelectSeries: vi.fn(),
  onSelectInstance: vi.fn(),
};

describe('RecurringEventVolunteerModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal with individual volunteering title, description and option texts', () => {
    // Make date formatting deterministic for this test
    const formattedDate = dayjs(defaultProps.eventDate)
      .toDate()
      .toLocaleDateString();
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue(
      formattedDate,
    );

    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal {...defaultProps} />
      </I18nextProvider>,
    );

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
      screen.getByText(/You will be volunteering for all events/i),
    ).toBeInTheDocument();

    // Instance option description (individual branch, with formatted date)
    expect(
      screen.getByText(/You will only be volunteering for the event on/i),
    ).toBeInTheDocument();

    // Default selection should be "series"
    const seriesRadio = screen.getByTestId('volunteerForSeriesOption');
    const instanceRadio = screen.getByTestId('volunteerForInstanceOption');
    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();
  });

  test('renders group volunteering title, description and option texts when isForGroup is true', () => {
    const groupName = 'Cleanup Crew';
    const formattedDate = dayjs(defaultProps.eventDate)
      .toDate()
      .toLocaleDateString();
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue(
      formattedDate,
    );

    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal
          {...defaultProps}
          isForGroup={true}
          groupName={groupName}
        />
      </I18nextProvider>,
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
      screen.getByText(/You will join this group for all events/i),
    ).toBeInTheDocument();

    // Instance option description (group branch, with formatted date)
    expect(
      screen.getByText(/You will join this group only for the event on/i),
    ).toBeInTheDocument();
  });

  test('allows switching between instance and series options (covers both onChange handlers)', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal {...defaultProps} />
      </I18nextProvider>,
    );

    const seriesRadio = screen.getByTestId('volunteerForSeriesOption');
    const instanceRadio = screen.getByTestId('volunteerForInstanceOption');

    // Default is series
    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();

    // Switch to instance
    await user.click(instanceRadio);
    expect(instanceRadio).toBeChecked();
    expect(seriesRadio).not.toBeChecked();

    // Switch back to series (exercises the series onChange handler branch)
    await user.click(seriesRadio);
    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();
  });

  test('submit triggers onSelectSeries when "series" option is selected', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal {...defaultProps} />
      </I18nextProvider>,
    );

    // Series is selected by default
    const submitBtn = screen.getByTestId('modal-primary-btn');
    await user.click(submitBtn);

    expect(defaultProps.onSelectSeries).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelectInstance).not.toHaveBeenCalled();
  });

  test('submit triggers onSelectInstance when "instance" option is selected', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal {...defaultProps} />
      </I18nextProvider>,
    );

    const instanceRadio = screen.getByTestId('volunteerForInstanceOption');
    const submitBtn = screen.getByTestId('modal-primary-btn');

    // Change selection to instance
    await user.click(instanceRadio);
    await user.click(submitBtn);

    expect(defaultProps.onSelectInstance).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelectSeries).not.toHaveBeenCalled();
  });

  test('cancel button calls onHide', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal {...defaultProps} />
      </I18nextProvider>,
    );

    await user.click(screen.getByTestId('modal-secondary-btn'));

    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
  });

  test('close button calls onHide', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <RecurringEventVolunteerModal {...defaultProps} />
      </I18nextProvider>,
    );

    await user.click(screen.getByTestId('modalCloseBtn'));

    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
  });
});
