import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import OrgPostCard from './OrgPostCard';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';

const MOCKS = [
  {
    request: {
      query: DELETE_POST_MUTATION,
      variable: { id: '123' },
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

describe('Testing Organization Post Card', () => {
  const props = {
    key: '123',
    id: '12',
    postTitle: 'Event Info',
    postInfo: 'Time change',
    postAuthor: 'John Doe',
    postPhoto: 'photoLink',
    postVideo: 'videoLink',
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    global.confirm = () => true;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <OrgPostCard {...props} />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/deletePostBtn/i));

    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByText(/Image URL:/i)).toBeInTheDocument();
    expect(screen.getByText(/Video URL:/i)).toBeInTheDocument();
    expect(screen.getByText(props.postTitle)).toBeInTheDocument();
    expect(screen.getByText(props.postInfo)).toBeInTheDocument();
    expect(screen.getByText(props.postAuthor)).toBeInTheDocument();
    expect(screen.getByText(props.postPhoto)).toBeInTheDocument();
    expect(screen.getByText(props.postVideo)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = () => false;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <OrgPostCard {...props} />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/deletePostBtn/i));

    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByText(/Image URL:/i)).toBeInTheDocument();
    expect(screen.getByText(/Video URL:/i)).toBeInTheDocument();
    expect(screen.getByText(props.postTitle)).toBeInTheDocument();
    expect(screen.getByText(props.postInfo)).toBeInTheDocument();
    expect(screen.getByText(props.postAuthor)).toBeInTheDocument();
    expect(screen.getByText(props.postPhoto)).toBeInTheDocument();
    expect(screen.getByText(props.postVideo)).toBeInTheDocument();
  });
});
