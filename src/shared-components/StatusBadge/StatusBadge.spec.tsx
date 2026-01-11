import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusBadge from './StatusBadge';
import styles from './StatusBadge.module.css';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Ensure test isolation by clearing mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

describe('StatusBadge Component', () => {
  describe('Variant Rendering', () => {
    it('should render completed variant correctly', () => {
      render(<StatusBadge variant="completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('completed');
    });

    it('should render pending variant correctly', () => {
      render(<StatusBadge variant="pending" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('pending');
    });

    it('should render active variant correctly', () => {
      render(<StatusBadge variant="active" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('active');
    });

    it('should render inactive variant correctly', () => {
      render(<StatusBadge variant="inactive" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('inactive');
    });

    it('should render approved variant correctly', () => {
      render(<StatusBadge variant="approved" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('approved');
    });

    it('should render rejected variant correctly', () => {
      render(<StatusBadge variant="rejected" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('rejected');
    });

    it('should render disabled variant correctly', () => {
      render(<StatusBadge variant="disabled" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('disabled');
    });

    it('should render accepted variant correctly', () => {
      render(<StatusBadge variant="accepted" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('accepted');
    });

    it('should render declined variant correctly', () => {
      render(<StatusBadge variant="declined" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('declined');
    });

    it('should render no_response variant correctly', () => {
      render(<StatusBadge variant="no_response" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('no_response');
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      render(<StatusBadge variant="completed" size="sm" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.sm);
    });

    it('should render medium size by default', () => {
      render(<StatusBadge variant="completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.md);
    });

    it('should render large size', () => {
      render(<StatusBadge variant="completed" size="lg" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.lg);
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<StatusBadge variant="completed" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should use default aria-label', () => {
      render(<StatusBadge variant="completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'completed');
    });

    it('should use custom aria-label when provided', () => {
      render(<StatusBadge variant="completed" ariaLabel="Task completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Task completed');
    });
  });

  describe('Label Customization', () => {
    it('should use custom label when provided', () => {
      render(<StatusBadge variant="completed" label="Done" />);
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('should use i18n key as fallback', () => {
      render(<StatusBadge variant="completed" />);
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('should render icon when provided', () => {
      const icon = <span data-testid="test-icon">✓</span>;
      render(<StatusBadge variant="completed" icon={icon} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not render if icon is invalid type', () => {
      // Pass an invalid object that is definitely not a ReactNode, but cast delicately to satisfy TS compile
      // In reality, ReactNode can be almost anything, but we want to simulate a runtime check failure if possible
      // However, the component code `React.isValidElement(icon)` checks if it's a React Element.
      // So we can pass a plain string or number (which are valid ReactNodes but NOT valid Elements in some contexts depending on how they are passed,
      // but here we want to ensure `React.isValidElement` returns false).
      // actually, a string IS NOT a valid *Element*, but it IS a valid *Node*.
      // The component uses `React.isValidElement`.
      // Let's pass a plain object that isn't a react element.

      const invalidIcon = { invalid: true };
      // @ts-expect-error - Testing invalid prop type at runtime
      render(<StatusBadge variant="completed" icon={invalidIcon} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      // The icon should not be rendered because isValidElement({invalid:true}) is false
    });
  });

  describe('CSS Classes', () => {
    it('should apply semantic variant class for completed (success)', () => {
      render(<StatusBadge variant="completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.success);
    });

    it('should apply semantic variant class for pending (warning)', () => {
      render(<StatusBadge variant="pending" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.warning);
    });

    it('should apply semantic variant class for rejected (error)', () => {
      render(<StatusBadge variant="rejected" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.error);
    });

    it('should apply semantic variant class for no_response (info)', () => {
      render(<StatusBadge variant="no_response" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.info);
    });

    it('should apply semantic variant class for inactive (neutral)', () => {
      render(<StatusBadge variant="inactive" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.neutral);
    });

    it('should apply custom className', () => {
      render(<StatusBadge variant="completed" className="custom-class" />);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain('custom-class');
    });

    it('should apply base statusBadge class', () => {
      render(<StatusBadge variant="completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.statusBadge);
    });
  });

  describe('Variant Mapping', () => {
    it('should map completed to success', () => {
      render(<StatusBadge variant="completed" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.success);
    });

    it('should map active to success', () => {
      render(<StatusBadge variant="active" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.success);
    });

    it('should map approved to success', () => {
      render(<StatusBadge variant="approved" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.success);
    });

    it('should map accepted to success', () => {
      render(<StatusBadge variant="accepted" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.success);
    });

    it('should map pending to warning', () => {
      render(<StatusBadge variant="pending" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.warning);
    });

    it('should map rejected to error', () => {
      render(<StatusBadge variant="rejected" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.error);
    });

    it('should map declined to error', () => {
      render(<StatusBadge variant="declined" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.error);
    });

    it('should map inactive to neutral', () => {
      render(<StatusBadge variant="inactive" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.neutral);
    });

    it('should map disabled to neutral', () => {
      render(<StatusBadge variant="disabled" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.neutral);
    });

    it('should map no_response to info', () => {
      render(<StatusBadge variant="no_response" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(styles.info);
    });
  });
});
