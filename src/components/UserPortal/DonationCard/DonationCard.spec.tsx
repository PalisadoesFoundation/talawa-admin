import React, { act } from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import DonationCard from './DonationCard';
import { type InterfaceDonationCardProps } from 'screens/UserPortal/Donate/Donate';

/**
 * Unit test for the DonationCard component in the User Portal
 *
 * This test ensures that the DonationCard component renders correctly when provided with
 * the required props. It uses the MockedProvider to mock any GraphQL queries and the
 * StaticMockLink to simulate the network layer. The component is wrapped with necessary
 * providers such as BrowserRouter, Redux store, and i18n provider to simulate the environment
 * in which the component operates.
 *
 * The test specifically checks if the component renders without errors, though more tests
 * can be added in the future to validate interactions and state changes based on user actions.
 */

const link = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const props: InterfaceDonationCardProps = {
  id: '1',
  name: 'John Doe',
  amount: '20',
  userId: '1234',
  payPalId: 'id',
  updatedAt: String(new Date()),
};

describe('Testing ContactCard Component [User Portal]', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DonationCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });
});
