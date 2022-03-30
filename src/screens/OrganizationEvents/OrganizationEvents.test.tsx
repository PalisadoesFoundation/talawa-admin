import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import OrganizationEvents from './OrganizationEvents';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
    },
    result: {
      data: {
        eventsByOrganization: [
          {
            _id: 1,
            title: 'Event',
            description: 'Event Test',
            startDate: '',
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        description: 'This is a dummy organization',
        isPublic: false,
        recurring: true,
        isRegisterable: true,
        organizationId: undefined,
        startDate: 'Thu Mar 28 20222',
        endDate: 'Fri Mar 28 20223',
        allDay: false,
      },
    },
    result: {
      data: {
        eventsByOrganization: [
          {
            _id: '1',
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

describe('Organisation Events Page', () => {
  const searchData = {
    byOrganization: 'Sample organization',
    byLocation: 'Sample Location',
  };

  const formData = {
    title: 'Dummy Org',
    description: 'This is a dummy organization',
    startData: '03/28/2022',
    endData: '04/15/2023',
  };

  global.alert = jest.fn();

  test('It is necessary to query the correct mock data.', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.eventsByOrganization[0];

    expect(dataQuery1).toEqual({
      _id: 1,
      title: 'Event',
      description: 'Event Test',
      startDate: '',
    });
  });

  test('It is necessary to check correct render', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationEvents />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Events');
    expect(container.textContent).toMatch('Filter by Organization');
    expect(container.textContent).toMatch('Filter by Location');
    expect(container.textContent).toMatch('Events');
  });

  test('No mock data', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationEvents />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing filters', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationEvents />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText('Enter Name'),
      searchData.byOrganization
    );
    userEvent.type(
      screen.getByPlaceholderText('Enter Location'),
      searchData.byLocation
    );

    expect(screen.getByPlaceholderText('Enter Name')).toHaveValue(
      searchData.byOrganization
    );
    expect(screen.getByPlaceholderText('Enter Location')).toHaveValue(
      searchData.byLocation
    );
  });

  test('Testing toggling of Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationEvents />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('Testing Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationEvents />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    userEvent.type(screen.getByPlaceholderText(/Enter Title/i), formData.title);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description
    );
    await act(async () => {
      userEvent.type(
        screen.getByPlaceholderText(/Start Date/i),
        formData.startData
      );
      userEvent.type(
        screen.getByPlaceholderText(/End Date/i),
        formData.endData
      );
    });
    userEvent.click(screen.getByLabelText(/All Day?/i));
    userEvent.click(screen.getByLabelText(/Recurring Event:/i));
    userEvent.click(screen.getByLabelText(/Is Public?/i));
    userEvent.click(screen.getByLabelText(/Is Registrable?/i));

    await wait();

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(
      formData.title
    );
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(
      formData.description
    );

    expect(screen.getByLabelText(/All Day?/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Recurring Event:/i)).toBeChecked();
    expect(screen.getByLabelText(/Is Public?/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Is Registrable?/i)).toBeChecked();

    userEvent.click(screen.getByTestId('createEventBtn'));
  });
});
