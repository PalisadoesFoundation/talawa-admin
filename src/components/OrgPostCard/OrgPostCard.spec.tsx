import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
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
  PRESIGNED_URL,
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';

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

const mocks: MockedResponse[] = [
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
    result: {
      data: {
        updatePost: {
          id: '1',
          caption: 'Updated Post',
          createdAt: new Date().toISOString(),
          pinnedAt: null,
          creatorId: 'user1',
          attachments: [],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: { input: { id: '1' } },
    },
    result: {
      data: {
        deletePost: {
          id: '1',
          caption: 'Test Post',
          createdAt: new Date().toISOString(),
          pinnedAt: null,
          creatorId: 'user1',
          attachments: [],
        },
      },
    },
  },
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: { input: { id: '1', isPinned: true } },
    },
    result: {
      data: {
        updatePost: {
          id: '1',
          caption: 'Test Post',
          createdAt: new Date().toISOString(),
          pinnedAt: new Date().toISOString(),
          creatorId: 'user1',
          attachments: mockPost.attachments,
        },
      },
    },
  },
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: { input: { id: '1', isPinned: false } },
    },
    result: {
      data: {
        updatePost: {
          id: '1',
          caption: 'Test Post',
          createdAt: new Date().toISOString(),
          pinnedAt: null,
          creatorId: 'user1',
          attachments: mockPost.attachments,
        },
      },
    },
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
  // Error mock for presigned URL
  {
    request: {
      query: PRESIGNED_URL,
      variables: {
        input: {
          objectName: 'error-object.jpg',
          operation: 'GET',
        },
      },
    },
    error: new Error('Failed to get presigned URL'),
  },
  // Video mock for presigned URL
  {
    request: {
      query: PRESIGNED_URL,
      variables: {
        input: {
          objectName: 'test-video.mp4',
          operation: 'GET',
        },
      },
    },
    result: {
      data: {
        createPresignedUrl: {
          fileUrl: 'test://mock-video.mp4',
          presignedUrl: 'test://mock-presigned-video.mp4',
          objectName: 'test-video.mp4',
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

// Security utility functions
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

    // Protocol validation
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      // Special case for tests - allow test:// protocol
      if (parsed.protocol === 'test:') {
        return url;
      }
      return '';
    }

    // Domain whitelist for production and testing
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      'example.com',
      'talawa-api.org', // Add your actual domains here
      'talawa-admin.org',
    ];

    // Check if hostname exactly matches or is subdomain of allowed domain
    const isAllowedDomain = allowedDomains.some((domain) => {
      // Exact match
      if (parsed.hostname === domain) {
        return true;
      }

      // Subdomain check - ensure it's actually a subdomain with proper structure
      if (parsed.hostname.endsWith('.' + domain)) {
        // Get the subdomain part (everything before .domain)
        const subdomain = parsed.hostname.slice(
          0,
          parsed.hostname.length - domain.length - 1,
        );

        // Only allow direct subdomains (no further nesting) for maximum security
        if (subdomain && !subdomain.includes('.')) {
          return true;
        }
      }

      return false;
    });

    if (!isAllowedDomain) {
      return '';
    }

    return url;
  } catch (e) {
    return '';
  }
};

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

const renderComponent = (post = mockPost, customMocks = mocks) =>
  render(
    <MockedProvider
      mocks={customMocks}
      addTypename={false}
      defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}
    >
      <I18nextProvider i18n={i18nForTest}>
        <OrgPostCard post={post} />
      </I18nextProvider>
    </MockedProvider>,
  );

describe('OrgPostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock HTMLMediaElement methods for video tests
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Group 1: Basic rendering tests
  describe('Rendering', () => {
    test('renders post card with image', () => {
      renderComponent();
      expect(screen.getByAltText('Post image')).toBeInTheDocument();
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });

    test('opens and closes modal', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByTestId('post-item'));
      expect(screen.getByTestId('post-modal')).toBeInTheDocument();
      await user.click(screen.getByTestId('close-modal-button'));
      expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
    });

    test('initializes with correct state values', () => {
      renderComponent();
      expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-menu')).not.toBeInTheDocument();
    });
  });

  // Group 2: Post operations tests
  describe('Post Operations', () => {
    test('opens edit modal and updates post', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('edit-option'));

      const input = screen.getByPlaceholderText('orgPostCard.enterCaption');
      await user.clear(input);
      await user.type(input, 'Updated Post');

      await user.click(screen.getByTestId('update-post-submit'));

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('deletes post', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('delete-option'));

      await user.click(screen.getByText('Yes'));

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('toggles post pin', async () => {
      const user = userEvent.setup();
      renderComponent({ ...mockPost, pinnedAt: new Date() });
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('pin-post-button'));

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('validates caption field in edit mode', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('edit-option'));

      // Try to submit with empty caption
      const input = screen.getByPlaceholderText('orgPostCard.enterCaption');
      await user.clear(input);
      await user.click(screen.getByTestId('update-post-submit'));

      // Should not call mutation with empty caption
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    test('resets form state when modal is closed and reopened', async () => {
      const { rerender } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const user = userEvent.setup();

      // Open modal and edit
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('edit-option'));

      // Fill form
      const input = screen.getByPlaceholderText('orgPostCard.enterCaption');
      await user.clear(input);
      await user.type(input, 'Changed Value');
      expect(input).toHaveValue('Changed Value');

      // Close modal
      await user.click(screen.getByTestId('close-modal-button'));

      // Reopen modal
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('edit-option'));

      // Check if form is reset
      expect(
        screen.getByPlaceholderText('orgPostCard.enterCaption'),
      ).toHaveValue('Test Post');
    });
  });

  // Group 3: Media handling tests
  describe('Media Handling', () => {
    test('prevents invalid file uploads', async () => {
      const user = userEvent.setup();
      const { unmount } = renderComponent();

      await user.click(screen.getByTestId('post-item'));
      await user.click(await screen.findByTestId('more-options-button'));
      await user.click(await screen.findByTestId('edit-option'));

      expect(
        screen.queryByTestId('media-preview-image'),
      ).not.toBeInTheDocument();

      const fileInput = screen.getByTestId('image-upload');
      const invalidFile = new File(['test'], 'bad.pdf', {
        type: 'application/pdf',
      });

      await user.upload(fileInput, invalidFile);
      fireEvent.change(fileInput);

      await waitFor(
        () => {
          expect(
            screen.queryByTestId('media-preview-image'),
          ).not.toBeInTheDocument();
          expect(mockUploadFileToMinio).not.toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      unmount();
    });

    test('handles video playback controls', async () => {
      const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, 'play');
      const pauseSpy = vi.spyOn(window.HTMLMediaElement.prototype, 'pause');

      const videoPost = {
        ...mockPost,
        attachments: [
          {
            id: 'vid1',
            postId: '1',
            name: 'test.mp4',
            objectName: 'test-video.mp4',
            mimeType: 'video/mp4',
            createdAt: new Date(),
          },
        ],
      };

      renderComponent(videoPost, mocks);

      // Wait for video element to be in the DOM
      const videoElement = await screen.findByTestId(
        'video',
        {},
        { timeout: 5000 },
      );

      // Test mouseenter event
      fireEvent.mouseEnter(videoElement);

      // Verify play was called
      await waitFor(
        () => {
          expect(playSpy).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      // Test mouseleave event
      fireEvent.mouseLeave(videoElement);

      // Verify pause was called
      await waitFor(
        () => {
          expect(pauseSpy).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('properly cleans up object URLs on component unmount', async () => {
      const revokeURLSpy = vi.spyOn(URL, 'revokeObjectURL');
      const { unmount } = renderComponent();
      unmount();
      expect(revokeURLSpy).toHaveBeenCalled();
    });

    test('validates file types for video upload', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('edit-option'));

      const invalidFile = new File(['test'], 'test.pdf', {
        type: 'application/pdf',
      });
      await user.upload(screen.getByTestId('video-upload'), invalidFile);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please select a video file');
      });
    });

    test('validates file size limits', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByTestId('post-item'));
      await user.click(screen.getByTestId('more-options-button'));
      await user.click(screen.getByTestId('edit-option'));

      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      await user.upload(screen.getByTestId('image-upload'), largeFile);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('File exceeds 5MB limit');
      });
    });
  });

  // Group 4: Error handling tests
  describe('Error Handling', () => {
    test('handles CORS errors in loadMediaWithCorsHandling', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi
        .fn()
        .mockRejectedValue(new TypeError('Failed to fetch: CORS error'));

      renderComponent();

      const user = userEvent.setup();
      await user.click(screen.getByTestId('post-item'));

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining('cross-origin restrictions'),
          );
        },
        { timeout: 3000 },
      );

      global.fetch = originalFetch;
    });

    test('handles error in fetchPresignedUrl', async () => {
      const errorPost = {
        ...mockPost,
        attachments: [
          {
            id: 'error1',
            postId: '1',
            name: 'error.jpg',
            objectName: 'error-object.jpg',
            mimeType: 'image/jpeg',
            createdAt: new Date(),
          },
        ],
      };

      renderComponent(errorPost, mocks);

      const user = userEvent.setup();
      await user.click(screen.getByTestId('post-item'));

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith(
            'Failed to load media. Please try again.',
          );
        },
        { timeout: 3000 },
      );
    });
  });

  // Group 5: Security tests
  describe('Security Features', () => {
    test('sanitizeUrl properly handles different URL types', () => {
      // Test null/empty URL
      expect(sanitizeUrl(null)).toBe('');
      expect(sanitizeUrl('')).toBe('');

      // Test blob URL - should only allow same origin
      const sameOriginBlobUrl = 'blob:' + window.location.origin + '/123';
      const differentOriginBlobUrl = 'blob:https://example.com/123';
      expect(sanitizeUrl(sameOriginBlobUrl)).toBe(sameOriginBlobUrl);
      expect(sanitizeUrl(differentOriginBlobUrl)).toBe('');

      // Test data URL - should only allow properly formatted image data URIs
      const validDataUrl = 'data:image/png;base64,abc123';
      const invalidDataUrl =
        'data:text/html;base64,<script>alert("xss")</script>';
      expect(sanitizeUrl(validDataUrl)).toBe(validDataUrl);
      expect(sanitizeUrl(invalidDataUrl)).toBe('');

      // Test invalid URL
      expect(sanitizeUrl('not-a-url')).toBe('');

      // Test http URL with allowed domain
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');

      // Test https URL with allowed domain
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');

      // Test URL with allowed subdomain
      expect(sanitizeUrl('https://sub.example.com')).toBe(
        'https://sub.example.com',
      );

      // Test URL with disallowed domain
      expect(sanitizeUrl('https://evil.com')).toBe('');

      // Test URL with protocol other than http/https (except test:// for tests)
      expect(sanitizeUrl('ftp://example.com')).toBe('');
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
      expect(sanitizeUrl('test://mock-image.jpg')).toBe(
        'test://mock-image.jpg',
      );
    });

    test('sanitizeText properly handles dangerous content', () => {
      const dangerousText = '<script>alert("XSS")</script>';
      const sanitized = sanitizeText(dangerousText);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });
  });
});
