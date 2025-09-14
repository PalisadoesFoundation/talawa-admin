import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import StartPostModal from './StartPostModal';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          caption: 'This is dummy text',
          organizationId: '123',
          attachments: [],
        },
      },
      result: {
        data: {
          createPost: { id: '453' },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

async function wait(ms = 100): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

// Full userData mock
const userDataMock = {
  id: '123',
  name: 'Glen Dsza',
  emailAddress: 'glen@dsza.com',
  avatarURL: 'image.png',
  birthDate: null,
  city: null,
  countryCode: null,
  createdAt: '2023-02-18T09:22:27.969Z',
  updatedAt: '2023-02-18T09:22:27.969Z',
  educationGrade: null,
  employmentStatus: null,
  isEmailAddressVerified: true,
  maritalStatus: null,
  natalSex: null,
  naturalLanguageCode: 'en',
  postalCode: null,
  role: 'member',
  state: null,
  mobilePhoneNumber: null,
  homePhoneNumber: null,
  workPhoneNumber: null,
  createdOrganizations: [],
  organizationsWhereMember: { edges: [] },
};

const renderStartPostModal = (
  visibility: boolean,
  attachments: any[] = [],
  onHide: () => void = vi.fn(),
  fetchPosts: () => void = vi.fn(),
  customLink: StaticMockLink = link,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={customLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <StartPostModal
              show={visibility}
              onHide={onHide}
              fetchPosts={fetchPosts}
              userData={userDataMock}
              organizationId="123"
              attachment={attachments}
            />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('StartPostModal Component', () => {
  it('renders correctly', async () => {
    renderStartPostModal(true);
    const modal = await screen.findByTestId('startPostModal');
    expect(modal).toBeInTheDocument();
  });

  it('shows error toast on empty post submission', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    renderStartPostModal(true);
    await userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toastSpy).toHaveBeenCalledWith(
      "Can't create a post with an empty body.",
    );
  });

  it('shows info toast on valid post submission', async () => {
    renderStartPostModal(true);
    const input = screen.getByTestId('postInput');
    await userEvent.type(input, 'Hello World');
    await userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toast.info).toHaveBeenCalledWith(
      'Processing your post. Please wait.',
    );
  });

  it('displays correct username', async () => {
    renderStartPostModal(true);
    expect(screen.getByText('Glen Dsza')).toBeInTheDocument();
  });

  it('shows default user image if avatarURL is null', async () => {
    const userDataNoAvatar = { ...userDataMock, avatarURL: '' };
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <StartPostModal
                show={true}
                onHide={vi.fn()}
                fetchPosts={vi.fn()}
                userData={userDataNoAvatar}
                organizationId="123"
                attachment={[]}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const img = screen.getByTestId('userImage') as HTMLImageElement;
    expect(img.src).toContain('defaultImg.png');
  });

  it('clears input and hides modal on close', async () => {
    const onHideMock = vi.fn();
    renderStartPostModal(true, [], onHideMock);
    const input = screen.getByTestId('postInput');
    await userEvent.type(input, 'Test post');
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    expect(onHideMock).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('renders MinIO image attachments', async () => {
    const minioAttachment = [
      {
        fileHash: 'hash123',
        mimeType: 'image/png',
        name: 'test.png',
        objectName: 'uploads/test.png',
        previewUrl: 'https://minio.example.com/uploads/test.png',
      },
    ];

    renderStartPostModal(true, minioAttachment);
    const img = await screen.findByAltText('test.png');
    expect(img).toHaveAttribute(
      'src',
      'https://minio.example.com/uploads/test.png',
    );
  });

  it('updates postContent when typing', async () => {
    renderStartPostModal(true);
    const input = screen.getByTestId('postInput') as HTMLTextAreaElement;
    await userEvent.type(input, 'Typing test');
    expect(input.value).toBe('Typing test');
  });

  it('ignores non-image attachments in preview', async () => {
    const attachments = [
      {
        fileHash: 'hash1',
        mimeType: 'video/mp4',
        name: 'video.mp4',
        objectName: 'uploads/video.mp4',
        previewUrl: 'https://minio.example.com/uploads/video.mp4',
      },
    ];
    renderStartPostModal(true, attachments);
    expect(screen.queryByAltText('video.mp4')).not.toBeInTheDocument();
  });

  it('handles null attachment array gracefully', async () => {
    renderStartPostModal(true, null as any);
    const input = screen.getByTestId('postInput');
    await userEvent.type(input, 'Post with null attachments');
    await userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toast.info).toHaveBeenCalledWith(
      'Processing your post. Please wait.',
    );
  });

  it('calls fetchPosts and onHide after successful post', async () => {
    const fetchPostsMock = vi.fn();
    const onHideMock = vi.fn();
    const successMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test content',
              organizationId: '123',
              attachments: [],
            },
          },
        },
        result: { data: { createPost: { id: '111' } } },
      },
    ];
    const customLink = new StaticMockLink(successMocks, true);
    renderStartPostModal(true, [], onHideMock, fetchPostsMock, customLink);

    const input = screen.getByTestId('postInput');
    await userEvent.type(input, 'Test content');
    await userEvent.click(screen.getByTestId('createPostBtn'));

    await waitFor(() => {
      expect(fetchPostsMock).toHaveBeenCalled();
      expect(onHideMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('handles unsupported attachment type fallback', async () => {
    const attachments = [
      {
        fileHash: 'hashX',
        mimeType: 'application/pdf',
        name: 'doc.pdf',
        objectName: 'uploads/doc.pdf',
        previewUrl: 'https://minio.example.com/uploads/doc.pdf',
      },
    ];
    renderStartPostModal(true, attachments);
    // No image preview should be rendered
    expect(screen.queryByAltText('doc.pdf')).not.toBeInTheDocument();
  });
});
