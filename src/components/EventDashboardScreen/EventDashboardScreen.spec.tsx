import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import EventDashboardScreen from './EventDashboardScreen';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
import 'style/app.module.css';
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ orgId: mockID }) };
});

const link = new StaticMockLink(MOCKS, true);

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

const clickToggleMenuBtn = (toggleButton: HTMLElement): void => {
  fireEvent.click(toggleButton);
};

describe('Testing LeftDrawer in OrganizationScreen', () => {
  it('should be redirected to / if IsLoggedIn is false', async () => {
    setItem('IsLoggedIn', false);
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
  it('should be redirected to / if ss is false', async () => {
    setItem('IsLoggedIn', true);
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
  });
  it('Testing LeftDrawer in page functionality', async () => {
    setItem('IsLoggedIn', true);
    setItem('name', 'John Doe');
    setItem('AdminFor', [
      { _id: '6637904485008f171cf29924', __typename: 'Organization' },
    ]);
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
    const toggleButton = screen.getByTestId('toggleMenuBtn') as HTMLElement;
    const icon = toggleButton.querySelector('i');

    // Resize window to a smaller width
    resizeWindow(800);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');
    // Resize window back to a larger width

    resizeWindow(1000);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-left');

    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');
  });

  it('should be redirected to / if orgId is undefined', async () => {
    mockID = undefined;
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
});
