import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import StartPostModal from './StartPostModal';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';

// Mock modules
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock fetch for post creation
global.fetch = jest.fn();

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'mocked-preview-url');
const mockRevokeObjectURL = jest.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

const mockUserData: InterfaceQueryUserListItem = {
  user: {
    _id: '123',
    image: null,
    firstName: 'Glen',
    lastName: 'dsza',
    email: 'glen@dsza.com',
    createdAt: '2023-02-18T09:22:27.969Z',
    joinedOrganizations: [],
    registeredEvents: [],
    membershipRequests: [],
    organizationsBlockedBy: [],
  },
  appUserProfile: {
    _id: '123',
    isSuperAdmin: true,
    adminFor: [],
    createdOrganizations: [],
    createdEvents: [],
    eventAdmin: [],
  },
};

const mockProps = {
  show: true,
  onHide: jest.fn(),
  fetchPosts: jest.fn(),
  userData: mockUserData,
  organizationId: '123',
  img: null,
};

const renderStartPostModal = () => {
  return render(
    <MockedProvider addTypename={false}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <StartPostModal {...mockProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('StartPostModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
    // Reset createObjectURL mock
    mockCreateObjectURL.mockClear();
    // Reset revokeObjectURL mock
    mockRevokeObjectURL.mockClear();
  });

  // Test successful post creation
  it('should handle successful post creation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderStartPostModal();

    const postInput = screen.getByTestId('postInput');
    await userEvent.type(postInput, 'Test post content');

    const createPostBtn = screen.getByTestId('createPostBtn');
    await userEvent.click(createPostBtn);

    await waitFor(() => {
      expect(toast.dismiss).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Post now visible in feed');
      expect(mockProps.fetchPosts).toHaveBeenCalled();
      expect(mockProps.onHide).toHaveBeenCalled();
    });
  });

  // Test error handling in post creation
  it('should handle post creation error', async () => {
    const errorMessage = 'Failed to create post';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    renderStartPostModal();

    const postInput = screen.getByTestId('postInput');
    await userEvent.type(postInput, 'Test post content');

    const createPostBtn = screen.getByTestId('createPostBtn');
    await userEvent.click(createPostBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Test error handling with default error message
  it('should use default error message when no specific error is returned', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    renderStartPostModal();

    const postInput = screen.getByTestId('postInput');
    await userEvent.type(postInput, 'Test post content');

    const createPostBtn = screen.getByTestId('createPostBtn');
    await userEvent.click(createPostBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create the post.');
    });
  });

  // Rest of existing tests...
  it('should reset form state when modal is closed', () => {
    renderStartPostModal();

    const postInput = screen.getByTestId('postInput');
    fireEvent.change(postInput, {
      target: { name: 'postinfo', value: 'Test content' },
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockProps.onHide).toHaveBeenCalled();
    expect(postInput).toHaveValue('');
  });

  it('should display image preview when an image file is selected', async () => {
    renderStartPostModal();

    const fileInput = screen.getByTestId('modalFileInput') as HTMLInputElement;
    const imageFile = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, imageFile);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(imageFile);

    const previewImage = await screen.findByAltText('Post Image Preview');
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute('src', 'mocked-preview-url');
  });

  it('should display video preview when a video file is selected', async () => {
    renderStartPostModal();

    const fileInput = screen.getByTestId('modalFileInput') as HTMLInputElement;
    const videoFile = new File(['dummy content'], 'test-video.mp4', {
      type: 'video/mp4',
    });

    await userEvent.upload(fileInput, videoFile);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(videoFile);

    const previewVideo = await screen.findByTestId('videoPreview');
    expect(previewVideo).toBeInTheDocument();
    const source = previewVideo.querySelector('source');
    expect(source).toHaveAttribute('src', 'mocked-preview-url');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('should remove preview when the selected file is removed', async () => {
    renderStartPostModal();

    const fileInput = screen.getByTestId('modalFileInput') as HTMLInputElement;
    const imageFile = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, imageFile);

    const previewImage = await screen.findByAltText('Post Image Preview');
    expect(previewImage).toBeInTheDocument();

    await userEvent.upload(fileInput, []);

    await waitFor(() => {
      expect(
        screen.queryByAltText('Post Image Preview'),
      ).not.toBeInTheDocument();
    });

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mocked-preview-url');
  });

  const mockClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.getElementById = jest.fn().mockReturnValue({ click: mockClick });
  });

  it('should trigger file input click when Add Media button is clicked', () => {
    renderStartPostModal();

    const addMediaBtn = screen.getByRole('button', { name: /add media/i });
    fireEvent.click(addMediaBtn);

    expect(document.getElementById).toHaveBeenCalledWith('modalFileInput');
    expect(mockClick).toHaveBeenCalled();
  });

  it('should disable post button when post body is empty', () => {
    renderStartPostModal();

    const createPostBtn = screen.getByTestId('createPostBtn');
    expect(createPostBtn).toBeDisabled();

    const postInput = screen.getByTestId('postInput');

    fireEvent.change(postInput, {
      target: { name: 'postinfo', value: 'Test content' },
    });

    expect(createPostBtn).toBeEnabled();

    fireEvent.change(postInput, {
      target: { name: 'postinfo', value: '' },
    });

    expect(createPostBtn).toBeDisabled();
  });

  it('should consider whitespace-only content as empty', () => {
    renderStartPostModal();

    const postInput = screen.getByTestId('postInput');
    const createPostBtn = screen.getByTestId('createPostBtn');

    fireEvent.change(postInput, {
      target: { name: 'postinfo', value: '   ' },
    });

    expect(createPostBtn).toBeDisabled();
  });
  it('should correctly append file to FormData', async () => {
    // Mock API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Setup and render
    renderStartPostModal();

    // Select file
    const fileInput = screen.getByTestId('modalFileInput');
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    await userEvent.upload(fileInput, testFile);

    // Trigger post (which will create FormData and append file)
    const postInput = screen.getByTestId('postInput');
    await userEvent.type(postInput, 'test');
    await userEvent.click(screen.getByTestId('createPostBtn'));

    // Verify file was appended to FormData
    await waitFor(() => {
      const formData = (global.fetch as jest.Mock).mock.calls[0][1]
        .body as FormData;
      expect(formData.get('file')).toEqual(testFile);
    });
  });
});
