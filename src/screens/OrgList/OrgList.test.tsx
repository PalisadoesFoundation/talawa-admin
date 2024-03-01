import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
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

import {
  MOCKS,
  MOCKS_ADMIN,
  MOCKS_EMPTY,
  MOCKS_WITH_ERROR,
} from './OrgListMocks';
import { ToastContainer, toast } from 'react-toastify';

jest.setTimeout(30000);

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
  const link3 = new StaticMockLink(MOCKS_WITH_ERROR, true);

  const formData = {
    name: 'Dummy Organization',
    description: 'This is a dummy organization',
    address: {
      city: 'Delhi',
      countryCode: 'IN',
      dependentLocality: 'Some Dependent Locality',
      line1: '123 Random Street',
      line2: 'Apartment 456',
      postalCode: '110001',
      sortingCode: 'ABC-123',
      state: 'Delhi',
    },
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  test('Testing search functionality by pressing enter', async () => {
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
    userEvent.type(searchBar, 'Dummy{enter}');
  });

  test('Testing search functionality by Btn click', async () => {
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

    const searchBar = screen.getByTestId('searchByName');
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.type(searchBar, 'Dummy');
    fireEvent.click(searchBtn);
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
  });

  test('Create organization model should work properly', async () => {
    localStorage.setItem('id', '123');
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgList />
            </I18nextProvider>
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

    userEvent.type(screen.getByTestId(/modalOrganizationName/i), formData.name);
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formData.description
    );
    userEvent.type(screen.getByPlaceholderText(/City/i), formData.address.city);
    userEvent.type(
      screen.getByPlaceholderText(/Postal Code/i),
      formData.address.postalCode
    );
    userEvent.selectOptions(
      screen.getByTestId('countrycode'),
      formData.address.countryCode
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 1/i),
      formData.address.line1
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 2/i),
      formData.address.line2
    );
    userEvent.type(
      screen.getByPlaceholderText(/Sorting Code/i),
      formData.address.sortingCode
    );
    userEvent.type(
      screen.getByPlaceholderText(/Dependent Locality/i),
      formData.address.dependentLocality
    );
    userEvent.click(screen.getByTestId(/userRegistrationRequired/i));
    userEvent.click(screen.getByTestId(/visibleInSearch/i));
    userEvent.upload(screen.getByLabelText(/Display Image/i), formData.image);

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formData.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description
    );
    //Checking the fields for the address object in the formdata.
    const { address } = formData;
    expect(screen.getByPlaceholderText(/City/i)).toHaveValue(address.city);
    expect(screen.getByPlaceholderText(/Dependent Locality/i)).toHaveValue(
      address.dependentLocality
    );
    expect(screen.getByPlaceholderText(/Line 1/i)).toHaveValue(address.line1);
    expect(screen.getByPlaceholderText(/Line 2/i)).toHaveValue(address.line2);
    expect(screen.getByPlaceholderText(/Postal Code/i)).toHaveValue(
      address.postalCode
    );
    expect(screen.getByTestId(/countrycode/i)).toHaveValue(address.countryCode);
    expect(screen.getByPlaceholderText(/Sorting Code/i)).toHaveValue(
      address.sortingCode
    );
    expect(screen.getByTestId(/userRegistrationRequired/i)).not.toBeChecked();
    expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
    expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();

    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
    // await act(async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // });
    // await waitFor(() =>
    //   expect(
    //     screen.queryByText(/Congratulation the Organization is created/i)
    //   ).toBeInTheDocument()
    // );
  });

  test('Plugin Notification model should work properly', async () => {
    localStorage.setItem('id', '123');
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgList />
            </I18nextProvider>
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

    userEvent.type(screen.getByTestId(/modalOrganizationName/i), formData.name);
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formData.description
    );
    userEvent.type(screen.getByPlaceholderText(/City/i), formData.address.city);
    userEvent.type(
      screen.getByPlaceholderText(/Postal Code/i),
      formData.address.postalCode
    );
    userEvent.selectOptions(
      screen.getByTestId('countrycode'),
      formData.address.countryCode
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 1/i),
      formData.address.line1
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 2/i),
      formData.address.line2
    );
    userEvent.type(
      screen.getByPlaceholderText(/Sorting Code/i),
      formData.address.sortingCode
    );
    userEvent.type(
      screen.getByPlaceholderText(/Dependent Locality/i),
      formData.address.dependentLocality
    );
    userEvent.click(screen.getByTestId(/userRegistrationRequired/i));
    userEvent.click(screen.getByTestId(/visibleInSearch/i));
    userEvent.upload(screen.getByLabelText(/Display Image/i), formData.image);

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formData.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description
    );
    //Checking the fields for the address object in the formdata.
    const { address } = formData;
    expect(screen.getByPlaceholderText(/City/i)).toHaveValue(address.city);
    expect(screen.getByPlaceholderText(/Dependent Locality/i)).toHaveValue(
      address.dependentLocality
    );
    expect(screen.getByPlaceholderText(/Line 1/i)).toHaveValue(address.line1);
    expect(screen.getByPlaceholderText(/Line 2/i)).toHaveValue(address.line2);
    expect(screen.getByPlaceholderText(/Postal Code/i)).toHaveValue(
      address.postalCode
    );
    expect(screen.getByTestId(/countrycode/i)).toHaveValue(address.countryCode);
    expect(screen.getByPlaceholderText(/Sorting Code/i)).toHaveValue(
      address.sortingCode
    );
    expect(screen.getByTestId(/userRegistrationRequired/i)).not.toBeChecked();
    expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
    expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();

    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
    // await act(async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // });
    // await waitFor(() =>
    //   expect(
    //     screen.queryByText(/Congratulation the Organization is created/i)
    //   ).toBeInTheDocument()
    // );
    // userEvent.click(screen.getByTestId(/enableEverythingForm/i));
  });

  test('Testing create sample organization working properly', async () => {
    localStorage.setItem('id', '123');
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
    userEvent.click(screen.getByTestId(/createSampleOrganizationBtn/i));
    await waitFor(() =>
      expect(
        screen.queryByText(/Sample Organization Successfully created/i)
      ).toBeInTheDocument()
    );
  });
  test('Testing error handling for CreateSampleOrg', async () => {
    localStorage.setItem('id', '123');
    localStorage.setItem('UserType', 'SUPERADMIN');
    jest.spyOn(toast, 'error');
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <ToastContainer />
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    await wait();
    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
    userEvent.click(screen.getByTestId(/createSampleOrganizationBtn/i));
    await waitFor(() =>
      expect(
        screen.queryByText(/Only one sample organization allowed/i)
      ).toBeInTheDocument()
    );
  });
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
    await waitFor(() => {
      expect(screen.queryByText(/Create Organization/i)).toBeNull();
    });
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
