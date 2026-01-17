import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BasicUsage,
  LoadingState,
  SubmitDisabled,
  ComplexForm,
} from './CreateModal.stories';
import { CreateModal } from './CreateModal';
import type { InterfaceCreateModalProps } from 'types/shared-components/CRUDModalTemplate/interface';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        create: 'Create',
        cancel: 'Cancel',
      };
      return translations[key] || key;
    },
  }),
}));

describe('CreateModal Stories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('BasicUsage Story', () => {
    test('renders with basic form fields', () => {
      const args = BasicUsage.args as InterfaceCreateModalProps;
      render(<CreateModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Create New Item')).toBeInTheDocument();

      // Verify form fields are present
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Verify buttons
      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('has correct args configuration', () => {
      expect(BasicUsage.args?.title).toBe('Create New Item');
      expect(BasicUsage.args?.loading).toBe(false);
      expect(BasicUsage.args?.submitDisabled).toBe(false);
    });
  });

  describe('LoadingState Story', () => {
    test('renders with loading state', () => {
      const args = LoadingState.args as InterfaceCreateModalProps;
      render(<CreateModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Create New Item')).toBeInTheDocument();

      // Verify loading indicator is shown
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    test('has correct loading configuration', () => {
      expect(LoadingState.args?.loading).toBe(true);
      expect(LoadingState.args?.title).toBe('Create New Item');
    });
  });

  describe('SubmitDisabled Story', () => {
    test('renders with disabled submit button', () => {
      const args = SubmitDisabled.args as InterfaceCreateModalProps;
      render(<CreateModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Create New Item')).toBeInTheDocument();

      // Verify submit button is disabled
      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toBeDisabled();
    });

    test('has correct submitDisabled configuration', () => {
      expect(SubmitDisabled.args?.submitDisabled).toBe(true);
      expect(SubmitDisabled.args?.loading).toBe(false);
    });
  });

  describe('ComplexForm Story', () => {
    test('renders with multiple form fields', () => {
      const args = ComplexForm.args as InterfaceCreateModalProps;
      render(<CreateModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Create New Event')).toBeInTheDocument();

      // Verify all form fields are present
      expect(screen.getByText('Event Name')).toBeInTheDocument();
      expect(screen.getByText('Event Date')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Verify select options
      expect(screen.getByText('Select category')).toBeInTheDocument();
    });

    test('has correct complex form configuration', () => {
      expect(ComplexForm.args?.title).toBe('Create New Event');
      expect(ComplexForm.args?.loading).toBe(false);
      expect(ComplexForm.args?.submitDisabled).toBe(false);
      expect(ComplexForm.args?.children).toBeDefined();
    });
  });
});
