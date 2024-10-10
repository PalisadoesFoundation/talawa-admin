import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgSettings from './OrgSettings';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            name: 'Palisadoes',
            description: 'Equitable Access to STEM Education Jobs',
            location: 'Jamaica',
            isPublic: true,
            visibleInSearch: false,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@example.com',
            },
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
            ],
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DELETE_ORGANIZATION_MUTATION,
    },
    result: {
      data: {
        removeOrganization: [
          {
            _id: 123,
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

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.orgSettings),
);

afterEach(() => {
  localStorage.clear();
});

describe('Organisation Settings Page', () => {
  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[1]?.result?.data?.removeOrganization;
    expect(dataQuery1).toEqual([
      {
        _id: 123,
      },
    ]);
  });

  test('should render props and text elements test for the screen', async () => {
    window.location.assign('/orgsetting/123');
    setItem('SuperAdmin', true);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgSettings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getAllByText(/Delete Organization/i)).toHaveLength(3);
    expect(
      screen.getByText(
        /By clicking on Delete Organization button the organization will be permanently deleted along with its events, tags and all related data/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Other Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Language/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orgsetting/123');
  });

  test('should render appropriate settings based on the orgSetting state', async () => {
    window.location.assign('/orgsetting/123');
    setItem('SuperAdmin', true);

    const { getAllByText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgSettings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(screen.getByTestId('actionItemCategoriesSettings'));
      const elements = getAllByText(translations.actionItemCategories);
      expect(elements[2]).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByTestId('generalSettings'));
      expect(queryByText(translations.updateOrganization)).toBeInTheDocument();
    });
  });
});
