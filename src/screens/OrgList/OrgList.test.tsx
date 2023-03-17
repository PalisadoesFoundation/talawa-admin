import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  getByTestId,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import 'jest-localstorage-mock';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';

import OrgList from './OrgList';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { faker } from '@faker-js/faker';

const organizations = [];

for (let x = 0; x < 10; x++) {
  organizations.push({
    _id: faker.datatype.uuid(),
    image: '',
    name: faker.name.fullName(),
    creator: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    },
    admins: [
      {
        _id: faker.datatype.uuid(),
      },
    ],
    members: {
      _id: faker.datatype.uuid(),
    },
    createdAt: faker.date.birthdate().toString().split('T')[0],
    location: faker.address.city(),
  });
}

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: organizations,
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        user: [
          {
            firstName: 'John',
            lastName: 'Doe',
            image: '',
            email: 'John_Does_Palasidoes@gmail.com',
            userType: 'SUPERADMIN',
            adminFor: {
              _id: 1,
              name: 'Akatsuki',
              image: '',
            },
          },
        ],
      },
    },
  },
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

afterEach(() => {
  localStorage.clear();
});

describe('Organisation List Page', () => {
  const formData = {
    name: 'Dummy Organization',
    description: 'This is a dummy organization',
    location: 'Delhi, India',
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  global.alert = jest.fn();

  // eslint-disable-next-line jest/no-focused-tests
  test.only('The number of organizations rendered on the dom should be equal to the rowsPerPage', async () => {
    const rowsPerPage = 5; //The default set in the OrgList component

    const { getByTestId } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
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
      expect(getByTestId('organizations-list').childNodes.length).toBe(
        rowsPerPage
      );
    });
  });

  test('Correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organizationsConnection;

    expect(dataQuery1).toEqual([
      {
        _id: 1,
        creator: { firstName: 'John', lastName: 'Doe' },
        image: '',
        name: 'Akatsuki',
        createdAt: '02/02/2022',
        admins: [
          {
            _id: '123',
          },
        ],
        members: {
          _id: '234',
        },
        location: 'Washington DC',
      },
    ]);
  });

  test('Should render props and text elements test for the screen', async () => {
    window.location.assign('/');

    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgList />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(container.textContent).toMatch('Name:');
    expect(container.textContent).toMatch('Designation:');
    expect(container.textContent).toMatch('Email:');
    expect(window.location).toBeAt('/');

    userEvent.type(screen.getByTestId(/searchByName/i), formData.name);
  });

  test('Testing UserType from local storage', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByTestId(/createOrganizationBtn/i)).toBeTruthy();
  });

  test('Testing Organization data is not present', async () => {
    render(
      <MockedProvider addTypename={false}>
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
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
    userEvent.click(screen.getByTestId(/closeOrganizationModal/i));
  });

  test('Create organization model should work properly', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

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
    userEvent.type(screen.getByPlaceholderText(/Location/i), formData.location);
    userEvent.click(screen.getByLabelText(/Is Public:/i));
    userEvent.click(screen.getByLabelText(/Visible In Search:/i));
    userEvent.upload(screen.getByLabelText(/Display Image:/i), formData.image);

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formData.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description
    );
    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue(
      formData.location
    );
    expect(screen.getByLabelText(/Is Public/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Visible In Search:/i)).toBeChecked();
    expect(screen.getByLabelText(/Display Image:/i)).toBeTruthy();

    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));
  });
});

test('Search bar filters organizations by name', async () => {
  const { container } = render(
    <MockedProvider addTypename={false} mocks={MOCKS}>
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
  userEvent.type(searchBar, 'Akatsuki');
  expect(container.textContent).toMatch('Akatsuki');

  // Test that the search bar is case-insensitive
  userEvent.clear(searchBar);
  userEvent.type(searchBar, 'akatsuki');
  expect(container.textContent).toMatch('Akatsuki');

  // Test that the search bar filters organizations based on a partial match of the name
  userEvent.clear(searchBar);
  userEvent.type(searchBar, 'Aka');
  expect(container.textContent).toMatch('Akatsuki');
});
