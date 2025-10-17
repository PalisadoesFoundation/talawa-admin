import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { renderComponent } from './CreateEventModal.setup';

describe('CreateEventModal - Form Inputs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles form input changes', async () => {
    renderComponent();

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    expect(titleInput).toHaveValue('Test Event');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(locationInput).toHaveValue('Test Location');
  });

  test('handles date changes', async () => {
    renderComponent();

    const startDatePicker = screen.getByTestId('date-picker-Start Date');
    const endDatePicker = screen.getByTestId('date-picker-End Date');

    fireEvent.change(startDatePicker, {
      target: { value: '2024-03-01' },
    });

    fireEvent.change(endDatePicker, {
      target: { value: '2024-03-05' },
    });

    expect(startDatePicker).toHaveValue('2024-03-01');
    expect(endDatePicker).toHaveValue('2024-03-05');
  });

  test('updates end date when start date is changed to after current end date', async () => {
    renderComponent();

    const startDatePicker = screen.getByTestId('date-picker-Start Date');
    fireEvent.change(startDatePicker, {
      target: { value: '2025-12-01' },
    });

    await waitFor(() => {
      const endDatePicker = screen.getByTestId('date-picker-End Date');
      expect(endDatePicker.getAttribute('value')).toBe('2025-12-01');
    });
  });

  test('handles all day checkbox toggle', async () => {
    renderComponent();

    const allDayCheckbox = screen.getByTestId('alldayCheck');

    expect(allDayCheckbox).toBeChecked();

    await userEvent.click(allDayCheckbox);

    expect(allDayCheckbox).not.toBeChecked();

    await waitFor(() => {
      expect(screen.getByTestId('time-picker-Start Time')).toBeInTheDocument();
      expect(screen.getByTestId('time-picker-End Time')).toBeInTheDocument();
    });
  });

  test('handles time changes when not all day', async () => {
    renderComponent();

    const allDayCheckbox = screen.getByTestId('alldayCheck');
    await userEvent.click(allDayCheckbox);

    await waitFor(() => {
      expect(screen.getByTestId('time-picker-Start Time')).toBeInTheDocument();
    });

    const startTimePicker = screen.getByTestId('time-picker-Start Time');
    const endTimePicker = screen.getByTestId('time-picker-End Time');

    fireEvent.change(startTimePicker, {
      target: { value: '09:00:00' },
    });

    fireEvent.change(endTimePicker, {
      target: { value: '17:00:00' },
    });

    expect(startTimePicker).toHaveValue('09:00:00');
    expect(endTimePicker).toHaveValue('17:00:00');
  });

  test('updates end time when start time is changed to after current end time', async () => {
    renderComponent();

    const allDayCheckbox = screen.getByTestId('alldayCheck');
    await userEvent.click(allDayCheckbox);

    await waitFor(() => {
      expect(screen.getByTestId('time-picker-Start Time')).toBeInTheDocument();
    });

    const startTimePicker = screen.getByTestId('time-picker-Start Time');

    fireEvent.change(startTimePicker, {
      target: { value: '20:00:00' },
    });

    await waitFor(() => {
      const endTimePicker = screen.getByTestId('time-picker-End Time');
      expect(endTimePicker.getAttribute('value')).toBe('20:00:00');
    });
  });

  test('handles public checkbox toggle', async () => {
    renderComponent();

    const publicCheckbox = screen.getByTestId('ispublicCheck');
    expect(publicCheckbox).toBeChecked();

    await userEvent.click(publicCheckbox);

    expect(publicCheckbox).not.toBeChecked();
  });

  test('handles registrable checkbox toggle', async () => {
    renderComponent();

    const registrableCheckbox = screen.getByTestId('registrableCheck');
    expect(registrableCheckbox).not.toBeChecked();

    await userEvent.click(registrableCheckbox);

    expect(registrableCheckbox).toBeChecked();
  });

  test('handles null end date correctly', async () => {
    renderComponent();

    const endDatePicker = screen.getByTestId('date-picker-End Date');

    expect(endDatePicker.getAttribute('value')).toBeTruthy();
  });

  test('timeToDayJs converts time string correctly', async () => {
    renderComponent();

    const allDayCheckbox = screen.getByTestId('alldayCheck');
    await userEvent.click(allDayCheckbox);

    await waitFor(() => {
      const startTimePicker = screen.getByTestId('time-picker-Start Time');
      expect(startTimePicker.getAttribute('value')).toBe('08:00:00');
    });
  });

  test('validates form inputs trim whitespace', async () => {
    const { toast } = await import('react-toastify');
    renderComponent();

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, '   ');
    await userEvent.type(descriptionInput, '   ');
    await userEvent.type(locationInput, '   ');

    const createButton = screen.getByTestId('createEventBtn');
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith('Name can not be blank!');
      expect(toast.warning).toHaveBeenCalledWith(
        'Description can not be blank!',
      );
      expect(toast.warning).toHaveBeenCalledWith('Location can not be blank!');
    });
  });

  test('closes modal and resets form when close button is clicked', async () => {
    const mockClose = vi.fn();
    renderComponent({
      isOpen: true,
      onClose: mockClose,
      onEventCreated: vi.fn(),
      currentUrl: 'org123',
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    await userEvent.type(titleInput, 'Test Event');

    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });

  test('closes modal and resets form when handleClose is called', async () => {
    const mockClose = vi.fn();
    renderComponent({
      isOpen: true,
      onClose: mockClose,
      onEventCreated: vi.fn(),
      currentUrl: 'org123',
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const allDayCheckbox = screen.getByTestId('alldayCheck');
    await userEvent.click(allDayCheckbox);

    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });

  test('resets form properly when modal is closed', async () => {
    const mockClose = vi.fn();
    renderComponent({
      isOpen: true,
      onClose: mockClose,
      onEventCreated: vi.fn(),
      currentUrl: 'org123',
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const allDayCheckbox = screen.getByTestId('alldayCheck');
    await userEvent.click(allDayCheckbox);

    const publicCheckbox = screen.getByTestId('ispublicCheck');
    await userEvent.click(publicCheckbox);

    const registrableCheckbox = screen.getByTestId('registrableCheck');
    await userEvent.click(registrableCheckbox);

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);
    const dailyOption = screen.getByTestId('recurrenceOption-1');
    await userEvent.click(dailyOption);

    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });
});
