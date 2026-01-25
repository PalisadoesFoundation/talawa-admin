import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EditUserTagModal, {
  InterfaceEditUserTagModalProps,
} from './EditUserTagModal';

import type { TFunction } from 'i18next';
import userEvent from '@testing-library/user-event';

// Mock the CSS module
vi.mock('./EditUserTagModal.module.css', () => ({
  default: {
    modalHeader: 'modalHeader-class',
    inputField: 'inputField-class',
    removeButton: 'removeButton-class',
    addButton: 'addButton-class',
  },
}));

describe('EditUserTagModal Component', () => {
  const mockT = vi.fn((key) => key) as unknown as TFunction<
    'translation',
    'manageTag'
  >;
  const mockTCommon = vi.fn((key) => key) as unknown as TFunction<
    'common',
    undefined
  >;

  const defaultProps: InterfaceEditUserTagModalProps = {
    editUserTagModalIsOpen: true,
    hideEditUserTagModal: vi.fn(),
    newTagName: 'Test Tag',
    setNewTagName: vi.fn(),
    handleEditUserTag: vi.fn().mockResolvedValue(undefined),
    t: mockT,
    tCommon: mockTCommon,
  };

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open', () => {
    render(<EditUserTagModal {...defaultProps} />);

    expect(screen.getByText('tagDetails')).toBeInTheDocument();
    expect(screen.getByLabelText(/tagName/i)).toBeInTheDocument();
    expect(screen.getByTestId('tagNameInput')).toBeInTheDocument();
    expect(screen.getByTestId('closeEditTagModalBtn')).toBeInTheDocument();
    expect(screen.getByTestId('editTagSubmitBtn')).toBeInTheDocument();
  });

  it('does not render the modal when closed', () => {
    render(
      <EditUserTagModal {...defaultProps} editUserTagModalIsOpen={false} />,
    );

    expect(screen.queryByText('tagDetails')).not.toBeInTheDocument();
  });

  it('displays the current tag name in the input field', () => {
    render(<EditUserTagModal {...defaultProps} />);

    const inputField = screen.getByTestId('tagNameInput');
    expect(inputField).toHaveValue('Test Tag');
  });

  it('calls setNewTagName when input changes', async () => {
    function Wrapper() {
      const [tagName, setTagName] = React.useState('Test Tag');

      return (
        <EditUserTagModal
          {...defaultProps}
          newTagName={tagName}
          setNewTagName={setTagName}
        />
      );
    }

    render(<Wrapper />);

    const inputField = screen.getByTestId('tagNameInput');

    await user.clear(inputField);
    await user.type(inputField, 'Updated Tag');

    expect(inputField).toHaveValue('Updated Tag');
  });

  it('calls hideEditUserTagModal when cancel button is clicked', async () => {
    render(<EditUserTagModal {...defaultProps} />);

    await user.click(screen.getByTestId('closeEditTagModalBtn'));
    expect(defaultProps.hideEditUserTagModal).toHaveBeenCalledTimes(1);
  });

  it('calls handleEditUserTag when form is submitted with valid input', async () => {
    render(<EditUserTagModal {...defaultProps} />);

    await user.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call handleEditUserTag when form is submitted with empty input', async () => {
    render(<EditUserTagModal {...defaultProps} newTagName="" />);

    await user.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).not.toHaveBeenCalled();
    });
  });

  it('does not call handleEditUserTag when form is submitted with whitespace-only input', async () => {
    render(<EditUserTagModal {...defaultProps} newTagName="   " />);

    await user.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).not.toHaveBeenCalled();
    });
  });

  it('applies the correct CSS classes from the module', () => {
    render(<EditUserTagModal {...defaultProps} />);

    expect(screen.getByTestId('modalOrganizationHeader')).toHaveClass(
      'modalHeader-class',
    );
    expect(screen.getByTestId('tagNameInput')).toHaveClass('inputField-class');
    expect(screen.getByTestId('closeEditTagModalBtn')).toHaveClass(
      'removeButton-class',
    );
    expect(screen.getByTestId('editTagSubmitBtn')).toHaveClass(
      'addButton-class',
    );
  });

  it('sets the required attribute on the input field', () => {
    render(<EditUserTagModal {...defaultProps} />);
    expect(screen.getByTestId('tagNameInput')).toHaveAttribute('required');
  });

  it('sets autoComplete to off on the input field', () => {
    render(<EditUserTagModal {...defaultProps} />);
    expect(screen.getByTestId('tagNameInput')).toHaveAttribute(
      'autoComplete',
      'off',
    );
  });
});
