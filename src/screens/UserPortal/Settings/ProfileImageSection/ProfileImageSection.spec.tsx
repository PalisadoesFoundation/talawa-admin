import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileImageSection from './ProfileImageSection';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';

const sharedMocks = vi.hoisted(() => ({
  Avatar: ({
    name,
    size,
    dataTestId,
  }: {
    name: string;
    size: number;
    dataTestId: string;
  }) => (
    <div data-testid={dataTestId}>
      Mock Avatar: {name} (size: {size})
    </div>
  ),
  sanitizeAvatars: vi.fn((file: File | null, url?: string | null) =>
    file ? 'blob-url' : (url ?? null),
  ),
}));

// Mock dependencies
vi.mock('components/Avatar/Avatar', () => ({
  default: sharedMocks.Avatar,
}));

vi.mock('utils/sanitizeAvatar', () => ({
  sanitizeAvatars: sharedMocks.sanitizeAvatars,
}));

describe('ProfileImageSection', () => {
  const mockFileInputRef = React.createRef<HTMLInputElement | null>();
  const mockHandleFileUpload = vi.fn();

  const defaultProps = {
    userDetails: {
      name: 'John Doe',
      avatarURL: 'https://example.com/avatar.jpg',
    },
    selectedAvatar: null,
    fileInputRef: mockFileInputRef,
    handleFileUpload: mockHandleFileUpload,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with avatar URL', () => {
    render(<ProfileImageSection {...defaultProps} />);

    const img = screen.getByTestId('profile-picture');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', defaultProps.userDetails.avatarURL);
    expect(img).toHaveAttribute('crossOrigin', 'anonymous');
  });

  it('renders Avatar component when no avatarURL is provided', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      userDetails: {
        name: 'John Doe',
      },
    };

    render(<ProfileImageSection {...propsWithoutAvatar} />);

    const avatar = screen.getByTestId('profile-picture');
    expect(avatar.textContent).toContain('Mock Avatar: John Doe');
  });

  it('handles file upload button click', async () => {
    render(<ProfileImageSection {...defaultProps} />);

    const uploadButton = screen.getByTestId('uploadImageBtn');
    await userEvent.click(uploadButton);

    // Verify button accessibility attributes
    expect(uploadButton).toHaveAttribute('role', 'button');
    expect(uploadButton).toHaveAttribute('aria-label', 'Edit profile picture');
    expect(uploadButton).toHaveAttribute('tabIndex', '0');
  });

  it('calls handleFileUpload when file is selected', () => {
    render(<ProfileImageSection {...defaultProps} />);

    const fileInput = screen.getByTestId('fileInput');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockHandleFileUpload).toHaveBeenCalled();
  });

  it('uses sanitizeAvatars when selectedAvatar is present', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const propsWithSelectedAvatar = {
      ...defaultProps,
      selectedAvatar: mockFile,
    };

    render(<ProfileImageSection {...propsWithSelectedAvatar} />);

    expect(sanitizeAvatars).toHaveBeenCalledWith(
      mockFile,
      defaultProps.userDetails.avatarURL,
    );
  });

  it('applies correct styling to profile picture', () => {
    render(<ProfileImageSection {...defaultProps} />);

    const img = screen.getByTestId('profile-picture');
    expect(img).toHaveClass('rounded-circle');
    expect(img.style.width).toBe('60px');
    expect(img.style.height).toBe('60px');
    expect(img.style.objectFit).toBe('cover');
  });

  it('applies correct styling to edit icon', () => {
    render(<ProfileImageSection {...defaultProps} />);

    const editIcon = screen.getByTestId('uploadImageBtn');
    expect(editIcon).toHaveClass('fas');
    expect(editIcon).toHaveClass('fa-edit');
    expect(editIcon).toHaveClass('position-absolute');
    expect(editIcon).toHaveClass('bottom-0');
    expect(editIcon).toHaveClass('right-0');
    expect(editIcon.style.cursor).toBe('pointer');
    expect(editIcon.style.fontSize).toBe('1.2rem');
  });
});
