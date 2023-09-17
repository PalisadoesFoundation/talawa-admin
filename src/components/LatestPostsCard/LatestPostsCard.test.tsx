import React from 'react';
import { render } from '@testing-library/react';
import LatestPosts from './LatestPostsCard';
import LatestPostsCard from './LatestPostsCard';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/react-testing';
import i18nForTest from 'utils/i18nForTest';

const posts = [
  {
    id: 1,
    title: 'Post 1',
    createdAt: '2023-09-20T10:00:00Z',
    creator: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
  {
    id: 2,
    title: 'Post 2',
    createdAt: '2023-09-21T14:30:00Z',
    creator: {
      firstName: 'Jane',
      lastName: 'Smith',
    },
  },
];

test('Should render LatestPosts when appropriate props are passed', () => {
  const { getByText } = render(
    <MockedProvider addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <LatestPostsCard posts={posts} />
      </I18nextProvider>
    </MockedProvider>
  );

  expect(getByText('Latest Posts')).toBeInTheDocument();

  posts.forEach((post) => {
    expect(getByText(post.title)).toBeInTheDocument();
    expect(
      getByText(post.creator.firstName + ' ' + post.creator.lastName)
    ).toBeInTheDocument();
  });
});

test('Should render "No Posts Created" message when no posts are passed in', () => {
  const { getByText } = render(<LatestPosts posts={[]} />);
  expect(getByText('No Posts Created')).toBeInTheDocument();
});
