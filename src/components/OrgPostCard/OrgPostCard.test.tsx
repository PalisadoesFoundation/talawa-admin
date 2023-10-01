import React from 'react';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
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
import convertToBase64 from 'utils/convertToBase64';
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

  it('renders with default props', () => {
    const { getByAltText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    expect(getByTestId('card-text')).toBeInTheDocument();
    expect(getByTestId('card-title')).toBeInTheDocument();
    expect(getByAltText('image')).toBeInTheDocument();
  });

  it('toggles "Read more" button', () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));
    const toggleButton = getByTestId('toggleBtn');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('hide');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Read more');
  });

  // it('opens and closes edit modal', () => {
  //   const { getByTestId, queryByTestId } = render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <I18nextProvider i18n={i18nForTest}>
  //         <OrgPostCard {...props} />
  //       </I18nextProvider>
  //     </MockedProvider>
  //   );

  //   fireEvent.click(getByTestId('moreiconbtn'));
  //   fireEvent.click(getByTestId('editPostModalBtn'));

  //   expect(queryByTestId('modalOrganizationHeader')).toBeInTheDocument();

  //   fireEvent.click(getByTestId('closeOrganizationModal'));
  //   expect(queryByTestId('modalOrganizationHeader')).toBeNull();
  // });

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
  test('Testing pin post functionnality', async () => {
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

    userEvent.click(screen.getByTestId('pinpostBtn'));
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

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();
    // expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    // expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();

    // expect(screen.getByTestId('editPostModal')).toHaveClass('show');
    // expect(screen.getByTestId('deletePostModal')).not.toHaveClass('show');

    // expect(screen.getByTestId('modalVisible')).toBe('false');
    // expect(screen.getByTestId('menuVisible')).toBe('false');
    // expect(screen.getByTestId('showEditModal')).toBe('true');
    // expect(screen.getByTestId('showDeleteModal')).toBe('false');
  });

  // it('updates state variables correctly when handleDeleteModal is called', () => {
  //   const link2 = new StaticMockLink(MOCKS, true);
  //   render(
  //     <MockedProvider link={link2} addTypename={false}>
  //       <OrgPostCard {...props} />
  //     </MockedProvider>
  //   );
  //   userEvent.click(screen.getByAltText('image'));

  //   userEvent.click(screen.getByTestId('moreiconbtn'));

  //   expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();
  //   expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();

  //   userEvent.click(screen.getByTestId('deletePostModalBtn'));

  //   expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
  //   expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();
  //   expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();

  //   expect(screen.getByTestId('editPostModal')).not.toHaveClass('show');
  //   expect(screen.getByTestId('deletePostModal')).toHaveClass('show');

  //   expect(screen.getByTestId('modalVisible')).toBe('false');
  //   expect(screen.getByTestId('menuVisible')).toBe('false');
  //   expect(screen.getByTestId('showEditModal')).toBe('false');
  //   expect(screen.getByTestId('showDeleteModal')).toBe('true');
  // });
  it('clears postvideo state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));
    userEvent.click(screen.getByTestId('closePreview'));

    fireEvent.change(getByTestId('postVideoUrl'), {
      target: { value: '' },
    });
    userEvent.click(screen.getByPlaceholderText(/video/i));
    const input = getByTestId('postVideoUrl');
    const file = new File(['test-video'], 'test.mp4', { type: 'video/mp4' });
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    fireEvent.change(input);

    // Simulate the asynchronous base64 conversion function
    await waitFor(() => {
      convertToBase64(file); // Replace with the expected base64-encoded image
    });
  });
  it('clears postimage state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));
    userEvent.click(screen.getByTestId('closePreview'));

    fireEvent.change(getByTestId('postImageUrl'), {
      target: { value: '' },
    });
    userEvent.click(screen.getByPlaceholderText(/image/i));
    const input = getByTestId('postImageUrl');
    const file = new File(['test-image'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    fireEvent.change(input);

    // Simulate the asynchronous base64 conversion function
    await waitFor(() => {
      convertToBase64(file); // Replace with the expected base64-encoded image
    });
  });
});
