import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrganizationVenues from './OrganizationVenues';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';

const MOCKS = [
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue',
        description: 'Test Venue Desc',
        capacity: 100,
        organizationId: 'venue1',
        file: 'data:image/jpeg;base64,dGVzdC1pbWFnZQ==',
      },
    },
    result: {
      data: {
        createVenue: {
          _id: 'venue2',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        capacity: 100,
        description: 'Updated description',
        file: '',
        id: 'venue1',
        name: 'Updated Venue',
      },
    },
    result: {
      data: {
        editVenue: {
          _id: 'venue1',
        },
      },
    },
  },
  {
    request: {
      query: VENUE_LIST,
      variables: {
        orgId: 'venue1',
      },
    },
    result: {
      data: {
        organizations: [
          {
            venues: [
              {
                _id: 'venue1',
                capacity: 1000,
                description: 'Updated description for venue 1',
                imageUrl: null,
                name: 'Updated Venue 1',
                organization: {
                  __typename: 'Organization',
                  _id: 'venue1',
                },
                __typename: 'Venue',
              },
              {
                _id: 'venue2',
                capacity: 1500,
                description: 'Updated description for venue 2',
                imageUrl: null,
                name: 'Updated Venue 2',
                organization: {
                  __typename: 'Organization',
                  _id: 'venue1',
                },
                __typename: 'Venue',
              },
            ],
          },
        ],
      },
    },
  },
];

const MOCKS_ERROR_CREATE_VENUE = [
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue',
        description: 'Test Venue Desc',
        capacity: 100,
        organizationId: undefined,
        file: 'data:image/jpeg;base64,dGVzdC1pbWFnZQ==',
      },
    },
    result: {
      data: {
        createVenue: {
          _id: 'venue2',
        },
      },
    },
  },
];

const MOCKS_ERROR_UPDATE_VENUE = [
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        capacity: 100,
        description: 'Updated description',
        file: '',
        id: undefined,
        name: 'Updated Venue',
      },
    },
    result: {
      data: {
        editVenue: {
          _id: 'venue1',
        },
      },
    },
  },
  {
    request: {
      query: VENUE_LIST,
      variables: {
        orgId: 'venue1',
      },
    },
    result: {
      data: {
        organizations: [
          {
            venues: [
              {
                _id: 'venue1',
                capacity: 1000,
                description: 'Updated description for venue 1',
                imageUrl: null,
                name: 'Updated Venue 1',
                organization: {
                  __typename: 'Organization',
                  _id: 'venue1',
                },
                __typename: 'Venue',
              },
              {
                _id: 'venue2',
                capacity: 1500,
                description: 'Updated description for venue 2',
                imageUrl: null,
                name: 'Updated Venue 2',
                organization: {
                  __typename: 'Organization',
                  _id: 'venue1',
                },
                __typename: 'Venue',
              },
            ],
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_CREATE_VENUE, true);
const link3 = new StaticMockLink(MOCKS_ERROR_UPDATE_VENUE, true);

const linkURL = 'orgid';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: linkURL }),
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Organisation Venues Page', () => {
  const createFormData = {
    title: 'Test Venue',
    description: 'Test Venue Desc',
    capacity: 100,
    organizationId: 'venue1',
    file: 'data:image/jpeg;base64,dGVzdC1pbWFnZQ==',
  };

  global.alert = jest.fn();

  test('Testing toggling of Create venue modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createVenueModalBtn'));

    userEvent.click(screen.getByTestId('createVenueModalCloseBtn'));
  });

  test('Testing toggling of Update venue modal', async () => {
    window.location.assign('/orgvenues/venue1');
    render(
      <MockedProvider link={link} mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(
      screen.getByText('Updated description for venue 1'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Updated description for venue 2'),
    ).toBeInTheDocument();
    const updateButtons = screen.getAllByText('Update Venue Details');
    userEvent.click(updateButtons[0]);
    userEvent.click(screen.getByTestId('updateVenueModalCloseBtn'));
  });

  test('Testing Create venue modal', async () => {
    window.location.assign('/orgvenues/venue1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createVenueModalBtn'));

    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Name/i),
      createFormData.title,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Description/i),
      createFormData.description,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Capacity/i),
      createFormData.capacity.toString(),
    );

    // Mock the file upload
    const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('postImageUrl') as HTMLInputElement; // Assert as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } });

    await wait();
    convertToBase64(file);

    const clearImageButton = screen.getByTestId('closeimage');
    expect(clearImageButton).toBeInTheDocument();
    clearImageButton.addEventListener('click', (event) => {
      event.preventDefault();
    });
    fireEvent.click(clearImageButton);
    expect(screen.getByTestId('postImageUrl')).toHaveValue('');

    expect(input.value).toBe('');
    expect(screen.getByPlaceholderText(/Enter Venue Name/i)).toHaveValue(
      createFormData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Venue Description/i)).toHaveValue(
      createFormData.description,
    );

    userEvent.click(screen.getByTestId('createVenueBtn'));

    await wait();
    expect(toast.success).toBeCalledWith('Venue added Successfully');
  });

  test('Raise error if incorrect data is passed to create venue modal', async () => {
    window.location.assign('/orgvenues/venue1');

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createVenueModalBtn'));

    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Name/i),
      createFormData.title,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Description/i),
      createFormData.description,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Capacity/i),
      createFormData.capacity.toString(),
    );

    // Mock the file upload
    const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('postImageUrl') as HTMLInputElement; // Assert as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } });

    await wait();
    convertToBase64(file);

    const clearImageButton = screen.getByTestId('closeimage');
    expect(clearImageButton).toBeInTheDocument();
    clearImageButton.addEventListener('click', (event) => {
      event.preventDefault();
    });
    fireEvent.click(clearImageButton);
    expect(screen.getByTestId('postImageUrl')).toHaveValue('');

    expect(input.value).toBe('');
    expect(screen.getByPlaceholderText(/Enter Venue Name/i)).toHaveValue(
      createFormData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Venue Description/i)).toHaveValue(
      createFormData.description,
    );

    userEvent.click(screen.getByTestId('createVenueBtn'));

    await wait();
    expect(toast.error).toBeCalled();
  });

  test('Testing successful venue update and page reload', async () => {
    window.location.assign('/orgvenues/venue1');
    render(
      <MockedProvider link={link} mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const updateButtons = screen.getAllByText('Update Venue Details');
    userEvent.click(updateButtons[0]);

    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Name/i), {
      target: { value: 'Updated Venue' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Description/i), {
      target: { value: 'Updated description' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Capacity/i), {
      target: { value: '100' },
    });
    // Mock the file upload
    const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('postImageUrl') as HTMLInputElement; // Assert as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } });

    await wait();
    convertToBase64(file);

    const clearImageButton = screen.getByTestId('closeimage');
    expect(clearImageButton).toBeInTheDocument();
    clearImageButton.addEventListener('click', (event) => {
      event.preventDefault();
    });
    fireEvent.click(clearImageButton);
    expect(screen.getByTestId('postImageUrl')).toHaveValue('');

    expect(input.value).toBe('');

    fireEvent.click(screen.getByTestId('updateVenueBtn'));

    await wait();

    expect(toast.success).toBeCalledWith('Venue details updated successfully');
  });

  test('Raises error when incorrect data is passed to update event modal', async () => {
    window.location.assign('/orgvenues/venue1');
    render(
      <MockedProvider link={link3} mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const updateButtons = screen.getAllByText('Update Venue Details');
    userEvent.click(updateButtons[0]);

    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Name/i), {
      target: { value: 'Updated Venue' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Description/i), {
      target: { value: 'Updated description' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Capacity/i), {
      target: { value: '100' },
    });
    // Mock the file upload
    const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('postImageUrl') as HTMLInputElement; // Assert as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } });

    await wait();
    convertToBase64(file);

    const clearImageButton = screen.getByTestId('closeimage');
    expect(clearImageButton).toBeInTheDocument();
    clearImageButton.addEventListener('click', (event) => {
      event.preventDefault();
    });
    fireEvent.click(clearImageButton);
    expect(screen.getByTestId('postImageUrl')).toHaveValue('');

    expect(input.value).toBe('');

    fireEvent.click(screen.getByTestId('updateVenueBtn'));

    await wait();

    expect(toast.error).toBeCalled();
  });

  test('Gives warning when title of create modal is blank', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('createVenueModalBtn'));
    await wait();
    userEvent.type(screen.getByPlaceholderText(/Enter Venue Name/i), '');
    userEvent.click(screen.getByTestId('createVenueBtn'));
    expect(toast.warning).toBeCalledWith('Venue title can not be blank!');
  });

  test('Gives warning when title of update modal is blank', async () => {
    window.location.assign('/orgvenues/venue1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationVenues />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const updateButtons = screen.getAllByText('Update Venue Details');
    userEvent.click(updateButtons[0]);

    await wait();

    fireEvent.change(screen.getByPlaceholderText(/Enter Venue Name/i), {
      target: { value: '' },
    });
    await wait();
    userEvent.click(screen.getByTestId('updateVenueBtn'));
    expect(toast.warning).toBeCalledWith('Venue title can not be blank!');
  });
});
