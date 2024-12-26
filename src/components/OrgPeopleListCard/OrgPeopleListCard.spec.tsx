import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import OrgPeopleListCard from './OrgPeopleListCard';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';

const MOCKS = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variable: { userid: '123', orgid: '456' },
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

describe('Testing Organization People List Card', () => {
  const props = {
    toggleRemoveModal: () => true,
    id: '1',
  };
  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    global.confirm = (): boolean => true;

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/removeMemberBtn/i));
  });

  test('Should not render modal when id is undefined', async () => {
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleListCard id={undefined} toggleRemoveModal={() => true} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(window.location.pathname).toEqual('/orglist');
  });
});
