import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it, expect, afterEach } from 'vitest';

import AgendaFolderUpdateModal from './AgendaFolderUpdateModal';
import { UPDATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { InterfaceAgendaFolderUpdateFormStateType } from 'types/AdminPortal/Agenda/interface';

// Mock NotificationToast
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const mockAgendaFolderId = 'folder123';
const mockOnClose = vi.fn();
const mockRefetchAgendaFolder = vi.fn();
const mockSetFolderFormState = vi.fn();

const mockFolderFormState: InterfaceAgendaFolderUpdateFormStateType = {
  id: mockAgendaFolderId,
  name: 'Test Folder',
  description: 'Test Description',
  creator: {
    id: 'creator1',
    name: 'Test Creator',
  },
};

const MOCKS_SUCCESS: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: mockAgendaFolderId,
          name: 'Test Folder',
          description: 'Test Description',
        },
      },
    },
    result: {
      data: {
        updateAgendaFolder: {
          id: mockAgendaFolderId,
          name: 'Test Folder',
          description: 'Test Description',
        },
      },
    },
  },
];

const MOCKS_SUCCESS_TRIMMED: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: mockAgendaFolderId,
          name: 'Trimmed Name',
          description: 'Trimmed Description',
        },
      },
    },
    result: {
      data: {
        updateAgendaFolder: {
          id: mockAgendaFolderId,
          name: 'Trimmed Name',
          description: 'Trimmed Description',
        },
      },
    },
  },
];

const MOCKS_SUCCESS_EMPTY_DESCRIPTION: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: mockAgendaFolderId,
          name: 'Test Folder',
          description: undefined,
        },
      },
    },
    result: {
      data: {
        updateAgendaFolder: {
          id: mockAgendaFolderId,
          name: 'Test Folder',
          description: '',
        },
      },
    },
  },
];

const MOCKS_ERROR: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: mockAgendaFolderId,
          name: 'Test Folder',
          description: 'Test Description',
        },
      },
    },
    error: new Error('Failed to update agenda folder'),
  },
];

const renderAgendaFolderUpdateModal = (
  mocks: MockedResponse[] = MOCKS_SUCCESS,
  isOpen = true,
  folderFormState: InterfaceAgendaFolderUpdateFormStateType = mockFolderFormState,
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <AgendaFolderUpdateModal
          isOpen={isOpen}
          onClose={mockOnClose}
          agendaFolderId={mockAgendaFolderId}
          folderFormState={folderFormState}
          setFolderFormState={mockSetFolderFormState}
          refetchAgendaFolder={mockRefetchAgendaFolder}
        />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('AgendaFolderUpdateModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal when isOpen is true', () => {
      renderAgendaFolderUpdateModal();

      expect(screen.getByTestId('updateAgendaFolderModal')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      renderAgendaFolderUpdateModal(MOCKS_SUCCESS, false);

      expect(
        screen.queryByTestId('updateAgendaFolderModal'),
      ).not.toBeInTheDocument();
    });

    it('renders modal with correct title', () => {
      renderAgendaFolderUpdateModal();

      expect(screen.getByText('updateAgendaFolder')).toBeInTheDocument();
    });

    it('renders folder name input field', () => {
      renderAgendaFolderUpdateModal();

      expect(
        screen.getByPlaceholderText('folderNamePlaceholder'),
      ).toBeInTheDocument();
    });

    it('renders folder description input field', () => {
      renderAgendaFolderUpdateModal();

      expect(screen.getByPlaceholderText('description')).toBeInTheDocument();
    });

    it('renders update button', () => {
      renderAgendaFolderUpdateModal();

      expect(screen.getByTestId('modal-submit-btn')).toBeInTheDocument();
    });

    it('displays current folder name in input', () => {
      renderAgendaFolderUpdateModal();

      const nameInput = screen.getByPlaceholderText(
        'folderNamePlaceholder',
      ) as HTMLInputElement;
      expect(nameInput.value).toBe('Test Folder');
    });

    it('displays current folder description in input', () => {
      renderAgendaFolderUpdateModal();

      const descInput = screen.getByPlaceholderText(
        'description',
      ) as HTMLInputElement;
      expect(descInput.value).toBe('Test Description');
    });

    it('renders update button with correct text', () => {
      renderAgendaFolderUpdateModal();

      const updateBtn = screen.getByTestId('modal-submit-btn');
      expect(updateBtn).toHaveTextContent('update');
    });

    it('renders cancel button', () => {
      renderAgendaFolderUpdateModal();

      expect(screen.getByTestId('modal-cancel-btn')).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('calls setFolderFormState when folder name is changed', async () => {
      renderAgendaFolderUpdateModal();

      const nameInput = screen.getByPlaceholderText('folderNamePlaceholder');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'New Folder Name');

      expect(mockSetFolderFormState).toHaveBeenCalled();
    });

    it('calls setFolderFormState when folder description is changed', async () => {
      renderAgendaFolderUpdateModal();

      const descInput = screen.getByPlaceholderText('description');
      await userEvent.clear(descInput);
      await userEvent.type(descInput, 'New Description');

      expect(mockSetFolderFormState).toHaveBeenCalled();
    });

    it('updates folder name with correct value', async () => {
      // Start with empty form state
      const emptyFormState: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        name: '',
      };

      renderAgendaFolderUpdateModal(MOCKS_SUCCESS, true, emptyFormState);

      const nameInput = screen.getByPlaceholderText('folderNamePlaceholder');
      await userEvent.type(nameInput, 'A');

      expect(mockSetFolderFormState).toHaveBeenCalledWith({
        ...emptyFormState,
        name: 'A',
      });
    });

    it('updates folder description with correct value', async () => {
      // Start with empty form state
      const emptyFormState: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        description: '',
      };

      renderAgendaFolderUpdateModal(MOCKS_SUCCESS, true, emptyFormState);

      const descInput = screen.getByPlaceholderText('description');
      await userEvent.type(descInput, 'B');

      expect(mockSetFolderFormState).toHaveBeenCalledWith({
        ...emptyFormState,
        description: 'B',
      });
    });

    it('handles empty folder name input', async () => {
      renderAgendaFolderUpdateModal();

      const nameInput = screen.getByPlaceholderText('folderNamePlaceholder');
      await userEvent.clear(nameInput);

      expect(mockSetFolderFormState).toHaveBeenCalledWith({
        ...mockFolderFormState,
        name: '',
      });
    });

    it('handles empty folder description input', async () => {
      renderAgendaFolderUpdateModal();

      const descInput = screen.getByPlaceholderText('description');
      await userEvent.clear(descInput);

      expect(mockSetFolderFormState).toHaveBeenCalledWith({
        ...mockFolderFormState,
        description: '',
      });
    });
  });

  describe('Form submission - Success', () => {
    it('calls updateAgendaFolder mutation when form is submitted', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaFolderUpdated',
          );
        },
        { timeout: 5000 },
      );
    });

    it('shows success notification after successful update', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaFolderUpdated',
          );
        },
        { timeout: 5000 },
      );
    });

    it('calls refetchAgendaFolder after successful update', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(mockRefetchAgendaFolder).toHaveBeenCalledTimes(1);
        },
        { timeout: 5000 },
      );
    });

    it('calls onClose after successful update', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 5000 },
      );
    });

    it('does not show error notification on successful update', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  describe('Form submission - Trimming', () => {
    it('trims whitespace from folder name before submission', async () => {
      const formStateWithWhitespace: InterfaceAgendaFolderUpdateFormStateType =
        {
          ...mockFolderFormState,
          name: '  Trimmed Name  ',
          description: '  Trimmed Description  ',
        };

      renderAgendaFolderUpdateModal(
        MOCKS_SUCCESS_TRIMMED,
        true,
        formStateWithWhitespace,
      );

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('disables submit when folder name is only whitespace', async () => {
      const formStateWithEmptyName: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        name: '   ',
      };

      renderAgendaFolderUpdateModal(
        MOCKS_SUCCESS,
        true,
        formStateWithEmptyName,
      );

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
      // Verify that clicking the disabled button doesn't trigger submission
      await userEvent.click(submitBtn);
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('sends undefined for empty trimmed description', async () => {
      const formStateWithEmptyDesc: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        description: '   ',
      };

      renderAgendaFolderUpdateModal(
        MOCKS_SUCCESS_EMPTY_DESCRIPTION,
        true,
        formStateWithEmptyDesc,
      );

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('handles empty description correctly', async () => {
      const formStateWithEmptyDesc: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        description: '',
      };

      renderAgendaFolderUpdateModal(
        MOCKS_SUCCESS_EMPTY_DESCRIPTION,
        true,
        formStateWithEmptyDesc,
      );

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Form submission - Error handling', () => {
    it('shows mutation error message when available', async () => {
      const mocks = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: mockAgendaFolderId,
                name: 'Test Folder',
                description: 'Test Description',
              },
            },
          },
          error: new Error('Update failed'),
        },
      ];

      renderAgendaFolderUpdateModal(mocks);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith('Update failed');
        },
        { timeout: 5000 },
      );
    });

    it('shows error notification when mutation fails', async () => {
      renderAgendaFolderUpdateModal(MOCKS_ERROR);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Failed to update agenda folder',
          );
        },
        { timeout: 5000 },
      );
    });

    it('does not call refetchAgendaFolder when mutation fails', async () => {
      renderAgendaFolderUpdateModal(MOCKS_ERROR);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('does not call onClose when mutation fails', async () => {
      renderAgendaFolderUpdateModal(MOCKS_ERROR);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not show success notification when mutation fails', async () => {
      renderAgendaFolderUpdateModal(MOCKS_ERROR);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(NotificationToast.success).not.toHaveBeenCalled();
    });

    it('handles Error instance in catch block', async () => {
      renderAgendaFolderUpdateModal(MOCKS_ERROR);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Failed to update agenda folder',
          );
        },
        { timeout: 5000 },
      );
    });

    it('handles GraphQL errors correctly', async () => {
      const MOCKS_GRAPHQL_ERROR: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: mockAgendaFolderId,
                name: 'Test Folder',
                description: 'Test Description',
              },
            },
          },
          result: {
            errors: [{ message: 'GraphQL error occurred' }],
          },
        },
      ];

      renderAgendaFolderUpdateModal(MOCKS_GRAPHQL_ERROR);

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Submit button state', () => {
    it('disables submit button when folder name is empty', () => {
      const emptyNameFormState: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        name: '',
      };

      renderAgendaFolderUpdateModal(MOCKS_SUCCESS, true, emptyNameFormState);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });

    it('disables submit button when folder name contains only whitespace', () => {
      const whitespaceNameFormState: InterfaceAgendaFolderUpdateFormStateType =
        {
          ...mockFolderFormState,
          name: '   ',
        };

      renderAgendaFolderUpdateModal(
        MOCKS_SUCCESS,
        true,
        whitespaceNameFormState,
      );

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });

    it('enables submit button when folder name has valid content', () => {
      renderAgendaFolderUpdateModal();

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).not.toBeDisabled();
    });
  });

  describe('Edge cases', () => {
    it('handles rapid form submissions gracefully', async () => {
      renderAgendaFolderUpdateModal([
        ...MOCKS_SUCCESS,
        ...MOCKS_SUCCESS,
        ...MOCKS_SUCCESS,
      ]);

      const submitBtn = screen.getByTestId('modal-submit-btn');

      // Click multiple times rapidly
      await userEvent.click(submitBtn);
      await userEvent.click(submitBtn);
      await userEvent.click(submitBtn);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles empty agendaFolderId gracefully', async () => {
      const MOCKS_EMPTY_ID: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: '',
                name: 'Test Folder',
                description: 'Test Description',
              },
            },
          },
          error: new Error('Invalid folder ID'),
        },
      ];

      render(
        <MockedProvider mocks={MOCKS_EMPTY_ID} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaFolderUpdateModal
              isOpen={true}
              onClose={mockOnClose}
              agendaFolderId=""
              folderFormState={mockFolderFormState}
              setFolderFormState={mockSetFolderFormState}
              refetchAgendaFolder={mockRefetchAgendaFolder}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Invalid folder ID',
          );
        },
        { timeout: 5000 },
      );
    });

    it('handles very long folder name', async () => {
      const longName = 'A'.repeat(1000);
      const formStateWithLongName: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        name: longName,
      };

      const MOCKS_LONG_NAME: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: mockAgendaFolderId,
                name: longName,
                description: 'Test Description',
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: mockAgendaFolderId,
                name: longName,
                description: 'Test Description',
              },
            },
          },
        },
      ];

      renderAgendaFolderUpdateModal(
        MOCKS_LONG_NAME,
        true,
        formStateWithLongName,
      );

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('handles special characters in folder name and description', async () => {
      const specialCharsFormState: InterfaceAgendaFolderUpdateFormStateType = {
        ...mockFolderFormState,
        name: 'Test@#$%^&*()',
        description: '<script>alert("test")</script>',
      };

      const MOCKS_SPECIAL_CHARS: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: mockAgendaFolderId,
                name: 'Test@#$%^&*()',
                description: '<script>alert("test")</script>',
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: mockAgendaFolderId,
                name: 'Test@#$%^&*()',
                description: '<script>alert("test")</script>',
              },
            },
          },
        },
      ];

      renderAgendaFolderUpdateModal(
        MOCKS_SPECIAL_CHARS,
        true,
        specialCharsFormState,
      );

      await userEvent.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Modal close handling', () => {
    it('calls onClose when cancel button is clicked', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-cancel-btn'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not submit form when modal is closed via cancel button', async () => {
      renderAgendaFolderUpdateModal();

      await userEvent.click(screen.getByTestId('modal-cancel-btn'));

      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });
  });
});
