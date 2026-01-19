import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BasicUsage,
  LoadingData,
  SubmittingState,
  SubmitDisabled,
  ComplexForm,
} from './EditModal.stories';
import { EditModal } from './EditModal';
import type { InterfaceEditModalProps } from 'types/shared-components/CRUDModalTemplate/interface';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        saveChanges: 'Save Changes',
        update: 'Update',
        cancel: 'Cancel',
      };
      return translations[key] || key;
    },
  }),
}));

describe('EditModal Stories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('BasicUsage Story', () => {
    test('renders with pre-populated form fields', () => {
      const args = BasicUsage.args as InterfaceEditModalProps;
      render(<EditModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Edit Item')).toBeInTheDocument();

      // Verify form fields are present with values
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Verify buttons
      expect(screen.getByText('Update')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('has correct args configuration', () => {
      expect(BasicUsage.args?.title).toBe('Edit Item');
      expect(BasicUsage.args?.loading).toBe(false);
      expect(BasicUsage.args?.loadingData).toBe(false);
      expect(BasicUsage.args?.submitDisabled).toBe(false);
    });
  });

  describe('LoadingData Story', () => {
    test('renders with data loading state', () => {
      const args = LoadingData.args as InterfaceEditModalProps;
      render(<EditModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Edit Item')).toBeInTheDocument();

      // Verify loading state is shown
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    test('has correct loadingData configuration', () => {
      expect(LoadingData.args?.loadingData).toBe(true);
      expect(LoadingData.args?.loading).toBe(false);
    });
  });

  describe('SubmittingState Story', () => {
    test('renders with submitting state', () => {
      const args = SubmittingState.args as InterfaceEditModalProps;
      render(<EditModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Edit Item')).toBeInTheDocument();

      // Verify loading indicator is shown on button
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    test('has correct loading configuration', () => {
      expect(SubmittingState.args?.loading).toBe(true);
      expect(SubmittingState.args?.loadingData).toBe(false);
    });
  });

  describe('SubmitDisabled Story', () => {
    test('renders with disabled submit button', () => {
      const args = SubmitDisabled.args as InterfaceEditModalProps;
      render(<EditModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Edit Item')).toBeInTheDocument();

      // Verify submit button is disabled
      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toBeDisabled();
    });

    test('has correct submitDisabled configuration', () => {
      expect(SubmitDisabled.args?.submitDisabled).toBe(true);
      expect(SubmitDisabled.args?.loading).toBe(false);
      expect(SubmitDisabled.args?.loadingData).toBe(false);
    });
  });

  describe('ComplexForm Story', () => {
    test('renders with multiple form fields', () => {
      const args = ComplexForm.args as InterfaceEditModalProps;
      render(<EditModal {...args} open={true} />);

      // Verify modal title
      expect(screen.getByText('Edit Event')).toBeInTheDocument();

      // Verify all form fields are present
      expect(screen.getByText('Event Name')).toBeInTheDocument();
      expect(screen.getByText('Event Date')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();

      // Verify checkbox
      expect(screen.getByText('Make this event public')).toBeInTheDocument();
    });

    test('has correct complex form configuration', () => {
      expect(ComplexForm.args?.title).toBe('Edit Event');
      expect(ComplexForm.args?.loading).toBe(false);
      expect(ComplexForm.args?.loadingData).toBe(false);
      expect(ComplexForm.args?.submitDisabled).toBe(false);
      expect(ComplexForm.args?.children).toBeDefined();
    });
  });
});
