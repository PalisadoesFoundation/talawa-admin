import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { ApolloLink } from '@apollo/client';
import type { InterfaceTagActionsProps } from './TagActions';
import TagActions from './TagActions';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import {
  MOCKS,
  MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS,
  MOCKS_ERROR_ORGANIZATION_TAGS_QUERY,
  MOCKS_ERROR_SUBTAGS_QUERY,
} from './TagActionsMocks';
import type { TFunction } from 'i18next';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_ORGANIZATION_TAGS_QUERY, true);
const link3 = new StaticMockLink(MOCKS_ERROR_SUBTAGS_QUERY, true);
const link4 = new StaticMockLink(MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS);
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

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const props: InterfaceTagActionsProps[] = [
  {
    tagActionsModalIsOpen: true,
    hideTagActionsModal: () => {},
    tagActionType: 'assignToTags',
    userId: 'testUserId',
    currentTagId: 'testTagId',
    t: ((key: string) => translations[key]) as TFunction<
      'translation',
      'manageTag'
    >,
    tCommon: ((key: string) => translations[key]) as TFunction<
      'common',
      undefined
    >,
  },
  {
    tagActionsModalIsOpen: true,
    hideTagActionsModal: () => {},
    tagActionType: 'removeFromTags',
    userId: 'testUserId',
    currentTagId: 'testTagId',
    t: ((key: string) => translations[key]) as TFunction<
      'translation',
      'manageTag'
    >,
    tCommon: ((key: string) => translations[key]) as TFunction<
      'common',
      undefined
    >,
  },
];

const renderTagActionsModal = (
  props: InterfaceTagActionsProps,
  link: ApolloLink,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<TagActions {...props} />}
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
    vi.mock('react-router', async () => {
      const actualModule = await vi.importActual('react-router');
      return {
        ...actualModule,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly and opens assignToTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[0], link);

    await wait();
  });

  test('Component loads correctly and opens removeFromTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[1], link);

    await wait();
  });

  test('Component calls hideTagActionsModal when modal is closed', async () => {
    const hideTagActionsModalMock = vi.fn();

    const props2: InterfaceTagActionsProps = {
      tagActionsModalIsOpen: true,
      hideTagActionsModal: hideTagActionsModalMock,
      tagActionType: 'assignToTags',
      userId: 'testUserId',
      currentTagId: 'testTagId',
      t: ((key: string) => translations[key]) as TFunction<
        'translation',
        'manageTag'
      >,
      tCommon: ((key: string) => translations[key]) as TFunction<
        'common',
        undefined
      >,
    };

    renderTagActionsModal(props2, link);

    await wait();
  });

  test('Renders error component when when query is unsuccessful', async () => {
    const { queryByText } = renderTagActionsModal(props[0], link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.assign)).not.toBeInTheDocument();
    });
  });

  test('Renders error component when when subTags query is unsuccessful', async () => {
    const { getByText } = renderTagActionsModal(props[0], link3);

    await wait();
  });

  test('searchs for tags where the name matches the provided search input', async () => {
    renderTagActionsModal(props[0], link);

    await wait();
  });

  test('Renders more members with infinite scroll', async () => {
    const { getByText } = renderTagActionsModal(props[0], link);

    await wait();
  });

  test('Selects and deselects tags', async () => {
    renderTagActionsModal(props[0], link);

    await wait();
  });

  test('fetches and lists the child tags and then selects and deselects them', async () => {
    renderTagActionsModal(props[0], link);

    await wait();
  });

  test('Toasts error when no tag is selected while assigning', async () => {
    renderTagActionsModal(props[0], link);

    await wait();
  });
  test('Toasts error when something wrong happen while assigning/removing tag', async () => {
    renderTagActionsModal(props[0], link4);
    await wait();
  });

  test('Successfully assigns to tags', async () => {
    renderTagActionsModal(props[0], link);

    await wait();
  });

  test('Successfully removes from tags', async () => {
    renderTagActionsModal(props[1], link);

    await wait();
  });
});
