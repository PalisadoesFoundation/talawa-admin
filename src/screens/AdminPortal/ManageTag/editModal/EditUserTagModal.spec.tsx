import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EditUserTagModal, {
  InterfaceEditUserTagModalProps,
} from './EditUserTagModal';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';

vi.mock('./EditUserTagModal.module.css', () => ({
  default: {
    modalHeader: 'modalHeader-class',
    inputField: 'inputField-class',
    removeButton: 'removeButton-class',
    addButton: 'addButton-class',
  },
}));

describe('EditUserTagModal Component', () => {
  const defaultProps: InterfaceEditUserTagModalProps = {
    editUserTagModalIsOpen: true,
    hideEditUserTagModal: vi.fn(),
    newTagName: 'Test Tag',
    setNewTagName: vi.fn(),
    handleEditUserTag: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = defaultProps) =>
    render(
      <I18nextProvider i18n={i18n}>
        <EditUserTagModal {...props} />
      </I18nextProvider>,
    );

  it('renders the modal when open', () => {
    renderComponent();
    expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();
    expect(screen.getByTestId('tagNameInput')).toBeInTheDocument();
  });

  it('does not render the modal when closed', () => {
    renderComponent({ ...defaultProps, editUserTagModalIsOpen: false });
    expect(
      screen.queryByTestId('modalOrganizationHeader'),
    ).not.toBeInTheDocument();
  });

  it('calls setNewTagName when input changes', () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('tagNameInput'), {
      target: { value: 'Updated Tag' },
    });
    expect(defaultProps.setNewTagName).toHaveBeenCalledWith('Updated Tag');
  });

  it('calls hideEditUserTagModal when cancel button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('closeEditTagModalBtn'));
    expect(defaultProps.hideEditUserTagModal).toHaveBeenCalled();
  });

  it('calls handleEditUserTag when form is valid', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('editTagSubmitBtn'));
    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).toHaveBeenCalled();
    });
  });

  it('does not submit when input is empty', async () => {
    renderComponent({ ...defaultProps, newTagName: '' });
    fireEvent.click(screen.getByTestId('editTagSubmitBtn'));
    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).not.toHaveBeenCalled();
    });
  });
});