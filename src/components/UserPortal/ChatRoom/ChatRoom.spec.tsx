import React from 'react';

import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MockedProvider, MockSubscriptionLink } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

import ChatRoom, { MessageImage } from './ChatRoom';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';
import { CHAT_BY_ID } from 'GraphQl/Queries/PlugInQueries';
import {
  CHAT_BY_ID_QUERY_MOCK,
  CHATS_LIST_MOCK,
  GROUP_CHAT_BY_ID_QUERY_MOCK,
  GROUP_CHAT_LIST_QUERY_MOCK,
  MARK_CHAT_MESSAGES_AS_READ_MOCK,
  MESSAGE_SENT_TO_CHAT_MOCK,
  SEND_MESSAGE_TO_CHAT_MOCK,
  UNREAD_CHAT_LIST_QUERY_MOCK,
} from './mocks';

import * as fileValidation from 'utils/fileValidation';
import * as minioUpload from 'utils/MinioUpload';
import * as minioDownload from 'utils/MinioDownload';

// Mock modules with simple functions, not referencing external variables
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: vi.fn(),
  }),
}));

vi.mock('utils/MinioDownload', () => ({
  useMinioDownload: () => ({
    getFileFromMinio: vi.fn(),
  }),
}));

vi.mock('utils/fileValidation', () => ({
  validateFile: vi.fn(),
}));

/**
 * Unit tests for the ChatRoom component
 *
 * Tests cover component rendering, message functionality (sending/replying),
 * user interactions, GraphQL integration, and provider integrations
 * (Router, Redux, i18n) for both direct and group chats.
 */

const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Chatroom Component [User Portal]', () => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('Chat room should display fallback content if no chat is active', async () => {
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(await screen.findByTestId('noChatSelected')).toBeInTheDocument();
  });

  it('Selected contact is direct chat', async () => {
    const link = new MockSubscriptionLink();
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('send message direct chat', async () => {
    setItem('userId', '2');
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ];
    const link2 = new StaticMockLink(mocks, true);
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const input = (await screen.findByTestId(
      'messageInput',
    )) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'Hello' } });
    });
    expect(input.value).toBe('Hello');

    const sendBtn = await screen.findByTestId('sendMessage');

    expect(sendBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(sendBtn);
    });

    const messages = await screen.findAllByTestId('message');

    console.log('MESSAGES', messages);

    expect(messages.length).not.toBe(0);

    act(() => {
      fireEvent.mouseOver(messages[0]);
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('moreOptions')).toBeInTheDocument();
    });

    const moreOptionsBtn = await screen.findByTestId('dropdown');
    act(() => {
      fireEvent.click(moreOptionsBtn);
    });

    const replyBtn = await screen.findByTestId('replyBtn');

    act(() => {
      fireEvent.click(replyBtn);
    });

    const replyMsg = await screen.findByTestId('replyMsg');

    await waitFor(() => {
      expect(replyMsg).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'Test reply message' } });
    });
    expect(input.value).toBe('Test reply message');

    act(() => {
      fireEvent.click(sendBtn);
    });

    await wait(400);
  });

  it('send message direct chat when userId is different', async () => {
    setItem('userId', '8');
    const mocks = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ];
    const link2 = new StaticMockLink(mocks, true);
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const input = (await screen.findByTestId(
      'messageInput',
    )) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'Hello' } });
    });
    expect(input.value).toBe('Hello');

    const sendBtn = await screen.findByTestId('sendMessage');

    expect(sendBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(sendBtn);
    });

    const messages = await screen.findAllByTestId('message');

    console.log('MESSAGES', messages);

    expect(messages.length).not.toBe(0);

    act(() => {
      fireEvent.mouseOver(messages[0]);
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('moreOptions')).toBeInTheDocument();
    });

    const moreOptionsBtn = await screen.findByTestId('dropdown');
    act(() => {
      fireEvent.click(moreOptionsBtn);
    });

    const replyBtn = await screen.findByTestId('replyBtn');

    act(() => {
      fireEvent.click(replyBtn);
    });

    const replyMsg = await screen.findByTestId('replyMsg');

    await waitFor(() => {
      expect(replyMsg).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'Test reply message' } });
    });
    expect(input.value).toBe('Test reply message');

    act(() => {
      fireEvent.click(sendBtn);
    });

    await wait(400);
  });

  it('Selected contact is group chat', async () => {
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('send message group chat', async () => {
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const input = (await screen.findByTestId(
      'messageInput',
    )) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'Test message' } });
    });
    expect(input.value).toBe('Test message');

    const sendBtn = await screen.findByTestId('sendMessage');

    expect(sendBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(sendBtn);
    });

    const messages = await screen.findAllByTestId('message');

    expect(messages.length).not.toBe(0);

    act(() => {
      fireEvent.mouseOver(messages[0]);
    });
    await wait();
    expect(await screen.findByTestId('moreOptions')).toBeInTheDocument();

    const moreOptionsBtn = await screen.findByTestId('dropdown');
    act(() => {
      fireEvent.click(moreOptionsBtn);
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'Test reply message' } });
    });
    expect(input.value).toBe('Test reply message');

    act(() => {
      fireEvent.click(sendBtn);
    });

    await wait(500);
  });

  it('should set chat title and subtitle for direct chat', async () => {
    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ];
    const mockRefetch = vi.fn();

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={mockRefetch} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/@/)).toBeInTheDocument(); // subtitle is user email
    });
  });
});

describe('MessageImage Component', () => {
  const mockGetFileFromMinio = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders base64 image directly', () => {
    render(
      <MessageImage
        media="data:image/png;base64,abc123"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );
    const img = screen.getByAltText('attachment') as HTMLImageElement;
    expect(img.src).toContain('data:image/png;base64,abc123');
  });

  it('renders loading placeholder while image is loading', async () => {
    // Create a promise that never resolves to simulate loading state
    const neverResolvingPromise = new Promise<string>(() => {});
    mockGetFileFromMinio.mockReturnValueOnce(neverResolvingPromise);

    render(
      <MessageImage
        media="minio-image-name.png"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );

    expect(await screen.findByText('Loading image...')).toBeInTheDocument();
  });

  it('renders MinIO image after successful fetch', async () => {
    mockGetFileFromMinio.mockResolvedValueOnce('https://example.com/image.png');

    render(
      <MessageImage
        media="minio-image-name.png"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );

    const img = await screen.findByAltText('attachment');
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('renders fallback if image fetching fails', async () => {
    mockGetFileFromMinio.mockRejectedValueOnce(new Error('Failed'));

    render(
      <MessageImage
        media="minio-fail.png"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );

    expect(await screen.findByText('Image not available')).toBeInTheDocument();
  });

  it('renders fallback if media is empty', async () => {
    render(<MessageImage media={''} getFileFromMinio={mockGetFileFromMinio} />);

    expect(await screen.findByText('Image not available')).toBeInTheDocument();
  });
});

describe('handleImageChange', () => {
  const createFile = (type = 'image/png', name = 'test.png') =>
    new File(['dummy content'], name, { type });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing if no file is selected', async () => {
    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [] } });
    });

    // No error should be shown, and no image uploaded
    expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
  });

  it('should show validation error for invalid file', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: false,
      errorMessage: 'Invalid file type',
    });

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = createFile('text/plain', 'test.txt');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(fileValidation.validateFile).toHaveBeenCalled();
    expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
  });

  it('should upload and display attachment for valid image', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: true,
      errorMessage: '',
    });

    vi.spyOn(minioUpload, 'useMinioUpload').mockImplementation(() => ({
      uploadFileToMinio: vi
        .fn()
        .mockResolvedValue({ objectName: 'mock-object-name' }),
    }));

    vi.spyOn(minioDownload, 'useMinioDownload').mockImplementation(() => ({
      getFileFromMinio: vi
        .fn()
        .mockResolvedValue('https://example.com/test-image.jpg'),
    }));

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = createFile('image/png', 'valid-image.png');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(await screen.findByAltText('attachment')).toBeInTheDocument();
  });

  it('should handle error during upload and show toast', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: true,
      errorMessage: '',
    });

    vi.spyOn(minioUpload, 'useMinioUpload').mockImplementation(() => ({
      uploadFileToMinio: vi.fn().mockRejectedValue(new Error('Upload failed')),
    }));

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = createFile('image/png', 'error-image.png');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    // Since upload failed, attachment should NOT appear
    expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
  });
});
