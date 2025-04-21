// ItemDeleteModal.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import ItemDeleteModal from './ItemDeleteModal'; // adjust the import path
import { DELETE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
// import type { ApolloLink } from '@apollo/client';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import type { RenderResult } from '@testing-library/react';
// import { I18nextProvider } from 'react-i18next';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { store } from 'state/store';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import i18nForTest from '../../../utils/i18nForTest';
// import { MOCKS, MOCKS_ERROR } from '../OrganizationActionItem.mocks';
// import { StaticMockLink } from 'utils/StaticMockLink';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceActionItem } from 'utils/interfaces';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

// Mock toast functions
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ItemDeleteModal', () => {
  const sampleActionItem: InterfaceActionItem = {
    id: '1',
    isCompleted: false,
    assignedAt: '2023-01-01T00:00:00.000Z',
    completionAt: '2023-01-02T00:00:00.000Z', // or an empty string if that's acceptable
    createdAt: '2022-12-31T00:00:00.000Z',
    updatedAt: '2022-12-31T00:00:00.000Z',
    preCompletionNotes: 'Sample pre-completion note',
    postCompletionNotes: null,
    organizationId: 'org1',
    categoryId: 'cat1',
    eventId: 'event1', // if eventId is required, otherwise you could set it to null if the type allows it
    assigneeId: 'user1',
    creatorId: 'user2',
    updaterId: 'user2',
    actionItemCategory: {
      id: 'cat1',
      name: 'Category 1',
    },
  };

  let hideMock = vi.fn();
  let refetchMock = vi.fn();

  beforeEach(() => {
    hideMock = vi.fn();
    refetchMock = vi.fn();
    toast.success = vi.fn();
    toast.error = vi.fn();
  });
  it('renders the modal with correct content', () => {
    render(
      <MockedProvider>
        <ItemDeleteModal
          isOpen={true}
          hide={hideMock}
          actionItem={sampleActionItem}
          actionItemsRefetch={refetchMock}
        />
      </MockedProvider>,
    );
    // Check that the modal displays the translation keys
    expect(screen.getByText('deleteActionItem')).toBeInTheDocument();
    expect(screen.getByText('deleteActionItemMsg')).toBeInTheDocument();
    // Check for close and action buttons by test id
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    expect(screen.getByTestId('deleteyesbtn')).toBeInTheDocument();
    expect(screen.getByTestId('deletenobtn')).toBeInTheDocument();
  });

  it('calls hide when the close button is clicked', () => {
    render(
      <MockedProvider>
        <ItemDeleteModal
          isOpen={true}
          hide={hideMock}
          actionItem={sampleActionItem}
          actionItemsRefetch={refetchMock}
        />
      </MockedProvider>,
    );
    fireEvent.click(screen.getByTestId('modalCloseBtn'));
    expect(hideMock).toHaveBeenCalled();
  });

  it('calls hide when the "no" button is clicked', () => {
    render(
      <MockedProvider>
        <ItemDeleteModal
          isOpen={true}
          hide={hideMock}
          actionItem={sampleActionItem}
          actionItemsRefetch={refetchMock}
        />
      </MockedProvider>,
    );
    fireEvent.click(screen.getByTestId('deletenobtn'));
    expect(hideMock).toHaveBeenCalled();
  });

  it('calls the delete mutation and then refetches data and hides the modal on successful deletion', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: DELETE_ACTION_ITEM_MUTATION,
          variables: {
            input: { id: sampleActionItem.id },
          },
        },
        result: {
          data: {
            deleteActionItem: {
              id: sampleActionItem.id,
              // Include other fields if needed.
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ItemDeleteModal
          isOpen={true}
          hide={hideMock}
          actionItem={sampleActionItem}
          actionItemsRefetch={refetchMock}
        />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalled();
      expect(hideMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('successfulDeletion');
    });
  });

  it('displays an error toast when the delete mutation fails', async () => {
    const errorMessage = 'Deletion failed';
    const mocks: MockedResponse[] = [
      {
        request: {
          query: DELETE_ACTION_ITEM_MUTATION,
          variables: {
            input: { id: sampleActionItem.id },
          },
        },
        error: new Error(errorMessage),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ItemDeleteModal
          isOpen={true}
          hide={hideMock}
          actionItem={sampleActionItem}
          actionItemsRefetch={refetchMock}
        />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
