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
import {
  MOCKS,
  MOCKS_ERROR,
  MOCKS_ERROR_ERROR_TAG,
  MOCKS_EMPTY,
  MOCKS_UNDEFINED_USER_TAGS,
  MOCKS_NULL_END_CURSOR,
  MOCKS_NO_MORE_PAGES,
} from './OrganizationTagsMocks';
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
const link3 = new StaticMockLink([...MOCKS, ...MOCKS_ERROR_ERROR_TAG], true);
const link4 = new StaticMockLink(MOCKS_EMPTY, true);
const link5 = new StaticMockLink(MOCKS_UNDEFINED_USER_TAGS, true);
const link6 = new StaticMockLink(MOCKS_NULL_END_CURSOR, true);
const link7 = new StaticMockLink(MOCKS_NO_MORE_PAGES, true);

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

  test('render error component on unsuccessful userTags query', async () => {
    const { queryByText } = renderOrganizationTags(link2);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByText(/Error occurred while loading Organization Tags Data/),
      ).toBeInTheDocument();
      expect(queryByText(translations.createTag)).toBeInTheDocument();
    });
  });

  test('opens and closes the create tag modal', async () => {
    renderOrganizationTags(link);
    await wait();
  });

  test('navigates to sub tags screen after clicking on a tag', async () => {
    renderOrganizationTags(link);

    await wait();
  });

  test('navigates to manage tag page after clicking manage tag option', async () => {
    renderOrganizationTags(link);

    await wait();
  });

  test('searches for tags where the name matches the provided search input', async () => {
    renderOrganizationTags(link);

    await wait();
  });

  test('fetches the tags by the sort order', async () => {
    renderOrganizationTags(link);

    await wait();
  });

  test('fetches more tags with infinite scroll', async () => {
    renderOrganizationTags(link);

    await wait();
  });

  test('creates a new user tag', async () => {
    renderOrganizationTags(link);
    await wait();
  });

  test('creates a new user tag with error', async () => {
    renderOrganizationTags(link3);

    await wait();
  });

  test('renders the no tags found message when there are no tags', async () => {
    renderOrganizationTags(link4);

    await wait();
  });

  test('sets dataLength to 0 when userTagsList is undefined', async () => {
    renderOrganizationTags(link5);

    await wait();

    // Wait for the component to render
    await waitFor(() => {
      const userTags = screen.queryAllByTestId('user-tag');
      expect(userTags).toHaveLength(0);
    });
  });

  test('Null endCursor', async () => {
    renderOrganizationTags(link6);
    await wait();
  });

  test('Null Page available', async () => {
    renderOrganizationTags(link7);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByText(/Error occurred while loading Organization Tags Data/),
      ).toBeInTheDocument();
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
  });

  test('creates a new user tag with undefined data', async () => {
    renderOrganizationTags(link);

    await wait();
  });

  test('handles null endCursor in pagination', async () => {
    renderOrganizationTags(link6);

    await wait();
  });

  test('handles error when fetching tags', async () => {
    renderOrganizationTags(link3);

    await wait();
  });
});
