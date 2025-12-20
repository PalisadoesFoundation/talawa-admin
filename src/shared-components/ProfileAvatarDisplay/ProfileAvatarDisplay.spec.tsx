import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ProfileAvatarDisplay } from './ProfileAvatarDisplay';
import '@testing-library/dom';

// Mock the Avatar component since we want to test ProfileAvatarDisplay's logic, not Avatar's.
vi.mock('components/Avatar/Avatar', () => ({
  default: ({ name, dataTestId }: { name: string; dataTestId: string }) => (
    <div data-testid={dataTestId}>Mocked Avatar: {name}</div>
  ),
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      if (key === 'altText') return `Profile picture of ${options?.name}`;
      if (key === 'enlargedAltText')
        return `Enlarged profile picture of ${options?.name}`;
      if (key === 'modalTitle') return 'Profile Picture';
      return key;
    },
  }),
}));

describe('ProfileAvatarDisplay Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    fallbackName: 'John Doe',
    dataTestId: 'test-avatar',
  };

  test('renders image when imageUrl is provided', () => {
    const { getByAltText, queryByTestId } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
      />,
    );

    const img = getByAltText('Profile picture of John Doe');
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

    const img = getByAltText('Profile picture of John Doe');
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
    const img = getByAltText('Profile picture of John Doe');
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
    expect(screen.getByText('Profile Picture')).toBeInTheDocument();
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

  test('closes modal when close button is clicked', async () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
      />,
    );

    // Open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click the close button (react-bootstrap Modal.Header closeButton has aria-label="Close")
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Modal should be removed (use waitFor since modal animation is async)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  test('closes modal when Escape key is pressed', async () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
      />,
    );

    // Open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Press Escape key on the dialog
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    // Modal should be removed (async due to modal animation)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  test('opens modal when Space key is pressed on avatar', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');

    // Press Space key on the avatar
    fireEvent.keyDown(avatarContainer, { key: ' ', code: 'Space' });

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('closes modal when backdrop is clicked', async () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
      />,
    );

    // Open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.click(dialog);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
