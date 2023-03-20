import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrgUpdate from './OrgUpdate';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';

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
            image: '',
            name: '',
            description: '',
            creator: {
              firstName: '',
              lastName: '',
              email: '',
            },
            location: '',
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: {
              _id: '789',
              firstName: 'Steve',
              lastName: 'Smith',
              email: 'stevesmith@gmail.com',
            },
            tags: ['Shelter', 'NGO', 'Open Source'],
            spamCount: [
              {
                _id: '6954',
                user: {
                  _id: '878',
                  firstName: 'Joe',
                  lastName: 'Root',
                  email: 'joeroot@gmail.com',
                },
                isReaded: false,
                groupchat: {
                  _id: '321',
                  title: 'Dummy',
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_ORGANIZATION_MUTATION,
      variables: {
        id: '123',
        name: 'Updated Organization',
        description: 'This is an updated test organization',
        location: 'Updated location',
        image: new File(['hello'], 'hello.png', { type: 'image/png' }),
        isPublic: true,
        visibleInSearch: false,
      },
    },
    result: {
      data: {
        updateOrganization: {
          _id: '123',
          name: 'Updated Organization',
          description: 'This is an updated test organization',
          location: 'Updated location',
          isPublic: true,
          visibleInSearch: false,
        },
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Organization Update', () => {
  const props = {
    id: '123',
    orgid: '123',
  };

  const formData = {
    name: 'John Doe',
    description: 'This is a description',
    location: 'Test location',
    displayImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    isPublic: true,
    isVisible: true,
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    //window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );
    await wait();
    userEvent.type(
      screen.getByPlaceholderText(/Enter Organization Name/i),
      formData.name
    );
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formData.description
    );
    userEvent.type(screen.getByPlaceholderText(/Location/i), formData.location);
    userEvent.upload(
      screen.getByLabelText(/Display Image:/i),
      formData.displayImage
    );
    userEvent.click(screen.getByLabelText(/Is Public:/i));
    userEvent.click(screen.getByLabelText(/Is Registrable:/i));

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/Organization Name/i)).toHaveValue(
      formData.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description
    );
    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue(
      formData.location
    );
    expect(screen.getByLabelText(/display image:/i)).toBeTruthy();
    expect(screen.getByLabelText(/Is Public:/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Is Registrable:/i)).toBeChecked();
    expect(screen.getByText(/Cancel/i)).toBeTruthy();

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Display Image:')).toBeInTheDocument();
    expect(screen.getByText('Is Public:')).toBeInTheDocument();
    expect(screen.getByText('Is Registrable:')).toBeInTheDocument();
  });
});
