import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import EventDashboardScreen from './EventDashboardScreen';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
import '../../style/app-fixed.module.css';
import { MOCKS } from './EventDashboardScreenMocks';

const { setItem } = useLocalStorage();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

let mockID: string | undefined = '123';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: mockID }),
    useLocation: () => ({
      pathname: mockID ? `/orgdash/${mockID}` : '/orgdash/undefined',
    }),
  };
});

const link = new StaticMockLink(MOCKS, true);

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

const clickToggleMenuBtn = (toggleButton: HTMLElement): void => {
  fireEvent.click(toggleButton);
};

describe('EventDashboardScreen Component', () => {
  it('does not render main content when orgId is undefined', async () => {
    mockID = undefined;
    setItem('IsLoggedIn', 'true');

    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgdash/undefined']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Component should not render the main page container
    expect(screen.queryByTestId('mainpageright')).not.toBeInTheDocument();
    mockID = '123';
  });

  it('does not render main content when IsLoggedIn is false', async () => {
    setItem('IsLoggedIn', 'false');

    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgdash/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.queryByTestId('mainpageright')).not.toBeInTheDocument();
  });

  it('renders correctly when AdminFor is null', async () => {
    setItem('IsLoggedIn', 'true');
    setItem('AdminFor', null);

    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgdash/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/title/i)).toBeInTheDocument();
  });

  it('renders and toggles drawer states correctly', async () => {
    setItem('IsLoggedIn', 'true');
    setItem('AdminFor', [{ _id: '1', __typename: 'Organization' }]);
    setItem('sidebar', false);

    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/orgdash/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    const toggleButton = await screen.findByTestId('toggleMenuBtn');
    const mainPage = await screen.findByTestId('mainpageright');

    const initialClass = mainPage.className;

    // Resize window to trigger hideDrawer true
    resizeWindow(800);
    clickToggleMenuBtn(toggleButton);

    const afterFirstToggle = mainPage.className;
    expect(afterFirstToggle).not.toBe(initialClass);
    expect(afterFirstToggle).toMatch(/expand|contract/);

    // Resize back
    resizeWindow(1200);
    clickToggleMenuBtn(toggleButton);

    const afterSecondToggle = mainPage.className;
    expect(afterSecondToggle).not.toBe(afterFirstToggle);
    expect(afterSecondToggle).toMatch(/expand|contract/);

    resizeWindow(1024);
  });
});

// Added based on recent edits in VolunteerCreateModal.spec.tsx
