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
import { ToastContainer, toast } from 'react-toastify';

import { MOCKS, MOCKS_ADMIN, MOCKS_EMPTY } from './OrgListMocks';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { CREATE_ORGANIZATION_MUTATION_PG } from 'GraphQl/Mutations/mutations';

vi.setConfig({ testTimeout: 30000 });
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: vi
    .fn()
    .mockImplementation(() => <div data-testid="toast-container" />),
}));

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
  // const link3 = new StaticMockLink(MOCKS_WITH_ERROR, true);

  // const formData = {
  //   name: 'Dummy Organization',
  //   description: 'This is a dummy organization',
  //   address: {
  //     city: 'Kingston',
  //     countryCode: 'JM',
  //     dependentLocality: 'Sample Dependent Locality',
  //     line1: '123 Jamaica Street',
  //     line2: 'Apartment 456',
  //     postalCode: 'JM12345',
  //     sortingCode: 'ABC-123',
  //     state: 'Kingston Parish',
  //   },
  //   image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  // };
  // test('Should display organisations for superAdmin even if admin For field is empty', async () => {
  //   window.location.assign('/');
  //   setItem('id', '123');
  //   setItem('SuperAdmin', true);
  //   setItem('AdminFor', []);

  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <OrgList />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );

  //   await wait();
  //   expect(
  //     screen.queryByText('Organizations Not Found'),
  //   ).not.toBeInTheDocument();
  // });

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
    await userEvent.type(searchBar, 'Dummy{enter}');
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
    await userEvent.type(searchBar, 'Dummy');
    fireEvent.click(searchBtn);
  });

  test('Testing search functionality by with empty search bar', async () => {
    setItem('id', '123');
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
    await userEvent.clear(searchBar);
    fireEvent.click(searchBtn);
  });

  test('Should render no organisation warning alert when there are no organization', async () => {
    window.location.assign('/');
    setItem('id', '123');
    setItem('role', 'administrator');

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
    setItem('role', 'administrator');

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

  test('testing scroll', async () => {
    setItem('id', '123');

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

    // Wait for initial organizations to load
    expect(await screen.findByText('Organization 1')).toBeInTheDocument();
    expect(await screen.findByText('Organization 2')).toBeInTheDocument();

    fireEvent.scroll(window, { target: { scrollY: 1000 } });
  });

  // test('Testing create organization modal', async () => {
  //   setItem('id', '123');
  //   setItem('SuperAdmin', true);
  //   setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

  //   render(
  //     <MockedProvider addTypename={true} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <OrgList />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );

  //   screen.debug();

  //   expect(localStorage.setItem).toHaveBeenLastCalledWith(
  //     'Talawa-admin_AdminFor',
  //     JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
  //   );

  //   expect(screen.getByTestId(/createOrganizationBtn/i)).toBeInTheDocument();
  // });

  // test('Create organization model should work properly', async () => {
  //   setItem('id', '123');
  //   setItem('SuperAdmin', true);
  //   setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgList />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );

  //   await wait(500);

  //   expect(localStorage.setItem).toHaveBeenLastCalledWith(
  //     'Talawa-admin_AdminFor',
  //     JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
  //   );

  //   await userEvent.click(screen.getByTestId(/createOrganizationBtn/i));

  //   await userEvent.type(screen.getByTestId(/modalOrganizationName/i), formData.name);
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Description/i),
  //     formData.description,
  //   );
  //   await userEvent.type(screen.getByPlaceholderText(/City/i), formData.address.city);
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Postal Code/i),
  //     formData.address.postalCode,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/State \/ Province/i),
  //     formData.address.state,
  //   );

  //   await userEvent.selectOptions(
  //     screen.getByTestId('countrycode'),
  //     formData.address.countryCode,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Line 1/i),
  //     formData.address.line1,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Line 2/i),
  //     formData.address.line2,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Sorting Code/i),
  //     formData.address.sortingCode,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Dependent Locality/i),
  //     formData.address.dependentLocality,
  //   );
  //   await userEvent.click(screen.getByTestId(/userRegistrationRequired/i));
  //   await userEvent.click(screen.getByTestId(/visibleInSearch/i));

  //   expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
  //     formData.name,
  //   );
  //   expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
  //     formData.description,
  //   );
  //   //Checking the fields for the address object in the formdata.
  //   const { address } = formData;
  //   expect(screen.getByPlaceholderText(/City/i)).toHaveValue(address.city);
  //   expect(screen.getByPlaceholderText(/State \/ Province/i)).toHaveValue(
  //     address.state,
  //   );
  //   expect(screen.getByPlaceholderText(/Dependent Locality/i)).toHaveValue(
  //     address.dependentLocality,
  //   );
  //   expect(screen.getByPlaceholderText(/Line 1/i)).toHaveValue(address.line1);
  //   expect(screen.getByPlaceholderText(/Line 2/i)).toHaveValue(address.line2);
  //   expect(screen.getByPlaceholderText(/Postal Code/i)).toHaveValue(
  //     address.postalCode,
  //   );
  //   expect(screen.getByTestId(/countrycode/i)).toHaveValue(address.countryCode);
  //   expect(screen.getByPlaceholderText(/Sorting Code/i)).toHaveValue(
  //     address.sortingCode,
  //   );
  //   expect(screen.getByTestId(/userRegistrationRequired/i)).not.toBeChecked();
  //   expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
  //   expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();
  //   const displayImage = screen.getByTestId('organisationImage');
  //   await userEvent.upload(displayImage, formData.image);
  //   await userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByText(/Congratulation the Organization is created/i),
  //     ).toBeInTheDocument();
  //   });
  // });

  // test('Plugin Notification model should work properly', async () => {
  //   setItem('id', '123');
  //   setItem('SuperAdmin', true);
  //   setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgList />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );

  //   await wait(500);

  //   expect(localStorage.setItem).toHaveBeenLastCalledWith(
  //     'Talawa-admin_AdminFor',
  //     JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
  //   );

  //   await userEvent.click(screen.getByTestId(/createOrganizationBtn/i));

  //   await userEvent.type(screen.getByTestId(/modalOrganizationName/i), formData.name);
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Description/i),
  //     formData.description,
  //   );
  //   await userEvent.type(screen.getByPlaceholderText(/City/i), formData.address.city);
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/State \/ Province/i),
  //     formData.address.state,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Postal Code/i),
  //     formData.address.postalCode,
  //   );
  //   await userEvent.selectOptions(
  //     screen.getByTestId('countrycode'),
  //     formData.address.countryCode,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Line 1/i),
  //     formData.address.line1,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Line 2/i),
  //     formData.address.line2,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Sorting Code/i),
  //     formData.address.sortingCode,
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/Dependent Locality/i),
  //     formData.address.dependentLocality,
  //   );
  //   await userEvent.click(screen.getByTestId(/userRegistrationRequired/i));
  //   await userEvent.click(screen.getByTestId(/visibleInSearch/i));

  //   expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
  //     formData.name,
  //   );
  //   expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
  //     formData.description,
  //   );
  //   //Checking the fields for the address object in the formdata.
  //   const { address } = formData;
  //   expect(screen.getByPlaceholderText(/City/i)).toHaveValue(address.city);
  //   expect(screen.getByPlaceholderText(/State \/ Province/i)).toHaveValue(
  //     address.state,
  //   );
  //   expect(screen.getByPlaceholderText(/Dependent Locality/i)).toHaveValue(
  //     address.dependentLocality,
  //   );
  //   expect(screen.getByPlaceholderText(/Line 1/i)).toHaveValue(address.line1);
  //   expect(screen.getByPlaceholderText(/Line 2/i)).toHaveValue(address.line2);
  //   expect(screen.getByPlaceholderText(/Postal Code/i)).toHaveValue(
  //     address.postalCode,
  //   );
  //   expect(screen.getByTestId(/countrycode/i)).toHaveValue(address.countryCode);
  //   expect(screen.getByPlaceholderText(/Sorting Code/i)).toHaveValue(
  //     address.sortingCode,
  //   );
  //   expect(screen.getByTestId(/userRegistrationRequired/i)).not.toBeChecked();
  //   expect(screen.getByTestId(/visibleInSearch/i)).toBeChecked();
  //   expect(screen.getByLabelText(/Display Image/i)).toBeTruthy();

  //   await userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
  //   // await act(async () => {
  //   //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   // });
  //   await waitFor(() =>
  //     expect(
  //       screen.queryByText(/Congratulation the Organization is created/i),
  //     ).toBeInTheDocument(),
  //   );
  //   await waitFor(() => {
  //     screen.findByTestId(/pluginNotificationHeader/i);
  //   });
  //   // await userEvent.click(screen.getByTestId(/enableEverythingForm/i));
  //   await userEvent.click(screen.getByTestId(/enableEverythingForm/i));
  // });

  // test('Testing create sample organization working properly', async () => {
  //   setItem('id', '123');
  //   setItem('SuperAdmin', true);
  //   setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgList />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );
  //   await wait();
  //   await userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
  //   await userEvent.click(screen.getByTestId(/createSampleOrganizationBtn/i));
  //   await waitFor(() =>
  //     expect(
  //       screen.queryByText(/Sample Organization Successfully created/i),
  //     ).toBeInTheDocument(),
  //   );
  // });
  //
  //   setItem('id', '123');
  //   setItem('SuperAdmin', true);
  //   setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

  //   vi.spyOn(toast, 'error');
  //   render(
  //     <MockedProvider addTypename={false} link={link3}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <ToastContainer />
  //           <OrgList />
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );
  //   await wait();
  //   await userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
  //   await userEvent.click(screen.getByTestId(/createSampleOrganizationBtn/i));
  //   await waitFor(() =>
  //     expect(
  //       screen.queryByText(/Only one sample organization allowed/i),
  //     ).toBeInTheDocument(),
  //   );
  // });
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

describe('Organization Modal Tests', () => {
  const formData = {
    name: 'Test Organization',
    description: 'This is a test organization',
    addressLine1: '123 Main Street',
    addressLine2: 'Suite 456',
    city: 'Kingston',
    state: 'Kingston Parish',
    postalCode: 'JM12345',
    countryCode: 'jm',
    avatar: new File(['avatar'], 'avatar.png', { type: 'image/png' }),
  };

  test('Testing create organization modal open and close', async () => {
    setItem('id', '123');
    setItem('role', 'administrator');
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    render(
      <MockedProvider
        addTypename={false}
        link={new StaticMockLink(MOCKS, true)}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(500);

    // Verify create organization button exists for administrator
    const createOrgButton = screen.getByTestId('createOrganizationBtn');
    expect(createOrgButton).toBeInTheDocument();

    // Open the modal
    await userEvent.click(createOrgButton);

    // Verify modal is open - checking for modal header which should be present
    expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();

    // Close the modal using the header's close button
    // Find the close button within the modal header
    const modalHeader = screen.getByTestId('modalOrganizationHeader');
    const closeButton = modalHeader.querySelector('.btn-close');

    if (closeButton) {
      await userEvent.click(closeButton);
    } else {
      const closeButtons = modalHeader.querySelectorAll('button');
      if (closeButtons.length > 0) {
        // Click the last button which is typically the close button
        fireEvent.click(closeButtons[closeButtons.length - 1]);
      } else {
        // If no buttons found, try to click on any element that might be the close button
        const closeElements =
          modalHeader.querySelectorAll('.close, .btn-close');
        if (closeElements.length > 0) {
          fireEvent.click(closeElements[0]);
        }
      }
    }

    // Verify modal is closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('modalOrganizationHeader'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing organization form input handling', async () => {
    setItem('id', '123');
    setItem('role', 'administrator');

    render(
      <MockedProvider
        addTypename={false}
        link={new StaticMockLink(MOCKS, true)}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(500);

    // Open the modal
    await userEvent.click(screen.getByTestId('createOrganizationBtn'));

    // Fill out form fields
    await userEvent.type(
      screen.getByTestId('modalOrganizationName'),
      formData.name,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationDescription'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationAddressLine1'),
      formData.addressLine1,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationAddressLine2'),
      formData.addressLine2,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationCity'),
      formData.city,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationState'),
      formData.state,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationPostalCode'),
      formData.postalCode,
    );

    await userEvent.selectOptions(
      screen.getByTestId('modalOrganizationCountryCode'),
      formData.countryCode,
    );

    // Verify form values are correctly set
    expect(screen.getByTestId('modalOrganizationName')).toHaveValue(
      formData.name,
    );
    expect(screen.getByTestId('modalOrganizationDescription')).toHaveValue(
      formData.description,
    );
    expect(screen.getByTestId('modalOrganizationAddressLine1')).toHaveValue(
      formData.addressLine1,
    );
    expect(screen.getByTestId('modalOrganizationAddressLine2')).toHaveValue(
      formData.addressLine2,
    );
    expect(screen.getByTestId('modalOrganizationCity')).toHaveValue(
      formData.city,
    );
    expect(screen.getByTestId('modalOrganizationState')).toHaveValue(
      formData.state,
    );
    expect(screen.getByTestId('modalOrganizationPostalCode')).toHaveValue(
      formData.postalCode,
    );
  });

  test('Testing organization creation error handling', async () => {
    setItem('id', '123');
    setItem('role', 'administrator');

    // Mock error response
    const CREATE_ORG_ERROR_MOCK = {
      request: {
        query: CREATE_ORGANIZATION_MUTATION_PG,
        variables: {
          name: formData.name,
          description: formData.description,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          countryCode: formData.countryCode,
          postalCode: formData.postalCode,
          state: formData.state,
          avatar: null,
        },
      },
      error: new Error('Failed to create organization'),
    };

    const CUSTOM_MOCKS = [...MOCKS, CREATE_ORG_ERROR_MOCK];

    render(
      <MockedProvider
        addTypename={false}
        link={new StaticMockLink(CUSTOM_MOCKS, true)}
      >
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

    // Open the modal
    await userEvent.click(screen.getByTestId('createOrganizationBtn'));

    // Fill out form fields
    await userEvent.type(
      screen.getByTestId('modalOrganizationName'),
      formData.name,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationDescription'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationAddressLine1'),
      formData.addressLine1,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationAddressLine2'),
      formData.addressLine2,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationCity'),
      formData.city,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationState'),
      formData.state,
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationPostalCode'),
      formData.postalCode,
    );

    await userEvent.selectOptions(
      screen.getByTestId('modalOrganizationCountryCode'),
      formData.countryCode,
    );

    // Submit the form
    const submitButton = screen.getByTestId('submitOrganizationForm');
    await userEvent.click(submitButton);

    // Verify error handling was triggered
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
