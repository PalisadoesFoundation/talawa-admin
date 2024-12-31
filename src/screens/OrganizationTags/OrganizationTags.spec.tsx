import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import OrganizationTags from './OrganizationTags';
import { MOCKS, MOCKS_ERROR } from './OrganizationTagsMocks';
import type { ApolloLink } from '@apollo/client';

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationTags ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderOrganizationTags = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route path="/orgtags/:orgId" element={<OrganizationTags />} />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/subTags/:tagId"
                element={<div data-testid="subTagsScreen"></div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Organisation Tags Page', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId' }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('component loads correctly', async () => {
    const { getByText } = renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createTag)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful userTags query', async () => {
    const { queryByText } = renderOrganizationTags(link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.createTag)).not.toBeInTheDocument();
    });
  });

  test('opens and closes the create tag modal', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createTagBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('closeCreateTagModal'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('closeCreateTagModal'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('closeCreateTagModal'),
    );
  });
  test('navigates to sub tags screen after clicking on a tag', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('tagName')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScreen')).toBeInTheDocument();
    });
  });

  test('navigates to manage tag page after clicking manage tag option', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  test('searchs for tags where the name matches the provided search input', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchUserTag' } });

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      const buttons = screen.getAllByTestId('manageTagBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  test('fetches the tags by the sort order, i.e. latest or oldest first', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchUserTag' } });

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchUserTag 1',
      );
    });

    // now change the sorting order
    await waitFor(() => {
      expect(screen.getByTestId('sortTags')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortTags'));

    await waitFor(() => {
      expect(screen.getByTestId('oldest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('oldest'));

    // returns the tags in reverse order
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchUserTag 2',
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('sortTags')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortTags'));

    await waitFor(() => {
      expect(screen.getByTestId('latest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('latest'));

    // reverse the order again
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchUserTag 1',
      );
    });
  });

  test('fetches more tags with infinite scroll', async () => {
    const { getByText } = renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createTag)).toBeInTheDocument();
    });

    const orgUserTagsScrollableDiv = screen.getByTestId(
      'orgUserTagsScrollableDiv',
    );

    // Get the initial number of tags loaded
    const initialTagsDataLength = screen.getAllByTestId('manageTagBtn').length;

    // Set scroll position to the bottom
    fireEvent.scroll(orgUserTagsScrollableDiv, {
      target: { scrollY: orgUserTagsScrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      const finalTagsDataLength = screen.getAllByTestId('manageTagBtn').length;
      expect(finalTagsDataLength).toBeGreaterThan(initialTagsDataLength);

      expect(getByText(translations.createTag)).toBeInTheDocument();
    });
  });

  test('creates a new user tag', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createTagBtn'));

    userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.enterTagName);
    });

    userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'userTag 12',
    );

    userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagCreationSuccess,
      );
    });
  });
});
