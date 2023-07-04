import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import OrgPostCard from './OrgPostCard';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

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
const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 100): Promise<void> {
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
    global.confirm = (): boolean => true;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();
    expect(screen.getByAltText(/image not found/i)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByAltText(/image not found/i)).toBeInTheDocument();
  });

  test('renders without "Read more" button when postInfo length is less than or equal to 43', () => {
    const props = {
      key: '123',
      id: '12',
      postTitle: 'Event Info',
      postInfo: 'Lorem ipsum dolor sit amet',
      postAuthor: 'John Doe',
      postPhoto: 'photoLink',
      postVideo: 'videoLink',
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );
  });
});
