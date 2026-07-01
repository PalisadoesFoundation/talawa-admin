import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

interface InterfaceFormTextFieldMockProps {
  value: string;
  onChange: (value: string) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

vi.mock('shared-components/FormFieldGroup/FormTextField', () => ({
  FormTextField: ({
    value,
    onChange,
    startAdornment,
    endAdornment,
    onKeyDown,
    ...props
  }: InterfaceFormTextFieldMockProps) => (
    <div>
      {startAdornment}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        {...props}
      />
      {endAdornment}
    </div>
  ),
}));

vi.mock('shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay', () => ({
  ProfileAvatarDisplay: ({
    imageUrl,
    fallbackName,
  }: {
    imageUrl?: string;
    fallbackName: string;
  }) => (
    <div data-testid="mock-profile-avatar-display">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={fallbackName}
          data-testid="mock-profile-image"
        />
      ) : (
        <div data-testid="mock-profile-fallback">{fallbackName}</div>
      )}
    </div>
  ),
}));

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<
    typeof import('react-i18next')
  >('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

import MessageInput from './MessageInput';

const createMockReplyMessage = () => ({
  id: 'reply123',
  body: 'Original message',
  createdAt: '2024-01-01T00:00:00Z',
  creator: {
    __typename: 'User' as const,
    id: 'user456',
    name: 'Jane Doe',
    avatarMimeType: 'image/jpeg',
    avatarURL: 'https://example.com/avatar.jpg',
  },
  updatedAt: '2024-01-01T00:00:00Z',
  parentMessage: null,
});

const defaultProps = {
  newMessage: '',
  replyToDirectMessage: null,
  attachment: null,
  onNewMessageChange: vi.fn(),
  onSendMessage: vi.fn(),
  onAddAttachment: vi.fn(),
  onFileChange: vi.fn(),
  onRemoveAttachment: vi.fn(),
  onCloseReply: vi.fn(),
  sendMessagePlaceholder: 'Type a message...',
  fileInputRef: React.createRef<HTMLInputElement>(),
};

const renderMessageInput = (props = {}) => {
  const allProps = { ...defaultProps, ...props };
  return render(
    <I18nextProvider i18n={i18nForTest}>
      <MessageInput {...allProps} />
    </I18nextProvider>,
  );
};

describe('MessageInput Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders input field and send button', () => {
      renderMessageInput();
      expect(screen.getByTestId('messageInput')).toBeInTheDocument();
      expect(screen.getByTestId('sendMessage')).toBeInTheDocument();
    });

    it('renders with placeholder text', () => {
      renderMessageInput({ sendMessagePlaceholder: 'Test placeholder' });
      const input = screen.getByTestId('messageInput');
      expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    });

    it('renders hidden file input', () => {
      renderMessageInput();
      const fileInput = screen.getByTestId('hidden-file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('does not render reply preview when replyToDirectMessage is null', () => {
      renderMessageInput();
      expect(screen.queryByTestId('replyMsg')).not.toBeInTheDocument();
    });

    it('does not render attachment preview when attachment is null', () => {
      renderMessageInput();
      expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
    });
  });

  describe('Message input and sending', () => {
    it('calls onNewMessageChange when typing', () => {
      const onNewMessageChange = vi.fn();
      renderMessageInput({ onNewMessageChange });

      const input = screen.getByTestId('messageInput');
      fireEvent.change(input, { target: { value: 'Test message' } });

      expect(onNewMessageChange).toHaveBeenCalledTimes(1);
      expect(onNewMessageChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'Test message' }),
        }),
      );
    });

    it('calls onSendMessage when send button clicked', async () => {
      const user = userEvent.setup();
      const onSendMessage = vi.fn();
      renderMessageInput({ onSendMessage });

      await user.click(screen.getByTestId('sendMessage'));

      expect(onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('calls onSendMessage when Enter key pressed', () => {
      const onSendMessage = vi.fn();
      renderMessageInput({ onSendMessage });

      const input = screen.getByTestId('messageInput');
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

      expect(onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('does not call onSendMessage on Shift+Enter', () => {
      const onSendMessage = vi.fn();
      renderMessageInput({ onSendMessage });

      const input = screen.getByTestId('messageInput');
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

      expect(onSendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Attachment handling', () => {
    it('calls onAddAttachment when attachment button clicked', async () => {
      const user = userEvent.setup();
      const onAddAttachment = vi.fn();
      renderMessageInput({ onAddAttachment });

      const addBtn = screen.getByLabelText('addAttachment');
      await user.click(addBtn);

      expect(onAddAttachment).toHaveBeenCalledTimes(1);
    });

    it('calls onFileChange when file selected', async () => {
      const user = userEvent.setup();
      const onFileChange = vi.fn();
      renderMessageInput({ onFileChange });

      const fileInput = screen.getByTestId('hidden-file-input');
      const file = new File(['content'], 'image.png', { type: 'image/png' });
      await user.upload(fileInput, file);

      expect(onFileChange).toHaveBeenCalledTimes(1);
    });

    it('shows attachment preview when attachment prop provided', () => {
      renderMessageInput({ attachment: 'data:image/png;base64,abc123' });

      expect(screen.getByAltText('attachment')).toBeInTheDocument();
    });

    it('calls onRemoveAttachment when remove attachment clicked', async () => {
      const user = userEvent.setup();
      const onRemoveAttachment = vi.fn();
      renderMessageInput({
        attachment: 'data:image/png;base64,abc123',
        onRemoveAttachment,
      });

      await user.click(screen.getByTestId('removeAttachment'));

      expect(onRemoveAttachment).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reply preview', () => {
    it('shows reply preview when replyToDirectMessage provided', () => {
      const replyToDirectMessage = createMockReplyMessage();
      renderMessageInput({ replyToDirectMessage });

      expect(screen.getByTestId('replyMsg')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Original message')).toBeInTheDocument();
    });

    it('renders profile avatar in reply preview', () => {
      const replyToDirectMessage = createMockReplyMessage();
      renderMessageInput({ replyToDirectMessage });

      expect(screen.getByTestId('mock-profile-avatar-display')).toBeInTheDocument();
      expect(screen.getByTestId('mock-profile-image')).toBeInTheDocument();
    });

    it('calls onCloseReply when close reply button clicked', async () => {
      const user = userEvent.setup();
      const onCloseReply = vi.fn();
      const replyToDirectMessage = createMockReplyMessage();
      renderMessageInput({ replyToDirectMessage, onCloseReply });

      await user.click(screen.getByTestId('closeReply'));

      expect(onCloseReply).toHaveBeenCalledTimes(1);
    });

    it('renders reply message body text', () => {
      const replyToDirectMessage = createMockReplyMessage();
      renderMessageInput({ replyToDirectMessage });

      expect(screen.getByText('Original message')).toBeInTheDocument();
    });
  });
});
