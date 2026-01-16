import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BasicUsage,
  WithWarning,
  RecurringEvent,
  DeleteUser,
  DeleteOrganization,
} from './DeleteModal.stories';
import { DeleteModal } from './DeleteModal';
import type { InterfaceDeleteModalProps } from 'types/shared-components/CRUDModalTemplate/interface';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { entityName?: string }) => {
      const translations: Record<string, string> = {
        delete: 'Delete',
        cancel: 'Cancel',
        deleteConfirmation:
          'Are you sure you want to delete this item? This action cannot be undone.',
      };
      if (key === 'deleteEntityConfirmation' && params?.entityName) {
        return `Are you sure you want to delete ${params.entityName}? This action cannot be undone.`;
      }
      return translations[key] || key;
    },
  }),
}));

describe('DeleteModal Stories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('BasicUsage Story', () => {
    test('renders with entity name', () => {
      const args = BasicUsage.args as InterfaceDeleteModalProps;
      render(<DeleteModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Delete Item')).toBeInTheDocument();

      // Verify buttons
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('has correct args configuration', () => {
      expect(BasicUsage.args?.title).toBe('Delete Item');
      expect(BasicUsage.args?.entityName).toBe('Sample Item');
      expect(BasicUsage.args?.showWarning).toBe(false);
    });
  });

  describe('WithWarning Story', () => {
    test('renders with warning message', () => {
      const args = WithWarning.args as InterfaceDeleteModalProps;
      render(<DeleteModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Delete Event')).toBeInTheDocument();

      // Verify warning message is displayed (user-visible content)
      expect(
        screen.getByText(/This action cannot be undone\./),
      ).toBeInTheDocument();
    });

    test('has correct warning configuration', () => {
      expect(WithWarning.args?.showWarning).toBe(true);
      expect(WithWarning.args?.entityName).toBe('Annual Conference 2024');
    });
  });

  describe('RecurringEvent Story', () => {
    test('renders with recurring event options', () => {
      const args = RecurringEvent.args as InterfaceDeleteModalProps;
      render(<DeleteModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Delete Recurring Event')).toBeInTheDocument();

      // Verify recurring event content is present
      expect(
        screen.getByText(
          'This is a recurring event. How would you like to proceed?',
        ),
      ).toBeInTheDocument();

      // Verify radio options
      expect(
        screen.getByText('Delete only this occurrence'),
      ).toBeInTheDocument();
      expect(screen.getByText('Delete all occurrences')).toBeInTheDocument();
      expect(
        screen.getByText('Delete this and all future occurrences'),
      ).toBeInTheDocument();
    });

    test('has correct recurring event configuration', () => {
      expect(RecurringEvent.args?.entityName).toBe('Weekly Team Meeting');
      expect(RecurringEvent.args?.showWarning).toBe(true);
      expect(RecurringEvent.args?.recurringEventContent).toBeDefined();
    });
  });

  describe('DeleteUser Story', () => {
    test('renders for user deletion', () => {
      const args = DeleteUser.args as InterfaceDeleteModalProps;
      render(<DeleteModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Delete User')).toBeInTheDocument();

      // Verify warning message is displayed (user-visible content)
      expect(
        screen.getByText(/This action cannot be undone\./),
      ).toBeInTheDocument();
    });

    test('has correct user deletion configuration', () => {
      expect(DeleteUser.args?.title).toBe('Delete User');
      expect(DeleteUser.args?.entityName).toBe('John Doe');
      expect(DeleteUser.args?.showWarning).toBe(true);
    });
  });

  describe('DeleteOrganization Story', () => {
    test('renders for organization deletion', () => {
      const args = DeleteOrganization.args as InterfaceDeleteModalProps;
      render(<DeleteModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Delete Organization')).toBeInTheDocument();

      // Verify warning message is displayed (user-visible content)
      expect(
        screen.getByText(/This action cannot be undone\./),
      ).toBeInTheDocument();
    });

    test('has correct organization deletion configuration', () => {
      expect(DeleteOrganization.args?.title).toBe('Delete Organization');
      expect(DeleteOrganization.args?.entityName).toBe('Tech Community Group');
      expect(DeleteOrganization.args?.showWarning).toBe(true);
    });
  });
});
