import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ProfileAvatarDisplay } from './ProfileAvatarDisplay';
import '@testing-library/dom';

// Mock the Avatar component since we want to test ProfileAvatarDisplay's logic, not Avatar's.
vi.mock('shared-components/Avatar/Avatar', () => ({
  default: ({
    name,
    dataTestId,
    radius,
  }: {
    name: string;
    dataTestId: string;
    radius?: number;
  }) => (
    <div data-testid={dataTestId} data-radius={radius}>
      Mocked Avatar: {name}
    </div>
  ),
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      if (key === 'profileAvatar.altText')
        return `Profile picture of ${options?.name}`;
      if (key === 'profileAvatar.enlargedAltText')
        return `Enlarged profile picture of ${options?.name}`;
      if (key === 'profileAvatar.modalTitle') return 'Profile Picture';
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
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('calls onClick instead of opening modal when enableEnlarge is false', () => {
    const onClickMock = vi.fn();
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={false}
        onClick={onClickMock}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Modal should not be visible
    expect(screen.queryByTestId('test-avatar-modal')).toBeNull();
    // onClick should be called
    expect(onClickMock).toHaveBeenCalled();
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
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();

    // Click the close button (react-bootstrap Modal.Header closeButton has aria-label="Close")
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Modal should be removed (use waitFor since modal animation is async)
    await waitFor(() => {
      expect(screen.queryByTestId('test-avatar-modal')).toBeNull();
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
    const dialog = screen.getByTestId('test-avatar-modal');
    expect(dialog).toBeInTheDocument();

    // Press Escape key on the dialog
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    // Modal should be removed (async due to modal animation)
    await waitFor(() => {
      expect(screen.queryByTestId('test-avatar-modal')).toBeNull();
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
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();
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
    const dialog = screen.getByTestId('test-avatar-modal');
    expect(dialog).toBeInTheDocument();

    // Click the backdrop element (react-bootstrap renders it with .modal-backdrop class)
    // The backdrop is a sibling to the dialog in the DOM
    const backdrop =
      dialog.parentElement?.querySelector('.modal') || dialog.parentElement;
    // If backdrop exists, click it; otherwise click the modal itself (fallback behavior)
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByTestId('test-avatar-modal')).toBeNull();
    });
  });

  test('renders fallback Avatar in modal when imageUrl is null', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
      />,
    );

    // Click the fallback avatar to open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Modal should be visible
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // The modal should render the fallback Avatar, not an image
    const modalFallback = screen.getByTestId('test-avatar-modal-fallback');
    expect(modalFallback).toBeInTheDocument();
    expect(modalFallback.textContent).toContain('Mocked Avatar: John Doe');
  });

  test('modal fallback Avatar receives correct radius for circle shape', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
        shape="circle"
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    const modalFallback = screen.getByTestId('test-avatar-modal-fallback');
    expect(modalFallback).toHaveAttribute('data-radius', '50');
  });

  test('modal fallback Avatar receives correct radius for rounded shape', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
        shape="rounded"
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    const modalFallback = screen.getByTestId('test-avatar-modal-fallback');
    expect(modalFallback).toHaveAttribute('data-radius', '10');
  });

  test('modal fallback Avatar receives correct radius for square shape', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
        shape="square"
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    const modalFallback = screen.getByTestId('test-avatar-modal-fallback');
    expect(modalFallback).toHaveAttribute('data-radius', '0');
  });

  test('modal fallback Avatar uses default dataTestId when not provided', () => {
    render(
      <ProfileAvatarDisplay
        fallbackName="John Doe"
        imageUrl={null}
        enableEnlarge={true}
      />,
    );

    // Without dataTestId prop, the container won't have a specific test id,
    // but we can find it by role
    const avatarContainer = screen.getByRole('button');
    fireEvent.click(avatarContainer);

    // Modal should be visible
    expect(screen.getByTestId('avatar-modal')).toBeInTheDocument();

    // The modal fallback should use the default 'avatar-modal-fallback' dataTestId
    const modalFallback = screen.getByTestId('avatar-modal-fallback');
    expect(modalFallback).toBeInTheDocument();
    expect(modalFallback.textContent).toContain('Mocked Avatar: John Doe');
  });
  test('opens modal when Enter key is pressed on fallback avatar', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');

    // Press Enter key on the fallback avatar
    fireEvent.keyDown(avatarContainer, { key: 'Enter', code: 'Enter' });

    // Modal should be visible
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();
  });

  test('opens modal when Space key is pressed on fallback avatar', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');

    // Press Space key on the fallback avatar
    fireEvent.keyDown(avatarContainer, { key: ' ', code: 'Space' });

    // Modal should be visible
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();
  });

  test('does not open modal when other keys are pressed on fallback avatar', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl={null}
        enableEnlarge={true}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');

    // Press a different key (e.g., Tab)
    fireEvent.keyDown(avatarContainer, { key: 'Tab', code: 'Tab' });

    // Modal should NOT be visible
    expect(screen.queryByTestId('test-avatar-modal')).toBeNull();
  });

  test('calls onLoad callback when image loads successfully', () => {
    const onLoadMock = vi.fn();
    const { getByAltText } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        onLoad={onLoadMock}
      />,
    );

    const img = getByAltText('Profile picture of John Doe');
    fireEvent.load(img);

    expect(onLoadMock).toHaveBeenCalled();
  });

  test('does not throw when image loads without onLoad callback', () => {
    const { getByAltText } = render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
      />,
    );

    const img = getByAltText('Profile picture of John Doe');

    expect(() => fireEvent.load(img)).not.toThrow();
    expect(img).toBeInTheDocument();
  });

  test('calls onLoad callback when enlarged modal image loads', () => {
    const onLoadMock = vi.fn();
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
        onLoad={onLoadMock}
      />,
    );

    // Open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Find the enlarged image in the modal
    const enlargedImg = screen.getByAltText(
      'Enlarged profile picture of John Doe',
    );
    fireEvent.load(enlargedImg);

    expect(onLoadMock).toHaveBeenCalled();
  });

  test('calls onError callback when enlarged modal image errors', () => {
    const onErrorMock = vi.fn();
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
        onError={onErrorMock}
      />,
    );

    // Open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Find the enlarged image in the modal
    const enlargedImg = screen.getByAltText(
      'Enlarged profile picture of John Doe',
    );
    fireEvent.error(enlargedImg);

    expect(onErrorMock).toHaveBeenCalled();
  });

  test('opens modal when Enter key is pressed on image avatar', () => {
    render(
      <ProfileAvatarDisplay
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
      />,
    );

    const avatarContainer = screen.getByTestId('test-avatar');

    // Press Enter key on the image avatar
    fireEvent.keyDown(avatarContainer, { key: 'Enter', code: 'Enter' });

    // Modal should be visible
    expect(screen.getByTestId('test-avatar-modal')).toBeInTheDocument();
  });

  test('does not throw when enlarged modal image loads without onLoad callback', () => {
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

    // Find the enlarged image in the modal
    const enlargedImg = screen.getByAltText(
      'Enlarged profile picture of John Doe',
    );

    // Trigger load event without onLoad callback
    expect(() => fireEvent.load(enlargedImg)).not.toThrow();
  });

  test('does not throw when enlarged modal image errors without onError callback', () => {
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

    // Find the enlarged image in the modal
    const enlargedImg = screen.getByAltText(
      'Enlarged profile picture of John Doe',
    );

    // Trigger error event without onError callback
    expect(() => fireEvent.error(enlargedImg)).not.toThrow();
  });

  test('uses translated modalTitle when fallbackName is empty', () => {
    render(
      <ProfileAvatarDisplay
        fallbackName=""
        imageUrl="https://example.com/image.jpg"
        enableEnlarge={true}
        dataTestId="test-avatar"
      />,
    );

    // Open the modal
    const avatarContainer = screen.getByTestId('test-avatar');
    fireEvent.click(avatarContainer);

    // Modal should show the translated 'Profile Picture' title
    expect(screen.getByText('Profile Picture')).toBeInTheDocument();
  });
});
