import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as apolloClient from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import * as reactRouter from 'react-router';
import i18n from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import type { MockedResponse } from '@apollo/react-testing';
import EventAgendaItems from './EventAgendaItems';
import { vi } from 'vitest';
import { AgendaItemByEvent } from 'GraphQl/Queries/AgendaItemQueries';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/AgendaCategoryQueries';
import {
  MOCKS,
  MOCKS_CATEGORY_ERROR,
  MOCKS_EMPTY_AGENDA_ITEMS,
  MOCKS_ERROR_QUERY,
  MOCKS_MUTATION_ERROR,
} from './EventAgendaItemsMocks';

const mockNotificationToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockNotificationToast,
}));

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
}));

vi.mock('components/AdminPortal/AgendaItems/AgendaItemsContainer', () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

//temporarily fixes react-beautiful-dnd droppable method's depreciation error
//needs to be fixed in React 19
vi.spyOn(console, 'error').mockImplementation((message) => {
  if (message.includes('Support for defaultProps will be removed')) {
    return;
  }
  console.error(message);
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = JSON.parse(
  JSON.stringify(i18n.getDataByLanguage('en')?.translation.agendaItems),
);

describe('Testing Agenda Items Components', () => {
  interface InterfaceRenderOptions {
    link?: StaticMockLink;
    mocks?: MockedResponse[];
    withLocalization?: boolean;
    eventId?: string;
    orgId?: string;
  }

  const formData = {
    title: 'AgendaItem 1',
    description: 'AgendaItem 1 Description',
    duration: '30',
    relatedEventId: '123',
    organizationId: '111',
    sequence: 1,
    categories: ['Category 1'],
    attachments: [],
    urls: [],
  };

  const baseCategory = {
    _id: 'agendaItemCategory1',
    name: 'Category 1',
    description: 'Test Description',
    createdBy: {
      _id: 'user0',
      firstName: 'Wilt',
      lastName: 'Shepherd',
    },
  };

  const baseAgendaItem = {
    _id: 'agendaItem1',
    title: 'AgendaItem 1',
    description: 'AgendaItem 1 Description',
    duration: '30',
    attachments: [],
    createdBy: {
      _id: 'user0',
      firstName: 'Wilt',
      lastName: 'Shepherd',
    },
    urls: [],
    users: [],
    sequence: 1,
    categories: [baseCategory],
    organization: {
      _id: '111',
      name: 'Unity Foundation',
    },
    relatedEvent: {
      _id: '123',
      title: 'Aerobics for Everyone',
    },
  };

  type GenericMock = MockedResponse<
    Record<string, unknown>,
    Record<string, unknown>
  >;

  const [BASE_CATEGORY_MOCK, BASE_AGENDA_MOCK, BASE_MUTATION_MOCK] =
    MOCKS as GenericMock[];

  const agendaErrorBase =
    (MOCKS_ERROR_QUERY[1] as GenericMock) ?? BASE_AGENDA_MOCK;
  const emptyAgendaBase =
    (MOCKS_EMPTY_AGENDA_ITEMS[1] as GenericMock) ?? BASE_AGENDA_MOCK;
  const categoryErrorBase =
    (MOCKS_CATEGORY_ERROR[1] as GenericMock) ?? BASE_AGENDA_MOCK;
  const categoryErrorRequestBase =
    (MOCKS_CATEGORY_ERROR[0] as GenericMock) ?? BASE_CATEGORY_MOCK;
  const mutationErrorRequestBase =
    (MOCKS_MUTATION_ERROR[2] as GenericMock) ?? BASE_MUTATION_MOCK;

  function cloneJson<T>(value: T): T {
    const serialized = JSON.stringify(value);
    return serialized === undefined
      ? (value as T)
      : (JSON.parse(serialized) as T);
  }

  const baseCategoryList = cloneJson([baseCategory]);
  const baseAgendaItemsList = cloneJson([baseAgendaItem]);
  const baseMutationInputTemplate = {
    title: formData.title,
    description: formData.description,
    duration: formData.duration,
    relatedEventId: formData.relatedEventId,
    organizationId: formData.organizationId,
    sequence: formData.sequence,
    categories: [baseCategory._id],
    attachments: [] as unknown[],
    urls: [] as unknown[],
  };
  const baseMutationResult = {
    createAgendaItem: { _id: 'agendaItem1' },
  };

  const createCategorySuccessMock = (): GenericMock => ({
    request: {
      query: BASE_CATEGORY_MOCK.request.query,
      variables: { organizationId: formData.organizationId },
    },
    result: {
      data: {
        agendaItemCategoriesByOrganization: cloneJson(baseCategoryList),
      },
    },
  });

  const createAgendaItemsMock = (
    agendaItems: Array<typeof baseAgendaItem> = cloneJson(baseAgendaItemsList),
  ): GenericMock => ({
    request: {
      query: BASE_AGENDA_MOCK.request.query,
      variables: { relatedEventId: formData.relatedEventId },
    },
    result: {
      data: {
        agendaItemByEvent: cloneJson(agendaItems),
      },
    },
  });

  const createMutationMock = (
    sequence: number,
    {
      categories = [baseCategory._id],
      error,
      onCall,
    }: {
      categories?: string[];
      error?: Error;
      onCall?: (variables: { input: typeof formData }) => void;
    } = {},
  ): GenericMock => {
    const input = {
      ...cloneJson(baseMutationInputTemplate),
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      relatedEventId: formData.relatedEventId,
      organizationId: formData.organizationId,
      sequence,
      categories,
      attachments: formData.attachments,
      urls: formData.urls,
    };

    if (error) {
      return {
        request: {
          query: mutationErrorRequestBase.request.query,
          variables: { input },
        },
        error,
      };
    }

    const result = { data: cloneJson(baseMutationResult) };

    return {
      request: {
        query: BASE_MUTATION_MOCK.request.query,
        variables: { input },
      },
      result,
      newData: (variables) => {
        onCall?.(variables as { input: typeof formData });
        return cloneJson(result);
      },
    };
  };

  const createDefaultMocks = (): MockedResponse[] => [
    createCategorySuccessMock(),
    createAgendaItemsMock(),
    createMutationMock(2),
  ];

  const createAgendaItemsErrorMocks = (): MockedResponse[] => [
    createCategorySuccessMock(),
    {
      request: {
        query: agendaErrorBase.request.query,
        variables: { relatedEventId: formData.relatedEventId },
      },
      error: new Error('Mock Graphql Error'),
    },
  ];

  const createBlankMessageErrorMocks = (): MockedResponse[] => [
    createCategorySuccessMock(),
    {
      request: {
        query: agendaErrorBase.request.query,
        variables: { relatedEventId: formData.relatedEventId },
      },
      error: new Error(''),
    },
  ];

  const createCategoryErrorMocks = (): MockedResponse[] => [
    {
      request: {
        query: categoryErrorRequestBase.request.query,
        variables: { organizationId: formData.organizationId },
      },
      error: new Error('Mock Agenda Category Error'),
    },
    {
      request: {
        query: categoryErrorBase.request.query,
        variables: { relatedEventId: formData.relatedEventId },
      },
      result: {
        data: {
          agendaItemByEvent: cloneJson(baseAgendaItemsList),
        },
      },
    },
  ];

  const createMutationErrorMocks = (): MockedResponse[] => [
    createCategorySuccessMock(),
    createAgendaItemsMock(),
    createMutationMock(2, { error: new Error('Mock Graphql Error') }),
  ];

  const createEmptyAgendaItemsMocks = (
    onCall?: (variables: { input: typeof formData }) => void,
  ): MockedResponse[] => [
    createCategorySuccessMock(),
    {
      request: {
        query: emptyAgendaBase.request.query,
        variables: { relatedEventId: formData.relatedEventId },
      },
      result: {
        data: {
          agendaItemByEvent: [],
        },
      },
    },
    createMutationMock(1, { onCall }),
  ];

  const createInvalidLengthMocks = (
    onCall?: (variables: { input: typeof formData }) => void,
  ): MockedResponse[] => [
    createCategorySuccessMock(),
    {
      request: {
        query: AgendaItemByEvent,
        variables: { relatedEventId: formData.relatedEventId },
      },
      result: {
        data: {
          agendaItemByEvent: new Proxy([baseAgendaItem], {
            get(target, prop) {
              if (prop === 'length') {
                return 0;
              }
              return Reflect.get(target, prop);
            },
          }) as unknown as Array<typeof baseAgendaItem>,
        },
      },
    },
    createMutationMock(1, { onCall }),
  ];

  const selectAgendaCategory = async (categoryId = 'agendaItemCategory1') => {
    const categorySelect = screen.getByTestId('categorySelect');
    // Use selectOptions for native HTML select element with category._id as value
    await userEvent.selectOptions(categorySelect, categoryId);
  };

  const renderEventAgendaItems = ({
    link,
    mocks,
    withLocalization = false,
    eventId = '123',
    orgId = formData.organizationId,
  }: InterfaceRenderOptions): ReturnType<typeof render> => {
    const providerProps = link
      ? { link }
      : {
          mocks: mocks ?? createDefaultMocks(),
        };

    const routes = (
      <Routes>
        <Route
          path="/admin/event/:orgId/:eventId"
          element={<EventAgendaItems eventId={eventId} />}
        />
      </Routes>
    );

    const content = (
      <MockedProvider {...providerProps}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/admin/event/${orgId}/${eventId}`]}>
            {withLocalization ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <I18nextProvider i18n={i18n}>{routes}</I18nextProvider>
              </LocalizationProvider>
            ) : (
              <I18nextProvider i18n={i18n}>{routes}</I18nextProvider>
            )}
          </MemoryRouter>
        </Provider>
      </MockedProvider>
    );

    return render(content);
  };

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'https://localhost:4321/admin/event/111/123',
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Component loads correctly', async () => {
    const link = new StaticMockLink(createDefaultMocks(), true);
    const { getByText } = renderEventAgendaItems({ link });
    await waitFor(() => {
      expect(getByText(translations.createAgendaItem)).toBeInTheDocument();
    });
  });

  it('renders fallback when orgId is missing', () => {
    const useParamsSpy = vi
      .spyOn(reactRouter, 'useParams')
      .mockReturnValue({ orgId: undefined });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderEventAgendaItems({});

    expect(
      screen.getByText(translations.errorLoadingAgendaCategories),
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'EventAgendaItems: missing orgId in route params.',
    );

    useParamsSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('render error component on unsuccessful agenda item query', async () => {
    const { queryByText } = renderEventAgendaItems({
      mocks: createAgendaItemsErrorMocks(),
    });
    expect(
      await screen.findByText(
        /Error occurred while loading Agenda Items Data/i,
      ),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  it('falls back to unknown error message when error lacks details', async () => {
    const { queryByText } = renderEventAgendaItems({
      mocks: createBlankMessageErrorMocks(),
    });
    expect(
      await screen.findByText(/Error message not found\./i),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  it('displays "Unknown error" when both query error messages are missing', async () => {
    const originalUseQuery = apolloClient.useQuery;
    const useQuerySpy = vi
      .spyOn(apolloClient, 'useQuery')
      .mockImplementation((...args) => {
        const [query] = args;

        if (query === AGENDA_ITEM_CATEGORY_LIST) {
          return {
            data: {
              agendaItemCategoriesByOrganization: cloneJson(baseCategoryList),
            },
            loading: false,
            error: undefined,
            refetch: vi.fn(),
          } as unknown as ReturnType<typeof originalUseQuery>;
        }

        if (query === AgendaItemByEvent) {
          return {
            data: undefined,
            loading: false,
            error: new Error(''),
            refetch: vi.fn(),
          } as unknown as ReturnType<typeof originalUseQuery>;
        }

        return originalUseQuery(...args);
      });

    try {
      const { queryByText } = renderEventAgendaItems({});

      expect(await screen.findByText(/Unknown error/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(
          queryByText(translations.createAgendaItem),
        ).not.toBeInTheDocument();
      });
    } finally {
      useQuerySpy.mockRestore();
    }
  });

  it('displays loader while fetching agenda data', () => {
    renderEventAgendaItems({ mocks: createDefaultMocks() });
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error component on unsuccessful agenda category query', async () => {
    const { queryByText } = renderEventAgendaItems({
      mocks: createCategoryErrorMocks(),
    });
    expect(
      await screen.findByText(
        /Error occurred while loading Agenda Categories Data/i,
      ),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  it('opens and closes the create agenda item modal', async () => {
    const link = new StaticMockLink(createDefaultMocks(), true);
    renderEventAgendaItems({ link, withLocalization: true });

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('creates new agenda item successfully', async () => {
    const link = new StaticMockLink(createDefaultMocks(), true);
    renderEventAgendaItems({ link, withLocalization: true });
    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(translations.enterTitle),
      formData.title,
    );

    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDescription),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDuration),
      formData.duration,
    );

    await selectAgendaCategory();

    await userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(mockNotificationToast.success).toHaveBeenCalledWith(
        translations.agendaItemCreated,
      );
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(translations.enterTitle)).toHaveValue(
      '',
    );
    expect(
      screen.getByPlaceholderText(translations.enterDescription),
    ).toHaveValue('');
    expect(screen.getByPlaceholderText(translations.enterDuration)).toHaveValue(
      '',
    );
    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('shows toast error when agenda item creation fails', async () => {
    const link = new StaticMockLink(createMutationErrorMocks(), true);
    renderEventAgendaItems({ link, withLocalization: true });
    await wait();

    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(translations.enterTitle),
      formData.title,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDescription),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDuration),
      formData.duration,
    );

    await selectAgendaCategory();

    await userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(mockNotificationToast.error).toHaveBeenCalledWith(
        'Mock Graphql Error',
      );
    });
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('defaults sequence to 1 when no existing agenda items', async () => {
    const sequences: number[] = [];
    const link = new StaticMockLink(
      createEmptyAgendaItemsMocks(({ input }) => {
        sequences.push(input.sequence);
      }),
      true,
    );

    renderEventAgendaItems({ link, withLocalization: true });
    await wait();
    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterTitle),
      formData.title,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDescription),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDuration),
      formData.duration,
    );
    await selectAgendaCategory();
    await userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(sequences).toContain(1);
      expect(mockNotificationToast.success).toHaveBeenCalledWith(
        translations.agendaItemCreated,
      );
    });
  });

  it('defaults sequence to 1 when agenda item query returns null data', async () => {
    const sequences: number[] = [];
    const originalUseQuery = apolloClient.useQuery;
    const useQuerySpy = vi
      .spyOn(apolloClient, 'useQuery')
      .mockImplementation((...args) => {
        const [query] = args;

        if (query === AGENDA_ITEM_CATEGORY_LIST) {
          return {
            data: {
              agendaItemCategoriesByOrganization: cloneJson(baseCategoryList),
            },
            loading: false,
            error: undefined,
            refetch: vi.fn(),
          } as unknown as ReturnType<typeof originalUseQuery>;
        }

        if (query === AgendaItemByEvent) {
          return {
            data: null,
            loading: false,
            error: undefined,
            refetch: vi.fn(),
          } as unknown as ReturnType<typeof originalUseQuery>;
        }

        return originalUseQuery(...args);
      });

    const link = new StaticMockLink(
      [
        createMutationMock(1, {
          onCall: ({ input }) => sequences.push(input.sequence),
        }),
      ],
      true,
    );

    try {
      renderEventAgendaItems({ link, withLocalization: true });
      await wait();
      await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

      await waitFor(() => {
        expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByPlaceholderText(translations.enterTitle),
        formData.title,
      );
      await userEvent.type(
        screen.getByPlaceholderText(translations.enterDescription),
        formData.description,
      );
      await userEvent.type(
        screen.getByPlaceholderText(translations.enterDuration),
        formData.duration,
      );
      await selectAgendaCategory();
      await userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

      await waitFor(() => {
        expect(sequences).toContain(1);
        expect(mockNotificationToast.success).toHaveBeenCalledWith(
          translations.agendaItemCreated,
        );
      });
    } finally {
      useQuerySpy.mockRestore();
    }
  });

  it('clamps sequence when agenda items length resolves to zero', async () => {
    const sequences: number[] = [];
    const link = new StaticMockLink(
      createInvalidLengthMocks(({ input }) => {
        sequences.push(input.sequence);
      }),
      true,
    );

    renderEventAgendaItems({ link, withLocalization: true });
    await wait();
    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterTitle),
      formData.title,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDescription),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(translations.enterDuration),
      formData.duration,
    );
    await selectAgendaCategory();
    await userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(sequences).toContain(1);
    });
  });

  it('handles non-Error create agenda item rejections gracefully', async () => {
    const originalUseMutation = apolloClient.useMutation;
    const useMutationSpy = vi
      .spyOn(apolloClient, 'useMutation')
      .mockImplementation((...args) => {
        const result = originalUseMutation(...args);
        const [mutate, rest] = result;
        const wrappedMutate: typeof mutate = async (...mutateArgs) => {
          await mutate(...mutateArgs);
          throw 'Non Error Rejection';
        };
        return [wrappedMutate, rest] as typeof result;
      });

    try {
      renderEventAgendaItems({
        mocks: createDefaultMocks(),
        withLocalization: true,
      });
      await wait();
      await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

      await waitFor(() => {
        expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByPlaceholderText(translations.enterTitle),
        formData.title,
      );
      await userEvent.type(
        screen.getByPlaceholderText(translations.enterDescription),
        formData.description,
      );
      await userEvent.type(
        screen.getByPlaceholderText(translations.enterDuration),
        formData.duration,
      );
      await selectAgendaCategory();
      await userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

      await waitFor(() => {
        expect(mockNotificationToast.success).not.toHaveBeenCalled();
        expect(mockNotificationToast.error).not.toHaveBeenCalled();
        expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
      });
    } finally {
      useMutationSpy.mockRestore();
    }
  });

  it('should handle loading state when fetching agenda items', async () => {
    const loadingMocks = [
      createCategorySuccessMock(),
      {
        request: {
          query: AgendaItemByEvent,
          variables: { relatedEventId: formData.relatedEventId },
        },
        result: { data: { agendaItemByEvent: [] } },
        delay: 100,
      },
    ];

    renderEventAgendaItems({
      mocks: loadingMocks,
      withLocalization: true,
      eventId: formData.relatedEventId,
    });

    // Assert spinner is visible during loading
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for loading to complete and button to appear
    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });

    // Assert spinner is no longer visible after loading
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});
