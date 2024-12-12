import React from 'react'; // <-- Add this import
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import EventRegistrants from './EventRegistrants';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import { REGISTRANTS_MOCKS } from './Registrants.mocks';
import { MOCKS as ATTENDEES_MOCKS } from '../EventAttendance/Attendance.mocks';

const COMBINED_MOCKS = [...REGISTRANTS_MOCKS, ...ATTENDEES_MOCKS];

const link = new StaticMockLink(COMBINED_MOCKS, true);

async function wait(): Promise<void> {
  await waitFor(() => {
    return Promise.resolve();
  });
}

const renderEventRegistrants = (): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <EventRegistrants />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Event Registrants Component', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly with table headers', async () => {
    renderEventRegistrants();

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-serial')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-registrant')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-created-at')).toBeInTheDocument();
      expect(
        screen.getByTestId('table-header-add-registrant'),
      ).toBeInTheDocument();
    });
  });

  test('Renders registrants button correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByTestId('stats-modal')).toBeInTheDocument();
      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });
  });
});
