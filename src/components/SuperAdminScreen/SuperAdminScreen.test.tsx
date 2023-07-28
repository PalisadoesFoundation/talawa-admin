import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import SuperAdminScreen, {
  InterfaceSuperAdminScreenProps,
} from './SuperAdminScreen';

let props: InterfaceSuperAdminScreenProps = {
  title: 'Organizations',
  screenName: 'Organizations',
  data: {
    user: {
      firstName: 'test',
      lastName: 'test',
      email: 'JohnDoe@gmail.com',
      adminFor: [],
      image: null,
      userType: 'SUPERADMIN',
    },
  },
  children: <div>Testing ...</div>,
};

describe('Testing LeftDrawer in SuperAdminScreen', () => {
  test('Testing LeftDrawer in page functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <SuperAdminScreen {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    userEvent.click(screen.getByTestId('menuBtn'));
  });
});
