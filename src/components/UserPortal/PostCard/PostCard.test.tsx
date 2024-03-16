import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import PostCard from './PostCard';

describe('PostCard compoenent', () => {
  const cardProps = {
    id: '',
    creator: {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      image: '',
      id: '1',
    },
    image: '',
    video: '',
    text: 'This is post test text',
    title: 'This is post test title',
    createdAt: 1647398400000,
  };
  test('Render post card with the correct content.', () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    const userFirstName = screen.getByTestId('creator-name');
    expect(userFirstName).toBeInTheDocument();
    const postText = screen.getByText('This is post test text');
    expect(postText).toBeInTheDocument();
    const postTitle = screen.getByText('This is post test title');
    expect(postTitle).toBeInTheDocument();
    expect(screen.getByText('16 March 2022')).toBeInTheDocument();
  });
  test('opens menu when three dots button is clicked', () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('three-dots-button'));

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Report')).toBeInTheDocument();
    expect(screen.getByText('Pin Post')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });
});
