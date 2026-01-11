import React, { act } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import i18nForTest from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { DropResult } from '@hello-pangea/dnd';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import {
  MOCKS,
  MOCKS_ERROR,
  MOCKS_DRAG_DROP,
  MOCKS_DRAG_DROP_ERROR,
  props,
  props2,
} from './AgendaItemsMocks';
import AgendaItemsContainer from './AgendaItemsContainer';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Store the onDragEnd callback to call it directly in tests
let capturedOnDragEnd: ((result: DropResult) => void) | null = null;

// Helper function to safely call capturedOnDragEnd
const callOnDragEnd = (result: DropResult): void => {
  if (capturedOnDragEnd) {
    capturedOnDragEnd(result);
  }
};

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  navigate: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

// Mock @hello-pangea/dnd to capture onDragEnd callback
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd: (result: DropResult) => void;
  }) => {
    capturedOnDragEnd = onDragEnd;
    return <div data-testid="drag-drop-context">{children}</div>;
  },
  Droppable: ({
    children,
  }: {
    children: (
      provided: {
        droppableProps: Record<string, unknown>;
        innerRef: (el: HTMLElement | null) => void;
      },
      snapshot: { isDraggingOver: boolean },
    ) => React.ReactNode;
    droppableId: string;
  }) => {
    return children(
      {
        droppableProps: {},
        innerRef: () => {},
      },
      { isDraggingOver: false },
    );
  },
  Draggable: ({
    children,
  }: {
    children: (
      provided: {
        draggableProps: Record<string, unknown>;
        dragHandleProps: Record<string, unknown>;
        innerRef: (el: HTMLElement | null) => void;
      },
      snapshot: { isDragging: boolean },
    ) => React.ReactNode;
    draggableId: string;
    index: number;
  }) => {
    return children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: () => {},
      },
      { isDragging: false },
    );
  },
}));

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);
const linkDragDrop = new StaticMockLink(MOCKS_DRAG_DROP, true);
const linkDragDropError = new StaticMockLink(MOCKS_DRAG_DROP_ERROR, true);

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

//temporarily fixes react-beautiful-dnd droppable method's depreciation error
//needs to be fixed in React 19
vi.spyOn(console, 'error').mockImplementation((message) => {
  if (message.includes('Support for defaultProps will be removed')) {
    return;
  }
  console.error(message);
});

async function wait(ms = 100): Promise<void> {
  await act(async () => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  });
}

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.agendaItems),
);

describe('Testing Agenda Items components', () => {
  beforeEach(() => {
    capturedOnDragEnd = null;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  const formData = {
    title: 'AgendaItem 1 Edited',
    description: 'AgendaItem 1 Description Edited',
  };

  test('component loads correctly with items', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaItems),
      ).not.toBeInTheDocument();
    });
  });

  test('component loads correctly with no agenda items', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props2} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaItems),
      ).toBeInTheDocument();
    });
  });

  test('opens and closes the update modal correctly', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('updateAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('opens and closes the preview modal correctly', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('previewAgendaItemModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('previewAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalDeleteBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalDeleteBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaItemCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteAgendaItemCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('deleteAgendaItemCloseBtn'),
      ).not.toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalUpdateBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalUpdateBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('updateAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('updates an agenda Items and toasts success', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    const title = screen.getByPlaceholderText(translations.enterTitle);
    const description = screen.getByPlaceholderText(
      translations.enterDescription,
    );

    fireEvent.change(title, { target: { value: '' } });
    await userEvent.type(title, formData.title);

    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('updateAgendaItemBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      // expect(toast.success).toBeCalledWith(translations.agendaItemUpdated);
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    render(
      <MockedProvider link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    const titleInput = screen.getByLabelText(translations.title);
    const descriptionInput = screen.getByLabelText(translations.description);
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, {
      target: { value: '' },
    });
    await userEvent.type(titleInput, formData.title);
    await userEvent.type(descriptionInput, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('updateAgendaItemBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('deletes the agenda item and toasts success', async () => {
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalDeleteBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalDeleteBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaItemCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalledWith(
        translations.agendaItemDeleted,
      );
    });
  });

  test('toasts error on unsuccessful deletion', async () => {
    render(
      <MockedProvider link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalDeleteBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalDeleteBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaItemCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('handles drag and drop to reorder agenda items', async () => {
    const mockRefetch = vi.fn();
    const propsWithMockRefetch = {
      ...props,
      agendaItemRefetch: mockRefetch,
    };

    render(
      <MockedProvider link={linkDragDrop}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...propsWithMockRefetch} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    // Verify agenda items are rendered
    await waitFor(() => {
      expect(screen.getByText('AgendaItem 1')).toBeInTheDocument();
      expect(screen.getByText('AgendaItem 2')).toBeInTheDocument();
    });

    // Verify the drag-drop context is rendered and callback is captured
    expect(capturedOnDragEnd).not.toBeNull();

    // Simulate a drag from index 0 to index 1 (swap items)
    await act(async () => {
      callOnDragEnd({
        source: { index: 0, droppableId: 'agendaItems' },
        destination: { index: 1, droppableId: 'agendaItems' },
        draggableId: 'agendaItem1',
        type: 'DEFAULT',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      });
    });

    await wait(200);

    // Verify refetch was called after successful reorder
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  test('handles drag end with no destination (cancelled drag)', async () => {
    const mockRefetch = vi.fn();
    const propsWithMockRefetch = {
      ...props,
      agendaItemRefetch: mockRefetch,
    };

    render(
      <MockedProvider link={linkDragDrop}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...propsWithMockRefetch} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    // Verify items are rendered
    await waitFor(() => {
      expect(screen.getByText('AgendaItem 1')).toBeInTheDocument();
    });

    expect(capturedOnDragEnd).not.toBeNull();

    // Simulate a cancelled drag (no destination)
    await act(async () => {
      callOnDragEnd({
        source: { index: 0, droppableId: 'agendaItems' },
        destination: null,
        draggableId: 'agendaItem1',
        type: 'DEFAULT',
        mode: 'FLUID',
        reason: 'CANCEL',
        combine: null,
      });
    });

    await wait();

    // When drag is cancelled (no destination), refetch should not be called
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  test('handles drag end with undefined agendaItemData', async () => {
    const mockRefetch = vi.fn();
    const propsWithUndefinedData = {
      ...props,
      agendaItemData: undefined,
      agendaItemRefetch: mockRefetch,
    };

    render(
      <MockedProvider link={linkDragDrop}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...propsWithUndefinedData} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    expect(capturedOnDragEnd).not.toBeNull();

    // Simulate a drag when agendaItemData is undefined
    await act(async () => {
      callOnDragEnd({
        source: { index: 0, droppableId: 'agendaItems' },
        destination: { index: 1, droppableId: 'agendaItems' },
        draggableId: 'agendaItem1',
        type: 'DEFAULT',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      });
    });

    await wait();

    // When agendaItemData is undefined, onDragEnd should exit early without calling refetch
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  test('displays categories correctly with multiple categories', async () => {
    const propsWithMultipleCategories = {
      ...props,
      agendaItemData: [
        {
          _id: 'agendaItem1',
          title: 'AgendaItem 1',
          description: 'Description 1',
          duration: '2h',
          attachments: [],
          createdBy: { _id: 'user0', firstName: 'John', lastName: 'Doe' },
          urls: [],
          users: [],
          sequence: 1,
          categories: [
            { _id: 'cat1', name: 'Category 1' },
            { _id: 'cat2', name: 'Category 2' },
          ],
          organization: { _id: 'org1', name: 'Org 1' },
          relatedEvent: { _id: 'event1', title: 'Event 1' },
        },
      ],
    };

    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...propsWithMultipleCategories} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByText(/Category 1/)).toBeInTheDocument();
      expect(screen.getByText(/Category 2/)).toBeInTheDocument();
    });
  });

  test('displays "No Category" when agenda item has no categories', async () => {
    const propsWithNoCategories = {
      ...props,
      agendaItemData: [
        {
          _id: 'agendaItem1',
          title: 'AgendaItem Without Category',
          description: 'Description',
          duration: '1h',
          attachments: [],
          createdBy: { _id: 'user0', firstName: 'John', lastName: 'Doe' },
          urls: [],
          users: [],
          sequence: 1,
          categories: [],
          organization: { _id: 'org1', name: 'Org 1' },
          relatedEvent: { _id: 'event1', title: 'Event 1' },
        },
      ],
    };

    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...propsWithNoCategories} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByText('No Category')).toBeInTheDocument();
    });
  });

  test('toasts error when drag and drop reorder fails', async () => {
    render(
      <MockedProvider link={linkDragDropError}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    // Verify items are rendered
    await waitFor(() => {
      expect(screen.getByText('AgendaItem 1')).toBeInTheDocument();
    });

    expect(capturedOnDragEnd).not.toBeNull();

    // Simulate a drag that will trigger an error from the mock
    await act(async () => {
      callOnDragEnd({
        source: { index: 0, droppableId: 'agendaItems' },
        destination: { index: 1, droppableId: 'agendaItems' },
        draggableId: 'agendaItem1',
        type: 'DEFAULT',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      });
    });

    await wait(200);

    // Should toast an error
    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('calls refetch when drag ends with no position change', async () => {
    const mockRefetch = vi.fn();
    const baseAgendaItemData = props.agendaItemData ?? [];

    // Defensive check: ensure mock data has at least 2 items for this test
    if (!baseAgendaItemData || baseAgendaItemData.length < 2) {
      throw new Error(
        'Test setup: baseAgendaItemData must contain at least 2 items',
      );
    }

    // Create props with items whose sequence already matches their index + 1
    const propsWithMatchingSequence = {
      ...props,
      agendaItemRefetch: mockRefetch,
      agendaItemData: [
        {
          ...baseAgendaItemData[0],
          sequence: 1, // Already at correct position
        },
        {
          ...baseAgendaItemData[1],
          sequence: 2, // Already at correct position
        },
      ],
    };

    render(
      <MockedProvider link={linkDragDrop}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...propsWithMatchingSequence} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByText('AgendaItem 1')).toBeInTheDocument();
    });

    expect(capturedOnDragEnd).not.toBeNull();

    // Simulate a drag to the same position (no change)
    await act(async () => {
      callOnDragEnd({
        source: { index: 0, droppableId: 'agendaItems' },
        destination: { index: 0, droppableId: 'agendaItems' },
        draggableId: 'agendaItem1',
        type: 'DEFAULT',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      });
    });

    await wait(100);

    // Refetch should still be called even when no sequence updates occur
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
