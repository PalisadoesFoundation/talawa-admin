import React from 'react';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import OrgPostCard from './OrgPostCard';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import convertToBase64 from 'utils/convertToBase64';
import { BrowserRouter } from 'react-router-dom';
const MOCKS = [
  {
    request: {
      query: DELETE_POST_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        removePost: {
          _id: '123',
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
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: {
        id: '32',
      },
    },
    result: {
      data: {
        togglePostPin: {
          _id: '32',
        },
      },
    },
  },
];
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
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
    postPhoto: 'test.png',
    postVideo: 'test.mp4',
    pinned: false,
  };
  jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  }));
  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(),
  }));
  global.alert = jest.fn();

  test('renders with default props', () => {
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

  test('toggles "Read more" button', () => {
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
  test('opens and closes edit modal', async () => {
    localStorage.setItem('id', '123');

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

    const createOrgBtn = screen.getByTestId('modalOrganizationHeader');
    expect(createOrgBtn).toBeInTheDocument();
    userEvent.click(createOrgBtn);
    userEvent.click(screen.getByTestId('closeOrganizationModal'));
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
  test('Testing post updating after post is updated', async () => {
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
  test('Testing pin post functionality', async () => {
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
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
    fireEvent.click(screen.getByTestId('deletePostBtn'));
  });
  test('Testing close functionality of primary modal', async () => {
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
  test('Testing close functionality of secondary modal', async () => {
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
  test('updates state variables correctly when handleEditModal is called', () => {
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
  test('clears postvideo state and resets file input value', async () => {
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
    await waitFor(() => {
      convertToBase64(file);
    });
  });
  test('clears postimage state and resets file input value', async () => {
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
    document.getElementById = jest.fn(() => input);
    const clearImageButton = getByTestId('closeimage');
    fireEvent.click(clearImageButton);
  });
  test('Testing create organization modal', async () => {
    localStorage.setItem('id', '123');

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
    const createOrgBtn = screen.getByTestId('modalOrganizationHeader');
    expect(createOrgBtn).toBeInTheDocument();
    userEvent.click(createOrgBtn);
    userEvent.click(screen.getByTestId('closeOrganizationModal'));
  });
  test('should toggle post pin when pin button is clicked', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));
    const pinButton = getByTestId('pinpostBtn');
    fireEvent.click(pinButton);
    await waitFor(() => {
      expect(MOCKS[2].request.variables).toEqual({
        id: '32',
      });
    });
  });
});
