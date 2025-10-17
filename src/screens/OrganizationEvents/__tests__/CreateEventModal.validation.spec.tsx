import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { renderComponent } from './CreateEventModal.setup';

describe('CreateEventModal - Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows warning when name is empty', async () => {
    const { toast } = await import('react-toastify');
    renderComponent();

    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(toast.warning).toHaveBeenCalledWith('Name can not be blank!');
  });

  test('shows warning when description is empty', async () => {
    const { toast } = await import('react-toastify');
    renderComponent();

    const titleInput = screen.getByTestId('eventTitleInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(locationInput, 'Test Location');

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(toast.warning).toHaveBeenCalledWith('Description can not be blank!');
  });

  test('shows warning when location is empty', async () => {
    const { toast } = await import('react-toastify');
    renderComponent();

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');

    await userEvent.type(titleInput, 'Test Event');
    await userEvent.type(descriptionInput, 'Test Description');

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(toast.warning).toHaveBeenCalledWith('Location can not be blank!');
  });

  test('shows all warnings when all fields are empty', async () => {
    const { toast } = await import('react-toastify');
    renderComponent();

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(toast.warning).toHaveBeenCalledWith('Name can not be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Description can not be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Location can not be blank!');
  });

  test('form submission prevented when form is invalid', async () => {
    const { toast } = await import('react-toastify');
    renderComponent();

    const form = screen.getByTestId('createEventBtn').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalled();
    });
  });
});
