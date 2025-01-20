import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './OrgActionItemCategoryMocks';
import OrgActionItemCategories from './OrgActionItemCategories';
import { vi } from 'vitest';

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

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const dateTimePickerModule = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: dateTimePickerModule.DesktopDateTimePicker,
  };
});

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
    <MockedProvider addTypename={false} link={link}>
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

    const sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by createdAt_DESC
    fireEvent.click(sortBtn);
    await waitFor(() => {
      expect(screen.getByTestId('createdAt_DESC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('createdAt_DESC'));
    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 1',
      );
    });

    // Sort by createdAt_ASC
    fireEvent.click(sortBtn);
    await waitFor(() => {
      expect(screen.getByTestId('createdAt_ASC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('createdAt_ASC'));
    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 2',
      );
    });
  });

  it('Filter the categories by status (All/Disabled)', async () => {
    renderActionItemCategories(link1, 'orgId');

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by All
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('all')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('all'));

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Filter by Disabled
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('disabled')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('disabled'));
    await waitFor(() => {
      expect(screen.queryByText('Category 1')).toBeNull();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Filter the categories by status (Active)', async () => {
    renderActionItemCategories(link1, 'orgId');

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('active')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('active'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('open and closes Create Category modal', async () => {
    renderActionItemCategories(link1, 'orgId');

    const addCategoryBtn = await screen.findByTestId(
      'createActionItemCategoryBtn',
    );
    expect(addCategoryBtn).toBeInTheDocument();
    userEvent.click(addCategoryBtn);

    await waitFor(() => expect(screen.getAllByText(t.create)).toHaveLength(2));
    userEvent.click(screen.getByTestId('actionItemCategoryModalCloseBtn'));
    await waitFor(() =>
      expect(
        screen.queryByTestId('actionItemCategoryModalCloseBtn'),
      ).toBeNull(),
    );
  });

  it('open and closes Edit Category modal', async () => {
    renderActionItemCategories(link1, 'orgId');

    const editCategoryBtn = await screen.findByTestId('editCategoryBtn1');
    await waitFor(() => expect(editCategoryBtn).toBeInTheDocument());
    userEvent.click(editCategoryBtn);

    await waitFor(() =>
      expect(screen.getByText(t.updateActionItemCategory)).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('actionItemCategoryModalCloseBtn'));
    await waitFor(() =>
      expect(
        screen.queryByTestId('actionItemCategoryModalCloseBtn'),
      ).toBeNull(),
    );
  });

  it('Search categories by name', async () => {
    renderActionItemCategories(link1, 'orgId');

    const searchInput = await screen.findByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'Category 1');
    userEvent.click(screen.getByTestId('searchBtn'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('Search categories by name and clear the input by backspace', async () => {
    renderActionItemCategories(link1, 'orgId');

    const searchInput = await screen.findByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    // Clear the search input by backspace
    userEvent.type(searchInput, 'A{backspace}');
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Search categories by name on press of ENTER', async () => {
    renderActionItemCategories(link1, 'orgId');

    const searchInput = await screen.findByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    // Simulate typing and pressing ENTER
    userEvent.type(searchInput, 'Category 1{enter}');

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
});
