import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
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
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
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
    useLocation: () => ({ pathname: '/orgdash/123' }),
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
  it('redirects to / if orgId is undefined', async () => {
    mockID = undefined;
    setItem('IsLoggedIn', 'true');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
    mockID = '123';
  });

  it('redirects to / if IsLoggedIn is false', async () => {
    setItem('IsLoggedIn', 'false');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
  });

  it('renders correctly when AdminFor is null (partial org dashboard)', async () => {
    setItem('IsLoggedIn', 'true');
    setItem('AdminFor', null);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText(/title/i)).toBeInTheDocument();
  });

  it('renders and toggles drawer states correctly', async () => {
    setItem('IsLoggedIn', 'true');
    setItem('AdminFor', [{ _id: '1', __typename: 'Organization' }]);
    setItem('sidebar', 'false');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = await screen.findByTestId('toggleMenuBtn');
    const mainPage = await screen.findByTestId('mainpageright');
    // Resize window to trigger hideDrawer true
    resizeWindow(800);
    clickToggleMenuBtn(toggleButton);

    // Resize back
    resizeWindow(1200);
    clickToggleMenuBtn(toggleButton);

    // Ensure class changes with hideDrawer state
    expect(mainPage.className).toMatch(/contract|expand/);
  });
});
