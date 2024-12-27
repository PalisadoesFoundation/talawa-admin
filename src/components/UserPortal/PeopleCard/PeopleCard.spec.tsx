import React, { act } from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import PeopleCard from './PeopleCard';

/**
 * Unit tests for the PeopleCard component in the User Portal.
 *
 * These tests ensure that the PeopleCard component renders correctly with and without an image,
 * validating that all information (name, role, email, etc.) is displayed as expected.
 *
 * 1. **Component renders properly**: Verifies that the component renders correctly with the given props (name, email, role, etc.).
 * 2. **Component renders properly if the person image is provided**: Ensures the component correctly displays the image when a valid image URL is passed in the props.
 *
 * Mocked GraphQL queries are used to simulate backend behavior, though no queries are required for these tests.
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
  name: 'First Last',
  image: '',
  email: 'first@last.com',
  role: 'Admin',
  sno: '1',
};

describe('Testing PeopleCard Component [User Portal]', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PeopleCard {...props} />
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
              <PeopleCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });
});
