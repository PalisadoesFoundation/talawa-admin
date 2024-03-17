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
  const postWithImage = {
    id: '1',
    creator: {
      firstName: 'John',
      lastName: 'Doe',
      image: '',
      id: '1',
    },
    image: 'https://example.com/image.jpg',
    video: '',
    text: 'Lorem ipsum dolor sit amet',
    title: 'Example Post',
    createdAt: 1626166078000,
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

  test('Renders image if the image prop is provided', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...postWithImage} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    const Image = screen.getByRole('img');
    expect(Image).toBeInTheDocument();
    expect(Image).toHaveAttribute('src', postWithImage.image);
  });

  test('Author profile should be present in the card.', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...postWithImage} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    const authorProfile = screen.getByRole('button', { name: 'profileImg' });
    expect(authorProfile).toBeInTheDocument();
  });
});
