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

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
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
                path="/orgtags/:orgId/managetag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/subtags/:tagId"
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
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly', async () => {
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
      expect(queryByText(translations.create)).not.toBeInTheDocument();
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

  test('opens and closes the remove tag modal', async () => {
    renderOrganizationTags(link);

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

  test('paginates between different pages', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('nextPagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('nextPagBtn'));

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent('6');
    });

    await waitFor(() => {
      expect(screen.getByTestId('previousPageBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('previousPageBtn'));

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent('1');
    });
  });

  test('creates a new user tag', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createTagBtn'));

    userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      '7',
    );

    userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.tagCreationSuccess);
    });
  });

  test('removes a user tag', async () => {
    renderOrganizationTags(link);

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
