import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';

import EventAgenda from './EventAgenda';
import {
  AGENDA_ITEM_CATEGORY_LIST,
  AGENDA_FOLDER_LIST,
} from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

vi.mock('shared-components/LoadingState/LoadingState', () => ({
  default: ({
    isLoading,
    children,
  }: {
    isLoading: boolean;
    children: React.ReactNode;
  }) => {
    if (isLoading) {
      return <div data-testid="loader">Loading...</div>;
    }
    return children;
  },
}));

vi.mock('components/AdminPortal/AgendaFolder/AgendaFolderContainer', () => ({
  default: ({ agendaFolderData }: { agendaFolderData: unknown }) => (
    <div data-testid="agendaFolderContainer">
      {agendaFolderData ? 'folders-loaded' : 'no-folders'}
    </div>
  ),
}));

vi.mock(
  'components/AdminPortal/AgendaFolder/Create/AgendaFolderCreateModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="agendaFolderCreateModal" /> : null,
  }),
);

vi.mock(
  'components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal',
  () => ({
    default: ({ isOpen, hide }: { isOpen: boolean; hide: () => void }) =>
      isOpen ? (
        <button
          type="button"
          data-testid="closeAgendaItemModal"
          onClick={hide}
        />
      ) : null,
  }),
);

const mockAgendaCategories = {
  agendaCategoriesByEventId: [
    {
      id: 'cat1',
      name: 'Category 1',
    },
  ],
};

const mockAgendaFolders = {
  agendaFoldersByEventId: [
    {
      id: 'folder1',
      name: 'Folder 1',
      items: { edges: [] },
    },
  ],
};

const MOCKS_SUCCESS: MockedResponse[] = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { eventId: 'event1' },
    },
    result: {
      data: mockAgendaCategories,
    },
  },
  {
    request: {
      query: AGENDA_FOLDER_LIST,
      variables: { eventId: 'event1' },
    },
    result: {
      data: mockAgendaFolders,
    },
  },
];

const MOCKS_LOADING: MockedResponse[] = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { eventId: 'event1' },
    },
    result: { data: mockAgendaCategories },
    delay: 100,
  },
  {
    request: {
      query: AGENDA_FOLDER_LIST,
      variables: { eventId: 'event1' },
    },
    result: { data: mockAgendaFolders },
    delay: 100,
  },
];

const MOCKS_ERROR: MockedResponse[] = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { eventId: 'event1' },
    },
    error: new Error('Category error'),
  },
  {
    request: {
      query: AGENDA_FOLDER_LIST,
      variables: { eventId: 'event1' },
    },
    result: { data: mockAgendaFolders },
  },
];

const renderEventAgenda = (mocks: MockedResponse[] = MOCKS_SUCCESS) => {
  return render(
    <MockedProvider mocks={mocks}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <EventAgenda eventId="event1" />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('EventAgenda', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('shows loader when only category query is loading', () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: AGENDA_ITEM_CATEGORY_LIST,
            variables: { eventId: 'event1' },
          },
          result: { data: mockAgendaCategories },
          delay: 100,
        },
        {
          request: {
            query: AGENDA_FOLDER_LIST,
            variables: { eventId: 'event1' },
          },
          result: { data: mockAgendaFolders },
        },
      ];

      renderEventAgenda(mocks);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('renders loader while queries are loading', () => {
      renderEventAgenda(MOCKS_LOADING);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('renders fallback error message when error has no message', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: AGENDA_ITEM_CATEGORY_LIST,
            variables: { eventId: 'event1' },
          },
          error: {} as Error,
        },
        {
          request: {
            query: AGENDA_FOLDER_LIST,
            variables: { eventId: 'event1' },
          },
          result: { data: mockAgendaFolders },
        },
      ];

      renderEventAgenda(mocks);

      expect(
        await screen.findByText(/Error message not found/i),
      ).toBeInTheDocument();
    });

    it('renders error message when category query fails', async () => {
      renderEventAgenda(MOCKS_ERROR);

      expect(
        await screen.findByText(/Error occurred while loading/i),
      ).toBeInTheDocument();

      expect(await screen.findByText(/Agenda Items/i)).toBeInTheDocument();

      expect(await screen.findByText(/Category error/i)).toBeInTheDocument();
    });
  });

  describe('Successful render', () => {
    it('closes agenda item modal when hide handler is called', async () => {
      renderEventAgenda();

      // open modal
      await userEvent.click(await screen.findByTestId('createAgendaItemBtn'));

      // modal should exist
      const closeBtn = await screen.findByTestId('closeAgendaItemModal');

      // close modal
      await userEvent.click(closeBtn);

      // modal should disappear
      await waitFor(() => {
        expect(
          screen.queryByTestId('closeAgendaItemModal'),
        ).not.toBeInTheDocument();
      });
    });

    it('renders agenda folder container when data is loaded', async () => {
      renderEventAgenda();

      await waitFor(() => {
        expect(screen.getByTestId('agendaFolderContainer')).toBeInTheDocument();
        expect(screen.getByText('folders-loaded')).toBeInTheDocument();
      });
    });

    it('renders create buttons', async () => {
      renderEventAgenda();

      await waitFor(() => {
        expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
        expect(screen.getByTestId('createAgendaFolderBtn')).toBeInTheDocument();
      });
    });
  });

  describe('Modal interactions', () => {
    it('opens agenda folder create modal when button clicked', async () => {
      renderEventAgenda();

      await userEvent.click(await screen.findByTestId('createAgendaFolderBtn'));

      expect(
        await screen.findByTestId('agendaFolderCreateModal'),
      ).toBeInTheDocument();
    });
  });

  describe('Prop wiring & coverage edges', () => {
    it('renders error message when folder query fails', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: AGENDA_ITEM_CATEGORY_LIST,
            variables: { eventId: 'event1' },
          },
          result: { data: mockAgendaCategories },
        },
        {
          request: {
            query: AGENDA_FOLDER_LIST,
            variables: { eventId: 'event1' },
          },
          error: new Error('Folder error'),
        },
      ];

      renderEventAgenda(mocks);

      expect(await screen.findByText(/Agenda Folders/i)).toBeInTheDocument();

      expect(await screen.findByText(/Folder error/i)).toBeInTheDocument();
    });

    it('handles undefined agendaFolderData safely', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: AGENDA_ITEM_CATEGORY_LIST,
            variables: { eventId: 'event1' },
          },
          result: { data: mockAgendaCategories },
        },
        {
          request: {
            query: AGENDA_FOLDER_LIST,
            variables: { eventId: 'event1' },
          },
          result: { data: { agendaFoldersByEventId: null } },
        },
      ];

      renderEventAgenda(mocks);

      await waitFor(() => {
        expect(screen.getByTestId('agendaFolderContainer')).toBeInTheDocument();
      });
    });
  });
});
