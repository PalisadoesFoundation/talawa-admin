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
import { StaticMockLink } from 'utils/StaticMockLink';

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
const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 100) {
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
      <MockedProvider addTypename={false} link={link}>
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
  test('should render User update form in clicking user update button', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('userUpdateBtn'));

    await wait();
    const firstNameInput = screen.getByText(/first name/i);
    const lastNameInput = screen.getByText(/last name/i);
    const emailInput = screen.getByText(/email/i);
    const imageInput = screen.getByText(/display image:/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });

    await wait();

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(imageInput).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  test('should render password update form in clicking update your password button', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('userPasswordUpdateBtn'));

    await wait();
    const previousPasswordInput = screen.getByText(/previous password/i);
    const confirmPasswordInput = screen.getByText(/confirm new password/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });

    await wait();

    expect(previousPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  test('should render update orgnization form in clicking update orgnization button', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('orgUpdateBtn'));

    await wait();
    const nameInput = screen.getByText(/name/i);
    const descriptionInput = screen.getByText(/description/i);
    const locationInput = screen.getByText(/location/i);
    const displayImageInput = screen.getByText(/display image:/i);
    const isPublicInput = screen.getByText(/is public:/i);
    const isRegistrableInput = screen.getByText(/is registrable:/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });

    await wait();

    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(locationInput).toBeInTheDocument();
    expect(displayImageInput).toBeInTheDocument();
    expect(isPublicInput).toBeInTheDocument();
    expect(isRegistrableInput).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });
});
