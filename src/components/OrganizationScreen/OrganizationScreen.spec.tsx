import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import OrganizationScreen from './OrganizationScreen';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import styles from './OrganizationScreen.module.css';
import { vi } from 'vitest';
const mockID: string | undefined = '123';
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: () => ({ orgId: mockID }),
  useMatch: () => ({ params: { eventId: 'event123', orgId: '123' } }),
}));

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        eventsByOrganization: [
          {
            _id: 'event123',
            title: 'Test Event Title',
            description: 'Test Description',
            startDate: '2024-01-01',
            endDate: '2024-01-02',
            location: 'Test Location',
            startTime: '09:00',
            endTime: '17:00',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

describe('Testing OrganizationScreen', () => {
  const renderComponent = (): void => {
    render(
      <MockedProvider addTypename={false} link={link} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  test('renders correctly with event title', async () => {
    renderComponent();

    await waitFor(() => {
      const mainPage = screen.getByTestId('mainpageright');
      expect(mainPage).toBeInTheDocument();
    });
  });

  test('handles drawer toggle correctly', () => {
    renderComponent();

    const closeButton = screen.getByTestId('closeMenu');
    fireEvent.click(closeButton);

    expect(screen.getByTestId('mainpageright')).toHaveClass(styles.expand);

    const openButton = screen.getByTestId('openMenu');
    fireEvent.click(openButton);

    // Check for expand class after opening
    expect(screen.getByTestId('mainpageright')).toHaveClass(styles.contract);
  });

  test('handles window resize', () => {
    renderComponent();
    window.innerWidth = 800;
    fireEvent(window, new Event('resize'));
    expect(screen.getByTestId('mainpageright')).toHaveClass(styles.expand);
  });
});
