import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import 'jest-location-mock';
import App from './App';
import { store } from 'state/store';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import i18nForTest from './utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
// These modules are used by the Feedback components
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

const MOCKS = [
  {
    request: {
      query: CHECK_AUTH,
    },
    result: {
      data: {
        checkAuth: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: '2023-04-13T04:53:17.742+00:00',
          image: 'john.jpg',
          email: 'johndoe@gmail.com',
          birthDate: '1990-01-01',
          educationGrade: 'NO_GRADE',
          employmentStatus: 'EMPLOYED',
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          address: {
            line1: 'line1',
            state: 'state',
            countryCode: 'IND',
          },
          phone: {
            mobile: '+8912313112',
          },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing the App Component', () => {
  test('Component should be rendered properly and user is loggedin', async () => {
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <App />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    window.location.assign('/orglist');
    await wait();
    expect(window.location).toBeAt('/orglist');
    expect(
      screen.getByText(
        'An open source application by Palisadoes Foundation volunteers',
      ),
    ).toBeTruthy();
  });

  test('Component should be rendered properly and user is loggedout', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <App />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });
});
