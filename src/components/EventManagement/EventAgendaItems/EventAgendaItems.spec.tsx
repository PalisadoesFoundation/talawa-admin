import React from 'react';
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useQuery, useMutation } from '@apollo/client/react';
import type { DocumentNode } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import i18n from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
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
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
}));

vi.mock('components/AgendaItems/AgendaItemsContainer', () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>(
    '@apollo/client/react',
  );
  return {
    ...actual,
    useQuery: vi.fn(actual.useQuery),
    useMutation: vi.fn(actual.useMutation),
  };
});

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
    mocks?: InterfaceGenericMock[];
    withLocalization?: boolean;
    eventId?: string;
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

  interface InterfaceGenericMock {
    request: {
      query: DocumentNode;
      variables?: Record<string, unknown>;
    };
    result?: {
      data?: Record<string, unknown>;
    };
    error?: Error;
    newData?: (variables: Record<string, unknown>) => {
      data?: Record<string, unknown>;
    };
  }
  const [BASE_CATEGORY_MOCK, BASE_AGENDA_MOCK, BASE_MUTATION_MOCK] =
    MOCKS as InterfaceGenericMock[];

  const agendaErrorBase =
    (MOCKS_ERROR_QUERY[1] as InterfaceGenericMock) ?? BASE_AGENDA_MOCK;
  const emptyAgendaBase =
    (MOCKS_EMPTY_AGENDA_ITEMS[1] as InterfaceGenericMock) ?? BASE_AGENDA_MOCK;
  const categoryErrorBase =
    (MOCKS_CATEGORY_ERROR[1] as InterfaceGenericMock) ?? BASE_AGENDA_MOCK;
  const categoryErrorRequestBase =
    (MOCKS_CATEGORY_ERROR[0] as InterfaceGenericMock) ?? BASE_CATEGORY_MOCK;
  const mutationErrorRequestBase =
    (MOCKS_MUTATION_ERROR[2] as InterfaceGenericMock) ?? BASE_MUTATION_MOCK;

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

  const createCategorySuccessMock = (): InterfaceGenericMock => ({
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
  ): InterfaceGenericMock => ({
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
  ): InterfaceGenericMock => {
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

  const createDefaultMocks = (): InterfaceGenericMock[] => [
    createCategorySuccessMock(),
    createAgendaItemsMock(),
    createMutationMock(2),
  ];

  const createAgendaItemsErrorMocks = (): InterfaceGenericMock[] => [
    createCategorySuccessMock(),
    {
      request: {
        query: agendaErrorBase.request.query,
        variables: { relatedEventId: formData.relatedEventId },
      },
      error: new Error('Mock Graphql Error'),
    },
  ];

  const createBlankMessageErrorMocks = (): InterfaceGenericMock[] => [
    createCategorySuccessMock(),
    {
      request: {
        query: agendaErrorBase.request.query,
        variables: { relatedEventId: formData.relatedEventId },
      },
      error: new Error(''),
    },
  ];

  const createCategoryErrorMocks = (): InterfaceGenericMock[] => [
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

  const createMutationErrorMocks = (): InterfaceGenericMock[] => [
    createCategorySuccessMock(),
    createAgendaItemsMock(),
    createMutationMock(2, { error: new Error('Mock Graphql Error') }),
  ];

  const createEmptyAgendaItemsMocks = (
    onCall?: (variables: { input: typeof formData }) => void,
  ): InterfaceGenericMock[] => [
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
  ): InterfaceGenericMock[] => [
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

  const selectAgendaCategory = async (categoryName = 'Category 1') => {
    const categorySelect = screen.getByTestId('categorySelect');
    await userEvent.click(within(categorySelect).getByRole('combobox'));
    const categoryOption = await screen.findByRole('option', {
      name: categoryName,
    });
    await userEvent.click(categoryOption);
  };

  const renderEventAgendaItems = ({
    link,
    mocks,
    withLocalization = false,
    eventId = '123',
  }: InterfaceRenderOptions): ReturnType<typeof render> => {
    const providerProps = link
      ? { link }
      : {
          mocks: mocks ?? createDefaultMocks(),
        };

    const content = (
      <MockedProvider {...providerProps}>
        <Provider store={store}>
          <BrowserRouter>
            {withLocalization ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <I18nextProvider i18n={i18n}>
                  {<EventAgendaItems eventId={eventId} />}
                </I18nextProvider>
              </LocalizationProvider>
            ) : (
              <I18nextProvider i18n={i18n}>
                {<EventAgendaItems eventId={eventId} />}
              </I18nextProvider>
            )}
          </BrowserRouter>
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
        href: 'https://localhost:4321/event/111/123',
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
    expect(await screen.findByText(/Unknown error/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  it('displays "Unknown error" when both query error messages are missing', async () => {
    const useQueryMock = vi.mocked(useQuery);
    useQueryMock.mockImplementation(((...args: unknown[]) => {
      const [query] = args;

      if (query === AGENDA_ITEM_CATEGORY_LIST) {
        return {
          data: {
            agendaItemCategoriesByOrganization: cloneJson(baseCategoryList),
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      if (query === AgendaItemByEvent) {
        return {
          data: undefined,
          loading: false,
          error: new Error(''),
          refetch: vi.fn(),
        };
      }

      // Return a default or initial implementation if needed, though for this test
      // we likely cover all cases. But since we need ReturnType<typeof useQuery>,
      // let's try to match it or cast.
      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    }) as unknown as typeof useQuery);

    try {
      const { queryByText } = renderEventAgendaItems({});

      expect(await screen.findByText(/Unknown error/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(
          queryByText(translations.createAgendaItem),
        ).not.toBeInTheDocument();
      });
    } finally {
      useQueryMock.mockRestore();
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
        screen.findByTestId('createAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createAgendaItemModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument();
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
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
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
      expect(toast.success).toBeCalledWith(translations.agendaItemCreated);
      expect(
        screen.queryByTestId('createAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));
    await waitFor(() => {
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
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
    await userEvent.click(screen.getByTestId('createAgendaItemModalCloseBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('createAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows toast error when agenda item creation fails', async () => {
    const link = new StaticMockLink(createMutationErrorMocks(), true);
    renderEventAgendaItems({ link, withLocalization: true });
    await wait();

    await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
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
      expect(toast.error).toBeCalledWith('Mock Graphql Error');
    });
    expect(
      screen.getByTestId('createAgendaItemModalCloseBtn'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('createAgendaItemModalCloseBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('createAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument();
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
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
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
      expect(toast.success).toHaveBeenCalledWith(
        translations.agendaItemCreated,
      );
    });
  });

  it('defaults sequence to 1 when agenda item query returns null data', async () => {
    const sequences: number[] = [];
    const useQueryMock = vi.mocked(useQuery);
    useQueryMock.mockImplementation(((...args: unknown[]) => {
      const [query] = args;

      if (query === AGENDA_ITEM_CATEGORY_LIST) {
        return {
          data: {
            agendaItemCategoriesByOrganization: cloneJson(baseCategoryList),
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      if (query === AgendaItemByEvent) {
        return {
          data: null,
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      // Fallback dummy
      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    }) as unknown as typeof useQuery);

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
        expect(
          screen.getByTestId('createAgendaItemModalCloseBtn'),
        ).toBeInTheDocument();
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
        expect(toast.success).toHaveBeenCalledWith(
          translations.agendaItemCreated,
        );
      });
    } finally {
      useQueryMock.mockRestore();
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
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
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
    const useMutationMock = vi.mocked(useMutation);
    useMutationMock.mockImplementation((() => {
      // We cannot call actual useMutation within the mock easily if not captured earlier or via importActual pattern inside mockImplementation.
      // However, we can simulate the behavior we need: returning a mutate function that rejects.
      const wrappedMutate = async () => {
        throw 'Non Error Rejection';
      };
      // useMutation returns [mutateFunction, resultObj]
      return [
        wrappedMutate,
        { data: undefined, loading: false, error: undefined, reset: vi.fn() },
      ];
    }) as unknown as typeof useMutation);

    try {
      renderEventAgendaItems({
        mocks: createDefaultMocks(),
        withLocalization: true,
      });
      await wait();
      await userEvent.click(screen.getByTestId('createAgendaItemBtn'));

      await waitFor(() => {
        expect(
          screen.getByTestId('createAgendaItemModalCloseBtn'),
        ).toBeInTheDocument();
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
        expect(toast.success).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
        expect(
          screen.getByTestId('createAgendaItemModalCloseBtn'),
        ).toBeInTheDocument();
      });
    } finally {
      useMutationMock.mockRestore();
    }
  });
});
