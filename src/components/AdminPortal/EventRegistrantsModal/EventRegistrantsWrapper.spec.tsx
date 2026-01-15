import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  cleanup,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventRegistrantsWrapper } from './EventRegistrantsWrapper';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

const queryMock = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          attendees: [],
        },
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'org123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org123',
            members: [
              {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@palisadoes.com',
                image: '',
                createdAt: '12/12/22',
                organizationsBlockedBy: [],
              },
            ],
          },
        ],
      },
    },
  },
];

type RenderComponentProps = React.ComponentProps<
  typeof EventRegistrantsWrapper
>;

const renderComponent = (props: RenderComponentProps) => {
  return render(
    <MockedProvider mocks={queryMock}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <NotificationToastContainer />
              <EventRegistrantsWrapper {...props} />
            </I18nextProvider>
          </Provider>
        </LocalizationProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('EventRegistrantsWrapper Component', () => {
  const defaultProps: RenderComponentProps = {
    eventId: 'event123',
    orgId: 'org123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('Component Rendering', () => {
    test('should render Register Member button with correct text', () => {
      renderComponent(defaultProps);

      const button = screen.getByText('Register Member');
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    });

    test('should render button with correct data-testid attribute', () => {
      renderComponent(defaultProps);

      const button = screen.getByTestId('filter-button');
      expect(button).toBeInTheDocument();
    });

    test('should render button with correct aria-label', () => {
      renderComponent(defaultProps);

      const button = screen.getByLabelText('showAttendees');
      expect(button).toBeInTheDocument();
    });

    test('should apply correct CSS classes to button', () => {
      renderComponent(defaultProps);

      const button = screen.getByTestId('filter-button');
      expect(button).toHaveClass('border-1', 'mx-4');
    });

    test('should not render modal initially', () => {
      renderComponent(defaultProps);

      expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
    });
  });

  describe('Modal Opening Functionality', () => {
    test('should open modal when Register Member button is clicked', async () => {
      renderComponent(defaultProps);

      const button = screen.getByText('Register Member');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should set showModal state to true when button is clicked', async () => {
      renderComponent(defaultProps);

      expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should render modal when eventId is provided', async () => {
      const customProps = { ...defaultProps, eventId: 'custom-event-123' };
      renderComponent(customProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should render modal when orgId is provided', async () => {
      const customProps = { ...defaultProps, orgId: 'custom-org-456' };
      renderComponent(customProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Closing Functionality', () => {
    test('should close modal when close button is clicked', async () => {
      renderComponent(defaultProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });
    });

    test('should set showModal state to false when modal is closed', async () => {
      renderComponent(defaultProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });
    });
  });

  describe('onUpdate Callback Functionality', () => {
    test('should call onUpdate callback when modal is closed', async () => {
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(1);
      });
    });

    test('should call onUpdate exactly once per modal close', async () => {
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(1);
      });

      expect(onUpdateMock).toHaveBeenCalledWith();
    });

    test('should not call onUpdate when modal is opened', async () => {
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      expect(onUpdateMock).not.toHaveBeenCalled();
    });

    test('should not throw error when onUpdate is not provided', async () => {
      renderComponent(defaultProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
      }).not.toThrow();

      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });
    });

    test('should not throw error when onUpdate is undefined', async () => {
      const propsWithUndefined = { ...defaultProps, onUpdate: undefined };
      renderComponent(propsWithUndefined);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
      }).not.toThrow();
    });
  });

  describe('Modal State Management', () => {
    test('should toggle modal visibility multiple times correctly', async () => {
      renderComponent(defaultProps);

      // First cycle
      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });

      // Second cycle
      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });

      // Third cycle
      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should call onUpdate for each modal close in multiple cycles', async () => {
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      // First cycle
      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(1);
      });

      // Second cycle
      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(2);
      });

      // Third cycle
      fireEvent.click(screen.getByText('Register Member'));
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('Props Passing to EventRegistrantsModal', () => {
    test('should pass show prop as true when modal is open', async () => {
      renderComponent(defaultProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should pass handleClose function to modal', async () => {
      renderComponent(defaultProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    test('should render EventRegistrantsModal with all props', async () => {
      const customProps = {
        eventId: 'test-event-789',
        orgId: 'test-org-101',
        onUpdate: vi.fn(),
      };

      renderComponent(customProps);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid button clicks without breaking', async () => {
      renderComponent(defaultProps);

      const button = screen.getByText('Register Member');

      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should handle empty string eventId', async () => {
      const propsWithEmptyEventId = { ...defaultProps, eventId: '' };
      renderComponent(propsWithEmptyEventId);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should handle empty string orgId', async () => {
      const propsWithEmptyOrgId = { ...defaultProps, orgId: '' };
      renderComponent(propsWithEmptyOrgId);

      fireEvent.click(screen.getByText('Register Member'));

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should maintain button functionality after modal operations', async () => {
      renderComponent(defaultProps);

      const button = screen.getByText('Register Member');

      // Open modal
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      // Close modal
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });

      // Button should still be clickable
      expect(button).toBeEnabled();
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have accessible button with proper aria-label', () => {
      renderComponent(defaultProps);

      const button = screen.getByLabelText('showAttendees');
      expect(button).toHaveAccessibleName();
    });

    test('should be keyboard accessible', async () => {
      renderComponent(defaultProps);

      const button = screen.getByText('Register Member');
      button.focus();

      expect(button).toHaveFocus();
    });
  });
});
