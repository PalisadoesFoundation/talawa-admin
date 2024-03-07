import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import userEvent from '@testing-library/user-event';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        firstName: 'Noble',
        lastName: 'Mittal',
      },
      result: {
        data: {
          updateUserProfile: {
            _id: '453',
          },
        },
      },
    },
  },
];

const Mocks1 = [
  {
    request: {
      query: CHECK_AUTH,
    },
    result: {
      data: {
        checkAuth: {
          email: 'johndoe@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
          userType: 'user',
          _id: '65ba1621b7b00c20e5f1d8d2',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link1 = new StaticMockLink(Mocks1, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Settings Screen [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryAllByText('Settings')).not.toBe([]);
  });

  test('input works properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('inputFirstName'), 'Noble');
    await wait();
    userEvent.type(screen.getByTestId('inputLastName'), 'Mittal');
    await wait();
    userEvent.type(screen.getByTestId('inputGender'), 'random');
    await wait();
    userEvent.type(screen.getByTestId('inputPhoneNumber'), '1234567890');
    await wait();
    userEvent.type(screen.getByTestId('inputGrade'), 'A');
    await wait();
    userEvent.type(screen.getByTestId('inputEmpStatus'), 'Employed');
    await wait();
    userEvent.type(screen.getByTestId('inputMaritalStatus'), 'Married');
    await wait();
    userEvent.type(screen.getByTestId('inputAddress'), 'random');
    await wait();
    userEvent.type(screen.getByTestId('inputState'), 'random');
    await wait();
    userEvent.type(screen.getByTestId('inputCountry'), 'random');
    await wait();
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    await wait();
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2024-03-01' },
    });
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2024-03-01');
    await wait();
    userEvent.click(screen.getByTestId('uploadImageBtn'));
    await wait();
  });

  test('resetChangesBtn works properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByTestId('inputFirstName')).toHaveValue('John');
    expect(screen.getByTestId('inputLastName')).toHaveValue('Doe');
    expect(screen.getByTestId('inputGender')).toHaveValue('');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('');
    expect(screen.getByTestId('inputGrade')).toHaveValue('');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('');
    expect(screen.getByTestId('inputAddress')).toHaveValue('');
    expect(screen.getByTestId('inputState')).toHaveValue('');
    expect(screen.getByTestId('inputCountry')).toHaveValue('');
    expect(screen.getByLabelText('Birth Date')).toHaveValue('');
  });

  test('updateUserDetails Mutation is triggered on button click', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('inputFirstName'), 'Noble');
    await wait();

    userEvent.type(screen.getByTestId('inputLastName'), 'Mittal');
    await wait();

    userEvent.click(screen.getByTestId('updateUserBtn'));
    await wait();
  });

  test('Details correctly rendered', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByText('Profile Details')).toBeInTheDocument();
    expect(screen.getByTestId('copyProfileLink')).toBeInTheDocument();
    expect(screen.getByTestId('userEmail')).toBeInTheDocument();
  });

  test('Other settings card is rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByText('Other Settings')).toBeInTheDocument();
    expect(screen.getByText('Change Language')).toBeInTheDocument();
  });
});
