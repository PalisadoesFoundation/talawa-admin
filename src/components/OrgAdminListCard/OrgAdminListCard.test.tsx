import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import OrgAdminListCard from './OrgAdminListCard';

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

async function wait(ms = 0) {
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
      key: '123',
      id: '456',
      memberName: 'John Doe',
      memberLocation: 'India',
      joinDate: '05/05/2022',
      memberImage: 'https://via.placeholder.com/200x100',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <OrgAdminListCard {...props} />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Remove/i));

    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    const props = {
      key: '123',
      id: '456',
      memberName: '',
      memberLocation: 'India',
      joinDate: '05/05/2022',
      memberImage: '',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <OrgAdminListCard {...props} />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Remove/i));

    expect(screen.getByText(/Dogs Care/i)).toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
  });
});
