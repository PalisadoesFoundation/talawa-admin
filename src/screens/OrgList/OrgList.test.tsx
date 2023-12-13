import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgList from './OrgList';

import { MOCKS, MOCKS_ADMIN, MOCKS_EMPTY } from './OrgListMocks';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

afterEach(() => {
  localStorage.clear();
  cleanup();
});

describe('Organisations Page testing as SuperAdmin', () => {
  localStorage.setItem('id', '123');

  const link = new StaticMockLink(MOCKS, true);
  const link2 = new StaticMockLink(MOCKS_EMPTY, true);

  const formData = {
    name: 'Dummy Organization',
    description: 'This is a dummy organization',
    location: 'Delhi, India',
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  test('Testing search functionality', async () => {
    localStorage.setItem('id', '123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();

    // Test that the search bar filters organizations by name
    const searchBar = screen.getByTestId(/searchByName/i);
    expect(searchBar).toBeInTheDocument();
    userEvent.type(searchBar, 'Dummy');
  });

  test('Should render no organisation warning alert when there are no organization', async () => {
    window.location.assign('/');
    localStorage.setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.queryByText('Organizations Not Found')).toBeInTheDocument();
    expect(
      screen.queryByText('Please create an organization through dashboard')
    ).toBeInTheDocument();
    expect(window.location).toBeAt('/');
  });

  test('Testing Organization data is not present', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing create organization modal', async () => {
    localStorage.setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    const createOrgBtn = screen.getByTestId(/createOrganizationBtn/i);
    expect(createOrgBtn).toBeInTheDocument();
    userEvent.click(createOrgBtn);
    userEvent.click(screen.getByTestId(/closeModalBtn/i));
  });

  test('Create organization model should work properly', async () => {
    localStorage.setItem('id', '123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <OrgList />
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );

      await wait(500);

      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'UserType',
        'SUPERADMIN'
      );

      userEvent.click(screen.getByTestId(/createOrganizationBtn/i));

      userEvent.type(
        screen.getByTestId(/modalOrganizationName/i),
        formData.name
      );
      userEvent.type(
        screen.getByPlaceholderText(/Description/i),
        formData.description
      );
      userEvent.type(
        screen.getByPlaceholderText(/Location/i),
        formData.location
      );
      userEvent.click(screen.getByTestId(/isPublic/i));
      userEvent.click(screen.getByTestId(/visibleInSearch/i));
      userEvent.upload(screen.getByLabelText(/Display Image/i), formData.image);

      await wait(500);
    });

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formData.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description
    );
    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue(
      formData.location
    );
    expect(screen.getByTestId(/isPublic/i)).not.toBeChecked();
    expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
    expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();

    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
  }, 10000);
});

describe('Organisations Page testing as Admin', () => {
  const link = new StaticMockLink(MOCKS_ADMIN, true);

  test('Create organization modal should not be present in the page for Admin', async () => {
    localStorage.setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.queryByText(/Create Organization/i)).toBeNull();
  });

  test('Testing sort latest and oldest toggle', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrgList />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );

      await wait();

      const searchInput = screen.getByTestId('sort');
      expect(searchInput).toBeInTheDocument();

      const inputText = screen.getByTestId('sortOrgs');

      fireEvent.click(inputText);
      const toggleText = screen.getByTestId('latest');

      fireEvent.click(toggleText);

      expect(searchInput).toBeInTheDocument();
      fireEvent.click(inputText);
      const toggleTite = screen.getByTestId('oldest');
      fireEvent.click(toggleTite);
      expect(searchInput).toBeInTheDocument();
    });
  });
});
