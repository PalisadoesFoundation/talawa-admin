import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EditUserTagModal, {
  InterfaceEditUserTagModalProps,
} from './EditUserTagModal';

import type { TFunction } from 'i18next';

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
  // Properly typed mock translation functions
  const mockT = vi.fn((key) => key) as unknown as TFunction<
    'translation',
    'manageTag'
  >;
  const mockTCommon = vi.fn((key) => key) as unknown as TFunction<
    'common',
    undefined
  >;

  // Common props for all tests with correct typing
  const defaultProps: InterfaceEditUserTagModalProps = {
    editUserTagModalIsOpen: true,
    hideEditUserTagModal: vi.fn(),
    newTagName: 'Test Tag',
    setNewTagName: vi.fn(),
    handleEditUserTag: vi.fn().mockImplementation(() => Promise.resolve()),
    t: mockT,
    tCommon: mockTCommon,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open', () => {
    render(<EditUserTagModal {...defaultProps} />);

    expect(screen.getByText('tagDetails')).toBeInTheDocument();
    expect(screen.getByLabelText('tagName')).toBeInTheDocument();
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

  it('calls setNewTagName when input changes', () => {
    render(<EditUserTagModal {...defaultProps} />);

    const inputField = screen.getByTestId('tagNameInput');
    fireEvent.change(inputField, { target: { value: 'Updated Tag' } });

    expect(defaultProps.setNewTagName).toHaveBeenCalledTimes(1);
    expect(defaultProps.setNewTagName).toHaveBeenCalledWith('Updated Tag');
  });

  it('calls hideEditUserTagModal when cancel button is clicked', () => {
    render(<EditUserTagModal {...defaultProps} />);

    const cancelButton = screen.getByTestId('closeEditTagModalBtn');
    fireEvent.click(cancelButton);

    expect(defaultProps.hideEditUserTagModal).toHaveBeenCalledTimes(1);
  });

  it('calls handleEditUserTag when form is submitted with valid input', async () => {
    render(<EditUserTagModal {...defaultProps} />);

    const submitButton = screen.getByTestId('editTagSubmitBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call handleEditUserTag when form is submitted with empty input', async () => {
    const propsWithEmptyTag = { ...defaultProps, newTagName: '' };

    render(<EditUserTagModal {...propsWithEmptyTag} />);

    const submitButton = screen.getByTestId('editTagSubmitBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).not.toHaveBeenCalled();
    });
  });

  it('does not call handleEditUserTag when form is submitted with whitespace-only input', async () => {
    const propsWithWhitespaceTag = { ...defaultProps, newTagName: '   ' };

    render(<EditUserTagModal {...propsWithWhitespaceTag} />);

    const submitButton = screen.getByTestId('editTagSubmitBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).not.toHaveBeenCalled();
    });
  });

  it('applies the correct CSS classes from the module', () => {
    render(<EditUserTagModal {...defaultProps} />);

    // BaseModal does not propagate testId to the internal header element.
    // Instead of checking the header class directly, we can verify other elements or skip this check if it relies on BaseModal internals.
    // However, we can check that the input field and buttons have the correct classes which are passed from this component.
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

    const inputField = screen.getByTestId('tagNameInput');
    expect(inputField).toHaveAttribute('required');
  });

  it('sets autoComplete to off on the input field', () => {
    render(<EditUserTagModal {...defaultProps} />);

    const inputField = screen.getByTestId('tagNameInput');
    expect(inputField).toHaveAttribute('autoComplete', 'off');
  });
});
