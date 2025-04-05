import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import dayjs from 'dayjs';

import OrgActionItemCategories from './OrgActionItemCategories';
import {
  ACTION_ITEM_CATEGORY,
  GET_USER,
} from 'GraphQl/Queries/ActionItemCategoryQueries';
// import {  } from './OrgActionItemCategories'; // from the same file
import type { InterfaceActionItemCategory } from 'utils/interfaces';

// Mock i18n so we don’t worry about translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'en' },
  }),
}));

// Mock sub-components that we aren’t focusing on in detail
vi.mock('subComponents/SortingButton', () => ({
  __esModule: true,
  default: ({
    title,
    sortingOptions,
    selectedOption,
    onSortChange,
    dataTestIdPrefix,
  }: {
    title: string;
    sortingOptions: { label: string; value: string }[];
    selectedOption: string;
    onSortChange: (val: string) => void;
    dataTestIdPrefix: string;
  }) => {
    return (
      <select
        data-testid={dataTestIdPrefix}
        aria-label={title}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortingOptions.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            aria-label={opt.label}
            selected={opt.label === selectedOption}
          >
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
}));

vi.mock('subComponents/SearchBar', () => ({
  __esModule: true,
  default: ({
    onSearch,
    inputTestId,
    buttonTestId,
  }: {
    onSearch: (val: string) => void;
    inputTestId: string;
    buttonTestId: string;
  }) => {
    return (
      <div>
        <input
          data-testid={inputTestId}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button data-testid={buttonTestId} onClick={() => onSearch('')}>
          Clear
        </button>
      </div>
    );
  },
}));

// We'll reference the same GET_USER_NAME used in the code
// If it's not exported, define your own local copy
export const mockCreatorQuery = GET_USER;

// ---------------------------
// 1. Mock Data for Categories
// ---------------------------
const mockCategories: InterfaceActionItemCategory[] = [
  {
    id: 'cat1',
    name: 'Category One',
    organizationId: 'org1',
    creatorId: 'user1',
    isDisabled: false,
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-02T12:00:00.000Z',
  },
  {
    id: 'cat2',
    name: 'Category Two',
    organizationId: 'org1',
    creatorId: 'user2',
    isDisabled: true,
    createdAt: '2025-01-02T12:00:00.000Z',
    updatedAt: '2025-01-03T12:00:00.000Z',
  },
];

// 2. Mock Data for GET_USER queries
const mockUser1Name = 'User One';
const mockUser2Name = 'User Two';

// 3. Apollo Mocks
const mockActionCategoriesSuccess: MockedResponse[] = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY,
      variables: {
        input: {
          organizationId: 'org1',
        },
      },
    },
    result: {
      data: {
        actionCategoriesByOrganization: mockCategories,
      },
    },
  },
];

// Mocks for the GET_USER query
const mockGetUserNameSuccess: MockedResponse[] = [
  {
    request: {
      query: GET_USER,
      variables: {
        input: { id: 'user1' },
      },
    },
    result: {
      data: {
        user: { name: mockUser1Name },
      },
    },
  },
  {
    request: {
      query: GET_USER,
      variables: {
        input: { id: 'user2' },
      },
    },
    result: {
      data: {
        user: { name: mockUser2Name },
      },
    },
  },
];

describe('OrgActionItemCategories Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders rows after successful fetch', async () => {
    render(
      <MockedProvider
        mocks={[...mockActionCategoriesSuccess, ...mockGetUserNameSuccess]}
        addTypename={false}
      >
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );

    // Wait for rows
    await waitFor(() => {
      // "Category One" should appear
      expect(screen.getByText('Category One')).toBeInTheDocument();
      // "Category Two" should appear
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });

    // We expect 2 status chips (Active, Disabled)
    // Because row1 => Active, row2 => Disabled
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('filters categories by search term', async () => {
    render(
      <MockedProvider
        mocks={[...mockActionCategoriesSuccess, ...mockGetUserNameSuccess]}
        addTypename={false}
      >
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });

    // Search for "Two"
    const searchInput = screen.getByTestId('searchByName') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Two' } });

    // Only "Category Two" should remain
    await waitFor(() => {
      expect(screen.queryByText('Category One')).not.toBeInTheDocument();
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });
  });

  it('filters categories by status (active, disabled)', async () => {
    render(
      <MockedProvider
        mocks={[...mockActionCategoriesSuccess, ...mockGetUserNameSuccess]}
        addTypename={false}
      >
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });

    // The select for status has data-testid prefix = "filter"
    const statusSelect = screen.getByTestId('filter') as HTMLSelectElement;
    // set to "disabled"
    fireEvent.change(statusSelect, { target: { value: 'disabled' } });

    // Only the disabled category remains (Category Two)
    await waitFor(() => {
      expect(screen.queryByText('Category One')).not.toBeInTheDocument();
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });

    // Now set to "active"
    fireEvent.change(statusSelect, { target: { value: 'active' } });
    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
      expect(screen.queryByText('Category Two')).not.toBeInTheDocument();
    });
  });

  it('sorts categories by created date', async () => {
    render(
      <MockedProvider
        mocks={[...mockActionCategoriesSuccess, ...mockGetUserNameSuccess]}
        addTypename={false}
      >
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });

    // By default we set "createdAt_DESC" => cat2 first -> cat1 second
    // Check the row "Sr. No." cell text or something
    // We'll do a quick check for the "Category" column order

    // The DataGrid "Sr. No." column uses sortedCategories => let's read them
    const rowIds = screen.getAllByTestId('rowId').map((el) => el.textContent);
    // rowId is 1,2 but let's see if the first row has "Category Two"
    const categoryCells = screen
      .getAllByTestId('categoryName')
      .map((el) => el.textContent);

    // Expect "Category Two" is first, "Category One" is second in the rendered list
    expect(categoryCells[0]).toBe('Category Two');
    expect(categoryCells[1]).toBe('Category One');

    // Now let's switch to "createdAt_ASC"
    const sortSelect = screen.getByTestId('sort') as HTMLSelectElement;
    fireEvent.change(sortSelect, { target: { value: 'createdAt_ASC' } });

    // Now "Category One" should appear first
    await waitFor(() => {
      const updatedCells = screen
        .getAllByTestId('categoryName')
        .map((el) => el.textContent);
      expect(updatedCells[0]).toBe('Category One');
      expect(updatedCells[1]).toBe('Category Two');
    });
  });

  it('opens modal on clicking create and edit buttons', async () => {
    render(
      <MockedProvider
        mocks={[...mockActionCategoriesSuccess, ...mockGetUserNameSuccess]}
        addTypename={false}
      >
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
    });

    // 1) Click "create" => opens CategoryModal
    const createBtn = screen.getByTestId('createActionItemCategoryBtn');
    fireEvent.click(createBtn);
    // The CategoryModal might have a test id, or we can expect certain text
    // We can check if the "Close" button or form is visible
    // For now, we test the "isOpen" state is true if there's dataTestId in the modal
    // Suppose CategoryModal has dataTestId="categoryModal"
    // If not, we can rely on anything that we know is in that modal
    await waitFor(() => {
      // We rely on the presence of something from the CategoryModal
      // We can do:
      expect(
        screen.getByTestId('actionItemCategoryModalCloseBtn'),
      ).toBeInTheDocument();
    });

    // 2) Click an edit button => opens in "edit" mode
    const editBtnForCat1 = screen.getByTestId('editCategoryBtncat1');
    fireEvent.click(editBtnForCat1);

    // Wait for the modal again
    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemCategoryModalCloseBtn'),
      ).toBeInTheDocument();
    });
  });
});
