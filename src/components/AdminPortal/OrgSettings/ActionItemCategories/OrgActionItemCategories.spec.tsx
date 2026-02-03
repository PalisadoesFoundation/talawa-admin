import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
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
import { vi, it } from 'vitest';

/**
 * This file contains unit tests for the `OrgActionItemCategories` component.
 *
 * The tests cover:
 * - Proper rendering of the component under different conditions, including scenarios with populated categories, empty categories, and API errors.
 * - User interactions such as searching, filtering, sorting categories, and opening/closing modals for creating or editing categories.
 * - Verification of GraphQL query and mutation behaviors using mock data, ensuring correct functionality in both success and error cases.
 * - Handling edge cases like no input, invalid input, and form resets.
 * - Integration tests for Redux state, routing, internationalization, and toast notifications.
 * - Ensuring sorting functionality reflects the `createdAt` property both in ascending and descending order.
 * - Testing the modal interactions for creating and editing categories, ensuring proper lifecycle (open/close) and state updates.
 * - Checking the rendering of error messages and placeholders when no data is available or an error occurs.
 * - Validation of search functionality for categories by name, including clearing the search input and using keyboard shortcuts like `Enter`.
 */

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_EMPTY);
const link3 = new StaticMockLink(MOCKS_ERROR);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.orgActionItemCategories ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderActionItemCategories = (
  link: ApolloLink,
  orgId: string,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <OrgActionItemCategories orgId={orgId} />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing Organisation Action Item Categories', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should render the Action Item Categories Screen', async () => {
    renderActionItemCategories(link1, 'orgId');
    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Sort the Categories (asc/desc) by createdAt', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const sortBtn = screen.getByTestId('sort-toggle');
    expect(sortBtn).toBeInTheDocument();

    // Sort by createdAt_DESC
    await user.click(sortBtn);
    expect(
      await screen.findByTestId('sort-item-createdAt_DESC'),
    ).toBeInTheDocument();
    await user.click(screen.getByTestId('sort-item-createdAt_DESC'));
    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 1',
      );
    });

    // Sort by createdAt_ASC
    await user.click(sortBtn);
    await waitFor(() => {
      expect(screen.getByTestId('sort-item-createdAt_ASC')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('sort-item-createdAt_ASC'));
    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 2',
      );
    });
  });

  it('Filter the categories by status (All/Disabled)', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const filterBtn = screen.getByTestId('filter-toggle');
    expect(filterBtn).toBeInTheDocument();

    // Filter by All
    await user.click(filterBtn);
    await waitFor(async () => {
      expect(await screen.findByTestId('filter-item-all')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('filter-item-all'));

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Filter by Disabled
    await user.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('filter-item-disabled')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('filter-item-disabled'));
    await waitFor(() => {
      expect(screen.queryByText('Category 1')).toBeNull();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
      // Verify dataTestId attribute is properly applied to StatusBadge components
      const statusChips = screen.getAllByTestId('statusChip');
      expect(statusChips).toHaveLength(1); // Only Category 2 is disabled
      expect(statusChips[0]).toHaveTextContent('Disabled');
    });
  });

  it('Filter the categories by status (Active)', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const filterBtn = screen.getByTestId('filter-toggle');
    expect(filterBtn).toBeInTheDocument();

    await user.click(filterBtn);
    const activeOption = await screen.findByTestId('filter-item-active');
    expect(activeOption).toBeInTheDocument();
    await user.click(screen.getByTestId('filter-item-active'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
      // Verify dataTestId attribute is properly applied to StatusBadge components
      const statusChips = screen.getAllByTestId('statusChip');
      expect(statusChips).toHaveLength(1); // Only Category 1 is active
      expect(statusChips[0]).toHaveTextContent('Active');
    });
  });

  it('open and closes Create Category modal', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const addCategoryBtn = screen.getByTestId('createActionItemCategoryBtn');
    expect(addCategoryBtn).toBeInTheDocument();
    await user.click(addCategoryBtn);

    await waitFor(() => expect(screen.getAllByText(t.create)).toHaveLength(2));
    await user.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes Edit Category modal', async () => {
    renderActionItemCategories(link1, 'orgId');

    const editCategoryBtn = await screen.findByTestId('editCategoryBtn1');
    await waitFor(() => expect(editCategoryBtn).toBeInTheDocument());
    await user.click(editCategoryBtn);

    await waitFor(() =>
      expect(screen.getByText(t.updateActionItemCategory)).toBeInTheDocument(),
    );
    await user.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes View Category modal', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for categories to load
    const viewCategoryBtn = await screen.findByTestId('viewCategoryBtn1');
    expect(viewCategoryBtn).toBeInTheDocument();

    // Open view modal
    await user.click(viewCategoryBtn);

    // Check modal is open by looking for the modal content
    await waitFor(() =>
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument(),
    );

    // Close the view modal
    await user.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('Search categories by name', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'Category 1');
    await user.click(screen.getByTestId('searchBtn'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('Search categories by description', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    // Search by description - "Test description" matches Category 1's description
    await user.type(searchInput, 'Test description');
    await user.click(screen.getByTestId('searchBtn'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('Search categories by name and clear the input by backspace', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    // Clear the search input by backspace
    await user.type(searchInput, 'A{backspace}');
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Search categories by name on press of ENTER', async () => {
    renderActionItemCategories(link1, 'orgId');

    // Wait for LoadingState to complete and categories to render
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    // Simulate typing and pressing ENTER
    await user.type(searchInput, 'Category 1{enter}');

    // Wait for the filtering to complete
    await waitFor(() => {
      // Assert only "Category 1" is visible
      const categories = screen.getAllByTestId('categoryName');
      expect(categories).toHaveLength(1);
      expect(categories[0]).toHaveTextContent('Category 1');
    });
  });

  it('should render Empty Action Item Categories Screen', async () => {
    renderActionItemCategories(link2, 'orgId');
    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
      expect(screen.getByText(t.noActionItemCategories)).toBeInTheDocument();
    });
  });

  it('should render the Action Item Categories Screen with error', async () => {
    renderActionItemCategories(link3, 'orgId');
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  describe('LoadingState Behavior', () => {
    it('should show spinner initially and hide after data loads', async () => {
      renderActionItemCategories(link1, 'orgId');

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should render content after LoadingState completes', async () => {
      renderActionItemCategories(link1, 'orgId');

      await waitFor(() => {
        expect(screen.getByTestId('searchByName')).toBeInTheDocument();
        expect(screen.getByTestId('sort-container')).toBeInTheDocument();
        expect(screen.getByTestId('filter-container')).toBeInTheDocument();
      });
    });

    it('should handle LoadingState with empty results', async () => {
      renderActionItemCategories(link2, 'orgId');

      await waitFor(() => {
        expect(screen.getByText(t.noActionItemCategories)).toBeInTheDocument();
      });
    });
  });
});
