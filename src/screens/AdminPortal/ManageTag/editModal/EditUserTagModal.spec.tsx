/**
 * Test Suite for EditUserTagModal
 *
 * This file contains unit tests to verify:
 * 1. Rendering of the modal with correct initial values.
 * 2. User interactions, including changing the tag name and clicking cancel.
 * 3. Form submission logic and proper event handler invocation.
 * 4. Validation logic (e.g., focusing input on empty submission).
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditUserTagModal from './EditUserTagModal';
import { InterfaceEditUserTagModalProps } from 'types/AdminPortal/ManageTag/editModal/EditUserTagModal/interface';
import { TFunction } from 'i18next';

// Mock Translation
const mockT = vi.fn((key) => key) as unknown as TFunction<"translation", undefined>;
const mockTCommon = vi.fn((key) => key) as unknown as TFunction<"common", undefined>;

describe('EditUserTagModal', () => {
  const mockHide = vi.fn();
  const mockHandleEdit = vi.fn();
  const mockSetNewTagName = vi.fn();
  const user = userEvent.setup();

  const defaultProps: InterfaceEditUserTagModalProps = {
    editUserTagModalIsOpen: true,
    hideEditUserTagModal: mockHide,
    newTagName: 'Old Name',
    handleEditUserTag: mockHandleEdit,
    setNewTagName: mockSetNewTagName,
    t: mockT,
    tCommon: mockTCommon,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when open', () => {
    render(<EditUserTagModal {...defaultProps} />);
    expect(screen.getByText('tagDetails')).toBeInTheDocument();
    expect(screen.getByTestId('tagNameInput')).toHaveValue('Old Name');
  });

  it('should not render when modal is closed', () => {
    render(<EditUserTagModal {...defaultProps} editUserTagModalIsOpen={false} />);
    expect(screen.queryByText('tagDetails')).not.toBeInTheDocument();
  });

  it('should close when cancel button is clicked', async () => {
    render(<EditUserTagModal {...defaultProps} />);
    const closeBtn = screen.getByTestId('closeEditTagModalBtn');
    await user.click(closeBtn);
    expect(mockHide).toHaveBeenCalled();
  });

  it('should update tag name on change', async () => {
    render(<EditUserTagModal {...defaultProps} />);
    const input = screen.getByTestId('tagNameInput');
    await user.clear(input);
    await user.type(input, 'New Name');
    expect(mockSetNewTagName).toHaveBeenCalled();
  });

  it('should submit form when valid', async () => {
    render(<EditUserTagModal {...defaultProps} newTagName="Valid Name" />);
    
    const input = screen.getByTestId('tagNameInput');
    const form = input.closest('form');
    
    if (!form) throw new Error('Form not found');
    
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockHandleEdit).toHaveBeenCalled();
    });
  });

  it('should prevent submission and show error when tag name is empty', () => {
    render(<EditUserTagModal {...defaultProps} newTagName="" />);

    const input = screen.getByTestId('tagNameInput');
    const form = input.closest('form');
    if (!form) throw new Error('Form not found');

    const focusSpy = vi.spyOn(input, 'focus');

    fireEvent.submit(form);

    expect(mockHandleEdit).not.toHaveBeenCalled(); 
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should prevent submission when tag name contains only whitespace', () => {
    render(<EditUserTagModal {...defaultProps} newTagName="   " />);

    const input = screen.getByTestId('tagNameInput');
    const form = input.closest('form');
    if (!form) throw new Error('Form not found');

    const focusSpy = vi.spyOn(input, 'focus');

    fireEvent.submit(form);

    expect(mockHandleEdit).not.toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should set isTouched to true on input blur', async () => {
    render(<EditUserTagModal {...defaultProps} newTagName="" />);
    
    const input = screen.getByTestId('tagNameInput');
    
    // Blur the input to trigger onBlur
    await user.click(input);
    await user.tab(); // This will blur the input
    
    // Now the error should be visible because isTouched is true
    expect(mockTCommon).toHaveBeenCalledWith('required');
  });

  it('should display error message when touched and invalid', () => {
    render(<EditUserTagModal {...defaultProps} newTagName="" />);
    
    const input = screen.getByTestId('tagNameInput');
    
    // Trigger blur to set touched state
    fireEvent.blur(input);
    
    // Check that the error translation key was called
    expect(mockTCommon).toHaveBeenCalledWith('required');
  });

  it('should reset isTouched when modal reopens', () => {
    const { rerender } = render(
      <EditUserTagModal {...defaultProps} editUserTagModalIsOpen={false} />
    );

    // Open modal
    rerender(<EditUserTagModal {...defaultProps} editUserTagModalIsOpen={true} />);
    
    const input = screen.getByTestId('tagNameInput');
    
    // Input should not show error initially (isTouched should be false)
    expect(input).not.toHaveClass('is-invalid');
  });

  it('should call translation functions correctly', () => {
    render(<EditUserTagModal {...defaultProps} />);
    
    // Check that translation functions were called with correct keys
    expect(mockT).toHaveBeenCalledWith('tagDetails');
    expect(mockT).toHaveBeenCalledWith('tagName');
    expect(mockT).toHaveBeenCalledWith('tagNamePlaceholder');
    expect(mockTCommon).toHaveBeenCalledWith('cancel');
    expect(mockTCommon).toHaveBeenCalledWith('edit');
  });

  it('should handle async form submission correctly', async () => {
    const asyncMockHandleEdit = vi.fn().mockResolvedValue(undefined);
    
    render(
      <EditUserTagModal 
        {...defaultProps} 
        newTagName="Valid Name"
        handleEditUserTag={asyncMockHandleEdit}
      />
    );
    
    const input = screen.getByTestId('tagNameInput');
    const form = input.closest('form');
    
    if (!form) throw new Error('Form not found');
    
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(asyncMockHandleEdit).toHaveBeenCalled();
    });
  });
});

