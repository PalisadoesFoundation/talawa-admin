import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import OrgPostCard from './OrgPostCard';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: DELETE_POST_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        removePost: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variable: {
        id: '123',
        title: 'updated title',
        text: 'This is a updated text',
      },
    },
    result: {
      data: {
        updatePost: {
          _id: '32',
        },
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
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

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
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByText(/Image URL:/i)).toBeInTheDocument();
    expect(screen.getByText(/Video URL:/i)).toBeInTheDocument();
    expect(screen.getByText(props.postTitle)).toBeInTheDocument();
    expect(screen.getByText(props.postInfo)).toBeInTheDocument();
    expect(screen.getByText(props.postAuthor)).toBeInTheDocument();
    expect(screen.getByText(props.postPhoto)).toBeInTheDocument();
    expect(screen.getByText(props.postVideo)).toBeInTheDocument();
  });

  test('Testing post update functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    userEvent.type(screen.getByTestId('updateTitle'), 'updated title');
    userEvent.type(screen.getByTestId('updateText'), 'This is a updated text');
    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('Testing delete post funcationality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
    userEvent.click(screen.getByTestId(/deletePostBtn/i));
  });
});
