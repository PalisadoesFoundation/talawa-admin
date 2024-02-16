import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { toast } from 'react-toastify';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import OrganizationActionItems from './OrganizationActionItems';
import {
  MOCKS,
  MOCKS_ERROR_ACTION_ITEM_CATEGORY_LIST_QUERY,
  MOCKS_ERROR_ACTION_ITEM_LIST_QUERY,
  MOCKS_ERROR_MEMBERS_LIST_QUERY,
} from './OrganizationActionItemMocks';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(
  MOCKS_ERROR_ACTION_ITEM_CATEGORY_LIST_QUERY,
  true
);
const link3 = new StaticMockLink(MOCKS_ERROR_MEMBERS_LIST_QUERY, true);
const link4 = new StaticMockLink(MOCKS_ERROR_ACTION_ITEM_LIST_QUERY, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems
  )
);

describe('Testing Action Item Categories Component', () => {
  test('Component loads correctly', async () => {
    window.location.assign('/organizationActionItems/id=123');
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createActionItem)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful action item category list query', async () => {
    window.location.assign('/orgsetting/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createActionItem)
      ).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful members list query', async () => {
    window.location.assign('/orgsetting/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createActionItem)
      ).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful action item list query', async () => {
    window.location.assign('/orgsetting/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createActionItem)
      ).not.toBeInTheDocument();
    });
  });

  test('returns action items in earliest first order', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('sortActionItems'));
    userEvent.click(screen.getByTestId('earliest'));
  });
});
