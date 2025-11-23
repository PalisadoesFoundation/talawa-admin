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
});
