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
  allottedHours: 2, // Default value for allottedHours
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

  it('renders correctly when the action item is completed', async () => {
    const completedActionItem = {
      ...sampleActionItem,
      isCompleted: true,
      completionAt: '2025-03-07T00:00:00.000Z',
      postCompletionNotes: 'Task completed successfully',
      allottedHours: 5, // Add the required property
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

  it('falls back to "No Category" when there is no categoryId', () => {
    const itemWithoutCategory = {
      ...sampleActionItem,
      categoryId: null,
      actionItemCategory: null,
    };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemViewModal
            isOpen={true}
            hide={hideMock}
            item={itemWithoutCategory}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // immediate fallback, no async query needed
    expect(screen.getByDisplayValue('No Category')).toBeInTheDocument();
  });

  it('falls back to "No Category" when query returns no matching category', async () => {
    const itemNoMatch = {
      ...sampleActionItem,
      categoryId: 'category2',
      actionItemCategory: null,
    };
    const emptyCategoryMock = {
      request: {
        query: GET_CATEGORIES_BY_IDS,
        variables: { ids: ['category2'] },
      },
      result: {
        data: {
          categoriesByIds: [],
        },
      },
    };

    render(
      <MockedProvider mocks={[...mocks, emptyCategoryMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemViewModal isOpen={true} hide={hideMock} item={itemNoMatch} />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // should still show the fallback text
    expect(await screen.findByDisplayValue('No Category')).toBeInTheDocument();
  });
});
