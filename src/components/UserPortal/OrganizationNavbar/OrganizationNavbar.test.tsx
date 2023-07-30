import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import cookies from 'js-cookie';
import { StaticMockLink } from 'utils/StaticMockLink';
import * as getOrganizationId from 'utils/getOrganizationId';

import OrganizationNavbar from './OrganizationNavbar';
import userEvent from '@testing-library/user-event';
import { USER_ORGANIZATION_CONNECTION } from 'GraphQl/Queries/Queries';

const MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        organizationsConnection: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af2',
            image: '',
            name: 'anyOrganization1',
            description: 'desc',
            isPublic: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
          },
        ],
      },
    },
  },
];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);

const navbarProps = {
  currentPage: 'home',
};

describe('Testing OrganizationNavbar Component [User Portal]', () => {
  jest.mock('utils/getOrganizationId');

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const getOrganizationIdSpy = jest
    .spyOn(getOrganizationId, 'default')
    .mockImplementation(() => {
      return '';
    });

  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText('anyOrganization1')).toBeInTheDocument();
  });

  test('The language is switched to English', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn0'));

    await wait();

    expect(cookies.get('i18next')).toBe('en');
  });

  test('The language is switched to fr', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn1'));

    await wait();

    expect(cookies.get('i18next')).toBe('fr');
  });

  test('The language is switched to hi', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn2'));

    await wait();

    expect(cookies.get('i18next')).toBe('hi');
  });

  test('The language is switched to sp', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn3'));

    await wait();

    expect(cookies.get('i18next')).toBe('sp');
  });

  test('The language is switched to zh', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn4'));

    await wait();

    expect(cookies.get('i18next')).toBe('zh');
  });
});
