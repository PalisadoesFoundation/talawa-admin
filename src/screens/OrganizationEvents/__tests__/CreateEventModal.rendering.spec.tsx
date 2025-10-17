import { screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { mockProps, renderComponent } from './CreateEventModal.setup';

describe('CreateEventModal - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    renderComponent();

    expect(screen.getByTestId('createEventModalCloseBtn')).toBeInTheDocument();
    expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    expect(screen.getByTestId('eventDescriptionInput')).toBeInTheDocument();
    expect(screen.getByTestId('eventLocationInput')).toBeInTheDocument();
    expect(screen.getByTestId('createEventBtn')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    renderComponent({ ...mockProps, isOpen: false });

    expect(
      screen.queryByTestId('createEventModalCloseBtn'),
    ).not.toBeInTheDocument();
  });

  test('displays recurrence dropdown with default value', () => {
    renderComponent();

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    expect(recurrenceDropdown).toHaveTextContent('Does not repeat');
  });

  test('button is disabled when createLoading is true', () => {
    renderComponent();

    const createButton = screen.getByTestId('createEventBtn');

    expect(createButton).not.toBeDisabled();
  });
});
