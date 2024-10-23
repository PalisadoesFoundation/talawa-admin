import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import ContactCard from './ContactCard';
import userEvent from '@testing-library/user-event';

const link = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

let props = {
  id: '1',
  title: 'Disha Talreja',
  subtitle: 'disha@example.com',
  email: 'noble@mittal.com',
  isGroup: false,
  image: '',
  selectedContact: '',
  type: '',
  setSelectedContact: jest.fn(),
  setSelectedChatType: jest.fn(),
  unseenMessages: 2,
  lastMessage: '',
};

describe('Testing ContactCard Component [User Portal]', () => {
  test('Component should be rendered properly  if person image is undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ContactCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Component should be rendered properly if person image is not undefined', async () => {
    props = {
      ...props,
      image: 'personImage',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ContactCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Contact gets selectected when component is clicked', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ContactCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('contactContainer'));

    await wait();
  });

  test('Component is rendered with background color grey if the contact is selected', async () => {
    props = {
      ...props,
      selectedContact: '1',
      isGroup: true,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ContactCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('contactContainer'));

    await wait();
  });
});
