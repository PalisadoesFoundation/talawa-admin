import { render, fireEvent } from '@testing-library/react';
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
    name: 'John Doe',
    altText: 'john',
    dataTestId: 'test-avatar',
  };

  test('renders image when avatarUrl is provided', () => {
    const { getByAltText, queryByTestId } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        avatarUrl="https://example.com/image.jpg"
      />,
    );

    const img = getByAltText('john');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('https://example.com/image.jpg');

    // Fallback should not be rendered
    expect(queryByTestId('test-avatar-fallback')).toBeNull();
  });

  test('renders fallback Avatar when avatarUrl is undefined/null/empty', () => {
    const { getByTestId, queryByRole } = render(
      <ProfileAvatarDisplay {...defaultProps} avatarUrl={null} />,
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
        avatarUrl="https://example.com/invalid.jpg"
      />,
    );

    const img = getByAltText('john');
    fireEvent.error(img);

    // After error, fallback should serve
    // Note: The implementation renders fallback INSTEAD of image when error occurs.
    const fallback = getByTestId('test-avatar-fallback');
    expect(fallback).toBeInTheDocument();
  });

  test('applies size classes/styles correctly for presets', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} size="large" />,
    );
    // Based on implementation: large = 96px
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('96px');
    expect(wrapper.style.height).toBe('96px');
  });

  test('applies custom size correctly', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} size="custom" customSize={123} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('123px');
    expect(wrapper.style.height).toBe('123px');
  });

  test('applies shape styles correctly', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} shape="circle" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.borderRadius).toBe('50%');
  });

  test('applies border when requested', () => {
    const { container } = render(
      <ProfileAvatarDisplay {...defaultProps} border={true} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.border).toContain('2px solid');
  });

  test('applies object-fit style to image', () => {
    const { getByAltText } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        avatarUrl="https://example.com/image.jpg"
        objectFit="contain"
      />,
    );
    const img = getByAltText('john');
    expect(img.style.objectFit).toBe('contain');
  });
});
