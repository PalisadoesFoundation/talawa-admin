import { render, fireEvent, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ProfileAvatarDisplay } from './ProfileAvatarDisplay';
import '@testing-library/dom';

// Mock the Avatar component since we want to test ProfileAvatarDisplay's logic, not Avatar's.
vi.mock('components/Avatar/Avatar', () => ({
  default: ({ name, dataTestId }: { name: string; dataTestId: string }) => (
    <div data-testid={dataTestId}>Mocked Avatar: {name}</div>
  ),
}));

describe('ProfileAvatarDisplay Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    fallbackName: 'John Doe',
    altText: 'john',
    dataTestId: 'test-avatar',
  };

  test('renders image when imageUrl is provided', () => {
    const { getByAltText, queryByTestId } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
      />,
    );

    const img = getByAltText('john');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('https://example.com/image.jpg');

    // Fallback should not be rendered
    expect(queryByTestId('test-avatar-fallback')).toBeNull();
  });

  test('renders fallback Avatar when imageUrl is undefined/null/empty', () => {
    const { getByTestId, queryByRole } = render(
      <ProfileAvatarDisplay {...defaultProps} imageUrl={null} />,
    );

    // Image should not be rendered
    expect(queryByRole('img')).toBeNull();

    // Fallback should be rendered
    const fallback = getByTestId('test-avatar-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback.textContent).toContain('Mocked Avatar: John Doe');
  });

  test('switches to fallback when image errors', () => {
    const { getByAltText, getByTestId } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/invalid.jpg"
      />,
    );

    const img = getByAltText('john');
    fireEvent.error(img);

    // After error, fallback should serve
    // Note: The implementation renders fallback INSTEAD of image when error occurs.
    const fallback = getByTestId('test-avatar-fallback');
    expect(fallback).toBeInTheDocument();
  });

  test('applies size classes correctly for presets', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} size="large" />,
    );
    // Size is applied via CSS class
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('sizeLarge');
  });

  test('applies custom size correctly via inline styles', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} size="custom" customSize={123} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('123px');
    expect(wrapper.style.height).toBe('123px');
  });

  test('applies shape classes correctly', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} shape="circle" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('shapeCircle');
  });

  test('applies border class when requested', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} border={true} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('containerWithBorder');
  });

  test('applies object-fit class to image', () => {
    const { getByAltText } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        objectFit="contain"
      />,
    );
    const img = getByAltText('john');
    expect(img.className).toContain('objectFitContain');
  });

  test('opens modal when enableEnlarge is true and avatar is clicked', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('does not open modal when enableEnlarge is false', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={false}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Modal should not be visible
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
