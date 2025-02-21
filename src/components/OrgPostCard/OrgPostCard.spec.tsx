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
import { vi } from 'vitest';

/**
 * Unit tests for the OrgPostCard component, which displays organization posts with various interactions.
 *
 * These tests verify:
 * - Basic rendering and display functionality:
 *   - Proper rendering of post content (title, text, images, videos)
 *   - "Read more" toggle button behavior
 *   - Image and video display handling
 *   - Fallback behavior when media is missing
 *
 * - Modal interactions:
 *   - Opening/closing primary modal on post click
 *   - Secondary modal functionality for edit/delete operations
 *   - Form validation in edit modal
 *   - Media upload handling in edit modal
 *
 * - Post management operations:
 *   - Creating and updating posts
 *   - Deleting posts
 *   - Pinning/unpinning posts
 *   - Error handling for failed operations
 *
 * - Media handling:
 *   - Image upload and preview
 *   - Video upload and preview
 *   - Auto-play behavior on hover
 *   - Clearing uploaded media
 */

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
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('i18next-browser-languagedetector', () => {
  return {
    default: {
      init: vi.fn(),
      type: 'languageDetector',
      detect: vi.fn(() => 'en'),
      cacheUserLanguage: vi.fn(),
    },
  };
});
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
        reload: vi.fn(),
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  const post = {
    id: '12',
    caption: 'Event Info',
    createdAt: new Date(),
    updatedAt: null,
    pinnedAt: null,
    creatorId: '123',
    attachments: [
      {
        id: '1',
        postId: '12',
        name: 'https://example.com/image.jpg',
        mimeType: 'image/jpeg',
        createdAt: new Date(),
      },
    ],
  };

  const props = {
    post,
    postID: '123',
    postTitle: 'Event Info',
    postInfo: 'Time change',
    postAuthor: 'John Doe',
    postPhoto: 'test.png',
    postVideo: 'test.mp4',
    pinned: false,
  };

  vi.mock('react-toastify', () => ({
    toast: {
      success: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  }));
  global.alert = vi.fn();

  it('Opens post on image click', async () => {
    const { getByTestId, getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByAltText('image'));

    expect(getByTestId('card-text')).toBeInTheDocument();
    expect(getByTestId('card-title')).toBeInTheDocument();
    expect(getByAltText('image')).toBeInTheDocument();
  });
  it('renders with default props', () => {
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
  it('toggles "Read more" button', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByAltText('image'));
    const toggleButton = getByTestId('toggleBtn');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('hide');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Read more');
  });
  it('opens and closes edit modal', async () => {
    setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));
    await userEvent.click(screen.getByTestId('editPostModalBtn'));

    const createOrgBtn = screen.getByTestId('modalOrganizationHeader');
    expect(createOrgBtn).toBeInTheDocument();
    await userEvent.click(createOrgBtn);
    await userEvent.click(screen.getByTestId('closeOrganizationModal'));
  });
  it('Should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    await userEvent.click(screen.getByAltText('image'));
    expect(screen.getByAltText('Post Image')).toBeInTheDocument();
  });
  it('Testing post updating after post is updated', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));

    await userEvent.click(screen.getByTestId('editPostModalBtn'));
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
      await userEvent.click(screen.getByPlaceholderText(/video/i));
      const input = getByTestId('postVideoUrl');
      const file = new File(['test-video'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
      await waitFor(() => {
        convertToBase64(file);
      });

      await userEvent.click(screen.getByTestId('closePreview'));
    }
    const imageUrlInput = screen.queryByTestId('postImageUrl');
    if (imageUrlInput) {
      fireEvent.change(getByTestId('postImageUrl'), {
        target: { value: 'This is a updated image' },
      });
      await userEvent.click(screen.getByPlaceholderText(/image/i));
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
      document.getElementById = vi.fn(() => input);
      const clearImageButton = getByTestId('closeimage');
      fireEvent.click(clearImageButton);
    }
    await userEvent.click(screen.getByTestId('updatePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });
  it('Testing post updating functionality fail case', async () => {
    const post2 = {
      id: '',
      caption: 'Event Info',
      createdAt: new Date(),
      updatedAt: null,
      pinnedAt: null,
      creatorId: '123',
      attachments: [],
    };

    const props2 = {
      post: post2,
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
    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));

    await userEvent.click(screen.getByTestId('editPostModalBtn'));
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
      await userEvent.click(screen.getByPlaceholderText(/video/i));
      const input = getByTestId('postVideoUrl');
      const file = new File(['test-video'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
      await waitFor(() => {
        convertToBase64(file);
      });

      await userEvent.click(screen.getByTestId('closePreview'));
    }
    const imageUrlInput = screen.queryByTestId('postImageUrl');
    if (imageUrlInput) {
      fireEvent.change(getByTestId('postImageUrl'), {
        target: { value: 'This is a updated image' },
      });
      await userEvent.click(screen.getByPlaceholderText(/image/i));
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
      document.getElementById = vi.fn(() => input);
      const clearImageButton = getByTestId('closeimage');
      fireEvent.click(clearImageButton);
    }
    await userEvent.click(screen.getByTestId('updatePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });
  it('Testing pin post functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));
    await userEvent.click(screen.getByTestId('pinpostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
  it('Testing pin post functionality fail case', async () => {
    const post2 = {
      id: '',
      caption: 'Event Info',
      createdAt: new Date(),
      updatedAt: null,
      pinnedAt: null,
      creatorId: '123',
      attachments: [],
    };

    const props2 = {
      post: post2,
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

    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));
    await userEvent.click(screen.getByTestId('pinpostBtn'));
  });
  it('Testing post delete functionality', async () => {
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

    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));

    await userEvent.click(screen.getByTestId('deletePostModalBtn'));
    fireEvent.click(screen.getByTestId('deletePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
  it('Testing post delete functionality fail case', async () => {
    const post2 = {
      id: '',
      caption: 'Event Info',
      createdAt: new Date(),
      updatedAt: null,
      pinnedAt: null,
      creatorId: '123',
      attachments: [],
    };

    const props2 = {
      post: post2,
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

    await userEvent.click(screen.getByAltText('image'));
    await userEvent.click(screen.getByTestId('moreiconbtn'));

    await userEvent.click(screen.getByTestId('deletePostModalBtn'));
    fireEvent.click(screen.getByTestId('deletePostBtn'));
  });
});
