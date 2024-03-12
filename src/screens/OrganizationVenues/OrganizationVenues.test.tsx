import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, fireEvent, within } from '@testing-library/react';
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

const mockVenueListData = {
  organizations: [
    {
      venues: [
        {
          capacity: 1000,
          description: 'Mock venue description 1',
          imageUrl: 'mockImageUrl1',
          name: 'Mock Venue 1',
          organization: { __typename: 'Organization', _id: '123' },
          __typename: 'Venue',
          _id: '1',
        },
        {
          capacity: 1001,
          description: 'Mock venue description 2',
          imageUrl: 'mockImageUrl2',
          name: 'Mock Venue 2',
          organization: { __typename: 'Organization', _id: '123' },
          __typename: 'Venue',
          _id: '2',
        },
      ],
    },
  ],
};

const mockUseQuery = (): any => ({
  data: mockVenueListData,
  loading: false,
  error: null,
  refetch: jest.fn(),
});

// In your test:
jest.mock('@apollo/client', (): any => ({
  useQuery: jest.fn().mockImplementation(() => mockUseQuery()),
}));

const mockUseMutation = jest.fn();

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'), // Ensure to include the actual module functionality
  useQuery: jest.fn().mockImplementation(() => mockUseQuery()),
  useMutation: jest
    .fn()
    .mockImplementation(() => [
      mockUseMutation,
      { loading: false, error: null },
    ]),
}));

const link = new StaticMockLink([], true);

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
  const formData = {
    title: 'Dummy Venue',
    description: 'This is a dummy venues',
    capacity: '100',
    orgId: '123',
    file: 'newVenue',
  };

  global.alert = jest.fn();

  test('Testing toggling of Create event modal', async () => {
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

  test('Testing toggling of Update event modal', async () => {
    window.location.assign('/orgvenues/123');
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

    const venueRow = screen.getByTestId('venueRow1');
    const updateButton = within(venueRow).getByTestId('updateVenueModalBtn');
    userEvent.click(updateButton);
    userEvent.click(screen.getByTestId('updateVenueModalCloseBtn'));
  });

  test('Testing Create event modal', async () => {
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

    const formData = {
      title: 'Dummy Venue',
      description: 'This is a dummy venue',
      capacity: '100',
      file: 'test.jpg',
    };

    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Name/i),
      formData.title,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Description/i),
      formData.description,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Capacity/i),
      formData.capacity,
    );

    // Mock the file upload
    const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('postImageUrl') as HTMLInputElement; // Assert as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } });

    await wait();
    convertToBase64(file);

    // Clear the image
    const clearImageButton = screen.getByTestId('closeimage');
    expect(clearImageButton).toBeInTheDocument();
    clearImageButton.addEventListener('click', (event) => {
      event.preventDefault();
    });
    fireEvent.click(clearImageButton);
    expect(screen.getByTestId('postImageUrl')).toHaveValue('');

    // Assert that input value is cleared
    expect(input.value).toBe('');
    // Assert that other input fields have the correct values
    expect(screen.getByPlaceholderText(/Enter Venue Name/i)).toHaveValue(
      formData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Venue Description/i)).toHaveValue(
      formData.description,
    );

    // Click the create venue button
    userEvent.click(screen.getByTestId('createVenueBtn'));
  });

  test('Testing update venue', async () => {
    window.location.assign('/orgvenues/123');

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

    const venueRow = screen.getByTestId('venueRow1');
    const updateButton = within(venueRow).getByTestId('updateVenueModalBtn');
    userEvent.click(updateButton);

    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Name/i),
      formData.title,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Description/i),
      formData.description,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Venue Capacity/i),
      formData.capacity,
    );

    // userEvent.type(
    //   screen.getByPlaceholderText(/Upload Venue Image/i),
    //   formData.file,
    // );
    await wait();

    expect(screen.getByPlaceholderText(/Enter Venue Name/i)).toHaveValue(
      formData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Venue Description/i)).toHaveValue(
      formData.description,
    );

    userEvent.click(screen.getByTestId('updateVenueBtn'));
  }, 15000);

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
  }, 15000);

  test('Gives warning when title of update modal is blank', async () => {
    window.location.assign('/orgvenues/123');

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

    const venueRow = screen.getByTestId('venueRow1');
    const updateButton = within(venueRow).getByTestId('updateVenueModalBtn');
    userEvent.click(updateButton);

    userEvent.type(screen.getByPlaceholderText(/Enter Venue Name/i), '');
    await wait();
    userEvent.click(screen.getByTestId('updateVenueBtn'));
    expect(toast.warning).toBeCalledWith('Venue title can not be blank!');
  }, 15000);
});
