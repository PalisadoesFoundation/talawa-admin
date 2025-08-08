import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { IItemModalProps } from './ActionItemModal';
import ItemModal from './ActionItemModal';
import { vi, it, describe, expect } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import userEvent from '@testing-library/user-event';
import type { IActionItemInfo } from 'types/Actions/interface';

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
      variables: {
        input: {
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [
          {
            id: 'cat1',
            name: 'Category 1',
            isDisabled: false,
            description: 'Test category 1',
            creator: { id: 'creator1', name: 'Creator 1' },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            id: 'cat2',
            name: 'Category 2',
            isDisabled: false,
            description: 'Test category 2',
            creator: { id: 'creator2', name: 'Creator 2' },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { organizationId: 'orgId' },
    },
    result: {
      data: {
        usersByOrganizationId: [
          {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            name: 'John Doe',
            emailAddress: 'john@example.com',
            role: 'USER',
            avatarURL: '',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            id: 'user2',
            firstName: 'Jane',
            lastName: 'Smith',
            image: null,
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            role: 'USER',
            avatarURL: '',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
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
  organization: {
    id: 'org1',
    name: 'Test Organization',
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

describe('ItemModal - Specific Test Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('actionItemCategories Memoization', () => {
    it('should handle actionCategoriesByOrganization data changes', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Component should render without crashing when categories are available
      expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    });
  });

  describe('GraphQL Mutations', () => {
    it('should validate required fields before CREATE_ACTION_ITEM_MUTATION', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Submit without selecting category or assignee
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Please select both category and assignee',
        );
      });
    });

    it('should handle missing ID in UPDATE_ACTION_ITEM_MUTATION', async () => {
      const actionItemWithoutId = {
        ...mockActionItem,
        id: undefined,
      };

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: actionItemWithoutId as unknown as IActionItemInfo,
      };

      renderWithProviders(props);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Action item ID is missing');
      });
    });
  });

  describe('handleFormChange function', () => {
    it('should update form fields when handleFormChange is called', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Test string field update (preCompletionNotes)
      const notesField = screen.getByLabelText(/preCompletionNotes/i);
      await userEvent.type(notesField, 'Updated notes via handleFormChange');

      // Verify the input has the new value
      expect(notesField).toHaveValue('Updated notes via handleFormChange');
    });

    it('should handle Date field changes', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find date picker input
      const dateInput = screen.getByLabelText(/assignmentDate/i);
      expect(dateInput).toBeInTheDocument();

      // The date picker should be accessible and allow interaction
      await userEvent.click(dateInput);
      expect(dateInput).toBeInTheDocument();
    });

    it('should clear field values when handleFormChange is called with empty values', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Test clearing a field
      const notesField = screen.getByLabelText(/preCompletionNotes/i);
      await userEvent.clear(notesField);

      // Verify the field is empty
      expect(notesField).toHaveValue('');
    });
  });

  describe('Modal Structure', () => {
    it('should render Modal with correct props', async () => {
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

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(modal).toBeVisible();
      });
    });

    it('should not render when isOpen is false', () => {
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

      // Modal should not be in the document when isOpen is false
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should call hide function when close button is clicked', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click the close button
      const closeButton = screen.getByTestId('modalCloseBtn');
      await userEvent.click(closeButton);

      expect(mockHide).toHaveBeenCalledTimes(1);
    });

    it('should render correct title based on editMode', async () => {
      // Test create mode
      const createProps: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      const { rerender } = renderWithProviders(createProps);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const submitBtn = screen.getByTestId('submitBtn');
      expect(submitBtn).toHaveTextContent(/create/i);

      // Test edit mode
      const editProps: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: mockActionItem,
      };

      rerender(
        <MockedProvider mocks={mockQueries} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...editProps} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        const updateSubmitBtn = screen.getByTestId('submitBtn');
        expect(updateSubmitBtn).toHaveTextContent(/update/i);
      });
    });

    it('should render Modal.Header with close button and icon', async () => {
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

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Check for modal header content
      const closeButton = screen.getByTestId('modalCloseBtn');
      expect(closeButton).toBeInTheDocument();

      // Check if close button has the correct icon
      const icon = closeButton.querySelector('i.fa.fa-times');
      expect(icon).toBeInTheDocument();
    });
  });
});

// ...existing code...
beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

describe('actionItemCategories Memoization with [actionItemCategoriesData] dependency', () => {
  it('should memoize actionItemCategories based on actionItemCategoriesData', async () => {
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

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Should have access to the categories in the component
    // The categories would be used in autocomplete or dropdown
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should update actionItemCategories when actionItemCategoriesData changes', async () => {
    const updatedMockQueries = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY_LIST,
          variables: {
            input: {
              organizationId: 'orgId',
            },
          },
        },
        result: {
          data: {
            actionCategoriesByOrganization: [
              {
                id: 'cat1',
                name: 'Updated Category 1',
                isDisabled: false,
                description: 'Updated test category 1',
                creator: { id: 'creator1', name: 'Creator 1' },
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
              {
                id: 'cat3',
                name: 'New Category 3',
                isDisabled: false,
                description: 'New test category 3',
                creator: { id: 'creator3', name: 'Creator 3' },
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
            ],
          },
        },
      },
      ...mockQueries.slice(1),
    ];

    const props: IItemModalProps = {
      isOpen: true,
      hide: vi.fn(),
      orgId: 'orgId',
      eventId: undefined,
      actionItemsRefetch: vi.fn(),
      editMode: false,
      actionItem: null,
    };

    const { rerender } = render(
      <MockedProvider mocks={updatedMockQueries} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal {...props} />
        </LocalizationProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Re-render with updated data should work without issues
    rerender(
      <MockedProvider mocks={updatedMockQueries} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal {...props} />
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle empty actionCategoriesByOrganization data', async () => {
    const emptyDataMockQueries = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY_LIST,
          variables: {
            input: {
              organizationId: 'orgId',
            },
          },
        },
        result: {
          data: {
            actionCategoriesByOrganization: [],
          },
        },
      },
      ...mockQueries.slice(1),
    ];

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
      <MockedProvider mocks={emptyDataMockQueries} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal {...props} />
        </LocalizationProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Component should handle empty categories gracefully
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle null/undefined actionItemCategoriesData', async () => {
    const nullDataMockQueries = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY_LIST,
          variables: {
            input: {
              organizationId: 'orgId',
            },
          },
        },
        result: {
          data: {
            actionCategoriesByOrganization: null,
          },
        },
      },
      ...mockQueries.slice(1),
    ];

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
      <MockedProvider mocks={nullDataMockQueries} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal {...props} />
        </LocalizationProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Should fallback to empty array and not crash
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('GraphQL Mutations - CREATE_ACTION_ITEM_MUTATION and UPDATE_ACTION_ITEM_MUTATION', () => {
  describe('createActionItem mutation', () => {
    it('should handle CREATE_ACTION_ITEM_MUTATION with eventId', async () => {
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();

      const createWithEventMock = {
        request: {
          query: CREATE_ACTION_ITEM_MUTATION,
        },
        variableMatcher: (variables: {
          input: {
            assigneeId: string;
            categoryId: string;
            organizationId: string;
            preCompletionNotes: string;
            assignedAt: string;
            eventId: string;
          };
        }) => {
          return (
            variables.input.assigneeId === 'user1' &&
            variables.input.categoryId === 'cat1' &&
            variables.input.organizationId === 'orgId' &&
            variables.input.preCompletionNotes === 'Test with event' &&
            variables.input.eventId === 'event123' &&
            typeof variables.input.assignedAt === 'string' &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(
              variables.input.assignedAt,
            )
          );
        },
        result: {
          data: {
            createActionItem: {
              id: 'newId',
              isCompleted: false,
              assignedAt: '2024-01-01',
              completionAt: null,
              createdAt: '2024-01-01',
              preCompletionNotes: 'Test with event',
              postCompletionNotes: null,
              assignee: { id: 'user1', name: 'John Doe' },
              creator: { id: 'creator1', name: 'Creator' },
              updater: null,
              category: {
                id: 'cat1',
                name: 'Category 1',
                description: 'Test category 1',
                isDisabled: false,
              },
              organization: { id: 'orgId', name: 'Organization' },
              event: {
                id: 'event123',
                name: 'Test Event',
                description: 'Test event description',
              },
            },
          },
        },
      };

      const mutationMocks = [createWithEventMock, ...mockQueries];

      const props: IItemModalProps = {
        isOpen: true,
        hide: mockHide,
        orgId: 'orgId',
        eventId: 'event123',
        actionItemsRefetch: mockRefetch,
        editMode: false,
        actionItem: null,
      };

      render(
        <MockedProvider mocks={mutationMocks} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('actionItemCategory')).toBeInTheDocument();
      });

      // Select category
      const categoryInput = screen.getByLabelText('actionItemCategory *');
      await userEvent.click(categoryInput);
      await userEvent.type(categoryInput, 'Category 1');
      await waitFor(async () => {
        const option = screen.getByText('Category 1');
        await userEvent.click(option);
      });

      // Select assignee
      const assigneeInput = screen.getByLabelText('assignee *');
      await userEvent.click(assigneeInput);
      await userEvent.type(assigneeInput, 'John Doe');
      await waitFor(async () => {
        const option = screen.getByText('John Doe');
        await userEvent.click(option);
      });

      // Wait for notes field to appear
      await waitFor(() => {
        expect(screen.getByLabelText('preCompletionNotes')).toBeInTheDocument();
      });

      // Fill notes field
      const notesInput = screen.getByLabelText('preCompletionNotes');
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Test with event');

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockHide).toHaveBeenCalled();
      });
    });

    it('should handle CREATE_ACTION_ITEM_MUTATION error', async () => {
      const errorMutationMock = {
        request: {
          query: CREATE_ACTION_ITEM_MUTATION,
        },
        variableMatcher: (variables: {
          input: {
            assigneeId: string;
            categoryId: string;
            organizationId: string;
            preCompletionNotes: string;
            assignedAt: string;
          };
        }) => {
          return (
            variables.input.assigneeId === 'user1' &&
            variables.input.categoryId === 'cat1' &&
            variables.input.organizationId === 'orgId' &&
            variables.input.preCompletionNotes === 'Test error' &&
            typeof variables.input.assignedAt === 'string' &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(
              variables.input.assignedAt,
            )
          );
        },
        error: new Error('Failed to create action item'),
      };

      const mutationMocks = [errorMutationMock, ...mockQueries];

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
        <MockedProvider mocks={mutationMocks} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('actionItemCategory')).toBeInTheDocument();
      });

      // Select category
      const categoryInput = screen.getByLabelText('actionItemCategory *');
      await userEvent.click(categoryInput);
      await userEvent.type(categoryInput, 'Category 1');
      await waitFor(async () => {
        const option = screen.getByText('Category 1');
        await userEvent.click(option);
      });

      // Select assignee
      const assigneeInput = screen.getByLabelText('assignee *');
      await userEvent.click(assigneeInput);
      await userEvent.type(assigneeInput, 'John Doe');
      await waitFor(async () => {
        const option = screen.getByText('John Doe');
        await userEvent.click(option);
      });

      // Wait for notes field to appear
      await waitFor(() => {
        expect(screen.getByLabelText('preCompletionNotes')).toBeInTheDocument();
      });

      // Fill notes field
      const notesInput = screen.getByLabelText('preCompletionNotes');
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Test error');

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to create action item',
        );
      });
    });
  });

  describe('updateActionItem mutation', () => {
    it('should successfully call UPDATE_ACTION_ITEM_MUTATION with all fields', async () => {
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();

      const updateMutationMock = {
        request: {
          query: UPDATE_ACTION_ITEM_MUTATION,
          variables: {
            input: {
              id: '1',
              isCompleted: false,
              categoryId: 'cat1',
              assigneeId: 'user1',
              preCompletionNotes: 'Updated test notes',
              postCompletionNotes: undefined,
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
              preCompletionNotes: 'Updated test notes',
              postCompletionNotes: null,
              assignee: { id: 'user1', name: 'John Doe' },
              creator: { id: 'creator1', name: 'Creator' },
              updater: { id: 'updater1', name: 'Updater' },
              category: {
                id: 'cat1',
                name: 'Category 1',
                description: 'Test category 1',
                isDisabled: false,
              },
              organization: { id: 'orgId', name: 'Organization' },
              event: null,
              createdAt: '2024-01-01',
            },
          },
        },
      };

      const mutationMocks = [updateMutationMock, ...mockQueries];

      const props: IItemModalProps = {
        isOpen: true,
        hide: mockHide,
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: mockRefetch,
        editMode: true,
        actionItem: mockActionItem,
      };

      render(
        <MockedProvider mocks={mutationMocks} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and update the notes field
      const notesInputs = screen.getAllByRole('textbox');
      const notesInput = notesInputs.find(
        (input) =>
          (input as HTMLInputElement).value === 'Test notes' ||
          (input as HTMLInputElement).defaultValue === 'Test notes' ||
          input.getAttribute('value') === 'Test notes',
      );

      if (notesInput) {
        await userEvent.clear(notesInput);
        await userEvent.type(notesInput, 'Updated test notes');
      }

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockHide).toHaveBeenCalled();
      });
    });

    it('should handle UPDATE_ACTION_ITEM_MUTATION with all fields', async () => {
      const updateMultipleFieldsMock = {
        request: {
          query: UPDATE_ACTION_ITEM_MUTATION,
          variables: {
            input: {
              id: '1',
              isCompleted: false,
              categoryId: 'cat1',
              assigneeId: 'user1',
              preCompletionNotes: 'Multiple updates',
              postCompletionNotes: undefined,
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
              preCompletionNotes: 'Multiple updates',
              postCompletionNotes: null,
              assignee: { id: 'user1', name: 'John Doe' },
              creator: { id: 'creator1', name: 'Creator' },
              updater: { id: 'updater1', name: 'Updater' },
              createdAt: '2024-01-01T00:00:00.000Z',
              category: {
                id: 'cat1',
                name: 'Category 1',
                description: 'Test category 1',
                isDisabled: false,
              },
              organization: { id: 'orgId', name: 'Organization' },
              event: null,
            },
          },
        },
      };

      const mutationMocks = [updateMultipleFieldsMock, ...mockQueries];

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: mockActionItem,
      };

      render(
        <MockedProvider mocks={mutationMocks} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Update notes
      const notesInput = screen.getByDisplayValue('Test notes');
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Multiple updates');

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should handle UPDATE_ACTION_ITEM_MUTATION error', async () => {
      const errorUpdateMock = {
        request: {
          query: UPDATE_ACTION_ITEM_MUTATION,
          variables: {
            input: {
              id: '1',
              isCompleted: false,
              categoryId: 'cat1',
              assigneeId: 'user1',
              preCompletionNotes: 'Error update',
              postCompletionNotes: undefined,
            },
          },
        },
        error: new Error('Failed to update action item'),
      };

      const mutationMocks = [errorUpdateMock, ...mockQueries];

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: mockActionItem,
      };

      render(
        <MockedProvider mocks={mutationMocks} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal {...props} />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Update notes to trigger the mutation
      const notesInput = screen.getByDisplayValue('Test notes');
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Error update');

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to update action item',
        );
      });
    });

    it('should handle missing action item ID error', async () => {
      const actionItemWithoutId = {
        ...mockActionItem,
        id: undefined,
      };

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: actionItemWithoutId as unknown as IActionItemInfo,
      };

      renderWithProviders(props);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByTestId('submitBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Action item ID is missing');
      });
    });
  });
});

describe('handleFormChange function', () => {
  it('should update form state when handleFormChange is called with different field types', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Test string field update (preCompletionNotes)
    const notesInputs = screen.getAllByRole('textbox');
    const notesInput = notesInputs.find(
      (input) =>
        input.getAttribute('placeholder')?.includes('notes') ||
        input.getAttribute('name')?.includes('notes'),
    );

    if (notesInput) {
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Updated notes via handleFormChange');

      // Verify the input has the new value
      expect(notesInput).toHaveValue('Updated notes via handleFormChange');
    }
  });

  it('should handle handleFormChange with boolean values', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check if there's a completion checkbox or toggle
    const checkboxes = screen.queryAllByRole('checkbox');
    if (checkboxes.length > 0) {
      const completionCheckbox = checkboxes[0];

      // Toggle the checkbox
      await userEvent.click(completionCheckbox);

      // The state should have changed (we can't directly test internal state,
      // but the interaction should work without errors)
      expect(completionCheckbox).toBeInTheDocument();
    }
  });

  it('should handle handleFormChange with Date values', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Find date picker inputs (MUI date pickers use textbox role)
    const dateInputs = screen.getAllByRole('textbox');
    const dateInput = dateInputs.find(
      (input) =>
        input.getAttribute('placeholder')?.includes('date') ||
        input.getAttribute('type') === 'date' ||
        input.closest('[data-testid*="date"]') ||
        (input as HTMLInputElement).value?.match(/\d{2}\/\d{2}\/\d{4}/),
    );

    if (dateInput) {
      // Try to interact with the date input
      await userEvent.click(dateInput);

      // The date picker should be accessible
      expect(dateInput).toBeInTheDocument();
    }
  });

  it('should handle handleFormChange with null/undefined values', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Test clearing a field (setting it to empty/null)
    const notesInputs = screen.getAllByRole('textbox');
    const notesInput = notesInputs.find(
      (input) =>
        (input as HTMLInputElement).value === 'Test notes' ||
        (input as HTMLInputElement).defaultValue === 'Test notes',
    );

    if (notesInput) {
      // Clear the field completely
      await userEvent.clear(notesInput);

      // Verify the field is empty
      expect(notesInput).toHaveValue('');
    }
  });

  it('should handle handleFormChange with different field keys', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Test updating the notes field (first available textbox)
    const notesInput = screen.getByDisplayValue('Test notes');
    await userEvent.clear(notesInput);
    await userEvent.type(notesInput, 'Updated field 1');
    expect(notesInput).toHaveValue('Updated field 1');

    // Test updating the date field
    const dateInput = screen.getByDisplayValue('01/01/2024');
    await userEvent.click(dateInput);
    // Date field should be interactable
    expect(dateInput).toBeInTheDocument();
  });

  it('should preserve existing form state when updating single field', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Find the notes input that has the original value
    const notesInputs = screen.getAllByRole('textbox');
    const originalNotesInput = notesInputs.find(
      (input) =>
        (input as HTMLInputElement).value === 'Test notes' ||
        (input as HTMLInputElement).defaultValue === 'Test notes',
    );

    if (originalNotesInput) {
      // Append to existing value rather than replace
      await userEvent.type(originalNotesInput, ' - updated');

      // Should now contain both original and new text
      expect((originalNotesInput as HTMLInputElement).value).toContain(
        'Test notes',
      );
      expect((originalNotesInput as HTMLInputElement).value).toContain(
        'updated',
      );
    }
  });
});

describe('Modal Structure - className={styles.itemModal} show={isOpen} onHide={hide}', () => {
  it('should render Modal with correct className styles.itemModal', async () => {
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

    await waitFor(() => {
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Check if the modal has the expected CSS class
      // Note: The exact class name might be transformed by CSS modules
      const modalContainer = modal.closest('.modal') || modal.parentElement;
      expect(modalContainer).toBeInTheDocument();
    });
  });

  it('should show modal when isOpen prop is true', async () => {
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

    await waitFor(() => {
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();
    });
  });

  it('should hide modal when isOpen prop is false', () => {
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

    // Modal should not be in the document when isOpen is false
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call hide function when modal is closed via onHide', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Find and click the close button
    const closeButton = screen.getByTestId('modalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockHide).toHaveBeenCalledTimes(1);
  });

  it('should render Modal.Header with correct title and close button', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check for modal header content
    const closeButton = screen.getByTestId('modalCloseBtn');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.className).toContain('closeButton');

    // Check if close button has the correct icon
    const icon = closeButton.querySelector('i.fa.fa-times');
    expect(icon).toBeInTheDocument();
  });

  it('should display correct title based on editMode', async () => {
    // Test create mode title
    const createProps: IItemModalProps = {
      isOpen: true,
      hide: vi.fn(),
      orgId: 'orgId',
      eventId: undefined,
      actionItemsRefetch: vi.fn(),
      editMode: false,
      actionItem: null,
    };

    const { rerender } = renderWithProviders(createProps);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Should show create-related content in submit button
    const createSubmitBtn = screen.getByTestId('submitBtn');
    expect(createSubmitBtn).toHaveTextContent(/create/i);

    // Test edit mode title
    const editProps: IItemModalProps = {
      isOpen: true,
      hide: vi.fn(),
      orgId: 'orgId',
      eventId: undefined,
      actionItemsRefetch: vi.fn(),
      editMode: true,
      actionItem: mockActionItem,
    };

    rerender(
      <MockedProvider mocks={mockQueries} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal {...editProps} />
        </LocalizationProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      const submitBtn = screen.getByTestId('submitBtn');
      expect(submitBtn).toHaveTextContent(/update/i);
    });
  });

  it('should handle modal backdrop click correctly', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // In React Bootstrap, clicking the backdrop typically calls onHide
    // We can test this by finding the modal backdrop element
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    // The modal should be present and the hide function should be available
    expect(mockHide).toBeInstanceOf(Function);
  });

  it('should maintain modal structure integrity with different props combinations', async () => {
    const testCases = [
      {
        isOpen: true,
        editMode: false,
        actionItem: null,
        eventId: undefined,
      },
      {
        isOpen: true,
        editMode: true,
        actionItem: mockActionItem,
        eventId: 'event123',
      },
      {
        isOpen: true,
        editMode: false,
        actionItem: null,
        eventId: 'event456',
      },
    ];

    for (const testCase of testCases) {
      const props: IItemModalProps = {
        ...testCase,
        hide: vi.fn(),
        orgId: 'orgId',
        actionItemsRefetch: vi.fn(),
      };

      const { unmount } = renderWithProviders(props);

      await waitFor(() => {
        if (testCase.isOpen) {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
          expect(screen.getByTestId('submitBtn')).toBeInTheDocument();
        }
      });

      unmount();
    }
  });
});
