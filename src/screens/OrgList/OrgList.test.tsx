import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
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
import { StaticMockLink } from 'utils/StaticMockLink';

type Organization = {
  _id: string;
  image: string;
  name: string;
  creator: {
    firstName: string;
    lastName: string;
  };
  admins: {
    _id: string;
  }[];
  members: {
    _id: string;
  };
  createdAt: string;
  location: string;
};

const organizations: Organization[] = [];

for (let x = 0; x < 100; x++) {
  organizations.push({
    _id: 'a' + x,
    image: '',
    name: 'name',
    creator: {
      firstName: 'firstName',
      lastName: 'lastName',
    },
    admins: [
      {
        _id: x + '1',
      },
    ],
    members: {
      _id: x + '2',
    },
    createdAt: new Date().toISOString(),
    location: 'location',
  });
}

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [
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
          ...organizations,
        ],
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
        user: {
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
      },
    },
  },
];
const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [],
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
        user: {
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          userType: 'ADMIN',
          adminFor: {
            _id: 1,
            name: 'Akatsuki',
            image: '',
          },
        },
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_EMPTY, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

afterEach(() => {
  localStorage.clear();
});

describe('Organisations Page', () => {
  const formData = {
    name: 'Dummy Organization',
    description: 'This is a dummy organization',
    location: 'Delhi, India',
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  test('Testing search functionality', async () => {
    const mocks = [
      {
        request: {
          query: ORGANIZATION_CONNECTION_LIST,
        },
        result: {
          data: {
            organizationsConnection: [
              {
                _id: 1,
                image: '',
                name: 'Akatsuki',
                creator: {
                  firstName: 'John',
                  lastName: 'Doe',
                },
                admins: [
                  {
                    _id: '123',
                  },
                ],
                members: {
                  _id: '234',
                },
                createdAt: '02/02/2022',
                location: 'Washington DC',
              },
            ],
          },
        },
      },
    ];

    const link = new StaticMockLink(mocks, true);

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
    const search1 = 'Akatsuki';
    expect(searchBar).toBeInTheDocument();
    userEvent.type(screen.getByTestId(/searchByName/i), search1);

    // Test that the search bar is case-insensitive
    userEvent.clear(searchBar);
    const search2 = 'aKaTsUkI';
    expect(searchBar).toBeInTheDocument();
    userEvent.type(screen.getByTestId(/searchByName/i), search2);

    // Test that the search bar filters all organization if there are is no search passed
    userEvent.clear(searchBar);
    const search3 = '';
    expect(searchBar).toBeInTheDocument();
    userEvent.type(screen.getByTestId(/searchByName/i), search3);
  });

  test('Should render no organisation warning alert when there are no organization', async () => {
    window.location.assign('/');

    const { container } = render(
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

    expect(container.textContent).toMatch('Organizations Not Found');
    expect(container.textContent).toMatch(
      'Please create an organization through dashboard'
    );
    expect(window.location).toBeAt('/');
  });

  test('Should not render no organisation warning alert when there are no organization', async () => {
    window.location.assign('/');

    const { container } = render(
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

    expect(container.textContent).not.toMatch('Organizations Not Found');
    expect(container.textContent).not.toMatch(
      'Please create an organization through dashboard'
    );
    expect(window.location).toBeAt('/');
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
      ...organizations,
    ]);
  });

  test('Should render props and text elements test for the screen', async () => {
    window.location.assign('/');

    const { container } = render(
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

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(window.location).toBeAt('/');

    userEvent.type(screen.getByTestId(/searchByName/i), formData.name);
  });

  test('Testing UserType from local storage', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
    localStorage.setItem('UserType', 'SUPERADMIN');

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

    userEvent.click(screen.getByTestId(/createOrganizationBtn/i));
    userEvent.click(screen.getByTestId(/closeOrganizationModal/i));
  });

  test('Create organization model should work properly', async () => {
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
    });
  });
});
