import React from 'react';
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Operation, FetchResult } from '@apollo/client/link/core';
import { Observable } from '@apollo/client/utilities';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import i18n from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import type { MockedResponse } from '@apollo/react-testing';
import EventAgendaItems from './EventAgendaItems';
import { vi } from 'vitest';
import { AgendaItemByEvent } from 'GraphQl/Queries/AgendaItemQueries';
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

  function cloneMock<T>(mock: T): T {
    return JSON.parse(JSON.stringify(mock)) as T;
  }

  const createCategorySuccessMock = (): MockedResponse => {
    return cloneMock(MOCKS[0]);
  };

  const createAgendaItemsMock = (
    agendaItems: Array<typeof baseAgendaItem> = [baseAgendaItem],
  ): MockedResponse => {
    const mock = cloneMock(MOCKS[1]);
    mock.result.data.agendaItemByEvent = agendaItems;
    return mock;
  };

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
  ): MockedResponse => {
    const mock = cloneMock(MOCKS[2]);
    mock.request.variables.input.sequence = sequence;
    mock.request.variables.input.categories = categories;
    mock.request.variables.input.attachments = formData.attachments;
    mock.request.variables.input.urls = formData.urls;

    if (error) {
      delete mock.result;
      mock.error = error;
      return mock;
    }

    mock.error = undefined;
    mock.result = cloneMock(MOCKS[2].result);

    mock.newData = (variables) => {
      onCall?.(variables as { input: typeof formData });
      return cloneMock(MOCKS[2].result);
    };

    return mock;
  };

  const createDefaultMocks = (): MockedResponse[] => [
    createCategorySuccessMock(),
    createAgendaItemsMock(),
    createMutationMock(2),
  ];

  const createAgendaItemsErrorMocks = (): MockedResponse[] => {
    const [categoryMock, agendaMock] = MOCKS_ERROR_QUERY.map(cloneMock);
    agendaMock.error = new Error('Mock Graphql Error');
    delete agendaMock.result;
    return [categoryMock, agendaMock];
  };

  const createBlankMessageErrorMocks = (): MockedResponse[] => {
    const [categoryMock, agendaMock] = MOCKS_ERROR_QUERY.map(cloneMock);
    agendaMock.error = new Error('');
    delete agendaMock.result;
    return [categoryMock, agendaMock];
  };

  const createCategoryErrorMocks = (): MockedResponse[] =>
    MOCKS_CATEGORY_ERROR.map(cloneMock);

  const createMutationErrorMocks = (): MockedResponse[] => {
    const mocks = MOCKS_MUTATION_ERROR.map(cloneMock);
    const mutationMock = mocks[mocks.length - 1];
    mutationMock.error = new Error('Mock Graphql Error');
    delete mutationMock.result;
    return mocks;
  };

  const createEmptyAgendaItemsMocks = (
    onCall?: (variables: { input: typeof formData }) => void,
  ): MockedResponse[] => {
    const mocks = MOCKS_EMPTY_AGENDA_ITEMS.map(cloneMock);
    mocks.push(createMutationMock(1, { onCall }));
    return mocks;
  };

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
    expect(
      await screen.findByText(/Error message not found\./i),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
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
    class NonErrorMockLink extends StaticMockLink {
      override request(operation: Operation): Observable<FetchResult> | null {
        if (operation.operationName === 'CreateAgendaItem') {
          return new Observable<FetchResult>((observer) => {
            observer.error('Non Error Rejection' as unknown as Error);
          });
        }
        return super.request(operation);
      }
    }

    const link = new NonErrorMockLink(createDefaultMocks(), true);

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
      expect(toast.success).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Error message not found.');
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
    });
  });
});
