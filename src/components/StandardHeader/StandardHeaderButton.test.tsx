import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import StandardHeaderButton from './StandardHeaderButton';

describe('StandardHeaderButton', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders default variant', () => {
    render(<StandardHeaderButton>Edit</StandardHeaderButton>);

    const button = screen.getByRole('button', { name: 'Edit' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-outline-secondary');
  });

  it('renders disabled button', () => {
    render(<StandardHeaderButton disabled>Disabled</StandardHeaderButton>);

    const button = screen.getByRole('button', { name: 'Disabled' });

    expect(button).toBeDisabled();
  });

  it('renders primary variant', () => {
    render(
      <StandardHeaderButton variant="primary">
        Create Event
      </StandardHeaderButton>,
    );

    const button = screen.getByRole('button', { name: 'Create Event' });

    expect(button).toHaveClass('btn-primary');
  });

  it('supports click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <StandardHeaderButton onClick={handleClick}>Click</StandardHeaderButton>,
    );

    const button = screen.getByRole('button', { name: 'Click' });

    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
