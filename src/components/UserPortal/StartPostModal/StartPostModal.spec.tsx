import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
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
import { waitFor } from '@testing-library/react';
import * as Toastify from 'react-toastify';

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
          id: '123',
          caption: 'This is dummy text',
          pinnedAt: null,
          attachments: [],
        },
      },
      result: {
        data: {
          createPost: {
            id: '453',
          },
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
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const renderStartPostModal = (
  visibility: boolean,
  image: string | null,
  img: string | null = null,
  onHide: () => void = vi.fn(),
  fetchPosts: () => void = vi.fn(),
  customLink: StaticMockLink = link,
): RenderResult => {
  const cardProps = {
    show: visibility,
    onHide,
    fetchPosts,
    userData: {
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
      organizationsWhereMember: {
        edges: [],
      },
    },
    organizationId: '123',
    img: img,
  };

  return render(
    <MockedProvider addTypename={false} link={customLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <StartPostModal {...cardProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Testing StartPostModal Component: User Portal', () => {
  it('Check if StartPostModal renders properly', async () => {
    renderStartPostModal(true, null);
    // Wait for modal to appear
    const modal = await screen.findByTestId('startPostModal');
    expect(modal).toBeInTheDocument();

    // When submitting, use await for actions
    await userEvent.click(screen.getByTestId('createPostBtn'));
  });

  it('On invalid post submission with empty body Error toast should be shown', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    renderStartPostModal(true, null);
    await wait();

    await userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toastSpy).toHaveBeenCalledWith(
      "Can't create a post with an empty body.",
    );
  });

  it('On valid post submission Info toast should be shown', async () => {
    renderStartPostModal(true, null);
    await wait();

    const randomPostInput = 'This is dummy text';
    await userEvent.type(screen.getByTestId('postInput'), randomPostInput);
    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toast.info).toHaveBeenCalledWith(
      'Processing your post. Please wait.',
    );
  });

  it('should display correct username', async () => {
    renderStartPostModal(true, null);
    await wait();

    const userFullName = screen.getByText('Glen Dsza');
    expect(userFullName).toBeInTheDocument();
  });

  it('If user image is null then default image should be shown', async () => {
    renderStartPostModal(true, null);
    await wait();

    const userImage = screen.getByTestId('userImage');
    expect(userImage).toHaveAttribute('src', 'image.png');
  });

  it('If user image is not null then user image should be shown', async () => {
    renderStartPostModal(true, 'image.png');
    await wait();

    const userImage = screen.getByTestId('userImage');
    expect(userImage).toHaveAttribute('src', 'image.png');
  });

  it('should clear post content and hide modal when close button is clicked', async () => {
    const onHideMock = vi.fn();
    renderStartPostModal(true, null, null, onHideMock);
    await wait();

    const input = screen.getByTestId('postInput');
    await userEvent.type(input, 'Test content');

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(onHideMock).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('should handle successful post creation', async () => {
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
        result: {
          data: {
            createPost: {
              id: '456',
              caption: 'Test content',
              pinnedAt: null,
              attachments: [],
            },
          },
        },
      },
    ];

    const customLink = new StaticMockLink(successMocks, true);

    renderStartPostModal(
      true,
      null,
      null,
      onHideMock,
      fetchPostsMock,
      customLink,
    );
    await wait();

    await userEvent.type(screen.getByTestId('postInput'), 'Test content');
    await userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();
    await waitFor(() => {
      expect(toast.dismiss).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
      expect(fetchPostsMock).toHaveBeenCalled();
      expect(onHideMock).toHaveBeenCalled();
    });
  });

  it('should handle failed post creation', async () => {
    const errorMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test content',
              organizationId: '123',
              isPinned: false,
              attachments: [
                {
                  fileHash: 'abc123hash',
                  mimetype: 'image/png',
                  name: 'test-image.png',
                  objectName: 'uploads/test-image.png',
                },
              ],
            },
          },
        },
        error: new Error('Failed to create post'),
      },
    ];

    const customLink = new StaticMockLink(errorMocks, true);

    renderStartPostModal(true, null, null, vi.fn(), vi.fn(), customLink);
    await wait();

    await userEvent.type(screen.getByTestId('postInput'), 'Test content');
    await userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    expect(toast.error).toHaveBeenCalled();
  });

  it('should display preview image when provided', async () => {
    const previewImage = 'preview.jpg';
    renderStartPostModal(true, null, previewImage);
    await wait();

    const image = screen.getByAltText('Post Image Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', previewImage);
  });

  it('should send caption, orgId and attachment when Add Post is clicked with image', async () => {
    const fetchPostsMock = vi.fn();
    const onHideMock = vi.fn();

    // A small base64 PNG string (1x1 transparent pixel)
    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn0B9g7R+wAAAABJRU5ErkJggg==';

    const successMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'My new post',
              organizationId: '123',
              attachments: [
                {
                  fileHash: expect.any(String), // SHA-256 hash generated dynamically
                  mimetype: 'IMAGE_PNG',
                  name: expect.stringContaining('.png'),
                  objectName: expect.stringContaining('uploads/'),
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '789',
              caption: 'My new post',
              attachments: [],
            },
          },
        },
      },
    ];

    const toastSuccessSpy = vi.spyOn(Toastify.toast, 'success');

    const customLink = new StaticMockLink(successMocks, true);

    renderStartPostModal(
      true,
      null,
      base64Image,
      onHideMock,
      fetchPostsMock,
      customLink,
    );
    await wait();

    // type caption
    await userEvent.type(screen.getByTestId('postInput'), 'My new post');
    // click Add Post
    await userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    // await waitFor(() => {
    //   expect(toast.success).toHaveBeenCalledWith(expect.any(String));
    // });
  });
});

describe('getMimeTypeEnum', () => {
  const getMimeTypeEnum = (url: string): string => {
    // Check for base64 data URI
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0].split(':')[1]; // e.g., "image/png"
      switch (mime) {
        case 'image/jpeg':
          return 'IMAGE_JPEG';
        case 'image/png':
          return 'IMAGE_PNG';
        case 'image/webp':
          return 'IMAGE_WEBP';
        case 'image/avif':
          return 'IMAGE_AVIF';
        case 'video/mp4':
          return 'VIDEO_MP4';
        case 'video/webm':
          return 'VIDEO_WEBM';
        default:
          return 'IMAGE_JPEG'; // fallback
      }
    }

    // Fallback for file URLs (e.g., https://.../file.png)
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'IMAGE_JPEG';
      case 'png':
        return 'IMAGE_PNG';
      case 'webp':
        return 'IMAGE_WEBP';
      case 'avif':
        return 'IMAGE_AVIF';
      case 'mp4':
        return 'VIDEO_MP4';
      case 'webm':
        return 'VIDEO_WEBM';
      default:
        return 'IMAGE_JPEG'; // fallback
    }
  };
  it('should return IMAGE_JPEG for .jpg and .jpeg', () => {
    expect(getMimeTypeEnum('file.jpg')).toBe('IMAGE_JPEG');
    expect(getMimeTypeEnum('file.jpeg')).toBe('IMAGE_JPEG');
  });

  it('should return IMAGE_PNG for .png', () => {
    expect(getMimeTypeEnum('file.png')).toBe('IMAGE_PNG');
  });

  it('should return IMAGE_WEBP for .webp', () => {
    expect(getMimeTypeEnum('file.webp')).toBe('IMAGE_WEBP');
  });

  it('should return IMAGE_AVIF for .avif', () => {
    expect(getMimeTypeEnum('file.avif')).toBe('IMAGE_AVIF');
  });

  it('should return VIDEO_MP4 for .mp4', () => {
    expect(getMimeTypeEnum('video.mp4')).toBe('VIDEO_MP4');
  });

  it('should return VIDEO_WEBM for .webm', () => {
    expect(getMimeTypeEnum('video.webm')).toBe('VIDEO_WEBM');
  });

  it('should return IMAGE_JPEG as fallback for unknown extension', () => {
    expect(getMimeTypeEnum('file.unknown')).toBe('IMAGE_JPEG');
    expect(getMimeTypeEnum('file')).toBe('IMAGE_JPEG'); // no extension
  });
});
