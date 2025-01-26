import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18n';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import VolunteerContainer from './VolunteerContainer';
import userEvent from '@testing-library/user-event';
import { MOCKS } from './Volunteers/Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { describe, it, beforeEach, expect, vi } from 'vitest';

/**
 * Unit tests for the `VolunteerContainer` component.
 *
 * The tests ensure the `VolunteerContainer` component renders correctly with various routes and URL parameters.
 * Mocked dependencies are used to isolate the component and verify its behavior.
 * All tests are covered.
 */

const link1 = new StaticMockLink(MOCKS);

const mockedUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockedUseParams(),
  };
});

const renderVolunteerContainer = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link1}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/event/:orgId/:eventId"
                  element={<VolunteerContainer />}
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError">paramsError</div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Volunteer Container', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockedUseParams.mockReturnValue({});

    renderVolunteerContainer();

    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('Testing Volunteer Container Screen -> Toggle screens', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/event/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/" element={<VolunteerContainer />} />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    mockedUseParams.mockReturnValue({ orgId: 'orgId', eventId: 'eventId' });

    renderVolunteerContainer();

    const groupRadio = await screen.findByTestId('groupsRadio');
    const requestsRadio = await screen.findByTestId('requestsRadio');
    const individualRadio = await screen.findByTestId('individualRadio');

    expect(groupRadio).toBeInTheDocument();
    expect(requestsRadio).toBeInTheDocument();
    expect(individualRadio).toBeInTheDocument();

    await waitFor(async () => {
      await userEvent.click(groupRadio);
      await userEvent.click(requestsRadio);
      await userEvent.click(individualRadio);
    });

    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });
});
