import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ItemViewModal from './ItemViewModal';
import {
  GET_USERS_BY_IDS,
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';

const hideMock = vi.fn();

const sampleActionItem = {
  id: '1',
  isCompleted: false,
  assignedAt: '2023-01-01T00:00:00.000Z',
  completionAt: '',
  createdAt: '2022-12-31T00:00:00.000Z',
  updatedAt: '2022-12-31T00:00:00.000Z',
  preCompletionNotes: 'Pre notes',
  postCompletionNotes: null,
  organizationId: 'org1',
  categoryId: 'cat1',
  eventId: 'event1',
  assigneeId: 'user1',
  creatorId: 'user2',
  updaterId: 'user2',
  actionItemCategory: {
    id: 'cat1',
    name: 'Category 1',
  },
};

const mocks = [
  {
    request: {
      query: GET_USERS_BY_IDS,
      variables: { input: { ids: ['user1', 'user2'] } },
    },
    result: {
      data: {
        usersByIds: [
          { id: 'user1', name: 'Assignee User' },
          { id: 'user2', name: 'Creator User' },
        ],
      },
    },
  },
  {
    request: {
      query: GET_CATEGORIES_BY_IDS,
      variables: { ids: ['category1'] },
    },
    result: {
      data: {
        categoriesByIds: [{ id: 'category1', name: 'General' }],
      },
    },
  },
];

describe('ItemViewModal Component', () => {
  beforeEach(() => {
    hideMock.mockReset();
  });

  //   it('renders the modal with correct details', async () => {
  //     render(
  //       <MockedProvider mocks={mocks} addTypename={false}>
  //         <LocalizationProvider dateAdapter={AdapterDayjs}>
  //           <ItemViewModal isOpen={true} hide={hideMock} item={sampleActionItem} />
  //         </LocalizationProvider>
  //       </MockedProvider>
  //     );

  //     expect(screen.getByText('actionItemDetails')).toBeInTheDocument();
  //     expect(screen.getByText('category')).toBeInTheDocument();
  //     expect(screen.getByText('assignee')).toBeInTheDocument();
  //     expect(screen.getByText('assigner')).toBeInTheDocument();
  //     expect(screen.getByText('status')).toBeInTheDocument();
  //     expect(screen.getByText('preCompletionNotes')).toBeInTheDocument();

  //     // Ensure the category and assignee fields are displaying correctly
  //     expect(await screen.findByDisplayValue('General')).toBeInTheDocument();
  //     expect(await screen.findByDisplayValue('Assignee User')).toBeInTheDocument();
  //     expect(await screen.findByDisplayValue('Creator User')).toBeInTheDocument();

  //     // Ensure status is displayed correctly
  //     expect(screen.getByDisplayValue('pending')).toBeInTheDocument();
  //   });

  it('renders correctly when the action item is completed', async () => {
    const completedActionItem = {
      ...sampleActionItem,
      isCompleted: true,
      completionAt: '2025-03-07T00:00:00.000Z',
      postCompletionNotes: 'Task completed successfully',
    };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemViewModal
            isOpen={true}
            hide={hideMock}
            item={completedActionItem}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(await screen.findByDisplayValue('completed')).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue('Task completed successfully'),
    ).toBeInTheDocument();
  });

  it('calls hide function when close button is clicked', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemViewModal
            isOpen={true}
            hide={hideMock}
            item={sampleActionItem}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const closeButton = screen.getByTestId('modalCloseBtn');
    fireEvent.click(closeButton);

    expect(hideMock).toHaveBeenCalled();
  });
});
