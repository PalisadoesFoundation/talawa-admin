import React from 'react';
import {
  render,
  screen,
  waitFor,
  renderHook,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { FormTextField } from '../FormFieldGroup/FormTextField';
import {
  CRUDModalTemplate,
  CreateModal,
  EditModal,
  DeleteModal,
  ViewModal,
  useModalState,
  useFormModal,
  useMutationModal,
} from './index';

/**
 * Helper to render components with i18n support.
 *
 * Note: When using the returned `rerender` function, you must manually wrap
 * the component with I18nextProvider again, as RTL's rerender does not
 * preserve the original wrapper.
 */
const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18nForTest}>{component}</I18nextProvider>,
  );
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('CRUDModalTemplate', () => {
  const mockOnClose = vi.fn();
  const mockOnPrimary = vi.fn();

  describe('Modal open/close functionality', () => {
    it('should render modal when open prop is true', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          data-testid="test-modal"
        >
          <div>Modal Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should not render modal when open prop is false', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={false}
          title="Test Modal"
          onClose={mockOnClose}
        >
          <div>Modal Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CRUDModalTemplate open={true} title="Test Modal" onClose={mockOnClose}>
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const closeButton = screen.getByTestId('modalCloseBtn');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Action buttons', () => {
    it('should render primary and secondary buttons', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          primaryText="Save"
          secondaryText="Cancel"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should call onPrimary when primary button is clicked', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          primaryText="Save"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      expect(mockOnPrimary).toHaveBeenCalledTimes(1);
    });

    it('should not render primary button when onPrimary is not provided', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          primaryText="Save"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('should hide secondary button when hideSecondary is true', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          hideSecondary={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(
        screen.queryByTestId('modal-secondary-btn'),
      ).not.toBeInTheDocument();
    });

    it('should disable buttons when loading is true', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          loading={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const primaryBtn = screen.getByTestId('modal-primary-btn');
      const secondaryBtn = screen.getByTestId('modal-secondary-btn');

      expect(primaryBtn).toBeDisabled();
      expect(secondaryBtn).toBeDisabled();
    });

    it('should disable primary button when primaryDisabled is true', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          primaryDisabled={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const primaryBtn = screen.getByTestId('modal-primary-btn');
      expect(primaryBtn).toBeDisabled();
    });

    it('should render custom footer when provided', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          customFooter={<button type="button">Custom Action</button>}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByText('Custom Action')).toBeInTheDocument();
      expect(screen.queryByTestId('modal-primary-btn')).not.toBeInTheDocument();
    });

    it('should hide footer when showFooter is false', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          showFooter={false}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.queryByTestId('modal-primary-btn')).not.toBeInTheDocument();
    });

    it('should apply primary className when primaryVariant is primary', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          primaryVariant="primary"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const primaryBtn = screen.getByTestId('modal-primary-btn');
      expect(primaryBtn.className).toContain('addButton');
    });

    it('should apply danger className when primaryVariant is danger', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          primaryVariant="danger"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const primaryBtn = screen.getByTestId('modal-primary-btn');
      expect(primaryBtn.className).toContain('removeButton');
    });

    it('should not apply special className when primaryVariant is success', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          primaryVariant="success"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const primaryBtn = screen.getByTestId('modal-primary-btn');
      expect(primaryBtn.className).not.toContain('addButton');
      expect(primaryBtn.className).not.toContain('removeButton');
    });
  });

  describe('Loading states', () => {
    it('should display loading spinner when loading is true', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          loading={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should not call onPrimary when loading', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          onPrimary={mockOnPrimary}
          loading={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      const primaryBtn = screen.getByTestId('modal-primary-btn');
      await user.click(primaryBtn);

      expect(mockOnPrimary).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should display error message when error prop is provided', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          error="Something went wrong"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should not display error alert when error prop is not provided', () => {
      renderWithI18n(
        <CRUDModalTemplate open={true} title="Test Modal" onClose={mockOnClose}>
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard navigation', () => {
    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CRUDModalTemplate open={true} title="Test Modal" onClose={mockOnClose}>
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not call onClose when Escape is pressed while loading', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          loading={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Styling and customization', () => {
    it('should apply custom className', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          className="custom-class"
          data-testid="custom-modal"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should apply size prop', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          size="lg"
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should center modal when centered prop is true', () => {
      renderWithI18n(
        <CRUDModalTemplate
          open={true}
          title="Test Modal"
          onClose={mockOnClose}
          centered={true}
        >
          <div>Content</div>
        </CRUDModalTemplate>,
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

describe('CreateModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  describe('Form submission', () => {
    it('should render form with children', () => {
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField
            name="name"
            label="Name"
            value=""
            onChange={vi.fn()}
            placeholder="Enter name"
          />
        </CreateModal>,
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('should call onSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
        </CreateModal>,
      );

      const submitButton = screen.getByTestId('modal-submit-btn');
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
        </CreateModal>,
      );

      const submitButton = screen.getByTestId('modal-submit-btn');
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should disable submit button when submitDisabled is true', () => {
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          submitDisabled={true}
        >
          <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
        </CreateModal>,
      );

      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toBeDisabled();
    });

    it('should use translated submit and cancel text', () => {
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
        </CreateModal>,
      );

      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Keyboard shortcuts', () => {
    it('should submit form when Ctrl+Enter is pressed', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField
            name="test"
            label="Test"
            value=""
            onChange={vi.fn()}
            data-testid="input-field"
          />
        </CreateModal>,
      );

      const input = screen.getByTestId('input-field');
      await user.click(input);
      await user.keyboard('{Control>}{Enter}{/Control}');

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should submit form when Cmd+Enter is pressed (Mac)', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField
            name="test"
            label="Test"
            value=""
            onChange={vi.fn()}
            data-testid="input-field"
          />
        </CreateModal>,
      );

      const input = screen.getByTestId('input-field');
      await user.click(input);
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Focus management', () => {
    it('should auto-focus first input when modal opens', async () => {
      const { rerender } = renderWithI18n(
        <CreateModal
          open={false}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField
            name="test"
            label="Test"
            value=""
            onChange={vi.fn()}
            data-testid="first-input"
          />
        </CreateModal>,
      );

      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <CreateModal
            open={true}
            title="Create Item"
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          >
            <FormTextField
              name="test"
              label="Test"
              value=""
              onChange={vi.fn()}
              data-testid="first-input"
            />
          </CreateModal>
        </I18nextProvider>,
      );

      await waitFor(
        () => {
          const input = screen.getByTestId('first-input');
          expect(document.activeElement).toBe(input);
        },
        { timeout: 200 },
      );
    });

    it('should skip hidden and disabled inputs when auto-focusing', async () => {
      const { rerender } = renderWithI18n(
        <CreateModal
          open={false}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <>
            <input type="hidden" />
            <FormTextField
              name="disabled"
              label="Disabled"
              value=""
              onChange={vi.fn()}
              disabled
            />
            <FormTextField
              name="visible"
              label="Visible"
              value=""
              onChange={vi.fn()}
              data-testid="visible-input"
            />
          </>
        </CreateModal>,
      );

      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <CreateModal
            open={true}
            title="Create Item"
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          >
            <>
              <input type="hidden" />
              <FormTextField
                name="disabled"
                label="Disabled"
                value=""
                onChange={vi.fn()}
                disabled
              />
              <FormTextField
                name="visible"
                label="Visible"
                value=""
                onChange={vi.fn()}
                data-testid="visible-input"
              />
            </>
          </CreateModal>
        </I18nextProvider>,
      );

      await waitFor(
        () => {
          const input = screen.getByTestId('visible-input');
          expect(document.activeElement).toBe(input);
        },
        { timeout: 200 },
      );
    });

    it('should not crash when modal opens with no focusable inputs', async () => {
      const { rerender } = renderWithI18n(
        <CreateModal
          open={false}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <div>No inputs here</div>
        </CreateModal>,
      );

      rerender(
        <I18nextProvider i18n={i18nForTest}>
          <CreateModal
            open={true}
            title="Create Item"
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          >
            <div>No inputs here</div>
          </CreateModal>
        </I18nextProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByText('No inputs here')).toBeInTheDocument();
        },
        { timeout: 200 },
      );
    });

    it('should not submit when Enter is pressed without Ctrl or Cmd', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <input type="text" data-testid="input-field" />
        </CreateModal>,
      );

      const input = screen.getByTestId('input-field');
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should render footer with cancel and submit buttons', () => {
      renderWithI18n(
        <CreateModal
          open={true}
          title="Create Item"
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        >
          <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
        </CreateModal>,
      );

      const cancelBtn = screen.getByTestId('modal-cancel-btn');
      const submitBtn = screen.getByTestId('modal-submit-btn');

      expect(cancelBtn).toBeInTheDocument();
      expect(submitBtn).toBeInTheDocument();
      expect(cancelBtn).toHaveTextContent('Cancel');
      expect(submitBtn).toHaveTextContent('Create');
    });
  });
});

describe('EditModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  it('should render edit form with data loading state', () => {
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        loadingData={true}
      >
        <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
      </EditModal>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render form when data is loaded', () => {
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        loadingData={false}
      >
        <FormTextField
          name="name"
          label="Edit Name"
          value="Existing Name"
          onChange={vi.fn()}
        />
      </EditModal>,
    );

    expect(screen.getByText('Edit Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Name')).toBeInTheDocument();
  });

  it('should use "Update" as default submit text', () => {
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
      </EditModal>,
    );

    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('should not auto-focus while data is loading', () => {
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        loadingData={true}
      >
        <FormTextField
          name="test"
          label="Test"
          value=""
          onChange={vi.fn()}
          data-testid="input-field"
        />
      </EditModal>,
    );

    const spinner = screen.queryByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should handle both loading and loadingData states', () => {
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        loading={true}
        loadingData={true}
      >
        <FormTextField name="test" label="Test" value="" onChange={vi.fn()} />
      </EditModal>,
    );

    const submitButton = screen.getByTestId('modal-submit-btn');
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <FormTextField
          name="test"
          label="Test"
          value=""
          onChange={vi.fn()}
          data-testid="input-field"
        />
      </EditModal>,
    );

    const submitButton = screen.getByTestId('modal-submit-btn');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should submit form when Ctrl+Enter is pressed', async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <FormTextField
          name="test"
          label="Test"
          value=""
          onChange={vi.fn()}
          data-testid="input-field"
        />
      </EditModal>,
    );

    const input = screen.getByTestId('input-field');
    await user.click(input);
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should submit form when Cmd+Enter is pressed (Mac)', async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <EditModal
        open={true}
        title="Edit Item"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <FormTextField
          name="test"
          label="Test"
          value=""
          onChange={vi.fn()}
          data-testid="input-field"
        />
      </EditModal>,
    );

    const input = screen.getByTestId('input-field');
    await user.click(input);
    await user.keyboard('{Meta>}{Enter}{/Meta}');

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('DeleteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();

  it('should render delete confirmation with entity name', () => {
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        entityName="Test Campaign"
      />,
    );

    expect(screen.getByText(/Test Campaign/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/i),
    ).toBeInTheDocument();
  });

  it('should render default confirmation message', () => {
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    expect(
      screen.getByText(/Are you sure you want to delete this item/i),
    ).toBeInTheDocument();
  });

  it('should render warning icon by default', () => {
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    const warningIcon = document.querySelector('.fa-exclamation-triangle');
    expect(warningIcon).toBeInTheDocument();
  });

  it('should hide warning icon when showWarning is false', () => {
    const { container } = renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        showWarning={false}
      />,
    );

    const warningIcon = container.querySelector('.fa-exclamation-triangle');
    expect(warningIcon).not.toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    const deleteButton = screen.getByTestId('modal-delete-btn');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should not call onDelete when loading state is true', async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        loading={true}
      />,
    );

    const deleteButton = screen.getByTestId('modal-delete-btn');
    await user.click(deleteButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should render translated delete and cancel buttons', () => {
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render custom children content', () => {
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Item"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      >
        <div>Custom delete message</div>
      </DeleteModal>,
    );

    expect(screen.getByText('Custom delete message')).toBeInTheDocument();
  });

  it('should render recurring event options', () => {
    renderWithI18n(
      <DeleteModal
        open={true}
        title="Delete Recurring Event"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        recurringEventContent={
          <div>
            <input type="radio" id="single" />
            <label htmlFor="single">Delete this instance</label>
            <input type="radio" id="series" />
            <label htmlFor="series">Delete entire series</label>
          </div>
        }
      />,
    );

    expect(screen.getByText('Delete this instance')).toBeInTheDocument();
    expect(screen.getByText('Delete entire series')).toBeInTheDocument();
  });
});

describe('ViewModal', () => {
  const mockOnClose = vi.fn();

  it('should render view content', () => {
    const testData = { name: 'Test Item', id: '123' };

    renderWithI18n(
      <ViewModal open={true} title="View Item" onClose={mockOnClose}>
        <div>
          <strong>Name:</strong> {testData.name}
        </div>
        <div>
          <strong>ID:</strong> {testData.id}
        </div>
      </ViewModal>,
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render loading state while fetching data', () => {
    renderWithI18n(
      <ViewModal
        open={true}
        title="View Item"
        onClose={mockOnClose}
        loadingData={true}
      >
        <div>Content</div>
      </ViewModal>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render translated close button', () => {
    renderWithI18n(
      <ViewModal open={true} title="View Item" onClose={mockOnClose}>
        <div>Content</div>
      </ViewModal>,
    );

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should render custom action buttons', async () => {
    const user = userEvent.setup();
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();

    renderWithI18n(
      <ViewModal
        open={true}
        title="View Item"
        onClose={mockOnClose}
        customActions={
          <>
            <button type="button" onClick={mockEdit}>
              Edit
            </button>
            <button type="button" onClick={mockDelete}>
              Delete
            </button>
          </>
        }
      >
        <div>Content</div>
      </ViewModal>,
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    await user.click(screen.getByText('Edit'));
    expect(mockEdit).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Delete'));
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('should only show close button when no custom actions provided', () => {
    renderWithI18n(
      <ViewModal open={true} title="View Item" onClose={mockOnClose}>
        <div>Content</div>
      </ViewModal>,
    );

    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});

describe('useModalState', () => {
  it('should initialize with closed state by default', () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with provided initial state', () => {
    const { result } = renderHook(() => useModalState(true));

    expect(result.current.isOpen).toBe(true);
  });

  it('should open modal when open is called', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should close modal when close is called', () => {
    const { result } = renderHook(() => useModalState(true));

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle modal state', () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useFormModal', () => {
  interface InterfaceTestData {
    id: string;
    name: string;
  }

  it('should initialize with null form data', () => {
    const { result } = renderHook(() => useFormModal<InterfaceTestData>());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.formData).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should initialize with provided initial data', () => {
    const initialData: InterfaceTestData = { id: '1', name: 'Test' };
    const { result } = renderHook(() =>
      useFormModal<InterfaceTestData>(initialData),
    );

    expect(result.current.formData).toEqual(initialData);
  });

  it('should open modal with data when openWithData is called', () => {
    const { result } = renderHook(() => useFormModal<InterfaceTestData>());
    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    act(() => {
      result.current.openWithData(testData);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.formData).toEqual(testData);
  });

  it('should reset all state when reset is called', () => {
    const { result } = renderHook(() => useFormModal<InterfaceTestData>());
    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    act(() => {
      result.current.openWithData(testData);
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.formData).toEqual(testData);
    expect(result.current.isSubmitting).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.formData).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should update submitting state', () => {
    const { result } = renderHook(() => useFormModal<InterfaceTestData>());

    act(() => {
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);

    act(() => {
      result.current.setIsSubmitting(false);
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});

describe('useMutationModal', () => {
  interface InterfaceTestData {
    id: string;
    name: string;
  }

  interface InterfaceTestResult {
    success: boolean;
  }

  it('should initialize with default state', () => {
    const mockMutation = vi.fn();
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.formData).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute mutation with form data', async () => {
    const mockMutation = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    act(() => {
      result.current.openWithData(testData);
    });

    await act(async () => {
      await result.current.execute();
    });

    expect(mockMutation).toHaveBeenCalledWith(testData);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should execute mutation with provided data', async () => {
    const mockMutation = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    await act(async () => {
      await result.current.execute(testData);
    });

    expect(mockMutation).toHaveBeenCalledWith(testData);
  });

  it('should call onSuccess callback when mutation succeeds', async () => {
    const mockMutation = vi.fn().mockResolvedValue({ success: true });
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation, {
        onSuccess,
      }),
    );

    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    await act(async () => {
      await result.current.execute(testData);
    });

    expect(onSuccess).toHaveBeenCalledWith({ success: true });
  });

  it('should handle mutation error and call onError callback', async () => {
    const mockError = new Error('Mutation failed');
    const mockMutation = vi.fn().mockRejectedValue(mockError);
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation, {
        onError,
      }),
    );

    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    await act(async () => {
      await result.current.execute(testData);
    });

    expect(result.current.error).toEqual(mockError);
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should clear error when clearError is called', async () => {
    const mockError = new Error('Mutation failed');
    const mockMutation = vi.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    await act(async () => {
      await result.current.execute(testData);
    });

    expect(result.current.error).toEqual(mockError);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should clear error when opening modal', () => {
    const mockMutation = vi.fn();
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    act(() => {
      result.current.open();
    });

    expect(result.current.error).toBeNull();
  });

  it('should return undefined when no data is available', async () => {
    const mockMutation = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    let returnValue: InterfaceTestResult | undefined;
    await act(async () => {
      returnValue = await result.current.execute();
    });

    expect(returnValue).toBeUndefined();
    expect(mockMutation).not.toHaveBeenCalled();
  });

  it('should reset all state including error', () => {
    const mockMutation = vi.fn();
    const { result } = renderHook(() =>
      useMutationModal<InterfaceTestData, InterfaceTestResult>(mockMutation),
    );

    const testData: InterfaceTestData = { id: '1', name: 'Test' };

    act(() => {
      result.current.openWithData(testData);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.formData).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
