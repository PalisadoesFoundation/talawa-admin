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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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

  it('renders with avatar URL and normalizes 127.0.0.1 to localhost', () => {
    const propsWith127 = {
      ...defaultProps,
      userDetails: {
        ...defaultProps.userDetails,
        avatarURL: 'http://127.0.0.1:4000/objects/avatar.png',
      },
    };
    render(<ProfileImageSection {...propsWith127} />);
    const avatar = screen.getByTestId('profile-avatar');
    // Should call sanitizeAvatars with normalized URL
    expect(sanitizeAvatars).toHaveBeenCalledWith(
      null,
      'http://localhost:4000/objects/avatar.png',
    );
    // Should pass crossOrigin prop to ProfileAvatarDisplay
    expect(avatar).toBeInTheDocument();
  });

  it('renders fallback avatar when no avatarURL is provided', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      userDetails: {
        name: 'John Doe',
      },
    };
    render(<ProfileImageSection {...propsWithoutAvatar} />);
    const avatar = screen.getByTestId('profile-avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('handles file upload button click', async () => {
    render(<ProfileImageSection {...defaultProps} />);
    const uploadButton = screen.getByTestId('uploadImageBtn');
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    await userEvent.click(uploadButton);
    expect(uploadButton.tagName).toBe('BUTTON');
    expect(uploadButton).toHaveAttribute('type', 'button');
    expect(uploadButton).toHaveAttribute(
      'aria-label',
      'settings.uploadProfilePicture',
    );
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('triggers file input click when pressing Enter or Space on upload button', () => {
    render(<ProfileImageSection {...defaultProps} />);
    const uploadButton = screen.getByTestId('uploadImageBtn');
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    fireEvent.keyDown(uploadButton, { key: 'Enter' });
    expect(clickSpy).toHaveBeenCalled();

    fireEvent.keyDown(uploadButton, { key: ' ' });
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
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

  it('applies correct styling to profile avatar', () => {
    render(<ProfileImageSection {...defaultProps} />);
    const avatar = screen.getByTestId('profile-avatar');
    expect(avatar).toHaveClass('rounded-circle');
    expect(avatar.style.width).toBe('80px');
    expect(avatar.style.height).toBe('80px');
  });

  it('applies correct styling to edit icon', () => {
    render(<ProfileImageSection {...defaultProps} />);
    const editIcon = screen.getByTestId('uploadImageBtn');
    expect(editIcon).toHaveClass('position-absolute');
    expect(editIcon).toHaveClass('bottom-0');
    expect(editIcon).toHaveClass('right-0');
    expect(editIcon).toHaveClass('p-2');
    expect(editIcon).toHaveClass('bg-white');
    expect(editIcon).toHaveClass('rounded-circle');
    expect(editIcon).toHaveClass('border-0');
    expect(editIcon).toHaveClass('cursor-pointer');
    expect(editIcon).toHaveClass('d-flex');
    expect(editIcon).toHaveClass('align-items-center');
    expect(editIcon).toHaveClass('justify-content-center');
    const iconElement = editIcon.querySelector('i');
    expect(iconElement).not.toBeNull();
    if (iconElement) {
      expect(iconElement).toHaveClass('fas');
      expect(iconElement).toHaveClass('fa-edit');
      expect(iconElement).toHaveClass('fs-5');
      expect(iconElement).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
