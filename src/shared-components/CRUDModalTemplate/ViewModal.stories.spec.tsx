import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BasicUsage,
  LoadingState,
  WithCustomActions,
  UserProfile,
  OrganizationDetails,
} from './ViewModal.stories';
import { ViewModal } from './ViewModal';
import type { InterfaceViewModalProps } from 'types/shared-components/CRUDModalTemplate/interface';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        close: 'Close',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ViewModal Stories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('BasicUsage Story', () => {
    test('renders with entity details', () => {
      const args = BasicUsage.args as InterfaceViewModalProps;
      render(<ViewModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('View Item Details')).toBeInTheDocument();

      // Verify content is displayed
      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText('Sample Item')).toBeInTheDocument();
      expect(screen.getByText('Description:')).toBeInTheDocument();

      // Verify close button
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    test('has correct args configuration', () => {
      expect(BasicUsage.args?.title).toBe('View Item Details');
      expect(BasicUsage.args?.loadingData).toBe(false);
      expect(BasicUsage.args?.children).toBeDefined();
    });
  });

  describe('LoadingState Story', () => {
    test('renders with loading state', () => {
      const args = LoadingState.args as InterfaceViewModalProps;
      render(<ViewModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('View Item Details')).toBeInTheDocument();

      // Verify loading state is shown
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    test('has correct loadingData configuration', () => {
      expect(LoadingState.args?.loadingData).toBe(true);
      expect(LoadingState.args?.title).toBe('View Item Details');
    });
  });

  describe('WithCustomActions Story', () => {
    test('renders with custom action buttons', () => {
      const args = WithCustomActions.args as InterfaceViewModalProps;
      render(<ViewModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('View Event Details')).toBeInTheDocument();

      // Verify custom action buttons
      expect(screen.getByText('Edit Event')).toBeInTheDocument();
      expect(screen.getByText('Delete Event')).toBeInTheDocument();

      // Verify content
      expect(screen.getByText('Event Name:')).toBeInTheDocument();
      expect(screen.getByText('Annual Conference 2024')).toBeInTheDocument();
    });

    test('has correct custom actions configuration', () => {
      expect(WithCustomActions.args?.customActions).toBeDefined();
      expect(WithCustomActions.args?.loadingData).toBe(false);
    });
  });

  describe('UserProfile Story', () => {
    test('renders user profile information', () => {
      const args = UserProfile.args as InterfaceViewModalProps;
      render(<ViewModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('View User Profile')).toBeInTheDocument();

      // Verify user information
      expect(screen.getByText('Full Name:')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Role:')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    test('has correct user profile configuration', () => {
      expect(UserProfile.args?.title).toBe('View User Profile');
      expect(UserProfile.args?.loadingData).toBe(false);
      expect(UserProfile.args?.children).toBeDefined();
    });
  });

  describe('OrganizationDetails Story', () => {
    test('renders organization details with custom actions', () => {
      const args = OrganizationDetails.args as InterfaceViewModalProps;
      render(<ViewModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('View Organization')).toBeInTheDocument();

      // Verify organization information
      expect(screen.getByText('Organization Name:')).toBeInTheDocument();
      expect(screen.getByText('Tech Community Group')).toBeInTheDocument();
      expect(screen.getByText('Members:')).toBeInTheDocument();
      expect(screen.getByText('1,234 members')).toBeInTheDocument();

      // Verify custom action buttons
      expect(screen.getByText('View Members')).toBeInTheDocument();
      expect(screen.getByText('Edit Organization')).toBeInTheDocument();
    });

    test('has correct organization configuration', () => {
      expect(OrganizationDetails.args?.title).toBe('View Organization');
      expect(OrganizationDetails.args?.customActions).toBeDefined();
      expect(OrganizationDetails.args?.loadingData).toBe(false);
    });
  });
});
