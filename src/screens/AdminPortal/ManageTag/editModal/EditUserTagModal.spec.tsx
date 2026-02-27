import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  const StatefulWrapper = ({
    props = defaultProps,
  }: {
    props?: InterfaceEditUserTagModalProps;
  }) => {
    const [name, setName] = React.useState(props.newTagName);
    return (
      <I18nextProvider i18n={i18n}>
        <EditUserTagModal
          {...props}
          newTagName={name}
          setNewTagName={(action) => {
            props.setNewTagName(action);
            if (typeof action === 'function') {
              setName(action);
            } else {
              setName(action);
            }
          }}
        />
      </I18nextProvider>
    );
  };

  const renderComponent = (props = defaultProps) =>
    render(<StatefulWrapper props={props} />);

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

  it('calls setNewTagName when input changes', async () => {
    renderComponent();
    const input = screen.getByTestId('tagNameInput');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Tag');
    // Now that we have a real state update, the prop will change and userEvent.type will work as expected.
    await waitFor(() => {
      expect(defaultProps.setNewTagName).toHaveBeenLastCalledWith(
        'Updated Tag',
      );
      expect(input).toHaveValue('Updated Tag');
    });
  });

  it('calls hideEditUserTagModal when cancel button is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId('closeEditTagModalBtn'));
    expect(defaultProps.hideEditUserTagModal).toHaveBeenCalled();
  });

  it('calls handleEditUserTag when form is valid', async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));
    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).toHaveBeenCalled();
    });
  });

  it('does not submit when input is empty', async () => {
    renderComponent({ ...defaultProps, newTagName: '' });
    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));
    await waitFor(() => {
      expect(defaultProps.handleEditUserTag).not.toHaveBeenCalled();
    });
  });

  it('focuses input when submitting empty tag name', async () => {
    renderComponent({ ...defaultProps, newTagName: '' });

    const input = screen.getByTestId('tagNameInput');
    const focusSpy = vi.spyOn(input, 'focus');

    const form = document.getElementById(
      'edit-user-tag-form',
    ) as HTMLFormElement;

    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  it('sets touched state on blur', async () => {
    const user = userEvent.setup();

    renderComponent({ ...defaultProps, newTagName: '' });

    const input = screen.getByTestId('tagNameInput');

    await user.click(input);
    await user.tab(); // triggers blur

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
