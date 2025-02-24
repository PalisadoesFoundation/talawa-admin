import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18n';
import { MemoryRouter } from 'react-router-dom';
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

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

const mockedUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockedUseParams(),
    Navigate: () => <div data-testid="paramsError">Navigated to root</div>,
  };
});

const renderVolunteerContainer = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={new StaticMockLink(MOCKS)}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider>
            <I18nextProvider i18n={i18n}>
              <VolunteerContainer />
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

    const errorElement = await screen.findByTestId('paramsError');
    expect(errorElement).toBeInTheDocument();
  });

  it('Testing Volunteer Container Screen -> Toggle screens', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId', eventId: 'eventId' });

    renderVolunteerContainer();

    const individualLabel = await screen.findByTestId('individualRadio');
    const groupsLabel = await screen.findByTestId('groupsRadio');
    const requestsLabel = await screen.findByTestId('requestsRadio');

    expect(await screen.findByTestId('individualRadio')).toBeInTheDocument();
    await userEvent.click(groupsLabel);
    expect(await screen.findByTestId('groupsRadio')).toBeInTheDocument();
    await userEvent.click(requestsLabel);
    expect(await screen.findByTestId('requestsRadio')).toBeInTheDocument();
    await userEvent.click(individualLabel);
  });
});
