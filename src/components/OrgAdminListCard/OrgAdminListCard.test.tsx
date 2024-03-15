import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import OrgAdminListCard from './OrgAdminListCard';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';

const MOCKS = [
  {
    request: {
      query: REMOVE_ADMIN_MUTATION,
      variable: { userid: '564', orgid: '987' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Organization Admin List Card', () => {
  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    const props = {
      toggleRemoveModal: () => true,
      id: '456',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgAdminListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/removeAdminBtn/i));
  });

  test('Should not render modal when id is undefined', async () => {
    const props = {
      toggleRemoveModal: () => true,
      id: undefined,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgAdminListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(window.location.pathname).toEqual('/orglist');
  });
});
