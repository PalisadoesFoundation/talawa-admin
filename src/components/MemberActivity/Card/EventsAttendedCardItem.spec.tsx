import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventAttendedCard from './EventsAttendedCardItem';
import type { InterfaceCardItem } from './EventsAttendedCardItem';
import { vi } from 'vitest';

// Mock react-router Link (not react-router-dom!) to avoid router context issues
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: React.PropsWithChildren<{ to: string }>) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock useLocalStorage
const mockGetItem = vi.fn();
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
  }),
}));

describe('EventAttendedCard', () => {
  const mockProps: InterfaceCardItem = {
    title: 'Test Event',
    startdate: '2023-05-15',
    time: '14:00',
    location: 'Test Location',
    orgId: 'org123',
    eventId: 'event456',
  };

  const renderComponent = (props = mockProps): void => {
    render(
      <BrowserRouter>
        <EventAttendedCard {...props} />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to administrator role
    mockGetItem.mockReturnValue('administrator');
  });

  describe('Basic rendering', () => {
    it('renders event details correctly', () => {
      renderComponent();

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText(/may/i)).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    it('renders card with correct test id', () => {
      renderComponent();
      expect(screen.getByTestId('EventsAttendedCard')).toBeInTheDocument();
    });

    // Location icon asserted in the location-specific tests below.
  });

  describe('Date handling', () => {
    it('renders valid date correctly', () => {
      renderComponent();
      expect(screen.getByText(/may/i)).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('renders "Date N/A" for invalid date', () => {
      const propsWithInvalidDate = {
        ...mockProps,
        startdate: 'invalid-date',
      };
      renderComponent(propsWithInvalidDate);
      expect(screen.getByText('Date N/A')).toBeInTheDocument();
    });

    it('renders "Date N/A" for missing date', () => {
      const propsWithoutDate = {
        ...mockProps,
        startdate: undefined,
      };
      renderComponent(propsWithoutDate);
      expect(screen.getByText('Date N/A')).toBeInTheDocument();
    });

    it('renders "Date N/A" for empty date string', () => {
      const propsWithEmptyDate = {
        ...mockProps,
        startdate: '',
      };
      renderComponent(propsWithEmptyDate);
      expect(screen.getByText('Date N/A')).toBeInTheDocument();
    });
  });

  describe('Location handling', () => {
    it('renders location when present', () => {
      renderComponent();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByTestId('LocationOnIcon')).toBeInTheDocument();
    });

    it('does not render location icon when location is missing', () => {
      const propsWithoutLocation = {
        ...mockProps,
        location: undefined,
      };
      renderComponent(propsWithoutLocation);
      expect(screen.queryByTestId('LocationOnIcon')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
    });

    it('does not render location icon when location is empty', () => {
      const propsWithEmptyLocation = {
        ...mockProps,
        location: '',
      };
      renderComponent(propsWithEmptyLocation);
      expect(screen.queryByTestId('LocationOnIcon')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
    });
  });

  describe('User role handling', () => {
    describe('Administrator user', () => {
      beforeEach(() => {
        mockGetItem.mockReturnValue('administrator');
      });

      it('renders link with correct path when both IDs are present', () => {
        renderComponent();
        const card = screen.getByTestId('EventsAttendedCard');
        const link = within(card).getByRole('link');
        expect(link).toHaveAttribute('href', '/event/org123/event456');
      });

      it('renders chevron right icon', () => {
        renderComponent();
        const card = screen.getByTestId('EventsAttendedCard');
        expect(
          within(card).getByTestId('ChevronRightIcon'),
        ).toBeInTheDocument();
      });

      it('renders link when orgId is missing', () => {
        const propsWithoutOrgId = {
          ...mockProps,
          orgId: undefined,
        };
        renderComponent(propsWithoutOrgId);
        const card = screen.getByTestId('EventsAttendedCard');
        const link = within(card).getByRole('link');
        expect(link).toHaveAttribute('href', '/event/undefined/event456');
      });

      it('renders link when eventId is missing', () => {
        const propsWithoutEventId = {
          ...mockProps,
          eventId: undefined,
        };
        renderComponent(propsWithoutEventId);
        const card = screen.getByTestId('EventsAttendedCard');
        const link = within(card).getByRole('link');
        expect(link).toHaveAttribute('href', '/event/org123/undefined');
      });

      it('renders link when both IDs are missing', () => {
        const propsWithoutIds = {
          ...mockProps,
          orgId: undefined,
          eventId: undefined,
        };
        renderComponent(propsWithoutIds);
        const card = screen.getByTestId('EventsAttendedCard');
        const link = within(card).getByRole('link');
        expect(link).toHaveAttribute('href', '/event/undefined/undefined');
      });
    });

    describe('Regular user', () => {
      beforeEach(() => {
        mockGetItem.mockReturnValue('regular');
      });

      it('does not render link for regular user', () => {
        renderComponent();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
      });

      it('does not render chevron right icon for regular user', () => {
        renderComponent();
        expect(
          screen.queryByTestId('ChevronRightIcon'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Superadmin user', () => {
      beforeEach(() => {
        mockGetItem.mockReturnValue('superadmin');
      });

      it('does not render link for superadmin user', () => {
        renderComponent();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
      });

      it('does not render chevron right icon for superadmin user', () => {
        renderComponent();
        expect(
          screen.queryByTestId('ChevronRightIcon'),
        ).not.toBeInTheDocument();
      });
    });

    describe('User role', () => {
      beforeEach(() => {
        mockGetItem.mockReturnValue('user');
      });

      it('does not render link for user role', () => {
        renderComponent();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
      });

      it('does not render chevron right icon for user role', () => {
        renderComponent();
        expect(
          screen.queryByTestId('ChevronRightIcon'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Null role', () => {
      beforeEach(() => {
        mockGetItem.mockReturnValue(null);
      });

      it('does not render link for null role', () => {
        renderComponent();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
      });

      it('does not render chevron right icon for null role', () => {
        renderComponent();
        expect(
          screen.queryByTestId('ChevronRightIcon'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Undefined role', () => {
      beforeEach(() => {
        mockGetItem.mockReturnValue(undefined);
      });

      it('does not render link for undefined role', () => {
        renderComponent();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
      });

      it('does not render chevron right icon for undefined role', () => {
        renderComponent();
        expect(
          screen.queryByTestId('ChevronRightIcon'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('handles empty title gracefully', () => {
      const propsWithEmptyTitle = {
        ...mockProps,
        title: '',
      };
      renderComponent(propsWithEmptyTitle);
      const titleElement = screen.getByTestId('EventsAttendedCardTitle');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('');
    });

    it('handles very long title', () => {
      const longTitle = 'A'.repeat(1000);
      const propsWithLongTitle = {
        ...mockProps,
        title: longTitle,
      };
      renderComponent(propsWithLongTitle);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles special characters in title', () => {
      const specialTitle =
        'Event with Special Characters: @#$%^&*()_+-=[]{}|;:,.<>?';
      const propsWithSpecialTitle = {
        ...mockProps,
        title: specialTitle,
      };
      renderComponent(propsWithSpecialTitle);
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('handles missing time gracefully', () => {
      const propsWithoutTime = {
        ...mockProps,
        time: undefined,
      };
      renderComponent(propsWithoutTime);
      const card = screen.getByTestId('EventsAttendedCard');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    it('handles empty time gracefully', () => {
      const propsWithEmptyTime = {
        ...mockProps,
        time: '',
      };
      renderComponent(propsWithEmptyTime);
      const card = screen.getByTestId('EventsAttendedCard');
      expect(card).toBeInTheDocument();
    });

    it('handles very long time string', () => {
      const longTime = 'T'.repeat(1000);
      const propsWithLongTime = {
        ...mockProps,
        time: longTime,
      };
      renderComponent(propsWithLongTime);
      const card = screen.getByTestId('EventsAttendedCard');
      expect(card).toBeInTheDocument();
    });

    it('handles malformed time format', () => {
      const malformedTime = 'invalid-time-format-25:99:99';
      const propsWithMalformedTime = {
        ...mockProps,
        time: malformedTime,
      };
      renderComponent(propsWithMalformedTime);
      const card = screen.getByTestId('EventsAttendedCard');
      expect(card).toBeInTheDocument();
    });

    it('handles special characters in time', () => {
      const specialTime = '@#$%^&*()_+-=[]{}|;:,.<>?';
      const propsWithSpecialTime = {
        ...mockProps,
        time: specialTime,
      };
      renderComponent(propsWithSpecialTime);
      const card = screen.getByTestId('EventsAttendedCard');
      expect(card).toBeInTheDocument();
    });
  });
});
