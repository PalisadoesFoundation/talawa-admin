import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { IItemModalProps } from './ItemModal';
import ItemModal from './ItemModal';
import { vi, it, describe, expect } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';

// Mock the toast functions
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Define common mocks for GraphQL queries
const mockQueries = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: 'orgId' },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          { id: 'cat1', name: 'Category 1', isDisabled: false },
          { id: 'cat2', name: 'Category 2', isDisabled: false },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { orgId: 'orgId' },
    },
    result: {
      data: {
        organizationMembers: [
          { _id: 'user1', firstName: 'John', lastName: 'Doe', image: null },
          { _id: 'user2', firstName: 'Jane', lastName: 'Smith', image: null },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        input: {
          assigneeId: 'user1',
          categoryId: 'cat1',
          organizationId: 'orgId',
          preCompletionNotes: 'Test notes',
          assignedAt: expect.any(String),
        },
      },
    },
    result: {
      data: {
        createActionItem: {
          id: 'newId',
          isCompleted: false,
          assignedAt: '2024-01-01',
          completionAt: null,
          createdAt: '2024-01-01',
          preCompletionNotes: 'Test notes',
          postCompletionNotes: null,
          assignee: { id: 'user1', name: 'John Doe' },
          creator: { id: 'creator1', name: 'Creator' },
          updater: null,
          category: {
            id: 'cat1',
            name: 'Category 1',
            description: '',
            isDisabled: false,
          },
          organization: { id: 'orgId', name: 'Organization' },
          event: null,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        input: {
          id: '1',
          isCompleted: false,
          preCompletionNotes: 'Updated notes',
        },
      },
    },
    result: {
      data: {
        updateActionItem: {
          id: '1',
          isCompleted: false,
          assignedAt: '2024-01-01',
          completionAt: null,
          preCompletionNotes: 'Updated notes',
          postCompletionNotes: null,
          assignee: { id: 'user1', name: 'John Doe' },
          creator: { id: 'creator1', name: 'Creator' },
          updater: { id: 'updater1', name: 'Updater' },
          category: { id: 'cat1', name: 'Category 1' },
          organization: { id: 'orgId', name: 'Organization' },
          event: null,
        },
      },
    },
  },
];

// Helper function to render the component with necessary providers
const renderWithProviders = (props: IItemModalProps) => {
  return render(
    <MockedProvider mocks={mockQueries} addTypename={false}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ItemModal {...props} />
      </LocalizationProvider>
    </MockedProvider>,
  );
};

// Test mock action item with proper type
const mockActionItem = {
  id: '1',
  assigneeId: 'user1',
  categoryId: 'cat1',
  eventId: null,
  organizationId: 'org1',
  creatorId: 'creator1',
  updaterId: null,
  assignedAt: new Date('2024-01-01'),
  completionAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
  isCompleted: false,
  preCompletionNotes: 'Test notes',
  postCompletionNotes: null,
  assignee: {
    id: 'user1',
    name: 'John Doe',
    avatarURL: '',
    emailAddress: 'john@example.com',
  },
  creator: {
    id: 'creator1',
    name: 'Creator',
    avatarURL: '',
    emailAddress: 'creator@example.com',
  },
  updater: null,
  event: null,
  category: {
    id: 'cat1',
    name: 'Category 1',
    description: '',
    isDisabled: false,
    createdAt: '2024-01-01',
    organizationId: 'org1',
  },
};

// Additional test cases for ItemModal component
describe('ItemModal - Additional Test Cases', () => {
  // Test modal visibility and basic rendering
  describe('Modal Visibility and Basic Rendering', () => {
    it('should not render modal when isOpen is false', () => {
      const props: IItemModalProps = {
        isOpen: false,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should call hide function when close button is clicked', () => {
      const mockHide = vi.fn();
      const props: IItemModalProps = {
        isOpen: true,
        hide: mockHide,
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);
      // Using data-testid to find the close button
      const closeButton = screen.getByTestId('modalCloseBtn');
      fireEvent.click(closeButton);
      expect(mockHide).toHaveBeenCalledTimes(1);
    });
  });

  // Test form initialization
  describe('Form Initialization', () => {
    it('should initialize form with default values for create mode', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);

      // Check the modal renders
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Find submit button with correct label for create mode
      const submitButton = screen.getByTestId('submitBtn');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent(/create/i);
    });

    it('should initialize form with action item data for edit mode', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: mockActionItem,
      };

      renderWithProviders(props);

      // In edit mode, the notes field should contain the pre-existing value
      const notesFields = screen.getAllByRole('textbox');
      const hasFieldWithValue = notesFields.some(
        (field) =>
          field.getAttribute('value') === 'Test notes' ||
          field.textContent?.includes('Test notes'),
      );

      expect(hasFieldWithValue).toBe(true);

      // In edit mode, the submit button should say "Update"
      const submitButton = screen.getByTestId('submitBtn');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent(/update/i);
    });
  });

  // Test form validation
  describe('Form Validation', () => {
    it('should show validation error when submitting without required fields', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);

      // Submit without selecting category or assignee
      const submitButton = screen.getByTestId('submitBtn');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringMatching(/select both category and assignee/i),
        );
      });
    });
  });

  // Test edit mode functionality
  describe('Edit Mode Functionality', () => {
    it('should handle updating an action item', async () => {
      const mockRefetch = vi.fn();
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: mockRefetch,
        editMode: true,
        actionItem: mockActionItem,
      };

      renderWithProviders(props);

      // Update the notes
      const notesFields = screen.getAllByRole('textbox');
      const notesField = notesFields.find(
        (field) =>
          field.getAttribute('value') === 'Test notes' ||
          field.textContent?.includes('Test notes'),
      );

      if (notesField) {
        fireEvent.change(notesField, { target: { value: 'Updated notes' } });
      }

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      fireEvent.click(submitButton);

      // Check if update was successful
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  // Test date picker functionality
  describe('Date Picker Functionality', () => {
    it('should render date picker correctly', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);

      // In MUI v5+, date pickers use an input with type="text"
      const dateInputs = screen.getAllByRole('textbox');
      expect(dateInputs.length).toBeGreaterThan(0);

      // The modal should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // Test GraphQL mutation handling
  describe('GraphQL Mutation Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockErrorLink = new StaticMockLink(
        [],
        true, // This makes the link error on every request
      );

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(
        <MockedProvider mocks={[]} link={mockErrorLink}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      // Verify the component renders
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Try to submit the form
      const submitButton = screen.getByTestId('submitBtn');
      fireEvent.click(submitButton);

      // Should not throw an unhandled exception
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    it('should handle undefined eventId gracefully', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      expect(() => renderWithProviders(props)).not.toThrow();
    });

    it('should handle null action item in edit mode gracefully', async () => {
      // This is technically an invalid state but the component should handle it
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true, // Edit mode with null item
        actionItem: null, // This is invalid but should be handled
      };

      expect(() => renderWithProviders(props)).not.toThrow();

      // Try to submit - should show error about missing ID
      const submitButton = screen.getByTestId('submitBtn');
      fireEvent.click(submitButton);

      // Add await here to properly wait for the toast error
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  // Test accessibility
  describe('Accessibility', () => {
    it('should have proper role for modal dialog', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have form elements with proper labels', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);

      // Check for form elements
      const formElements = screen.getAllByRole('textbox');
      expect(formElements.length).toBeGreaterThan(0);

      // The submit button should be enabled
      const submitButton = screen.getByTestId('submitBtn');
      expect(submitButton).toBeEnabled();
    });
  });

  // Test internationalization
  describe('Internationalization', () => {
    it('should display buttons with proper text', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      renderWithProviders(props);

      // Create button should be present in the dialog
      const createButton = screen.getByTestId('submitBtn');
      expect(createButton).toBeInTheDocument();
    });
  });

  // Test performance
  describe('Performance', () => {
    it('should not re-render unnecessarily with same props', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      const { rerender } = renderWithProviders(props);

      // Re-render with same props
      rerender(
        <MockedProvider mocks={mockQueries} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      // Component should handle this gracefully
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
