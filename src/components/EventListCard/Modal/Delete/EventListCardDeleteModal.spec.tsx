import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import EventListCardDeleteModal from './EventListCardDeleteModal';
import dayjs from 'dayjs';
import type { InterfaceDeleteEventModalProps } from 'types/Event/interface';
import i18n from 'utils/i18nForTest';

// Mock props for standalone event
const mockStandaloneEventProps: InterfaceDeleteEventModalProps = {
  eventListCardProps: {
    id: 'standalone-event-1',
    name: 'Standalone Event',
    description: 'A standalone event',
    startAt: dayjs().add(10, 'days').toISOString(),
    endAt: dayjs().add(10, 'days').add(1, 'hour').toISOString(),
    startTime: '10:00:00',
    endTime: '11:00:00',
    allDay: false,
    location: 'Test Location',
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {
      id: 'user1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
    },
    // Standalone event fields
    isRecurringEventTemplate: false,
    baseEvent: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  eventDeleteModalIsOpen: true,
  toggleDeleteModal: vi.fn(),
  t: (key: string) => key,
  tCommon: (key: string) => key,
  deleteEventHandler: vi.fn(),
};

// Mock props for recurring event instance
const mockRecurringEventProps: InterfaceDeleteEventModalProps = {
  eventListCardProps: {
    id: 'recurring-instance-1',
    name: 'Daily Meeting',
    description: 'Daily team meeting',
    startAt: dayjs().add(10, 'days').subtract(1, 'hour').toISOString(),
    endAt: dayjs().add(10, 'days').toISOString(),
    startTime: '09:00:00',
    endTime: '10:00:00',
    allDay: false,
    location: 'Conference Room',
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {
      id: 'user1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
    },
    // Recurring instance fields
    isRecurringEventTemplate: false,
    baseEvent: { id: 'base-event-123' }, // This makes it a recurring instance
    sequenceNumber: 5,
    totalCount: 10,
    hasExceptions: false,
    progressLabel: '5 of 10',
  },
  eventDeleteModalIsOpen: true,
  toggleDeleteModal: vi.fn(),
  t: (key: string) => key,
  tCommon: (key: string) => key,
  deleteEventHandler: vi.fn(),
};

describe('EventListCardDeleteModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Standalone Event Tests', () => {
    it('should call deleteEventHandler without parameters for standalone events (Line 55 - else branch)', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockStandaloneEventProps} />
        </I18nextProvider>,
      );

      // Click the delete button (Yes button)
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Verify deleteEventHandler was called without parameters (Line 55 - else branch)
      expect(
        mockStandaloneEventProps.deleteEventHandler,
      ).toHaveBeenCalledWith();
      expect(mockStandaloneEventProps.deleteEventHandler).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should show simple confirmation message for standalone events', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockStandaloneEventProps} />
        </I18nextProvider>,
      );

      // Should show simple delete message, not recurring options
      expect(screen.getByText('deleteEventMsg')).toBeInTheDocument();
      expect(
        screen.queryByText('deleteRecurringEventMsg'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Recurring Event Instance Tests', () => {
    it('should call deleteEventHandler with "single" option by default (Line 55 - if branch)', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Click the delete button (Yes button) - should use default "single" option
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Verify deleteEventHandler was called with "single" parameter (Line 55 - if branch)
      expect(mockRecurringEventProps.deleteEventHandler).toHaveBeenCalledWith(
        'single',
      );
      expect(mockRecurringEventProps.deleteEventHandler).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should update delete option when "Delete only this instance" radio is selected (Line 90)', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Find and click the "single" radio button (Line 90)
      const singleRadio = screen.getByLabelText('deleteThisInstance');
      await user.click(singleRadio);

      // Verify it's checked
      expect(singleRadio).toBeChecked();

      // Click delete button
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Verify deleteEventHandler was called with "single"
      expect(mockRecurringEventProps.deleteEventHandler).toHaveBeenCalledWith(
        'single',
      );
    });

    it('should update delete option when switching back to "Delete only this instance"', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // First select a different option (following) to ensure single is not selected
      const followingRadio = screen.getByLabelText('deleteThisAndFollowing');
      await user.click(followingRadio);
      expect(followingRadio).toBeChecked();
      expect(screen.getByLabelText('deleteThisInstance')).not.toBeChecked();

      // Now click the "single" radio button to trigger onChange (Line 94)
      const singleRadio = screen.getByLabelText('deleteThisInstance');
      await user.click(singleRadio);

      // Verify single is now checked and others are not
      expect(singleRadio).toBeChecked();
      expect(followingRadio).not.toBeChecked();
      expect(screen.getByLabelText('deleteAllEvents')).not.toBeChecked();

      // Click delete button to verify the correct option is passed
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Verify deleteEventHandler was called with "single"
      expect(mockRecurringEventProps.deleteEventHandler).toHaveBeenCalledWith(
        'single',
      );
    });

    it('should update delete option when "Delete this and following" radio is selected (Line 100)', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Find and click the "following" radio button (Line 100)
      const followingRadio = screen.getByLabelText('deleteThisAndFollowing');
      await user.click(followingRadio);

      // Verify it's checked and others are not
      expect(followingRadio).toBeChecked();
      expect(screen.getByLabelText('deleteThisInstance')).not.toBeChecked();
      expect(screen.getByLabelText('deleteAllEvents')).not.toBeChecked();

      // Click delete button
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Verify deleteEventHandler was called with "following"
      expect(mockRecurringEventProps.deleteEventHandler).toHaveBeenCalledWith(
        'following',
      );
    });

    it('should update delete option when "Delete all events" radio is selected (Line 110)', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Find and click the "all" radio button (Line 110)
      const allRadio = screen.getByLabelText('deleteAllEvents');
      await user.click(allRadio);

      // Verify it's checked and others are not
      expect(allRadio).toBeChecked();
      expect(screen.getByLabelText('deleteThisInstance')).not.toBeChecked();
      expect(screen.getByLabelText('deleteThisAndFollowing')).not.toBeChecked();

      // Click delete button
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Verify deleteEventHandler was called with "all"
      expect(mockRecurringEventProps.deleteEventHandler).toHaveBeenCalledWith(
        'all',
      );
    });

    it('should show recurring event options and messages', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Should show recurring delete message and options
      expect(screen.getByText('deleteRecurringEventMsg')).toBeInTheDocument();
      expect(screen.getByLabelText('deleteThisInstance')).toBeInTheDocument();
      expect(
        screen.getByLabelText('deleteThisAndFollowing'),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('deleteAllEvents')).toBeInTheDocument();

      // Should not show simple delete message
      expect(screen.queryByText('deleteEventMsg')).not.toBeInTheDocument();
    });

    it('should have "single" option selected by default', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Default selection should be "single"
      expect(screen.getByLabelText('deleteThisInstance')).toBeChecked();
      expect(screen.getByLabelText('deleteThisAndFollowing')).not.toBeChecked();
      expect(screen.getByLabelText('deleteAllEvents')).not.toBeChecked();
    });

    it('should use larger modal size for recurring events', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockRecurringEventProps} />
        </I18nextProvider>,
      );

      // Modal should have larger size for recurring events
      const modal = document.querySelector('.modal-lg');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Modal Behavior Tests', () => {
    it('should call toggleDeleteModal when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockStandaloneEventProps} />
        </I18nextProvider>,
      );

      const cancelButton = screen.getByTestId('eventDeleteModalCloseBtn');
      await user.click(cancelButton);

      expect(mockStandaloneEventProps.toggleDeleteModal).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should use small modal size for standalone events', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...mockStandaloneEventProps} />
        </I18nextProvider>,
      );

      // Modal should have small size for standalone events
      const modal = document.querySelector('.modal-sm');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle recurring template events as standalone (isRecurringTemplate=true)', async () => {
      const templateEventProps = {
        ...mockRecurringEventProps,
        eventListCardProps: {
          ...mockRecurringEventProps.eventListCardProps,
          isRecurringEventTemplate: true, // This is a template, not an instance
          baseEvent: null,
        },
      };

      const user = userEvent.setup();

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...templateEventProps} />
        </I18nextProvider>,
      );

      // Should show simple confirmation, not recurring options
      expect(screen.getByText('deleteEventMsg')).toBeInTheDocument();
      expect(
        screen.queryByText('deleteRecurringEventMsg'),
      ).not.toBeInTheDocument();

      // Click delete button
      const deleteButton = screen.getByTestId('deleteEventBtn');
      await user.click(deleteButton);

      // Should call deleteEventHandler without parameters
      expect(templateEventProps.deleteEventHandler).toHaveBeenCalledWith();
    });

    it('should handle events with baseEventId but isRecurringTemplate=true as standalone', () => {
      const edgeCaseProps = {
        ...mockRecurringEventProps,
        eventListCardProps: {
          ...mockRecurringEventProps.eventListCardProps,
          isRecurringEventTemplate: true, // Template flag takes precedence
        },
      };

      render(
        <I18nextProvider i18n={i18n}>
          <EventListCardDeleteModal {...edgeCaseProps} />
        </I18nextProvider>,
      );

      // Should treat as standalone because isRecurringTemplate=true
      expect(screen.getByText('deleteEventMsg')).toBeInTheDocument();
      expect(
        screen.queryByText('deleteRecurringEventMsg'),
      ).not.toBeInTheDocument();
    });
  });
});
