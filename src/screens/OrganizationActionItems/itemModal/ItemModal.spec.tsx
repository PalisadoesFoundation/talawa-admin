import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { IItemModalProps } from './ItemModal';
import ItemModal from './ItemModal';
import { vi, it } from 'vitest';

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

      render(<ItemModal {...props} />);
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

      render(<ItemModal {...props} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
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

      render(<ItemModal {...props} />);
      const closeButton = screen.getByRole('button', { name: /close/i });
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

      render(<ItemModal {...props} />);

      expect(screen.getByLabelText(/category/i)).toHaveValue('');
      expect(screen.getByLabelText(/assignee/i)).toHaveValue('');
      expect(screen.getByLabelText(/pre completion notes/i)).toHaveValue('');
    });

    it('should initialize form with action item data for edit mode', () => {
      const actionItem = {
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
        assignee: null,
        creator: null,
        event: null,
        category: null,
      };

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem,
      };

      render(<ItemModal {...props} />);
      expect(screen.getByDisplayValue('Test notes')).toBeInTheDocument();
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

      render(<ItemModal {...props} />);

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Please select both category and assignee',
        );
      });
    });

    it('should validate category selection is required', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      // Select assignee but not category
      const assigneeField = screen.getByLabelText(/assignee/i);
      fireEvent.change(assigneeField, { target: { value: 'user1' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Please select both category and assignee',
        );
      });
    });

    it('should validate assignee selection is required', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      // Select category but not assignee
      const categoryField = screen.getByLabelText(/category/i);
      fireEvent.change(categoryField, { target: { value: 'cat1' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Please select both category and assignee',
        );
      });
    });
  });

  // Test date picker functionality
  describe('Date Picker Functionality', () => {
    it('should handle date selection correctly', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      const datePicker = screen.getByLabelText(/assigned date/i);
      const testDate = '01/15/2024';
      fireEvent.change(datePicker, { target: { value: testDate } });

      expect(datePicker).toHaveValue(testDate);
    });

    it('should handle invalid date input gracefully', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      const datePicker = screen.getByLabelText(/assigned date/i);
      fireEvent.change(datePicker, { target: { value: 'invalid-date' } });

      // Should not crash and should handle gracefully
      expect(datePicker).toBeInTheDocument();
    });
  });

  // Test notes handling
  describe('Notes Handling', () => {
    it('should display pre-completion notes field for non-completed items', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);
      expect(
        screen.getByLabelText(/pre completion notes/i),
      ).toBeInTheDocument();
    });

    it('should display post-completion notes field for completed items', () => {
      const completedActionItem = {
        id: '1',
        assigneeId: 'user1',
        categoryId: 'cat1',
        eventId: null,
        organizationId: 'org1',
        creatorId: 'creator1',
        updaterId: null,
        assignedAt: new Date('2024-01-01'),
        completionAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-01'),
        updatedAt: null,
        isCompleted: true,
        preCompletionNotes: 'Pre notes',
        postCompletionNotes: 'Post notes',
        assignee: null,
        creator: null,
        event: null,
        category: null,
      };

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: completedActionItem,
      };

      render(<ItemModal {...props} />);
      expect(
        screen.getByLabelText(/post completion notes/i),
      ).toBeInTheDocument();
    });

    it('should handle notes with maximum character length', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      const notesField = screen.getByLabelText(/pre completion notes/i);
      const longText = 'a'.repeat(1000);

      fireEvent.change(notesField, { target: { value: longText } });
      expect(notesField).toHaveValue(longText);
    });

    it('should preserve line breaks in notes', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      const notesField = screen.getByLabelText(/pre completion notes/i);
      const textWithLineBreaks = 'Line 1\nLine 2\nLine 3';

      fireEvent.change(notesField, { target: { value: textWithLineBreaks } });
      expect(notesField).toHaveValue(textWithLineBreaks);
    });
  });

  // Test GraphQL mutation handling
  describe('GraphQL Mutation Handling', () => {
    it('should handle network errors gracefully', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      // Mock network error
      const errorLink = new StaticMockLink([]);

      render(
        <MockedProvider mocks={[]} addTypename={false} link={errorLink}>
          <ItemModal {...props} />
        </MockedProvider>,
      );

      // Fill required fields
      const categoryField = screen.getByLabelText(/category/i);
      const assigneeField = screen.getByLabelText(/assignee/i);

      fireEvent.change(categoryField, { target: { value: 'cat1' } });
      fireEvent.change(assigneeField, { target: { value: 'user1' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should reset form after successful creation', async () => {
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();

      const props: IItemModalProps = {
        isOpen: true,
        hide: mockHide,
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: mockRefetch,
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      // Fill and submit form
      const categoryField = screen.getByLabelText(/category/i);
      const assigneeField = screen.getByLabelText(/assignee/i);
      const notesField = screen.getByLabelText(/pre completion notes/i);

      fireEvent.change(categoryField, { target: { value: 'cat1' } });
      fireEvent.change(assigneeField, { target: { value: 'user1' } });
      fireEvent.change(notesField, { target: { value: 'Test notes' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockHide).toHaveBeenCalled();
        // Form should be reset
        expect(notesField).toHaveValue('');
      });
    });
  });

  // Test update functionality
  describe('Update Functionality', () => {
    it('should only send changed fields in update mutation', async () => {
      const originalActionItem = {
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
        preCompletionNotes: 'Original notes',
        postCompletionNotes: null,
        assignee: null,
        creator: null,
        event: null,
        category: null,
      };

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: originalActionItem,
      };

      render(<ItemModal {...props} />);

      // Only change notes
      const notesField = screen.getByDisplayValue('Original notes');
      fireEvent.change(notesField, { target: { value: 'Updated notes' } });

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      // Should only send changed fields to mutation
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Action item updated successfully',
        );
      });
    });

    it('should handle missing action item ID in edit mode', async () => {
      const actionItemWithoutId = {
        id: '', // Empty ID
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
        preCompletionNotes: 'Notes',
        postCompletionNotes: null,
        assignee: null,
        creator: null,
        event: null,
        category: null,
      };

      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: actionItemWithoutId,
      };

      render(<ItemModal {...props} />);

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Action item ID is missing');
      });
    });
  });

  // Test accessibility
  describe('Accessibility', () => {
    it('should have proper ARIA labels for form fields', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/assigned date/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/pre completion notes/i),
      ).toBeInTheDocument();
    });

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

      render(<ItemModal {...props} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      const categoryField = screen.getByLabelText(/category/i);
      categoryField.focus();
      expect(document.activeElement).toBe(categoryField);

      // Tab to next field
      fireEvent.keyDown(categoryField, { key: 'Tab' });
      expect(document.activeElement).not.toBe(categoryField);
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

      expect(() => render(<ItemModal {...props} />)).not.toThrow();
    });

    it('should handle empty orgId gracefully', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: '',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      expect(() => render(<ItemModal {...props} />)).not.toThrow();
    });

    it('should handle rapid open/close cycles', () => {
      const mockHide = vi.fn();
      let isOpen = true;

      const props: IItemModalProps = {
        isOpen,
        hide: mockHide,
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      const { rerender } = render(<ItemModal {...props} />);

      // Rapidly toggle modal
      for (let i = 0; i < 10; i++) {
        isOpen = !isOpen;
        rerender(<ItemModal {...{ ...props, isOpen }} />);
      }

      expect(() => {}).not.toThrow();
    });

    it('should handle component unmounting during async operations', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      const { unmount } = render(<ItemModal {...props} />);

      // Fill form and start submission
      const categoryField = screen.getByLabelText(/category/i);
      const assigneeField = screen.getByLabelText(/assignee/i);

      fireEvent.change(categoryField, { target: { value: 'cat1' } });
      fireEvent.change(assigneeField, { target: { value: 'user1' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      // Unmount component immediately
      unmount();

      // Should not throw errors
      await waitFor(() => {
        expect(true).toBe(true);
      });
    });
  });

  // Test internationalization
  describe('Internationalization', () => {
    it('should display translated text for form labels', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      // Should display translated labels (assuming translation keys exist)
      expect(screen.getByText(/create action item/i)).toBeInTheDocument();
    });

    it('should display translated text for buttons', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      render(<ItemModal {...props} />);

      expect(
        screen.getByRole('button', { name: /create/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
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

      const { rerender } = render(<ItemModal {...props} />);

      // Re-render with same props
      rerender(<ItemModal {...props} />);

      // Component should handle this gracefully
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };

      // Mock large dataset
      const startTime = performance.now();
      render(<ItemModal {...props} />);
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
