import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { GraphQLError } from 'graphql';

import { renderComponent } from './CreateEventModal.setup';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';

describe('CreateEventModal - Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('submits form with all day event data', async () => {
    renderComponent();

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const startDatePicker = screen.getByTestId('date-picker-Start Date');
    fireEvent.change(startDatePicker, {
      target: { value: '2024-03-01' },
    });

    const form = screen.getByTestId('createEventBtn').closest('form');

    expect(titleInput).toHaveValue('Test Event');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(locationInput).toHaveValue('Test Location');
    expect(startDatePicker).toHaveValue('2024-03-01');

    if (form) {
      fireEvent.submit(form);
    }
  });

  test('submits form with specific times when not all day', async () => {
    renderComponent();

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

    const startDatePicker = screen.getByTestId('date-picker-Start Date');
    fireEvent.change(startDatePicker, {
      target: { value: '2024-03-01' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('time-picker-Start Time')).toBeInTheDocument();
    });

    const startTimePicker = screen.getByTestId('time-picker-Start Time');
    fireEvent.change(startTimePicker, {
      target: { value: '09:00:00' },
    });

    const endTimePicker = screen.getByTestId('time-picker-End Time');
    fireEvent.change(endTimePicker, {
      target: { value: '17:00:00' },
    });

    expect(titleInput).toHaveValue('Test Event');
    expect(allDayCheckbox).not.toBeChecked();
    expect(publicCheckbox).not.toBeChecked();
    expect(registrableCheckbox).toBeChecked();
    expect(startTimePicker).toHaveValue('09:00:00');
    expect(endTimePicker).toHaveValue('17:00:00');

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }
  });

  test('handles error when creating event', async () => {
    const errorHandler = (await import('utils/errorHandler')).errorHandler;

    const errorMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
      },
      error: new Error('Network error'),
    };

    renderComponent(undefined, [errorMock]);

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const createButton = screen.getByTestId('createEventBtn');
    await userEvent.click(createButton);

    await waitFor(
      () => {
        expect(errorHandler).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('handles GraphQL error when creating event', async () => {
    const errorHandler = (await import('utils/errorHandler')).errorHandler;

    const graphQLErrorMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
        variables: expect.any(Object),
      },
      result: {
        errors: [new GraphQLError('Event creation failed')],
      },
    };

    renderComponent(undefined, [graphQLErrorMock]);

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const createButton = screen.getByTestId('createEventBtn');
    await userEvent.click(createButton);

    await waitFor(
      () => {
        expect(errorHandler).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('submits form with valid recurrence', async () => {
    renderComponent();

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const startDatePicker = screen.getByTestId('date-picker-Start Date');
    fireEvent.change(startDatePicker, {
      target: { value: '2024-03-01' },
    });

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    const dailyOption = screen.getByTestId('recurrenceOption-1');
    await userEvent.click(dailyOption);

    await waitFor(() => {
      expect(recurrenceDropdown).toHaveTextContent('Daily');
    });

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }
  });
});
