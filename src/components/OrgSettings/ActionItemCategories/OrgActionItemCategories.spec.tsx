import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import dayjs from 'dayjs';
import {
  ACTION_ITEM_CATEGORY,
  GET_USER,
} from 'GraphQl/Queries/ActionItemCategoryQueries';
// import {  } from './OrgActionItemCategories'; // from the same file
// import type { InterfaceActionItemCategory } from 'utils/interfaces'
import { CreatorNameCell } from './OrgActionItemCategories';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './OrgActionItemCategoryMocks';
import OrgActionItemCategories from './OrgActionItemCategories';
export interface InterfaceActionItemCategory {
  id: string;
  name: string;
  organizationId: string;
  creatorId: string;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
}
interface InterfaceActionItemCategoryProps {
  creatorId: string;
}

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

export const creatorNameMocks = {
  // Stays in loading if no result or error is provided
  loading: [
    {
      request: {
        query: GET_USER,
        variables: { input: { id: 'loadingUser' } },
      },
      // Omit result => remains loading
    },
  ],

  // Simulates a GraphQL error (e.g. "User not found")
  error: [
    {
      request: {
        query: GET_USER,
        variables: { input: { id: 'errorUser' } },
      },
      error: new Error('User not found'),
    },
  ],

  // Returns a null user => fallback to displaying the ID
  nullData: [
    {
      request: {
        query: GET_USER,
        variables: { input: { id: 'nullDataUser' } },
      },
      result: {
        data: {
          user: null,
        },
      },
    },
  ],

  // Returns a valid user => displays the user name
  success: [
    {
      request: {
        query: GET_USER,
        variables: { input: { id: 'successUser' } },
      },
      result: {
        data: {
          user: { name: 'Test User Name' },
        },
      },
    },
  ],
};

describe('OrgActionItemCategories Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const testCreatorId = 'test-user-id';
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

  it('renders "Loading..." when the query is loading', () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USER,
          variables: { input: { id: testCreatorId } },
        },
        // No result provided: stays loading.
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatorNameCell creatorId={testCreatorId} />
      </MockedProvider>,
    );

    // Now query by the test id
    expect(screen.getByTestId('loading-text')).toBeInTheDocument();
  });

  it('renders creatorId when query returns error', async () => {
    render(
      <MockedProvider mocks={creatorNameMocks.error} addTypename={false}>
        <CreatorNameCell creatorId="errorUser" />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('errorUser')).toBeInTheDocument();
    });
  });

  it('renders creatorId when query returns null/undefined data', async () => {
    render(
      <MockedProvider mocks={creatorNameMocks.nullData} addTypename={false}>
        <CreatorNameCell creatorId="nullDataUser" />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('nullDataUser')).toBeInTheDocument();
    });
  });

  it('renders user name when query is successful', async () => {
    render(
      <MockedProvider mocks={creatorNameMocks.success} addTypename={false}>
        <CreatorNameCell creatorId="successUser" />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test User Name')).toBeInTheDocument();
    });
  });
  // New test for error branch: When query fails (catError)
  it('renders error message if query fails', async () => {
    const errorMocks: MockedResponse[] = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY,
          variables: { input: { organizationId: 'org1' } },
        },
        error: new Error('Network Error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
      expect(screen.getByText(/Network Error/)).toBeInTheDocument();
    });
  });

  // New test for modal close functionality (covering closeModal)
  it('closes modal when the close button is clicked', async () => {
    // Render the component with success mocks so modal can open
    render(
      <MockedProvider
        mocks={[...mockActionCategoriesSuccess, ...mockGetUserNameSuccess]}
        addTypename={false}
      >
        <OrgActionItemCategories orgId="org1" />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
    });

    // Open the modal by clicking the create button.
    const createBtn = screen.getByTestId('createActionItemCategoryBtn');
    fireEvent.click(createBtn);

    // Wait for modal to appear
    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemCategoryModalCloseBtn'),
      ).toBeInTheDocument();
    });

    // Click the modal close button
    fireEvent.click(screen.getByTestId('actionItemCategoryModalCloseBtn'));

    // Wait for the modal to disappear
    await waitFor(() => {
      expect(
        screen.queryByTestId('actionItemCategoryModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });
});
