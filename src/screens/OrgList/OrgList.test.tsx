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
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';
import AdminDashListCard from 'components/AdminDashListCard/AdminDashListCard';
import { ToastContainer } from 'react-toastify';

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

  const formDataEmpty = {
    name: '   ',
    description: '   ',
    location: '   ',
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  test('On dynamic setting of rowsPerPage, the number of organizations rendered on the dom should be changed to the selected option', async () => {
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

    // Wait and confirm that the component has been rendered
    await screen.findByTestId('rowsPPSelect');

    //Get the reference to the dropdown for rows per page
    const numRowsSelect: HTMLSelectElement | null = screen
      .getByTestId('rowsPPSelect')
      .querySelector('select');

    if (numRowsSelect === null) {
      throw new Error('numRowwsSelect is null');
    }

    // Get all possible options
    const options = Array.from(numRowsSelect?.querySelectorAll('option')).slice(
      1
    );

    // Change the  number of rows to display through the dropdown
    options.forEach((option) => {
      //Change the selected option to the value of the current option
      userEvent.selectOptions(numRowsSelect, option.value);

      // When the selected option from rowsPerPage is "All", the total number of organizations displayed
      // is the number of organizations plus one (i.e an object is prepended to the list of mocked organizations)
      const numOrgDisplayed =
        option.textContent === 'All'
          ? organizations.length + 1
          : parseInt(option.value);

      expect(
        screen
          .getByTestId('organizations-list')
          .querySelectorAll('[data-testid="singleorg"]').length
      ).toBe(numOrgDisplayed);
    });
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

    expect(container.textContent).toMatch('Name:');
    expect(container.textContent).toMatch('Designation:');
    expect(container.textContent).toMatch('Email:');
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
      <MockedProvider addTypename={false} link={link}>
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

  test('Create organization should throw error when empty strings have been entered', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <ToastContainer />
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

    userEvent.type(
      screen.getByTestId(/modalOrganizationName/i),
      formDataEmpty.name
    );
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formDataEmpty.description
    );
    userEvent.type(
      screen.getByPlaceholderText(/Location/i),
      formDataEmpty.location
    );

    expect(screen.getByTestId(/modalOrganizationName/i)).toHaveValue(
      formDataEmpty.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formDataEmpty.description
    );
    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue(
      formDataEmpty.location
    );

    userEvent.click(screen.getByTestId(/submitOrganizationForm/i));

    await wait();

    expect(container.textContent).toMatch(
      'Text fields cannot be empty strings'
    );
  });
});

describe('SuperDashListCard', () => {
  it('renders correctly when user type is SUPERADMIN', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    const datas = {
      _id: '123',
      image: 'https://example.com/image.png',
      admins: [
        {
          _id: '123',
        },
        {
          _id: '456',
        },
      ],
      members: [1, 2, 3],
      createdAt: '2022, 2, 20',
      name: 'Example Org',
      location: 'Example Location',
    };

    await wait();

    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'UserType',
      'SUPERADMIN'
    );

    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
            <SuperDashListCard
              id={datas._id}
              key={datas._id}
              image={datas.image}
              admins={datas?.admins.length}
              members={datas?.members.length}
              createdDate={datas.createdAt}
              orgName={datas.name}
              orgLocation={datas.location}
            />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('Example Org')).toBeInTheDocument();
    expect(getByText('Admins:')).toBeInTheDocument();
    expect(getByText('Members:')).toBeInTheDocument();
    expect(getByText('2022, 2, 20')).toBeInTheDocument();
    expect(getByText('Example Location')).toBeInTheDocument();
  });
});

describe('AdminDashListCard', () => {
  it('renders correctly when user type is ADMIN', async () => {
    localStorage.setItem('UserType', 'ADMIN');
    const datas = {
      _id: '123',
      image: 'https://example.com/image.png',
      admins: [
        {
          _id: '123',
        },
        {
          _id: '456',
        },
      ],
      members: [1, 2, 3],
      createdAt: '2022, 2, 20',
      name: 'Example Org',
      location: 'Example Location',
    };

    await wait();

    expect(localStorage.setItem).toHaveBeenLastCalledWith('UserType', 'ADMIN');

    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgList />
            <AdminDashListCard
              id={datas._id}
              key={datas._id}
              image={datas.image}
              admins={datas?.admins.length}
              members={datas?.members.length}
              createdDate={datas.createdAt}
              orgName={datas.name}
              orgLocation={datas.location}
            />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('Example Org')).toBeInTheDocument();
    expect(getByText('Admins:')).toBeInTheDocument();
    expect(getByText('Members:')).toBeInTheDocument();
    expect(getByText('2022, 2, 20')).toBeInTheDocument();
    expect(getByText('Example Location')).toBeInTheDocument();
  });
});
