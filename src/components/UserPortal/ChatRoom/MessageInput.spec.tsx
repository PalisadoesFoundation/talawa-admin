import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import MessageInput from './MessageInput';
import type { INewChat } from './types';

const mockReplyMessage = {
  id: 'msg123',
  body: 'Test reply message',
  creator: {
    id: 'user123',
    name: 'John Doe',
    avatarURL: 'https://example.com/avatar.jpg',
  },
} as INewChat['messages']['edges'][0]['node'];

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
  fileInputRef: { current: null },
};

const renderMessageInput = (props = {}) => {
  return render(
    <I18nextProvider i18n={i18nForTest}>
      <MessageInput {...defaultProps} {...props} />
    </I18nextProvider>,
  );
};

describe('MessageInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the message input field', () => {
    renderMessageInput();
    expect(screen.getByTestId('messageInput')).toBeInTheDocument();
  });

  it('renders the send button', () => {
    renderMessageInput();
    expect(screen.getByTestId('sendMessage')).toBeInTheDocument();
  });

  it('calls onSendMessage when send button is clicked', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();
    renderMessageInput({ onSendMessage });

    await user.click(screen.getByTestId('sendMessage'));
    expect(onSendMessage).toHaveBeenCalledTimes(1);
  });

  it('calls onSendMessage when Enter key is pressed', () => {
    const onSendMessage = vi.fn();
    renderMessageInput({ onSendMessage });

    const input = screen.getByTestId('messageInput');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
    expect(onSendMessage).toHaveBeenCalledTimes(1);
  });

  it('does not call onSendMessage when Shift+Enter is pressed', () => {
    const onSendMessage = vi.fn();
    renderMessageInput({ onSendMessage });

    const input = screen.getByTestId('messageInput');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('calls onAddAttachment when attachment button is clicked', async () => {
    const user = userEvent.setup();
    const onAddAttachment = vi.fn();
    renderMessageInput({ onAddAttachment });

    const attachButton = screen.getByLabelText('Add attachment');
    await user.click(attachButton);
    expect(onAddAttachment).toHaveBeenCalledTimes(1);
  });

  it('renders the attachment preview when attachment is provided', () => {
    const attachment = 'https://example.com/image.jpg';
    renderMessageInput({ attachment });

    expect(screen.getByAltText('Attachment')).toBeInTheDocument();
    expect(screen.getByTestId('removeAttachment')).toBeInTheDocument();
  });

  it('calls onRemoveAttachment when remove attachment button is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveAttachment = vi.fn();
    const attachment = 'https://example.com/image.jpg';
    renderMessageInput({ attachment, onRemoveAttachment });

    await user.click(screen.getByTestId('removeAttachment'));
    expect(onRemoveAttachment).toHaveBeenCalledTimes(1);
  });

  it('does not render reply section when replyToDirectMessage is null', () => {
    renderMessageInput({ replyToDirectMessage: null });
    expect(screen.queryByTestId('replyMsg')).not.toBeInTheDocument();
  });

  it('renders reply section when replyToDirectMessage is provided', () => {
    renderMessageInput({ replyToDirectMessage: mockReplyMessage });

    expect(screen.getByTestId('replyMsg')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test reply message')).toBeInTheDocument();
  });

  it('calls onCloseReply when close reply button is clicked', async () => {
    const user = userEvent.setup();
    const onCloseReply = vi.fn();
    renderMessageInput({
      replyToDirectMessage: mockReplyMessage,
      onCloseReply,
    });

    await user.click(screen.getByTestId('closeReply'));
    expect(onCloseReply).toHaveBeenCalledTimes(1);
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder text';
    renderMessageInput({ sendMessagePlaceholder: customPlaceholder });

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('displays the message value in the input', () => {
    renderMessageInput({ newMessage: 'Hello world' });

    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument();
  });
});
