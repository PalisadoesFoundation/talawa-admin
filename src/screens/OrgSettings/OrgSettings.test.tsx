import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { MEMBERSHIP_REQUEST } from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import 'jest-location-mock';

import { store } from 'state/store';
import OrgSettings from './OrgSettings';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: MEMBERSHIP_REQUEST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            membershipRequests: {
              _id: 1,
              user: {
                _id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
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

describe('Organisation Settings Page', () => {
  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organizations[0];

    expect(dataQuery1).toEqual({
      _id: 1,
      membershipRequests: {
        _id: 1,
        user: {
          _id: 1,
          email: 'johndoe@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    });
  });
  test('should render props and text elements test for the screen', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgSettings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();

    // expect(screen.getByTestId('userUpdateBtn')).toBeInTheDocument();
    // expect(screen.getByTestId('orgUpdateBtn')).toBeInTheDocument();
    // expect(screen.getByTestId('orgDeleteBtn')).toBeInTheDocument();
    // expect(screen.getByTestId('orgDeleteBtn2')).toBeInTheDocument();
    // expect(screen.getByText(/settings/i)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('userUpdateBtn'));
    userEvent.click(screen.getByTestId('userPasswordUpdateBtn'));
    userEvent.click(screen.getByTestId('orgUpdateBtn'));
    userEvent.click(screen.getByTestId('orgDeleteBtn'));
    userEvent.click(screen.getByTestId('orgDeleteBtn2'));

    expect(container.textContent).toMatch('Settings');
    expect(container.textContent).toMatch('Update Your Details');
    expect(container.textContent).toMatch('Update Organization');
    expect(container.textContent).toMatch('Delete Organization');
    expect(container.textContent).toMatch('See Request');
    expect(window.location).toBeAt('/orglist');
  });
});
