import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import SubTags from './SubTags';
import {
  MOCKS,
  MOCKS_ERROR_SUB_TAGS,
  MOCKS_ERROR_TAG_ANCESTORS,
} from './SubTagsMocks';
import { InMemoryCache, type ApolloLink } from '@apollo/client';

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
const link2 = new StaticMockLink(MOCKS_ERROR_SUB_TAGS, true);
const link3 = new StaticMockLink(MOCKS_ERROR_TAG_ANCESTORS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getUserTag: {
          keyArgs: false,
          merge(existing = {}, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const renderSubTags = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider cache={cache} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/subtags/tag1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<div data-testid="orgtagsScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/managetag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/subtags/:tagId"
                element={<SubTags />}
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
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
    cache.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly', async () => {
    const { getByText } = renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addChildTag)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful subtags query', async () => {
    const { queryByText } = renderSubTags(link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addChildTag)).not.toBeInTheDocument();
    });
  });

  test('renders error component on unsuccessful userTag ancestors query', async () => {
    const { queryByText } = renderSubTags(link3);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addChildTag)).not.toBeInTheDocument();
    });
  });

  test('opens and closes the create tag modal', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('addSubTagBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('addSubTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('addSubTagModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('addSubTagModalCloseBtn'),
    );
  });

  test('opens and closes the remove tag modal', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('removeUserTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('removeUserTagBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('removeUserTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('removeUserTagModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('removeUserTagModalCloseBtn'),
    );
  });

  test('navigates to manage tag screen after clicking manage tag option', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  test('navigates to sub tags screen after clicking on a tag', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('tagName')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  test('navigates to the different sub tag screen screen after clicking a tag in the breadcrumbs', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('redirectToSubTags')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  test('navigates to organization tags screen screen after clicking tha all tags option in the breadcrumbs', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('allTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('orgtagsScreen')).toBeInTheDocument();
    });
  });

  test('navigates to manage tags screen for the current tag after clicking tha manageCurrentTag button', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('manageCurrentTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('manageCurrentTagBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  test('paginates between different pages', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('nextPagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('nextPagBtn'));

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent('subTag 6');
    });

    await waitFor(() => {
      expect(screen.getByTestId('previousPageBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('previousPageBtn'));

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent('subTag 1');
    });
  });

  test('adds a new sub tag to the current tag', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('addSubTagBtn'));

    userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'subTag 7',
    );

    userEvent.click(screen.getByTestId('addSubTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.tagCreationSuccess);
    });
  });

  test('removes a sub tag', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('removeUserTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('removeUserTagBtn')[0]);

    userEvent.click(screen.getByTestId('removeUserTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.tagRemovalSuccess);
    });
  });
});
