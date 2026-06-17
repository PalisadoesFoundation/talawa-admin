import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import dayjs from 'dayjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import MessageInput from './MessageInput';
import type { INewChat } from './types';

type ReplyMessage = INewChat['messages']['edges'][0]['node'];

const replyMessage: ReplyMessage = {
  id: 'msg-1',
  body: 'Original message body',
  createdAt: dayjs().toISOString(),
  updatedAt: dayjs().toISOString(),
  creator: {
    id: 'user-1',
    name: 'Jane Doe',
    avatarURL: 'https://example.com/avatar.png',
  },
};

interface IRenderOptions {
  newMessage?: string;
  replyToDirectMessage?: ReplyMessage | null;
  attachment?: string | null;
  sendMessagePlaceholder?: string;
}

const makeProps = (overrides: IRenderOptions = {}) => {
  const handlers = {
    onNewMessageChange: vi.fn(),
    onSendMessage: vi.fn(),
    onAddAttachment: vi.fn(),
    onFileChange: vi.fn(),
    onRemoveAttachment: vi.fn(),
    onCloseReply: vi.fn(),
  };

  const props = {
    newMessage: overrides.newMessage ?? '',
    replyToDirectMessage:
      overrides.replyToDirectMessage === undefined
        ? null
        : overrides.replyToDirectMessage,
    attachment:
      overrides.attachment === undefined ? null : overrides.attachment,
    sendMessagePlaceholder:
      overrides.sendMessagePlaceholder ?? 'Type a message...',
    fileInputRef: createRef<HTMLInputElement>(),
    ...handlers,
  };

  return { props, handlers };
};

const renderComponent = (overrides: IRenderOptions = {}) => {
  const { props, handlers } = makeProps(overrides);
  const result = render(
    <I18nextProvider i18n={i18nForTest}>
      <MessageInput {...props} />
    </I18nextProvider>,
  );
  return { ...result, props, handlers };
};

describe('MessageInput Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the message input wrapper and field', () => {
      renderComponent();

      expect(document.getElementById('messageInput')).toBeInTheDocument();
      expect(screen.getByTestId('messageInput')).toBeInTheDocument();
    });

    it('renders the hidden file input with image accept and attached ref', () => {
      const { props } = renderComponent();

      const fileInput = screen.getByTestId('hidden-file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
      expect(props.fileInputRef.current).toBe(fileInput);
    });

    it('renders attachment and send buttons', () => {
      renderComponent();

      expect(screen.getByTestId('sendMessage')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('uses the placeholder passed via props', () => {
      renderComponent({ sendMessagePlaceholder: 'Say something' });

      expect(screen.getByPlaceholderText('Say something')).toBeInTheDocument();
    });

    it('reflects the newMessage value in the input', () => {
      renderComponent({ newMessage: 'Hello world' });

      expect(screen.getByTestId('messageInput')).toHaveValue('Hello world');
    });

    it('does not render reply preview or attachment by default', () => {
      renderComponent();

      expect(screen.queryByTestId('replyMsg')).not.toBeInTheDocument();
      expect(screen.queryByTestId('removeAttachment')).not.toBeInTheDocument();
    });
  });

  describe('Typing / onNewMessageChange', () => {
    it('calls onNewMessageChange with a synthetic event when typing', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      await user.type(screen.getByTestId('messageInput'), 'a');

      expect(handlers.onNewMessageChange).toHaveBeenCalledTimes(1);
      expect(handlers.onNewMessageChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: { value: 'a' } }),
      );
    });
  });

  describe('Send behaviour', () => {
    it('calls onSendMessage when the send button is clicked', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      await user.click(screen.getByTestId('sendMessage'));

      expect(handlers.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('calls onSendMessage when Enter is pressed without shift', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      await user.click(screen.getByTestId('messageInput'));
      await user.keyboard('{Enter}');

      expect(handlers.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('does not send when Enter is pressed with shift held', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      await user.click(screen.getByTestId('messageInput'));
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(handlers.onSendMessage).not.toHaveBeenCalled();
    });

    it('does not send for non-Enter keys', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      await user.click(screen.getByTestId('messageInput'));
      await user.keyboard('a');

      expect(handlers.onSendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Attachment handling', () => {
    it('calls onAddAttachment when the attachment button is clicked', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      await user.click(screen.getByRole('button', { name: /add/i }));

      expect(handlers.onAddAttachment).toHaveBeenCalledTimes(1);
    });

    it('calls onFileChange when a file is selected', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent();

      const file = new File(['hello'], 'photo.png', { type: 'image/png' });
      await user.upload(screen.getByTestId('hidden-file-input'), file);

      expect(handlers.onFileChange).toHaveBeenCalledTimes(1);
    });

    it('renders an attachment preview when attachment is provided', () => {
      renderComponent({ attachment: 'data:image/png;base64,abc' });

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'data:image/png;base64,abc');
      expect(screen.getByTestId('removeAttachment')).toBeInTheDocument();
    });

    it('calls onRemoveAttachment when the remove button is clicked', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent({
        attachment: 'data:image/png;base64,abc',
      });

      await user.click(screen.getByTestId('removeAttachment'));

      expect(handlers.onRemoveAttachment).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reply preview', () => {
    it('renders the reply preview with creator name and body', () => {
      renderComponent({ replyToDirectMessage: replyMessage });

      const replyPreview = screen.getByTestId('replyMsg');
      expect(replyPreview).toBeInTheDocument();
      expect(replyPreview).toHaveTextContent('Jane Doe');
      expect(replyPreview).toHaveTextContent('Original message body');
    });

    it('calls onCloseReply when the close reply button is clicked', async () => {
      const user = userEvent.setup();
      const { handlers } = renderComponent({
        replyToDirectMessage: replyMessage,
      });

      await user.click(screen.getByTestId('closeReply'));

      expect(handlers.onCloseReply).toHaveBeenCalledTimes(1);
    });

    it('does not render the reply preview when the reply id is missing', () => {
      const replyWithoutId = {
        ...replyMessage,
        id: '',
      } as ReplyMessage;

      renderComponent({ replyToDirectMessage: replyWithoutId });

      expect(screen.queryByTestId('replyMsg')).not.toBeInTheDocument();
    });
  });
});
