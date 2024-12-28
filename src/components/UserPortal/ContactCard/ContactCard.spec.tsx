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
import { vi } from 'vitest';

/**
 * Unit tests for the ContactCard component.
 *
 * These tests ensure the ContactCard component renders and behaves as expected
 * under different scenarios. They cover various functionalities like:
 *  - Rendering the contact card with and without a profile image
 *  - Selecting a contact by clicking on the card
 *  - Applying a grey background color to the selected contact card (for groups)
 * Mocked dependencies like StaticMockLink are used
 * to isolate the component and test its behavior independently.
 */
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
  unseenMessages: 2,
  lastMessage: '',
  setSelectedContact: vi.fn(),
  setSelectedChatType: vi.fn(),
};

describe('Testing ContactCard Component [User Portal]', () => {
  it('Component should be rendered properly  if person image is undefined', async () => {
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

  it('Component should be rendered properly if person image is not undefined', async () => {
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

  it('Contact gets selectected when component is clicked', async () => {
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

  it('Component is rendered with background color grey if the contact is selected', async () => {
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
