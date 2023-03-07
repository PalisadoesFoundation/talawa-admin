import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrganizationEvents from './OrganizationEvents';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

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
            endDate: '',
            location: 'New Delhi',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
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
        allDay: true,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
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
  global.alert = jest.fn();

  test('It is necessary to query the correct mock data.', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.eventsByOrganization;

    expect(dataQuery1).toEqual([
      {
        _id: 1,
        title: 'Event',
        description: 'Event Test',
        startDate: '',
        endDate: '',
        location: 'New Delhi',
        startTime: '02:00',
        endTime: '06:00',
        allDay: false,
        recurring: false,
        isPublic: true,
        isRegisterable: true,
      },
    ]);
  });

  test('It is necessary to check correct render', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(window.location).toBeAt('/orglist');
  });
});
