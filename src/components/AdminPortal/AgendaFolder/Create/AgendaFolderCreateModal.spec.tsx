import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';

import AgendaFolderCreateModal from './AgendaFolderCreateModal';
import { CREATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { StaticMockLink } from 'utils/StaticMockLink';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

let mockOrgId: string | undefined = 'org-123';

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: mockOrgId }),
  };
});

describe('AgendaFolderCreateModal', () => {
  afterEach(() => {
    cleanup();
    mockOrgId = 'org-123';
    vi.restoreAllMocks(); // restore spy implementations
  });

  it('renders modal when open', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('createAgendaFolderModal')).toBeInTheDocument();
    expect(screen.getByText('agendaFolderDetails')).toBeInTheDocument();
  });

  it('creates agenda folder with sequence = 1 when no folders exist', async () => {
    const user = userEvent.setup();
    const refetchMock = vi.fn();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Folder A',
                    description: 'Desc A',
                    eventId: 'event-1',
                    sequence: 1,
                    organizationId: 'org-123',
                  },
                },
              },
              result: {
                data: {
                  createAgendaFolder: {
                    id: '1',
                    name: 'Folder A',
                    description: 'Desc A',
                    sequence: 1,
                    event: { id: 'event-1', name: 'Event' },
                    creator: { id: 'u1', name: 'Admin' },
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={refetchMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Folder A');
    await user.type(screen.getByLabelText(/description/i), 'Desc A');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaFolderCreated',
        );
        expect(refetchMock).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('creates agenda folder with next sequence when folders exist', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Folder B',
                    description: 'Desc B',
                    eventId: 'event-1',
                    sequence: 3,
                    organizationId: 'org-123',
                  },
                },
              },
              result: {
                data: {
                  createAgendaFolder: {
                    id: '3',
                    name: 'Folder B',
                    description: 'Desc B',
                    sequence: 3,
                    event: { id: 'event-1', name: 'Event' },
                    creator: { id: 'u1', name: 'Admin' },
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{
              agendaFoldersByEventId: [
                { id: '1', name: 'F1', sequence: 1, items: { edges: [] } },
                { id: '2', name: 'F2', sequence: 2, items: { edges: [] } },
              ],
            }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Folder B');
    await user.type(screen.getByLabelText(/description/i), 'Desc B');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('shows error toast when mutation fails', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Bad Folder',
                    description: 'Bad Desc',
                    eventId: 'event-1',
                    sequence: 1,
                    organizationId: 'org-123',
                  },
                },
              },
              error: new Error('Mutation failed'),
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Bad Folder');
    await user.type(screen.getByLabelText(/description/i), 'Bad Desc');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith('Mutation failed');
      },
      { timeout: 5000 },
    );
  });

  it('handles undefined agendaFolderData gracefully', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Folder U',
                    description: 'Desc U',
                    eventId: 'event-1',
                    sequence: 1,
                    organizationId: 'org-123',
                  },
                },
              },
              result: {
                data: {
                  createAgendaFolder: {
                    id: '10',
                    name: 'Folder U',
                    description: 'Desc U',
                    sequence: 1,
                    event: { id: 'event-1', name: 'Event' },
                    creator: { id: 'u1', name: 'Admin' },
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={undefined}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Folder U');
    await user.type(screen.getByLabelText(/description/i), 'Desc U');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('calls hideCreateModal when modal close button is clicked', async () => {
    const hideMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={hideMock}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(hideMock).toHaveBeenCalled();
    });
  });

  it('does not show modal when isOpen is false', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={false}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('correctly calculates sequence when folders have mixed sequence values', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Mixed Sequence',
                    description: 'Mixed Desc',
                    eventId: 'event-1',
                    sequence: 6,
                    organizationId: 'org-123',
                  },
                },
              },
              result: {
                data: {
                  createAgendaFolder: {
                    id: '106',
                    name: 'Mixed Sequence',
                    description: 'Mixed Desc',
                    sequence: 6,
                    event: { id: 'event-1', name: 'Event' },
                    creator: { id: 'u1', name: 'Admin' },
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{
              agendaFoldersByEventId: [
                { id: '1', name: 'F1', sequence: 1, items: { edges: [] } },
                { id: '2', name: 'F2', sequence: 5, items: { edges: [] } },
                { id: '3', name: 'F3', sequence: 3, items: { edges: [] } },
              ],
            }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Mixed Sequence');
    await user.type(screen.getByLabelText(/description/i), 'Mixed Desc');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('uses formState values in mutation correctly', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Form State Test',
                    description: 'Form State Description',
                    eventId: 'event-1',
                    sequence: 1,
                    organizationId: 'org-123',
                  },
                },
              },
              result: {
                data: {
                  createAgendaFolder: {
                    id: '107',
                    name: 'Form State Test',
                    description: 'Form State Description',
                    sequence: 1,
                    event: { id: 'event-1', name: 'Event' },
                    creator: { id: 'u1', name: 'Admin' },
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Form State Test');
    await user.type(
      screen.getByLabelText(/description/i),
      'Form State Description',
    );
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaFolderCreated',
        );
      },
      { timeout: 5000 },
    );
  });

  it('handles error and does not reset form or call hideCreateModal on failure', async () => {
    const user = userEvent.setup();
    const hideMock = vi.fn();
    const refetchMock = vi.fn();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Error Test',
                    description: 'Error Desc',
                    eventId: 'event-1',
                    sequence: 1,
                    organizationId: 'org-123',
                  },
                },
              },
              error: new Error('Creation failed'),
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={hideMock}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={refetchMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const nameInput = screen.getByLabelText(/folderName/i);
    const descInput = screen.getByLabelText(/description/i);

    await user.type(nameInput, 'Error Test');
    await user.type(descInput, 'Error Desc');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith('Creation failed');
        // Form should still have values after error
        expect(nameInput).toHaveValue('Error Test');
        expect(descInput).toHaveValue('Error Desc');
        // These should not be called on error
        expect(hideMock).not.toHaveBeenCalled();
        expect(refetchMock).not.toHaveBeenCalled();
        expect(NotificationToast.success).not.toHaveBeenCalled();
      },
      { timeout: 10000 },
    );
  });

  it('handles non-array agendaFoldersByEventId safely', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: {} as never }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('createAgendaFolderModal')).toBeInTheDocument();
  });

  it('handles mutation error without crashing when error message is missing', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_FOLDER_MUTATION,
                variables: {
                  input: {
                    name: 'Weird Error',
                    description: 'Desc',
                    eventId: 'event-1',
                    sequence: 1,
                    organizationId: 'org-123',
                  },
                },
              },
              // Apollo-compatible "no message" error
              error: new Error(),
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/folderName/i), 'Weird Error');
    await user.type(screen.getByLabelText(/description/i), 'Desc');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalled();
        expect(NotificationToast.success).not.toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('shows error and renders nothing when orgId is missing', async () => {
    mockOrgId = undefined;

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaFolderCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaFolderData={{ agendaFoldersByEventId: [] }}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'organizationRequired',
      );
    });

    expect(
      screen.queryByTestId('createAgendaFolderModal'),
    ).not.toBeInTheDocument();
  });
});
