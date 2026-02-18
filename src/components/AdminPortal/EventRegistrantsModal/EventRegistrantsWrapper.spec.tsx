import React from 'react';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventRegistrantsWrapper } from './EventRegistrantsWrapper';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import { describe, test, expect, vi, afterEach } from 'vitest';

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

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render Register Member button with correct text', () => {
      renderComponent(defaultProps);

      // Match either "Register Member" or the translation key
      const button = screen.getByText(
        /Register Member|eventRegistrantsModal\.registerMember/i,
      );
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

      const button = screen.getByLabelText(
        /Register Member|eventRegistrantsModal\.registerMember/i,
      );
      expect(button).toBeInTheDocument();
    });

    test('should apply correct CSS classes to button', () => {
      renderComponent(defaultProps);

      const button = screen.getByTestId('filter-button');

      expect(button).toHaveClass('btn', 'btn-primary');
    });

    test('should not render modal initially', () => {
      renderComponent(defaultProps);

      expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
    });
  });

  describe('Modal Opening Functionality', () => {
    test('should open modal when Register Member button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      const button = screen.getByText(
        /Register Member|eventRegistrantsModal\.registerMember/i,
      );
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should set showModal state to true when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should render modal when eventId is provided', async () => {
      const user = userEvent.setup();
      const customProps = { ...defaultProps, eventId: 'custom-event-123' };
      renderComponent(customProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should render modal when orgId is provided', async () => {
      const user = userEvent.setup();
      const customProps = { ...defaultProps, orgId: 'custom-org-456' };
      renderComponent(customProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Closing Functionality', () => {
    test('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });
    });

    test('should set showModal state to false when modal is closed', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });
    });
  });

  describe('onUpdate Callback Functionality', () => {
    test('should call onUpdate callback when modal is closed', async () => {
      const user = userEvent.setup();
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(1);
      });
    });

    test('should call onUpdate exactly once per modal close', async () => {
      const user = userEvent.setup();
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(1);
      });

      expect(onUpdateMock).toHaveBeenCalledWith();
    });

    test('should not call onUpdate when modal is opened', async () => {
      const user = userEvent.setup();
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      expect(onUpdateMock).not.toHaveBeenCalled();
    });

    test('should not throw error when onUpdate is not provided', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });
    });

    test('should not throw error when onUpdate is undefined', async () => {
      const user = userEvent.setup();
      const propsWithUndefined = { ...defaultProps, onUpdate: undefined };
      renderComponent(propsWithUndefined);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));
    });
  });

  describe('Modal State Management', () => {
    test('should toggle modal visibility multiple times correctly', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      // First cycle
      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });

      // Second cycle
      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });

      // Third cycle
      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should call onUpdate for each modal close in multiple cycles', async () => {
      const user = userEvent.setup();
      const onUpdateMock = vi.fn();
      const propsWithCallback = { ...defaultProps, onUpdate: onUpdateMock };

      renderComponent(propsWithCallback);

      // First cycle
      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(1);
      });

      // Second cycle
      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(2);
      });

      // Third cycle
      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('Props Passing to EventRegistrantsModal', () => {
    test('should pass show prop as true when modal is open', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should pass handleClose function to modal', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    test('should render EventRegistrantsModal with all props', async () => {
      const user = userEvent.setup();
      const customProps = {
        eventId: 'test-event-789',
        orgId: 'test-org-101',
        onUpdate: vi.fn(),
      };

      renderComponent(customProps);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid button clicks without breaking', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      const button = screen.getByText(
        /Register Member|eventRegistrantsModal\.registerMember/i,
      );

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should handle empty string eventId', async () => {
      const user = userEvent.setup();
      const propsWithEmptyEventId = { ...defaultProps, eventId: '' };
      renderComponent(propsWithEmptyEventId);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should handle empty string orgId', async () => {
      const user = userEvent.setup();
      const propsWithEmptyOrgId = { ...defaultProps, orgId: '' };
      renderComponent(propsWithEmptyOrgId);

      await user.click(
        screen.getByText(
          /Register Member|eventRegistrantsModal\.registerMember/i,
        ),
      );

      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });

    test('should maintain button functionality after modal operations', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      const button = screen.getByText(
        /Register Member|eventRegistrantsModal\.registerMember/i,
      );

      // Open modal
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });

      // Close modal
      await user.click(await screen.findByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText('Event Registrants')).not.toBeInTheDocument();
      });

      // Button should still be clickable
      expect(button).toBeEnabled();
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Event Registrants')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have accessible button with proper aria-label', () => {
      renderComponent(defaultProps);

      const button = screen.getByLabelText(
        /Register Member|eventRegistrantsModal\.registerMember/i,
      );
      expect(button).toHaveAccessibleName();
    });

    test('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      renderComponent(defaultProps);

      await user.tab();

      const button = screen.getByRole('button', {
        name: /Register Member|eventRegistrantsModal\.registerMember/i,
      });

      expect(button).toHaveFocus();
    });
  });
});
