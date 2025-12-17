import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PeopleAvatarImage, IMAGE_STYLES } from './PeopleAvatarImage';
import { vi, describe, it, expect } from 'vitest';

// Mock the Avatar component
vi.mock('../../../components/Avatar/Avatar', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="mock-avatar">{name}</div>
  ),
}));

describe('PeopleAvatarImage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'User Avatar',
    name: 'John Doe',
  };

  it('renders the image when src is provided and no error occurs', () => {
    render(<PeopleAvatarImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', defaultProps.src);
    expect(img).toHaveAttribute('alt', defaultProps.alt);
    expect(img).toHaveStyle({
      width: IMAGE_STYLES.width as string,
      height: IMAGE_STYLES.height as string,
      borderRadius: IMAGE_STYLES.borderRadius as string,
      objectFit: IMAGE_STYLES.objectFit as string,
    });
  });

  it('exports IMAGE_STYLES with expected properties', () => {
    expect(IMAGE_STYLES).toEqual({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    });
  });

  it('renders the Avatar fallback when src is null', () => {
    render(<PeopleAvatarImage {...defaultProps} src={null} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toHaveTextContent(
      defaultProps.name,
    );
  });

  it('renders the Avatar fallback when image fails to load', () => {
    render(<PeopleAvatarImage {...defaultProps} />);
    const img = screen.getByRole('img');

    // Simulate error
    fireEvent.error(img);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
  });
});
