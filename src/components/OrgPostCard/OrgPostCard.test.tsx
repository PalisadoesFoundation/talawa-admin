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
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: { id: '12' },
    },
    result: {
      data: {
        removePost: {
          _id: '12',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        id: '12',
        title: 'updated title',
        text: 'This is a updated text',
      },
    },
    result: {
      data: {
        updatePost: {
          _id: '12',
        },
      },
    },
  },
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: {
        id: '12',
      },
    },
    result: {
      data: {
        togglePostPin: {
          _id: '12',
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
jest.mock('i18next-browser-languagedetector', () => ({
  init: jest.fn(),
  type: 'languageDetector',
  detect: jest.fn(() => 'en'),
  cacheUserLanguage: jest.fn(),
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
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: jest.fn(),
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  const props = {
    id: '12',
    postID: '123',
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

  test('Opens post on image click', () => {
    const { getByTestId, getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    expect(getByTestId('card-text')).toBeInTheDocument();
    expect(getByTestId('card-title')).toBeInTheDocument();
    expect(getByAltText('image')).toBeInTheDocument();
  });
  test('renders with default props', () => {
    const { getByAltText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
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
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));
    const toggleButton = getByTestId('toggleBtn');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('hide');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Read more');
  });
  test('opens and closes edit modal', async () => {
    setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
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
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByAltText('image'));
    expect(screen.getByAltText('Post Image')).toBeInTheDocument();
  });
  test('Testing post updating after post is updated', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));
    fireEvent.change(getByTestId('updateTitle'), {
      target: { value: 'updated title' },
    });
    fireEvent.change(getByTestId('updateText'), {
      target: { value: 'This is a updated text' },
    });
    const postVideoUrlInput = screen.queryByTestId('postVideoUrl');
    if (postVideoUrlInput) {
      fireEvent.change(getByTestId('postVideoUrl'), {
        target: { value: 'This is a updated video' },
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

      userEvent.click(screen.getByTestId('closePreview'));
    }
    const imageUrlInput = screen.queryByTestId('postImageUrl');
    if (imageUrlInput) {
      fireEvent.change(getByTestId('postImageUrl'), {
        target: { value: 'This is a updated image' },
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
    }
    userEvent.click(screen.getByTestId('updatePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });
  test('Testing post updating functionality fail case', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: 'test.png',
      postVideo: 'test.mp4',
      pinned: true,
    };
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));
    fireEvent.change(getByTestId('updateTitle'), {
      target: { value: 'updated title' },
    });
    fireEvent.change(getByTestId('updateText'), {
      target: { value: 'This is a updated text' },
    });
    const postVideoUrlInput = screen.queryByTestId('postVideoUrl');
    if (postVideoUrlInput) {
      fireEvent.change(getByTestId('postVideoUrl'), {
        target: { value: 'This is a updated video' },
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

      userEvent.click(screen.getByTestId('closePreview'));
    }
    const imageUrlInput = screen.queryByTestId('postImageUrl');
    if (imageUrlInput) {
      fireEvent.change(getByTestId('postImageUrl'), {
        target: { value: 'This is a updated image' },
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
    }
    userEvent.click(screen.getByTestId('updatePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });
  test('Testing pin post functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('pinpostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
  test('Testing pin post functionality fail case', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: 'test.png',
      postVideo: 'test.mp4',
      pinned: true,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
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
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
    fireEvent.click(screen.getByTestId('deletePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
  test('Testing post delete functionality fail case', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: 'test.png',
      postVideo: 'test.mp4',
      pinned: true,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard {...props2} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
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
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('closeiconbtn'));

    //Primary Modal is closed
    expect(screen.queryByTestId('moreiconbtn')).not.toBeInTheDocument();
  });
  test('Testing close functionality of secondary modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('closebtn'));

    //Secondary Modal is closed
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinpostBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closebtn')).not.toBeInTheDocument();
  });
  test('renders without "Read more" button when postInfo length is less than or equal to 43', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    expect(screen.queryByTestId('toggleBtn')).not.toBeInTheDocument();
  });
  test('renders with "Read more" button when postInfo length is more than 43', () => {
    const props2 = {
      id: '12',
      postID: '123',
      postTitle: 'Event Info',
      postInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.', // Length is greater than 43
      postAuthor: 'John Doe',
      postPhoto: 'photoLink',
      postVideo: 'videoLink',
      pinned: false,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    expect(screen.getByTestId('toggleBtn')).toBeInTheDocument();
  });
  test('updates state variables correctly when handleEditModal is called', () => {
    const link2 = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    //Primary Modal is closed
    expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('moreiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toggleBtn')).not.toBeInTheDocument();

    //Secondary Modal is closed
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinpostBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closebtn')).not.toBeInTheDocument();
  });
  test('updates state variables correctly when handleDeleteModal is called', () => {
    const link2 = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('deletePostModalBtn'));

    //Primary Modal is closed
    expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('moreiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toggleBtn')).not.toBeInTheDocument();

    //Secondary Modal is closed
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinpostBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closebtn')).not.toBeInTheDocument();
  });
  test('clears postvideo state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    const postVideoUrlInput = screen.queryByTestId('postVideoUrl');

    if (postVideoUrlInput) {
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

      userEvent.click(screen.getByTestId('closePreview'));
    }
  });
  test('clears postimage state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    const imageUrlInput = screen.queryByTestId('postImageUrl');

    if (imageUrlInput) {
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
    }
  });
  test('clears postitle state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    fireEvent.change(getByTestId('updateTitle'), {
      target: { value: '' },
    });

    userEvent.click(screen.getByTestId('updatePostBtn')); // Should not update post

    expect(screen.getByTestId('updateTitle')).toHaveValue('');
    expect(screen.getByTestId('closeOrganizationModal')).toBeInTheDocument();
    expect(screen.getByTestId('updatePostBtn')).toBeInTheDocument();
  });
  test('clears postinfo state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    fireEvent.change(getByTestId('updateText'), {
      target: { value: '' },
    });

    userEvent.click(screen.getByTestId('updatePostBtn')); // Should not update post

    expect(screen.getByTestId('updateText')).toHaveValue('');
    expect(screen.getByTestId('closeOrganizationModal')).toBeInTheDocument();
    expect(screen.getByTestId('updatePostBtn')).toBeInTheDocument();
  });
  test('Testing create organization modal', async () => {
    setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
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
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));
    const pinButton = getByTestId('pinpostBtn');
    fireEvent.click(pinButton);
    await waitFor(() => {
      expect(MOCKS[2].request.variables).toEqual({
        id: '12',
      });
    });
  });
  test('testing video play and pause on mouse enter and leave events', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const card = getByTestId('cardVid');

    HTMLVideoElement.prototype.play = jest.fn();
    HTMLVideoElement.prototype.pause = jest.fn();

    fireEvent.mouseEnter(card);
    expect(HTMLVideoElement.prototype.play).toHaveBeenCalled();

    fireEvent.mouseLeave(card);
    expect(HTMLVideoElement.prototype.pause).toHaveBeenCalled();
  });
  test('for rendering when no image and no video is available', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: '',
      postVideo: '',
      pinned: true,
    };

    const { getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(getByAltText('image not found')).toBeInTheDocument();
  });
});
