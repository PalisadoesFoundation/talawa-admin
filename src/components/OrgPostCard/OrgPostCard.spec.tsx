import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useParams } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import OrgPostCard from './OrgPostCard';
import i18nForTest from 'utils/i18nForTest';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { PRESIGNED_URL } from 'GraphQl/Mutations/mutations';

// Mocks
vi.mock('react-router-dom', () => ({
  useParams: () => ({ orgId: 'org1' }),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const mockPost = {
  id: '1',
  caption: 'Test Post',
  createdAt: new Date(),
  creatorId: 'user1',
  pinnedAt: null as Date | null,
  attachments: [
    {
      id: 'att1',
      postId: '1',
      name: 'test.jpg',
      objectName: 'test-object.jpg',
      mimeType: 'image/jpeg',
      createdAt: new Date(),
    },
  ],
};

const mocks = [
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        input: {
          id: '1',
          caption: 'Updated Post',
          attachments: [],
        },
      },
    },
    result: { data: { updatePost: { id: '1' } } },
  },
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: { input: { id: '1' } },
    },
    result: { data: { deletePost: { id: '1' } } },
  },
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: { input: { id: '1', isPinned: true } },
    },
    result: { data: { updatePost: { id: '1' } } },
  },
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: { input: { id: '1', isPinned: false } },
    },
    result: { data: { updatePost: { id: '1' } } },
  },
  // User query mock
  {
    request: {
      query: GET_USER_BY_ID,
      variables: { input: { id: 'user1' } },
    },
    result: {
      data: {
        user: {
          id: 'user1',
          name: 'Test User',
        },
      },
    },
  },

  // Presigned URL mock for attachment
  {
    request: {
      query: PRESIGNED_URL,
      variables: {
        input: {
          objectName: 'test-object.jpg',
          operation: 'GET',
        },
      },
    },
    result: {
      data: {
        createPresignedUrl: {
          fileUrl: 'test://mock-image.jpg',
          presignedUrl: 'test://mock-presigned.jpg',
          objectName: 'test-object.jpg',
          requiresUpload: false,
        },
      },
    },
  },

  // Add this duplicate mock for the second call

  {
    request: {
      query: PRESIGNED_URL,
      variables: {
        input: {
          objectName: 'test-object.jpg',
          operation: 'GET',
        },
      },
    },
    result: {
      data: {
        createPresignedUrl: {
          fileUrl: 'test://mock-image.jpg', // Using test:// protocol that won't try to resolve
          presignedUrl: 'test://mock-presigned.jpg',
          objectName: 'test-object.jpg',
          requiresUpload: false,
        },
      },
    },
  },
];

const mockUploadFileToMinio = vi
  .fn()
  .mockResolvedValue({ objectName: 'test-image.png' });

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({ uploadFileToMinio: mockUploadFileToMinio }),
}));

global.URL.createObjectURL = vi.fn(() => 'mock-url');

const sanitizeUrl = (url: string | null): string => {
  if (!url) return '';

  // For blob/data URIs - restrict to specific known safe patterns
  if (url.startsWith('blob:')) {
    // Only allow blob URLs from same origin
    return url.startsWith('blob:' + window.location.origin) ? url : '';
  }

  if (url.startsWith('data:')) {
    // Only allow image data URIs with proper format
    if (
      /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(url)
    ) {
      return url;
    }
    return '';
  }

  try {
    const parsed = new URL(url);
    // Only allow http/https protocols from known domains
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    // Add domain whitelist if possible
    return url;
  } catch (e) {
    return '';
  }
};

// Add this function to the component
const sanitizeText = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
};

const renderComponent = (post = mockPost) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <OrgPostCard post={post} />
      </I18nextProvider>
    </MockedProvider>,
  );

describe('OrgPostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    global.fetch = vi.fn().mockImplementation((url) => {
      if (
        typeof url === 'string' &&
        (url.includes('test://') ||
          url.includes('example.com') ||
          url.includes('presigned'))
      ) {
        return Promise.resolve({
          ok: true,
          status: 200,
          blob: () =>
            Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
        });
      }
      return Promise.reject(new Error(`Unmocked fetch call to ${url}`));
    });
  });

  // Clean up in afterEach
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders post card with image', () => {
    renderComponent();
    expect(screen.getByAltText('Post image')).toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  test('opens and closes modal', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('post-item'));
    expect(screen.getByTestId('post-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-modal-button'));
    expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
  });

  test('opens edit modal and updates post', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('post-item'));
    fireEvent.click(screen.getByTestId('more-options-button'));
    fireEvent.click(screen.getByTestId('edit-option'));

    const input = screen.getByPlaceholderText('orgPostCard.enterCaption');
    fireEvent.change(input, { target: { value: 'Updated Post' } });

    fireEvent.click(screen.getByTestId('update-post-submit'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('deletes post', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('post-item'));
    fireEvent.click(screen.getByTestId('more-options-button'));
    fireEvent.click(screen.getByTestId('delete-option'));

    fireEvent.click(screen.getByText('Yes'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('toggles post pin', async () => {
    renderComponent({ ...mockPost, pinnedAt: new Date() });
    fireEvent.click(screen.getByTestId('post-item'));
    fireEvent.click(screen.getByTestId('more-options-button'));
    fireEvent.click(screen.getByTestId('pin-post-button'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('prevents invalid file uploads', async () => {
    const user = userEvent.setup();

    // Render component
    const { unmount } = renderComponent();

    // Open modal and navigate to edit
    await user.click(screen.getByTestId('post-item'));
    await user.click(await screen.findByTestId('more-options-button'));
    await user.click(await screen.findByTestId('edit-option'));

    // Verify initially no file preview is shown
    expect(screen.queryByTestId('media-preview-image')).not.toBeInTheDocument();

    // Try uploading an invalid file
    const fileInput = screen.getByTestId('image-upload');
    const invalidFile = new File(['test'], 'bad.pdf', {
      type: 'application/pdf',
    });

    await user.upload(fileInput, invalidFile);
    fireEvent.change(fileInput);

    // Wait a moment for any processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify invalid file was rejected (no preview shown)
    expect(screen.queryByTestId('media-preview-image')).not.toBeInTheDocument();

    // Verify the MinIO upload function wasn't called
    expect(mockUploadFileToMinio).not.toHaveBeenCalled();

    unmount();
  });
});
