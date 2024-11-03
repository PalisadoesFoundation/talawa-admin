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

const link1 = new StaticMockLink(MOCKS);

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
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
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

    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  test('Testing Volunteer Container Screen -> Toggle screens', async () => {
    renderVolunteerContainer();

    const groupRadio = await screen.findByTestId('groupsRadio');
    expect(groupRadio).toBeInTheDocument();
    userEvent.click(groupRadio);

    const requestsRadio = await screen.findByTestId('requestsRadio');
    expect(requestsRadio).toBeInTheDocument();
    userEvent.click(requestsRadio);

    const individualRadio = await screen.findByTestId('individualRadio');
    expect(individualRadio).toBeInTheDocument();
    userEvent.click(individualRadio);
  });
});
