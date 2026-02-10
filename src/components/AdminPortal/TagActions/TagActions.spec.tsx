import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { useMutation, ApolloClient } from '@apollo/client';

import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import type { InterfaceTagActionsProps } from 'types/AdminPortal/TagActions/interface';
import TagActions from './TagActions';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import { MOCKS, ERROR_MOCKS } from './TagActionsMocks';
import type { TFunction } from 'i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { InterfaceTagData } from 'utils/interfaces';
import type { MockedResponse } from '@apollo/react-testing';

const mockAssignToTags = vi.fn().mockResolvedValue({
  data: { assignToUserTags: { _id: '1' } },
});

const mockAssignToTagsHook: typeof useMutation = () => [
  mockAssignToTags,
  {
    data: undefined,
    loading: false,
    error: undefined,
    called: false,
    client: {} as ApolloClient<object>,
    reset: vi.fn(),
  },
];

type RemoveFromTagsHook = NonNullable<
  InterfaceTagActionsProps['removeFromTagsFn']
>;

const mockUseRemoveFromTags = ((_: unknown) => {
  return [
    vi.fn().mockResolvedValue({
      data: {
        removeFromUserTags: { _id: '1' },
      },
    }),
    {
      data: undefined,
      loading: false,
      error: undefined,
      called: false,
      client: {} as ApolloClient<unknown>,
      reset: vi.fn(),
    },
  ];
}) as unknown as RemoveFromTagsHook;

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const availableTags: InterfaceTagData[] = [
  {
    _id: 'Tag1',
    name: 'Tag 1',
    parentTag: { _id: 'Parent1' },
    usersAssignedTo: { totalCount: 0 },
    childTags: { totalCount: 0 },
    ancestorTags: [],
  },
  {
    _id: 'Tag2',
    name: 'Tag 2',
    parentTag: { _id: 'Parent2' },
    usersAssignedTo: { totalCount: 0 },
    childTags: { totalCount: 0 },
    ancestorTags: [],
  },
  {
    _id: 'Tag3',
    name: 'Tag 3',
    parentTag: { _id: 'Parent3' },
    usersAssignedTo: { totalCount: 0 },
    childTags: { totalCount: 0 },
    ancestorTags: [],
  },
];

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
    availableTags,
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
    availableTags,
  },
];

const renderTagActionsModal = (
  props: InterfaceTagActionsProps,
  mocks: MockedResponse[],
): RenderResult => {
  return render(
    <MockedProvider mocks={mocks} addTypename>
      <MemoryRouter initialEntries={['/admin/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
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
    const { getByText } = renderTagActionsModal(props[0], MOCKS);

    await waitFor(() => {
      expect(getByText(translations.assign)).toBeInTheDocument();
    });
  });

  test('Component loads correctly and opens removeFromTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[1], MOCKS);

    await waitFor(() => {
      expect(getByText(translations.remove)).toBeInTheDocument();
    });
  });

  test('Component calls hideTagActionsModal when modal is closed', async () => {
    const user = userEvent.setup();
    const hideTagActionsModalMock = vi.fn();

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
      availableTags,
    };

    renderTagActionsModal(props2, MOCKS);

    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('closeTagActionsModalBtn'));

    await waitFor(() => {
      expect(hideTagActionsModalMock).toHaveBeenCalled();
    });
  });

  test('Selects and deselects tags via checkboxes', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], MOCKS);

    const tag1 = screen.getByTestId('checkTag1');
    const tag2 = screen.getByTestId('checkTag2');

    await user.click(tag1);
    expect(tag1).toBeChecked();

    await user.click(tag2);
    expect(tag2).toBeChecked();

    await user.click(tag1);
    expect(tag1).not.toBeChecked();
  });

  test('does not render expand button when no child tags UI is enabled', async () => {
    renderTagActionsModal(props[0], MOCKS);

    expect(screen.queryByTestId('expandSubTags1')).not.toBeInTheDocument();
  });

  test('Toasts error when no tag is selected while assigning', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], MOCKS);

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.noTagSelected,
      );
    });
  });

  test('Toasts error when something goes wrong while assigning/removing tags', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], ERROR_MOCKS);

    // Select tags 2 and 3 to match the mock variables
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag2'));
    await waitFor(() => {
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag3'));

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock Graphql Error While assigning/removing tags',
      );
    });
  });

  test('Successfully assigns to tags', async () => {
    const user = userEvent.setup();

    const testProps: InterfaceTagActionsProps = {
      ...props[0],
      assignToTagsFn: mockAssignToTagsHook, // use mock
    };

    renderTagActionsModal(testProps, MOCKS);

    // select userTags 2 & 3
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag3'));

    // submit form
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToTags,
      );
    });
  });

  test('Successfully removes from tags', async () => {
    const user = userEvent.setup();

    const testProps: InterfaceTagActionsProps = {
      ...props[1],
      removeFromTagsFn: mockUseRemoveFromTags,
    };

    renderTagActionsModal(testProps, MOCKS);

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('checkTag2'));
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.successfullyRemovedFromTags,
      );
    });
  });
});
