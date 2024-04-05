import React from 'react';
import { act, render, screen } from '@testing-library/react';
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
<<<<<<< HEAD
    toggleRemoveModal: () => true,
    id: '1',
  };
=======
    key: '123',
    id: '1',
    memberName: 'John Doe',
    joinDate: '20/03/2022',
    memberImage: 'image',
    memberEmail: 'johndoe@gmail.com',
  };

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
    userEvent.click(screen.getByTestId(/removeMemberBtn/i));
  });

  test('Should not render modal when id is undefined', async () => {
=======
    userEvent.click(screen.getByTestId(/removeMemberModalBtn/i));
    userEvent.click(screen.getByTestId(/removeMemberBtn/i));

    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
<<<<<<< HEAD
            <OrgPeopleListCard id={undefined} toggleRemoveModal={() => true} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
=======
            <OrgPeopleListCard
              key="123"
              id="1"
              memberName=""
              joinDate="20/03/2022"
              memberImage=""
              memberEmail=""
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
    expect(window.location.pathname).toEqual('/orglist');
=======
    userEvent.click(screen.getByTestId(/removeMemberModalBtn/i));
    userEvent.click(screen.getByTestId(/removeMemberBtn/i));

    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.queryByText(props.memberName)).not.toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
