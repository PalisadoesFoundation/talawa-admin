import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import ProfileImageUpload from './ProfileImageUpload';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

// Mock ProfileAvatarDisplay to simplify testing
vi.mock('shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay', () => ({
  ProfileAvatarDisplay: ({
    imageUrl,
    fallbackName,
    dataTestId,
  }: {
    imageUrl?: string;
    fallbackName: string;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId} data-image-url={imageUrl || ''}>
      Mocked Avatar: {fallbackName}
    </div>
  ),
}));

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { types?: string; size?: number }) => {
      if (key === 'invalidFileType')
        return `Invalid file type. Please use ${options?.types}`;
      if (key === 'fileTooLarge')
        return `File too large. Maximum size is ${options?.size}MB`;
      if (key === 'editProfilePicture') return 'Edit profile picture';
      if (key === 'uploadProfilePicture') return 'Upload profile picture';
      return key;
    },
  }),
}));

describe('ProfileImageUpload Component', () => {
  const mockOnFileSelect = vi.fn();
  const defaultProps = {
    name: 'John Doe',
    onFileSelect: mockOnFileSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File(['x'.repeat(size)], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  describe('Rendering', () => {
    test('renders with default props', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      expect(screen.getByTestId('profile-image-upload')).toBeInTheDocument();
      expect(
        screen.getByTestId('profile-image-upload-avatar'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('profile-image-upload-edit-badge'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('profile-image-upload-input'),
      ).toBeInTheDocument();
    });

    test('renders with custom dataTestId', () => {
      render(
        <ProfileImageUpload {...defaultProps} dataTestId="custom-upload" />,
      );

      expect(screen.getByTestId('custom-upload')).toBeInTheDocument();
      expect(screen.getByTestId('custom-upload-avatar')).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-upload-edit-badge'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-upload-input')).toBeInTheDocument();
    });

    test('renders avatar with avatarURL when provided', () => {
      render(
        <ProfileImageUpload
          {...defaultProps}
          avatarURL="https://example.com/avatar.jpg"
        />,
      );

      const avatar = screen.getByTestId('profile-image-upload-avatar');
      expect(avatar).toHaveAttribute(
        'data-image-url',
        'https://example.com/avatar.jpg',
      );
    });

    test('renders fallback avatar when no avatarURL provided', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const avatar = screen.getByTestId('profile-image-upload-avatar');
      expect(avatar).toHaveAttribute('data-image-url', '');
      expect(avatar).toHaveTextContent('Mocked Avatar: John Doe');
    });

    test('renders preview of selectedFile when provided', () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg', 1024);
      render(<ProfileImageUpload {...defaultProps} selectedFile={mockFile} />);

      const avatar = screen.getByTestId('profile-image-upload-avatar');
      expect(avatar).toHaveAttribute('data-image-url', 'blob:mock-url');
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
    });

    test('renders with different size props', () => {
      const { rerender } = render(
        <ProfileImageUpload {...defaultProps} size="small" />,
      );
      expect(screen.getByTestId('profile-image-upload')).toBeInTheDocument();

      rerender(<ProfileImageUpload {...defaultProps} size="medium" />);
      expect(screen.getByTestId('profile-image-upload')).toBeInTheDocument();

      rerender(<ProfileImageUpload {...defaultProps} size="large" />);
      expect(screen.getByTestId('profile-image-upload')).toBeInTheDocument();
    });
  });

  describe('File Selection - Click Interaction', () => {
    test('clicking avatar wrapper triggers file input', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId(
        'profile-image-upload-input',
      ) as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const avatarWrapper = screen
        .getByTestId('profile-image-upload-avatar')
        .closest('[role="button"]');
      expect(avatarWrapper).toBeInTheDocument();

      if (avatarWrapper) {
        fireEvent.click(avatarWrapper);
      }

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('File Selection - Keyboard Interaction', () => {
    test('pressing Enter on avatar wrapper triggers file input', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId(
        'profile-image-upload-input',
      ) as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const avatarWrapper = screen
        .getByTestId('profile-image-upload-avatar')
        .closest('[role="button"]');

      if (avatarWrapper) {
        fireEvent.keyDown(avatarWrapper, { key: 'Enter' });
      }

      expect(clickSpy).toHaveBeenCalled();
    });

    test('pressing Space on avatar wrapper triggers file input', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId(
        'profile-image-upload-input',
      ) as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const avatarWrapper = screen
        .getByTestId('profile-image-upload-avatar')
        .closest('[role="button"]');

      if (avatarWrapper) {
        fireEvent.keyDown(avatarWrapper, { key: ' ' });
      }

      expect(clickSpy).toHaveBeenCalled();
    });

    test('pressing other keys does not trigger file input', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId(
        'profile-image-upload-input',
      ) as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const avatarWrapper = screen
        .getByTestId('profile-image-upload-avatar')
        .closest('[role="button"]');

      if (avatarWrapper) {
        fireEvent.keyDown(avatarWrapper, { key: 'Tab' });
      }

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('File Validation - Valid Files', () => {
    test('accepts valid JPEG file and calls onFileSelect', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const validFile = createMockFile('photo.jpg', 'image/jpeg', 1024);

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    test('accepts valid PNG file and calls onFileSelect', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const validFile = createMockFile('photo.png', 'image/png', 1024);

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    test('accepts valid GIF file and calls onFileSelect', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const validFile = createMockFile('photo.gif', 'image/gif', 1024);

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    test('accepts file just under 5MB limit', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const almostMaxFile = createMockFile(
        'large.jpg',
        'image/jpeg',
        5 * 1024 * 1024 - 1,
      );

      fireEvent.change(fileInput, { target: { files: [almostMaxFile] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(almostMaxFile);
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  describe('File Validation - Invalid File Type', () => {
    test('rejects invalid file type and shows error toast', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const invalidFile = createMockFile('doc.pdf', 'application/pdf', 1024);

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Invalid file type. Please use JPEG, PNG, or GIF',
      );
    });

    test('rejects WebP file (not in allowed list)', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const webpFile = createMockFile('photo.webp', 'image/webp', 1024);

      fireEvent.change(fileInput, { target: { files: [webpFile] } });

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    test('resets input value after invalid file type rejection', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId(
        'profile-image-upload-input',
      ) as HTMLInputElement;
      const invalidFile = createMockFile('doc.pdf', 'application/pdf', 1024);

      // Set a mock value first
      Object.defineProperty(fileInput, 'value', {
        writable: true,
        value: 'C:\\fakepath\\doc.pdf',
      });

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      // Input should be reset to allow re-selecting
      expect(fileInput.value).toBe('');
    });
  });

  describe('File Validation - Oversized Files', () => {
    test('rejects file over 5MB and shows error toast', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const oversizedFile = createMockFile(
        'huge.jpg',
        'image/jpeg',
        6 * 1024 * 1024,
      );

      fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'File too large. Maximum size is 5MB',
      );
    });

    test('rejects file exactly at 5MB limit + 1 byte', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      const oversizedFile = createMockFile(
        'exact.jpg',
        'image/jpeg',
        5 * 1024 * 1024 + 1,
      );

      fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    test('resets input value after oversized file rejection', async () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId(
        'profile-image-upload-input',
      ) as HTMLInputElement;
      const oversizedFile = createMockFile(
        'huge.jpg',
        'image/jpeg',
        6 * 1024 * 1024,
      );

      Object.defineProperty(fileInput, 'value', {
        writable: true,
        value: 'C:\\fakepath\\huge.jpg',
      });

      fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

      expect(fileInput.value).toBe('');
    });
  });

  describe('File Validation - No File Selected', () => {
    test('does nothing when no file is selected (user cancels)', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');

      // Simulate user cancelling the file picker (empty files array)
      fireEvent.change(fileInput, { target: { files: [] } });

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    test('does nothing when files is null', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');

      // Simulate files being null
      fireEvent.change(fileInput, { target: { files: null } });

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('avatar wrapper has correct ARIA attributes', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const avatarWrapper = screen
        .getByTestId('profile-image-upload-avatar')
        .closest('[role="button"]');

      expect(avatarWrapper).toHaveAttribute('role', 'button');
      expect(avatarWrapper).toHaveAttribute('tabIndex', '0');
      expect(avatarWrapper).toHaveAttribute(
        'aria-label',
        'Edit profile picture',
      );
    });

    test('file input has correct ARIA label', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('profile-image-upload-input');
      expect(fileInput).toHaveAttribute('aria-label', 'Upload profile picture');
    });

    test('edit badge icon is hidden from screen readers', () => {
      render(<ProfileImageUpload {...defaultProps} />);

      const editBadge = screen.getByTestId('profile-image-upload-edit-badge');
      const icon = editBadge.querySelector('i');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('URL Cleanup', () => {
    test('revokes object URL on unmount when selectedFile exists', () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg', 1024);
      const { unmount } = render(
        <ProfileImageUpload {...defaultProps} selectedFile={mockFile} />,
      );

      unmount();

      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
