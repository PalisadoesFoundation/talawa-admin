import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18n';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import VolunteerContainer from './VolunteerContainer';
import userEvent from '@testing-library/user-event';
import { MOCKS } from './Volunteers/Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

/**
 * Unit tests for the `VolunteerContainer` component.
 *
 * The tests ensure the `VolunteerContainer` component renders correctly with various routes and URL parameters.
 * Mocked dependencies are used to isolate the component and verify its behavior.
 * All tests are covered.
 */

const { mockedUseParams, useTranslationMock } = vi.hoisted(() => {
  const paramsMock = vi.fn();
  paramsMock.mockReturnValue({ orgId: 'orgId', eventId: 'eventId' });

  return {
    mockedUseParams: paramsMock,
    useTranslationMock: vi.fn(() => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    })),
  };
});

vi.mock('react-i18next', async () => {
  const actual =
    await vi.importActual<typeof import('react-i18next')>('react-i18next');
  return {
    ...actual,
    useTranslation: useTranslationMock,
  };
});

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: mockedUseParams,
    Navigate: () => <div data-testid="paramsError">Navigated to root</div>,
  };
});

const renderVolunteerContainer = (): RenderResult => {
  return render(
    <MockedProvider link={new StaticMockLink(MOCKS)}>
      <MemoryRouter initialEntries={['/admin/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    mockedUseParams.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
