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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import { userEvent } from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { ApolloLink } from '@apollo/client';
import type { InterfaceTagActionsProps } from './TagActions';
import TagActions from './TagActions';
import i18n from 'utils/i18nForTest';
import {
  MOCKS,
  MOCKS_ERROR_ORGANIZATION_TAGS_QUERY,
  MOCKS_ERROR_SUBTAGS_QUERY,
} from './TagActionsMocks';
import type { TFunction } from 'i18next';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_ORGANIZATION_TAGS_QUERY, true);
const link3 = new StaticMockLink(MOCKS_ERROR_SUBTAGS_QUERY, true);

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
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly and opens assignToTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.assign)).toBeInTheDocument();
    });
  });

  test('Component loads correctly and opens removeFromTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[1], link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.remove)).toBeInTheDocument();
    });
  });

  test('Component calls hideTagActionsModal when modal is closed', async () => {
    const hideTagActionsModalMock = jest.fn();

    const props2: InterfaceTagActionsProps = {
      tagActionsModalIsOpen: true,
      hideTagActionsModal: hideTagActionsModalMock,
      tagActionType: 'assignToTags',
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

    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('closeTagActionsModalBtn'));

    await waitFor(() => {
      expect(hideTagActionsModalMock).toHaveBeenCalled();
    });
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

    // expand tag 1 to list its subtags
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('expandSubTags1'));

    await waitFor(() => {
      expect(
        getByText(translations.errorOccurredWhileLoadingSubTags),
      ).toBeInTheDocument();
    });
  });

  test('searchs for tags where the name matches the provided search input', async () => {
    renderTagActionsModal(props[0], link);

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
      const tags = screen.getAllByTestId('orgUserTag');
      expect(tags.length).toEqual(2);
    });
  });

  test('Renders more members with infinite scroll', async () => {
    const { getByText } = renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.assign)).toBeInTheDocument();
    });

    // Find the infinite scroll div by test ID or another selector
    const scrollableDiv = screen.getByTestId('scrollableDiv');

    const initialTagsDataLength = screen.getAllByTestId('orgUserTag').length;

    // Set scroll position to the bottom
    fireEvent.scroll(scrollableDiv, {
      target: { scrollY: scrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      const finalTagsDataLength = screen.getAllByTestId('orgUserTag').length;
      expect(finalTagsDataLength).toBeGreaterThan(initialTagsDataLength);

      expect(getByText(translations.assign)).toBeInTheDocument();
    });
  });

  test('Selects and deselects tags', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('clearSelectedTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('clearSelectedTag2'));
  });

  test('fetches and lists the child tags and then selects and deselects them', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    // expand tag 1 to list its subtags
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('expandSubTags1'));

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScrollableDiv1')).toBeInTheDocument();
    });
    // Find the infinite scroll div for subtags by test ID or another selector
    const subTagsScrollableDiv1 = screen.getByTestId('subTagsScrollableDiv1');

    const initialTagsDataLength =
      screen.getAllByTestId('orgUserSubTags').length;

    // Set scroll position to the bottom
    fireEvent.scroll(subTagsScrollableDiv1, {
      target: { scrollY: subTagsScrollableDiv1.scrollHeight },
    });

    await waitFor(() => {
      const finalTagsDataLength =
        screen.getAllByTestId('orgUserSubTags').length;
      expect(finalTagsDataLength).toBeGreaterThan(initialTagsDataLength);
    });

    // select subtags 1 & 2
    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag1'));

    // deselect subtags 1 & 2
    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag2'));

    // hide subtags of tag 1
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('expandSubTags1'));
  });

  test('Toasts error when no tag is selected while assigning', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.noTagSelected);
    });
  });

  test('Successfully assigns to tags', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    // select userTags 2 & 3 and assign them
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag3'));

    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToTags,
      );
    });
  });

  test('Successfully removes from tags', async () => {
    renderTagActionsModal(props[1], link);

    await wait();

    // select userTag 2 and remove people from it
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyRemovedFromTags,
      );
    });
  });
});
