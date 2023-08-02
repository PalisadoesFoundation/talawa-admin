import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
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
    pinned: false,
  };
  jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  }));

  global.alert = jest.fn();

  test('renders post info', () => {
    render(
      <MockedProvider>
        <OrgPostCard {...props} />
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));

    const postAuthor = screen.getByText('John Doe');
    expect(postAuthor).toBeInTheDocument();
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
    userEvent.click(screen.getByAltText('image'));
    expect(screen.getByAltText('Post Image')).toBeInTheDocument();
  });

  test('Testing post update post modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));
    userEvent.type(screen.getByTestId('updateTitle'), 'updated title');
    userEvent.type(screen.getByTestId('updateText'), 'This is a updated text');
    userEvent.click(screen.getByTestId('updatePostBtn'));
  });
  test('Testing post delete functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
  });
  test('Testing post delete functionality toast', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
    window.location.assign('/');
  });

  test('Testing close modal functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('closeiconbtn'));
  });
  test('Testing close button functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('closebtn'));
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
      pinned: false,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );
  });
  test('should show an error toast when the delete event mutation fails', async () => {
    const errorMocks = [
      {
        request: {
          query: DELETE_POST_MUTATION,
          variables: {
            id: props.id,
          },
        },
        error: new Error('Something went wrong'),
      },
    ];
    const link2 = new StaticMockLink(errorMocks, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));

    const deleteBtn = screen.getByTestId('deletePostBtn');
    fireEvent.click(deleteBtn);
  });
  test('Delete post handler', async () => {
    const errorMocks = [
      {
        request: {
          query: DELETE_POST_MUTATION,
          variables: {
            id: props.id,
          },
        },
        error: new Error('Something went wrong'),
      },
    ];
    const link2 = new StaticMockLink(errorMocks, true);
    const { container } = render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));

    const deleteBtn = screen.getByTestId('deletePostBtn');
    fireEvent.click(deleteBtn);
    window.location.assign('/');
    await wait();

    expect(container.textContent).toMatch('Know More');
  });
  it('updates state variables correctly when handleEditModal is called', () => {
    const link2 = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();
    expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();

    expect(screen.getByTestId('editPostModal')).toHaveClass('show');
    expect(screen.getByTestId('deletePostModal')).not.toHaveClass('show');

    expect(screen.getByTestId('modalVisible')).toBe('false');
    expect(screen.getByTestId('menuVisible')).toBe('false');
    expect(screen.getByTestId('showEditModal')).toBe('true');
    expect(screen.getByTestId('showDeleteModal')).toBe('false');
  });

  it('updates state variables correctly when handleDeleteModal is called', () => {
    const link2 = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();
    expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('deletePostModalBtn'));

    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();
    expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();

    expect(screen.getByTestId('editPostModal')).not.toHaveClass('show');
    expect(screen.getByTestId('deletePostModal')).toHaveClass('show');

    expect(screen.getByTestId('modalVisible')).toBe('false');
    expect(screen.getByTestId('menuVisible')).toBe('false');
    expect(screen.getByTestId('showEditModal')).toBe('false');
    expect(screen.getByTestId('showDeleteModal')).toBe('true');
  });
});
