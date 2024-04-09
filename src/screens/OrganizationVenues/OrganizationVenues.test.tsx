import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import OrganizationVenues from './OrganizationVenues';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import type { ApolloLink } from '@apollo/client';
import { DELETE_VENUE_MUTATION } from 'GraphQl/Mutations/VenueMutations';

const MOCKS = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            venues: [
              {
                _id: 'venue1',
                capacity: 1000,
                description: 'Updated description for venue 1',
                imageUrl: null,
                name: 'Updated Venue 1',
                organization: {
                  __typename: 'Organization',
                  _id: 'orgId',
                },
                __typename: 'Venue',
              },
              {
                _id: 'venue2',
                capacity: 1500,
                description: 'Updated description for venue 2',
                imageUrl: null,
                name: 'Updated Venue 2',
                organization: {
                  __typename: 'Organization',
                  _id: 'orgId',
                },
                __typename: 'Venue',
              },
              {
                _id: 'venue3',
                name: 'Venue with a name longer than 25 characters that should be truncated',
                description:
                  'Venue description that should be truncated because it is longer than 75 characters',
                capacity: 2000,
                imageUrl: null,
                organization: {
                  _id: 'orgId',
                  __typename: 'Organization',
                },
                __typename: 'Venue',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DELETE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
      },
    },
    result: {
      data: {
        deleteVenue: {
          _id: 'venue1',
          __typename: 'Venue',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_VENUE_MUTATION,
      variables: {
        id: 'venue2',
      },
    },
    result: {
      data: {
        deleteVenue: {
          _id: 'venue2',
          __typename: 'Venue',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

const renderOrganizationVenue = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgvenues/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgvenues/:orgId"
                element={<OrganizationVenues />}
              />
              <Route
                path="/orglist"
                element={<div data-testid="paramsError">paramsError</div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('OrganizationVenue with missing orgId', () => {
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: undefined }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  test('Redirect to /orglist when orgId is falsy/undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgvenues/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/orgvenues/" element={<OrganizationVenues />} />
                <Route
                  path="/orglist"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const paramsError = screen.getByTestId('paramsError');
      expect(paramsError).toBeInTheDocument();
    });
  });
});

describe('Organisation Venues', () => {
  global.alert = jest.fn();

  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('searches the venue list correctly by Name', async () => {
    renderOrganizationVenue(link);
    await wait();

    fireEvent.click(screen.getByTestId('searchByDrpdwn'));
    fireEvent.click(screen.getByTestId('name'));

    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, {
      target: { value: 'Updated Venue 1' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('venue-item1')).toBeInTheDocument();
      expect(screen.queryByTestId('venue-item2')).not.toBeInTheDocument();
    });
  });

  test('searches the venue list correctly by Description', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('searchByDrpdwn'));
    fireEvent.click(screen.getByTestId('desc'));

    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, {
      target: { value: 'Updated description for venue 1' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('venue-item1')).toBeInTheDocument();
      expect(screen.queryByTestId('venue-item2')).not.toBeInTheDocument();
    });
  });

  test('sorts the venue list by lowest capacity correctly', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('sortVenues'));
    fireEvent.click(screen.getByTestId('lowest'));
    await waitFor(() => {
      expect(screen.getByTestId('venue-item1')).toHaveTextContent(
        /Updated Venue 1/i,
      );
      expect(screen.getByTestId('venue-item2')).toHaveTextContent(
        /Updated Venue 2/i,
      );
    });
  });

  test('sorts the venue list by highest capacity correctly', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('sortVenues'));
    fireEvent.click(screen.getByTestId('highest'));
    await waitFor(() => {
      expect(screen.getByTestId('venue-item1')).toHaveTextContent(
        /Venue with a name longer .../i,
      );
      expect(screen.getByTestId('venue-item2')).toHaveTextContent(
        /Updated Venue 2/i,
      );
    });
  });

  test('renders venue name with ellipsis if name is longer than 25 characters', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    const venue = screen.getByTestId('venue-item1');
    expect(venue).toHaveTextContent(/Venue with a name longer .../i);
  });

  test('renders full venue name if name is less than or equal to 25 characters', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    const venueName = screen.getByTestId('venue-item3');
    expect(venueName).toHaveTextContent('Updated Venue 1');
  });

  test('renders venue description with ellipsis if description is longer than 75 characters', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    const venue = screen.getByTestId('venue-item1');
    expect(venue).toHaveTextContent(
      'Venue description that should be truncated because it is longer than 75 cha...',
    );
  });

  test('renders full venue description if description is less than or equal to 75 characters', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    const venue = screen.getByTestId('venue-item3');
    expect(venue).toHaveTextContent('Updated description for venue 1');
  });

  test('Render modal to edit venue', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('updateVenueBtn1'));
    await waitFor(() => {
      expect(screen.getByTestId('venueForm')).toBeInTheDocument();
    });
  });

  test('Render Modal to add event', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('createVenueBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('venueForm')).toBeInTheDocument();
    });
  });

  test('calls handleDelete when delete button is clicked', async () => {
    renderOrganizationVenue(link);
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    const deleteButton = screen.getByTestId('deleteVenueBtn3');
    fireEvent.click(deleteButton);
    await wait();
    await waitFor(() => {
      const deletedVenue = screen.queryByTestId('venue-item3');
      expect(deletedVenue).not.toHaveTextContent(/Updated Venue 2/i);
    });
  });

  test('displays loader when data is loading', () => {
    renderOrganizationVenue(link);
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
  });

  test('renders without crashing', async () => {
    renderOrganizationVenue(link);
    waitFor(() => {
      expect(screen.findByTestId('orgvenueslist')).toBeInTheDocument();
    });
  });

  test('renders the venue list correctly', async () => {
    renderOrganizationVenue(link);
    waitFor(() => {
      expect(screen.getByTestId('venueRow2')).toBeInTheDocument();
      expect(screen.getByTestId('venueRow1')).toBeInTheDocument();
    });
  });
});
