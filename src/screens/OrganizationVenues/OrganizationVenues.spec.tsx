import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import OrganizationVenues from './OrganizationVenues';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import { errorHandler } from 'utils/errorHandler';
import {
  MOCK_ALL_VENUE_ASC,
  MOCK_SEARCH_VENUE_BY_DESC,
  MOCK_SEARCH_VENUE_BY_NAME,
  MOCK_ALL_VENUE_DESC,
  MOCK_FETCH_VENUES_ERROR,
  MOCK_FAILED_TO_DELETE_VENUE_ERROR,
} from './OrganizationVenuesMocks';

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
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
beforeAll(() => {
  vi.clearAllMocks();
});
describe('render OrganizationVenues component', () => {
  it('displays loader when data is loading', () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
  });

  it('render venues list', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));
    await waitFor(() => {
      expect(screen.getByText('Test Venue 1')).toBeInTheDocument();
      expect(screen.getByText('Test Venue 2')).toBeInTheDocument();
      expect(screen.getByText('Test Venue 3')).toBeInTheDocument();
      expect(screen.getByText('Test Venue 4')).toBeInTheDocument();
    });
  });
  it('renders venue list correctly after loading', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();

    await waitFor(() => {
      const venueList = screen.getByTestId('orgvenueslist');
      expect(venueList).toBeInTheDocument();

      const venues = screen.getAllByTestId(/^venue-item/);
      expect(venues).toHaveLength(4);
    });
  });
  it('search venue using name', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_SEARCH_VENUE_BY_NAME));

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('searchByDrpdwn'));
    fireEvent.click(screen.getByTestId('name'));

    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, {
      target: { value: 'Test Venue 4' },
    });

    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.queryByText('Test Venue 4')).toBeInTheDocument();
      expect(screen.queryByText('Test Venue 2')).not.toBeInTheDocument();
    });
  });
  it('search venue using description', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_SEARCH_VENUE_BY_DESC));

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('searchByDrpdwn'));
    fireEvent.click(screen.getByTestId('desc'));

    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, {
      target: { value: 'description of venue4' },
    });

    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.queryByText('description of venue4')).toBeInTheDocument();
      expect(
        screen.queryByText('This is a test venue.'),
      ).not.toBeInTheDocument(); // desc of venue1
    });
  });
  it('sorts venues list by lowest capacity correctly', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));
    await waitFor(() => {
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('sortVenues'));
    fireEvent.click(screen.getByTestId('lowest'));

    await waitFor(() => {
      const venueCards = screen.getAllByTestId((testId) =>
        testId.startsWith('capacity-'),
      );
      const capacities = venueCards.map((card) => {
        return parseInt(
          card.getAttribute('data-testid')?.replace('capacity-', '') || '0',
        );
      });
      expect(capacities).toEqual([100, 200, 200, 1200]);
    });
  });
  it('sorts venues list by highest capacity correctly', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_DESC));
    await waitFor(() => {
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('sortVenues'));
    fireEvent.click(screen.getByTestId('highest'));

    await waitFor(() => {
      const venueCards = screen.getAllByTestId((testId) =>
        testId.startsWith('capacity-'),
      );
      const capacities = venueCards.map((card) => {
        return parseInt(
          card.getAttribute('data-testid')?.replace('capacity-', '') || '0',
        );
      });
      expect(capacities).toEqual([1200, 200, 200, 100]);
    });
  });
  it('Render modal to edit venue', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('updateVenueBtn1'));
    await waitFor(() => {
      expect(screen.getByTestId('venueForm')).toBeInTheDocument();
    });
  });
  it('Render Modal to add event', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));
    await waitFor(() =>
      expect(screen.getByTestId('orgvenueslist')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('createVenueBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('venueForm')).toBeInTheDocument();
    });
  });
  it('calls handleDelete when delete button is clicked', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_ALL_VENUE_ASC));
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
});

vi.mock('utils/errorHandler');
describe('Organisation Venues Error Handling', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('handles venue query error correctly', async () => {
    renderOrganizationVenue(new StaticMockLink(MOCK_FETCH_VENUES_ERROR));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          message: 'Failed to fetch venues',
          name: 'ApolloError',
          networkError: expect.any(Error),
        }),
      );
    });
  });

  it('handles venue deletion error correctly', async () => {
    renderOrganizationVenue(
      new StaticMockLink(MOCK_FAILED_TO_DELETE_VENUE_ERROR),
    );
    await waitFor(() => {
      expect(screen.getByTestId('deleteVenueBtn1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('deleteVenueBtn1'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          message: 'Failed to delete venue',
          name: 'ApolloError',
          networkError: expect.any(Error),
        }),
      );
    });
  });
});
