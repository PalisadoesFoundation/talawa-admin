// SKIP_LOCALSTORAGE_CHECK
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
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';

vi.setConfig({ testTimeout: 30000 });

const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  vi.spyOn(Storage.prototype, 'setItem');
});

afterEach(() => {
  localStorage.clear();
  cleanup();
  vi.clearAllMocks();
});

describe('Organisations Page testing as SuperAdmin', () => {
  setItem('id', '123');
  const link = new StaticMockLink(MOCKS, true);
  const link2 = new StaticMockLink(MOCKS_EMPTY, true);
  const link3 = new StaticMockLink(MOCKS_WITH_ERROR, true);

  const formData = {
    name: 'Dummy Organization',
    description: 'This is a dummy organization',
    address: {
      city: 'Kingston',
      countryCode: 'JM',
      dependentLocality: 'Sample Dependent Locality',
      line1: '123 Jamaica Street',
      line2: 'Apartment 456',
      postalCode: 'JM12345',
      sortingCode: 'ABC-123',
      state: 'Kingston Parish',
    },
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };
  test('Should display organisations for superAdmin even if admin For field is empty', async () => {
    window.location.assign('/');
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', []);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(
      screen.queryByText('Organizations Not Found'),
    ).not.toBeInTheDocument();
  });

  test('Testing search functionality by pressing enter', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    // Test that the search bar filters organizations by name
    const searchBar = screen.getByTestId(/searchByName/i);
    expect(searchBar).toBeInTheDocument();
    userEvent.type(searchBar, 'Dummy{enter}');
  });

  test('Testing search functionality by Btn click', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const searchBar = screen.getByTestId('searchByName');
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.type(searchBar, 'Dummy');
    fireEvent.click(searchBtn);
  });

  test('Should render no organisation warning alert when there are no organization', async () => {
    window.location.assign('/');
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.queryByText('Organizations Not Found')).toBeInTheDocument();
    expect(
      screen.queryByText('Please create an organization through dashboard'),
    ).toBeInTheDocument();
  });

  test('Testing Organization data is not present', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', false);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Testing create organization modal', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    render(
      <MockedProvider addTypename={true} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    screen.debug();

    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'Talawa-admin_AdminFor',
      JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
    );

    expect(screen.getByTestId(/createOrganizationBtn/i)).toBeInTheDocument();
  });

  test('Create organization model should work properly', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

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
      </MockedProvider>,
    );

    await wait(500);

    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'Talawa-admin_AdminFor',
      JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
    );

    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));

    userEvent.type(screen.getByTestId(/modalOrganizationName/i), formData.name);
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formData.description,
    );
    userEvent.type(screen.getByPlaceholderText(/City/i), formData.address.city);
    userEvent.type(
      screen.getByPlaceholderText(/Postal Code/i),
      formData.address.postalCode,
    );
    userEvent.type(
      screen.getByPlaceholderText(/State \/ Province/i),
      formData.address.state,
    );

    userEvent.selectOptions(
      screen.getByTestId('countrycode'),
      formData.address.countryCode,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 1/i),
      formData.address.line1,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 2/i),
      formData.address.line2,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Sorting Code/i),
      formData.address.sortingCode,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Dependent Locality/i),
      formData.address.dependentLocality,
    );
    userEvent.click(screen.getByTestId(/userRegistrationRequired/i));
    userEvent.click(screen.getByTestId(/visibleInSearch/i));

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formData.name,
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description,
    );
    //Checking the fields for the address object in the formdata.
    const { address } = formData;
    expect(screen.getByPlaceholderText(/City/i)).toHaveValue(address.city);
    expect(screen.getByPlaceholderText(/State \/ Province/i)).toHaveValue(
      address.state,
    );
    expect(screen.getByPlaceholderText(/Dependent Locality/i)).toHaveValue(
      address.dependentLocality,
    );
    expect(screen.getByPlaceholderText(/Line 1/i)).toHaveValue(address.line1);
    expect(screen.getByPlaceholderText(/Line 2/i)).toHaveValue(address.line2);
    expect(screen.getByPlaceholderText(/Postal Code/i)).toHaveValue(
      address.postalCode,
    );
    expect(screen.getByTestId(/countrycode/i)).toHaveValue(address.countryCode);
    expect(screen.getByPlaceholderText(/Sorting Code/i)).toHaveValue(
      address.sortingCode,
    );
    expect(screen.getByTestId(/userRegistrationRequired/i)).not.toBeChecked();
    expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
    expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();
    const displayImage = screen.getByTestId('organisationImage');
    userEvent.upload(displayImage, formData.image);
    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
    await waitFor(() => {
      expect(
        screen.queryByText(/Congratulation the Organization is created/i),
      ).toBeInTheDocument();
    });
  });

  test('Plugin Notification model should work properly', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

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
      </MockedProvider>,
    );

    await wait(500);

    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'Talawa-admin_AdminFor',
      JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
    );

    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));

    userEvent.type(screen.getByTestId(/modalOrganizationName/i), formData.name);
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formData.description,
    );
    userEvent.type(screen.getByPlaceholderText(/City/i), formData.address.city);
    userEvent.type(
      screen.getByPlaceholderText(/State \/ Province/i),
      formData.address.state,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Postal Code/i),
      formData.address.postalCode,
    );
    userEvent.selectOptions(
      screen.getByTestId('countrycode'),
      formData.address.countryCode,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 1/i),
      formData.address.line1,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Line 2/i),
      formData.address.line2,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Sorting Code/i),
      formData.address.sortingCode,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Dependent Locality/i),
      formData.address.dependentLocality,
    );
    userEvent.click(screen.getByTestId(/userRegistrationRequired/i));
    userEvent.click(screen.getByTestId(/visibleInSearch/i));

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formData.name,
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description,
    );
    //Checking the fields for the address object in the formdata.
    const { address } = formData;
    expect(screen.getByPlaceholderText(/City/i)).toHaveValue(address.city);
    expect(screen.getByPlaceholderText(/State \/ Province/i)).toHaveValue(
      address.state,
    );
    expect(screen.getByPlaceholderText(/Dependent Locality/i)).toHaveValue(
      address.dependentLocality,
    );
    expect(screen.getByPlaceholderText(/Line 1/i)).toHaveValue(address.line1);
    expect(screen.getByPlaceholderText(/Line 2/i)).toHaveValue(address.line2);
    expect(screen.getByPlaceholderText(/Postal Code/i)).toHaveValue(
      address.postalCode,
    );
    expect(screen.getByTestId(/countrycode/i)).toHaveValue(address.countryCode);
    expect(screen.getByPlaceholderText(/Sorting Code/i)).toHaveValue(
      address.sortingCode,
    );
    expect(screen.getByTestId(/userRegistrationRequired/i)).not.toBeChecked();
    expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
    expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();

    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
    // await act(async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // });
    await waitFor(() =>
      expect(
        screen.queryByText(/Congratulation the Organization is created/i),
      ).toBeInTheDocument(),
    );
    await waitFor(() => {
      screen.findByTestId(/pluginNotificationHeader/i);
    });
    // userEvent.click(screen.getByTestId(/enableEverythingForm/i));
    userEvent.click(screen.getByTestId(/enableEverythingForm/i));
  });

  test('Testing create sample organization working properly', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

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
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
    userEvent.click(screen.getByTestId(/createSampleOrganizationBtn/i));
    await waitFor(() =>
      expect(
        screen.queryByText(/Sample Organization Successfully created/i),
      ).toBeInTheDocument(),
    );
  });
  test('Testing error handling for CreateSampleOrg', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    vi.spyOn(toast, 'error');
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <ToastContainer />
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
    userEvent.click(screen.getByTestId(/createSampleOrganizationBtn/i));
    await waitFor(() =>
      expect(
        screen.queryByText(/Only one sample organization allowed/i),
      ).toBeInTheDocument(),
    );
  });
});

describe('Organisations Page testing as Admin', () => {
  const link = new StaticMockLink(MOCKS_ADMIN, true);
  test('Create organization modal should not be present in the page for Admin', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', false);
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByText(/Create Organization/i)).toBeNull();
    });
  });
  test('Testing sort latest and oldest toggle', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', false);
    setItem('AdminFor', [{ name: 'adi', _id: 'a0', image: '' }]);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const sortDropdown = screen.getByTestId('sort');
    expect(sortDropdown).toBeInTheDocument();

    const sortToggle = screen.getByTestId('sortOrgs');

    await act(async () => {
      fireEvent.click(sortToggle);
    });

    const latestOption = screen.getByTestId('Latest');

    await act(async () => {
      fireEvent.click(latestOption);
    });

    expect(sortDropdown).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(sortToggle);
    });

    const oldestOption = await waitFor(() => screen.getByTestId('Earliest'));

    await act(async () => {
      fireEvent.click(oldestOption);
    });

    expect(sortDropdown).toBeInTheDocument();
  });
});
