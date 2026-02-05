import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EmptyChatState from './EmptyChatState';
import styles from './EmptyChatState.module.css';

describe('EmptyChatState Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Container Structure', () => {
    it('renders outer container with expected flexbox classes', () => {
      render(<EmptyChatState message="Test message" />);

      const container = screen.getByTestId('noChatSelected').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('d-flex');
      expect(container).toHaveClass('flex-column');
      expect(container).toHaveClass('justify-content-center');
      expect(container).toHaveClass('align-items-center');
      expect(container).toHaveClass('w-100');
      expect(container).toHaveClass('h-100');
      expect(container).toHaveClass(styles.container);
    });
  });

  describe('Message Heading', () => {
    it('renders message heading with data-testid="noChatSelected"', () => {
      const testMessage = 'Select a contact to start chatting';
      render(<EmptyChatState message={testMessage} />);

      const messageElement = screen.getByTestId('noChatSelected');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toHaveTextContent(testMessage);
      expect(messageElement.tagName).toBe('H6');
      expect(messageElement).toHaveClass(styles.message);
    });

    it('renders the passed message prop correctly', () => {
      const customMessage = 'Custom empty state message';
      render(<EmptyChatState message={customMessage} />);

      expect(screen.getByTestId('noChatSelected')).toHaveTextContent(
        customMessage,
      );
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty string message', () => {
      render(<EmptyChatState message="" />);

      const messageElement = screen.getByTestId('noChatSelected');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toHaveTextContent('');
    });

    it('renders with long message string', () => {
      const longMessage =
        'This is a very long message that might wrap across multiple lines in the UI to test how the component handles lengthy text content properly';
      render(<EmptyChatState message={longMessage} />);

      expect(screen.getByTestId('noChatSelected')).toHaveTextContent(
        longMessage,
      );
    });

    it('renders with special characters in message', () => {
      const specialMessage = '<script>alert("XSS")</script> & "quotes" © ™';
      render(<EmptyChatState message={specialMessage} />);

      expect(screen.getByTestId('noChatSelected')).toHaveTextContent(
        specialMessage,
      );
    });

    it('renders with unicode characters', () => {
      const unicodeMessage = 'Welcome! 你好 مرحبا';
      render(<EmptyChatState message={unicodeMessage} />);

      expect(screen.getByTestId('noChatSelected')).toHaveTextContent(
        unicodeMessage,
      );
    });

    it('renders with numeric message converted to string', () => {
      const numericMessage = '12345';
      render(<EmptyChatState message={numericMessage} />);

      expect(screen.getByTestId('noChatSelected')).toHaveTextContent('12345');
    });
  });
});
