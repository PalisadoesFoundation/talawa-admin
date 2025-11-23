import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import CreatePostModal from './CreatePostModal';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock crypto.subtle
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
});

// Mock utils/errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock utils/convertToBase64
vi.mock('utils/convertToBase64', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue('base64-string'),
}));
describe('CreatePostModal', () => {
  const mockOnHide = vi.fn();
  const mockRefetch = vi.fn();
  const orgId = 'test-org-id';

  const mocks = [
    {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          input: {
            caption: 'Test Caption',
            organizationId: orgId,
            isPinned: false,
            attachments: [],
          },
        },
      },
      result: {
        data: {
          createPost: {
            id: 'post-id',
            caption: 'Test Caption',
            pinnedAt: null,
            attachments: [],
          },
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when shown', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('modalTitle')).toBeInTheDocument();
    expect(screen.getByTestId('modalinfo')).toBeInTheDocument();
    expect(screen.getByText('addPost')).toBeInTheDocument();
  });

  it('validates empty title', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const form = screen.getByTestId('createPostForm');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('messageTitleError');
    });
  });

  it('handles input changes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    const descInput = screen.getByTestId('modalinfo');

    await userEvent.type(titleInput, 'New Post Title');
    await userEvent.type(descInput, 'New Post Description');

    expect(titleInput).toHaveValue('New Post Title');
    expect(descInput).toHaveValue('New Post Description');
  });

  it('handles file upload preview', async () => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);

    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const successMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test Title', // The code uses title as caption if description is empty? No, let's check code.
              // Looking at code:
              // caption: postformState.postInfo || postformState.posttitle,
              // So if postInfo is empty, it uses posttitle.
              organizationId: orgId,
              isPinned: false,
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: 'post-id',
              caption: 'Test Title',
              pinnedAt: null,
              attachments: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={successMocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'Test Title');

    const submitBtn = screen.getByText('addPost');
    await userEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith('postCreatedSuccess');
      },
      { timeout: 3000 },
    );
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockOnHide).toHaveBeenCalled();
  });
  it('handles video file upload preview', async () => {
    global.URL.createObjectURL = vi.fn(() => 'mock-video-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['video content'], 'video.mp4', {
      type: 'video/mp4',
    });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);

    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
  });

  it('handles removing media', async () => {
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);
    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();

    const removeBtn = screen.getByTestId('mediaCloseButton');
    await userEvent.click(removeBtn);

    expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
  });

  it('handles pin post toggle', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const pinCheckbox = screen.getByTestId('pinPost');
    expect(pinCheckbox).not.toBeChecked();

    await userEvent.click(pinCheckbox);
    expect(pinCheckbox).toBeChecked();
  });

  it('handles various mime types correctly', async () => {
    // This test implicitly covers the getMimeTypeEnum switch case by uploading different file types
    // We can verify the internal state or just ensure no errors and correct preview behavior
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const input = screen.getByTestId('addMediaField');

    // Test PNG
    await userEvent.upload(
      input,
      new File([''], 'test.png', { type: 'image/png' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test JPEG
    await userEvent.upload(
      input,
      new File([''], 'test.jpg', { type: 'image/jpeg' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test WEBP
    await userEvent.upload(
      input,
      new File([''], 'test.webp', { type: 'image/webp' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test AVIF
    await userEvent.upload(
      input,
      new File([''], 'test.avif', { type: 'image/avif' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test WEBM
    await userEvent.upload(
      input,
      new File([''], 'test.webm', { type: 'video/webm' }),
    );
    expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
  });
});
