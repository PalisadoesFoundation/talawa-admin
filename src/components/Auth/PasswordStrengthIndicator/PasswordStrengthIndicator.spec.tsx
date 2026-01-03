import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach, vi } from 'vitest';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        requirement_min_length: 'At least 8 characters',
        requirement_lowercase: 'Contains lowercase',
        requirement_uppercase: 'Contains uppercase',
        requirement_number: 'Contains a number',
        requirement_special_char: 'Contains a special character',
      };
      return translations[key] || key;
    },
  }),
}));

import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

describe('PasswordStrengthIndicator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders all 5 requirement indicators', () => {
      render(<PasswordStrengthIndicator password="" />);

      expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Contains lowercase/i)).toBeInTheDocument();
      expect(screen.getByText(/Contains uppercase/i)).toBeInTheDocument();
      expect(screen.getByText(/Contains a number/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Contains a special character/i),
      ).toBeInTheDocument();
    });

    test('returns null when isVisible is false', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="" isVisible={false} />,
      );

      expect(container.firstChild).toBeNull();
    });

    test('renders with default visibility (true)', () => {
      render(<PasswordStrengthIndicator password="" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Requirement States - All Unsatisfied', () => {
    test('shows all unsatisfied with empty password', () => {
      const { container } = render(<PasswordStrengthIndicator password="" />);

      const dangerElements = container.querySelectorAll('.text-danger');
      expect(dangerElements).toHaveLength(5);

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(0);
    });

    test('shows all unsatisfied with short password', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="abc" />,
      );

      const dangerElements = container.querySelectorAll('.text-danger');
      expect(dangerElements).toHaveLength(4); // missing length, uppercase, number, special

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(1); // has lowercase
    });
  });

  describe('Requirement States - Partial Satisfaction', () => {
    test('satisfies minimum length only', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="abcdefgh" />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(2); // length + lowercase

      expect(screen.getByText(/At least 8 characters/i).className).toContain(
        'text-success',
      );
      expect(screen.getByText(/Contains lowercase/i).className).toContain(
        'text-success',
      );
    });

    test('satisfies length, lowercase, and uppercase', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="abcdEFGH" />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(3);

      expect(screen.getByText(/At least 8 characters/i).className).toContain(
        'text-success',
      );
      expect(screen.getByText(/Contains lowercase/i).className).toContain(
        'text-success',
      );
      expect(screen.getByText(/Contains uppercase/i).className).toContain(
        'text-success',
      );
    });

    test('satisfies all except special character', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="Password123" />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(4);

      const dangerElements = container.querySelectorAll('.text-danger');
      expect(dangerElements).toHaveLength(1);

      expect(
        screen.getByText(/Contains a special character/i).className,
      ).toContain('text-danger');
    });

    test('satisfies mixed requirements', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="abc123" />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(2); // lowercase + numeric

      expect(screen.getByText(/Contains lowercase/i).className).toContain(
        'text-success',
      );
      expect(screen.getByText(/Contains a number/i).className).toContain(
        'text-success',
      );
    });
  });

  describe('Requirement States - All Satisfied', () => {
    test('shows all satisfied with valid password', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="Password123!" />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(5);

      const dangerElements = container.querySelectorAll('.text-danger');
      expect(dangerElements).toHaveLength(0);
    });

    test('shows all satisfied with complex password', () => {
      const { container } = render(
        <PasswordStrengthIndicator
          password={`MyP@ssw0rd#${dayjs.utc().year()}`}
        />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(5);
    });
  });

  describe('Edge Cases', () => {
    test('handles password with only spaces', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="        " />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(1); // only length requirement met

      expect(screen.getByText(/At least 8 characters/i).className).toContain(
        'text-success',
      );
    });

    test('handles password with special characters only', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="!@#$%^&*()" />,
      );

      const successElements = container.querySelectorAll('.text-success');
      expect(successElements).toHaveLength(2); // length + special

      expect(
        screen.getByText(/Contains a special character/i).className,
      ).toContain('text-success');
    });

    test('handles exactly 8 characters', () => {
      render(<PasswordStrengthIndicator password="Pass123!" />);

      expect(screen.getByText(/At least 8 characters/i).className).toContain(
        'text-success',
      );
    });

    test('handles 7 characters (below minimum)', () => {
      render(<PasswordStrengthIndicator password="Pass12!" />);

      expect(screen.getByText(/At least 8 characters/i).className).toContain(
        'text-danger',
      );
    });
  });

  describe('Accessibility', () => {
    test('has role="status" attribute', () => {
      render(<PasswordStrengthIndicator password="" />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeInTheDocument();
    });

    test('has aria-live="polite" attribute', () => {
      render(<PasswordStrengthIndicator password="" />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    test('visual indicators have aria-hidden attribute', () => {
      const { container } = render(<PasswordStrengthIndicator password="" />);

      const ariaHiddenElements =
        container.querySelectorAll('span[aria-hidden]');
      expect(ariaHiddenElements.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Indicators', () => {
    test('displays checkmark for satisfied requirements', () => {
      render(<PasswordStrengthIndicator password="abcdefgh" />);

      const element = screen.getByText(/At least 8 characters/i)
        .parentElement as HTMLElement;
      expect(element.textContent).toContain('✔︎');
    });

    test('displays X mark for unsatisfied requirements', () => {
      render(<PasswordStrengthIndicator password="" />);

      const element = screen.getByText(/At least 8 characters/i)
        .parentElement as HTMLElement;
      expect(element.textContent).toContain('✖︎');
    });
  });
});
