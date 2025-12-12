import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AvatarImage } from './AvatarImage';
import { vi, describe, it, expect } from 'vitest';

// Mock the Avatar component
vi.mock('../../../components/Avatar/Avatar', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="mock-avatar">{name}</div>
  ),
}));

describe('AvatarImage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'User Avatar',
    name: 'John Doe',
  };

  it('renders the image when src is provided and no error occurs', () => {
    render(<AvatarImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', defaultProps.src);
    expect(img).toHaveAttribute('alt', defaultProps.alt);
  });

  it('renders the Avatar fallback when src is null', () => {
    render(<AvatarImage {...defaultProps} src={null} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toHaveTextContent(
      defaultProps.name,
    );
  });

  it('renders the Avatar fallback when image fails to load', () => {
    render(<AvatarImage {...defaultProps} />);
    const img = screen.getByRole('img');

    // Simulate error
    fireEvent.error(img);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
  });
});
