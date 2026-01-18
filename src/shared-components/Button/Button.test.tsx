import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? _key,
  }),
}));

describe('Button', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it.each([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'dark',
    'light',
    'outline-primary',
    'outline-secondary',
    'outlined',
    'outline',
    'link',
  ])('renders with variant %s', (variant) => {
    render(<Button variant={variant}>Variant</Button>);
    const button = screen.getByRole('button', { name: 'Variant' });
    const expectedClass =
      variant === 'outlined' || variant === 'outline'
        ? 'btn-outline-primary'
        : `btn-${variant}`;
    expect(button).toHaveClass(expectedClass);
  });

  it('renders all size options', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    const small = screen.getByRole('button', { name: 'Small' });
    expect(small).toHaveClass('btn-sm');

    rerender(<Button size="md">Medium</Button>);
    const medium = screen.getByRole('button', { name: 'Medium' });
    expect(medium).not.toHaveClass('btn-sm');
    expect(medium).not.toHaveClass('btn-lg');

    rerender(<Button size="lg">Large</Button>);
    const large = screen.getByRole('button', { name: 'Large' });
    expect(large).toHaveClass('btn-lg');

    rerender(<Button size="xl">XL</Button>);
    const xl = screen.getByRole('button', { name: 'XL' });
    expect(xl).toHaveClass('btn-lg');
    expect(xl).toHaveAttribute('data-size', 'xl');
  });

  it('handles fullWidth and custom className', () => {
    render(
      <Button fullWidth className="custom-class">
        Wide
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Wide' });
    expect(button).toHaveAttribute('data-fullwidth', 'true');
    expect(button).toHaveClass('custom-class');
  });

  it('calls onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled prop', () => {
    render(
      <Button disabled aria-label="disabled-btn">
        Disabled
      </Button>,
    );
    const button = screen.getByLabelText('disabled-btn');
    expect(button).toBeDisabled();
  });

  it('forwards arbitrary props', () => {
    render(
      <Button href="https://example.com" target="_blank">
        Docs
      </Button>,
    );
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders icons in the correct position', () => {
    const icon = <span data-testid="icon">★</span>;
    const { rerender } = render(<Button icon={icon}>Star</Button>);

    let button = screen.getByRole('button', { name: /Star/ });
    let icons = button.querySelectorAll('[data-testid="icon"]');
    expect(icons).toHaveLength(1);
    expect(icons[0].previousSibling).toBeNull(); // start icon appears first

    rerender(
      <Button icon={icon} iconPosition="end">
        Star
      </Button>,
    );

    button = screen.getByRole('button', { name: /Star/ });
    icons = button.querySelectorAll('[data-testid="icon"]');
    expect(icons).toHaveLength(1);
    expect(icons[0].nextSibling).toBeNull(); // end icon appears last
  });

  it('shows loading state with spinner and loading text', () => {
    render(
      <Button isLoading loadingText="Loading...">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Loading...' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });

  it('shows loading state and falls back to children when loadingText is absent', () => {
    render(<Button isLoading>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });

  it('integrates with form submit', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) =>
      e.preventDefault(),
    );
    render(
      <form onSubmit={onSubmit} data-testid="form">
        <Button type="submit">Submit</Button>
      </form>,
    );
    fireEvent.submit(screen.getByTestId('form'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('can render inside a modal wrapper', () => {
    render(
      <BaseModal
        show
        onHide={() => undefined}
        title="Test Modal"
        footer={<Button data-testid="modal-button">In Modal</Button>}
      >
        <div>Body</div>
      </BaseModal>,
    );

    const button = screen.getByTestId('modal-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn');
  });
});
