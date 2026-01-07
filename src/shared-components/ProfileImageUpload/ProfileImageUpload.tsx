/**
 * ProfileImageUpload Component
 *
 * A reusable component that combines avatar display with file upload functionality.
 * It displays a profile avatar with an edit overlay that triggers a file picker.
 *
 * @remarks
 * - Uses `ProfileAvatarDisplay` for avatar rendering (reusing existing shared component)
 * - Uses `NotificationToast` for validation error messages (codebase standard)
 * - Validates file type (JPEG, PNG, GIF) and size (max 5MB)
 * - Supports preview of newly selected file before saving
 *
 * @example
 * ```tsx
 * <ProfileImageUpload
 *   name="John Doe"
 *   avatarURL="https://example.com/avatar.jpg"
 *   onFileSelect={(file) => handleFileSelect(file)}
 * />
 * ```
 */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './ProfileImageUpload.module.css';

/**
 * Props for the ProfileImageUpload component.
 */
export interface InterfaceProfileImageUploadProps {
  /** User's name for fallback avatar generation */
  name: string;
  /** Current avatar URL (optional) */
  avatarURL?: string | null;
  /** Newly selected file for preview (optional) */
  selectedFile?: File | null;
  /** Callback when a valid file is selected */
  onFileSelect: (file: File) => void;
  /** Avatar size preset (default: 'large') */
  size?: 'small' | 'medium' | 'large';
  /** Test ID prefix for testing */
  dataTestId?: string;
}

/** Allowed MIME types for profile images */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

/** Maximum file size in bytes (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * ProfileImageUpload Component
 *
 * Displays a profile avatar with an edit button overlay. When clicked, opens
 * a file picker for selecting a new profile image. Validates file type and size.
 */
export default function ProfileImageUpload({
  name,
  avatarURL,
  selectedFile,
  onFileSelect,
  size = 'large',
  dataTestId = 'profile-image-upload',
}: InterfaceProfileImageUploadProps): JSX.Element {
  const { t: tCommon } = useTranslation('common');
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * State for the display image URL.
   * Managed by useEffect to ensure proper cleanup of object URLs.
   */
  const [displayImageUrl, setDisplayImageUrl] = React.useState<
    string | undefined
  >(undefined);

  /**
   * Effect to manage object URL lifecycle.
   * Creates object URL for selectedFile and revokes it on cleanup/change.
   */
  React.useEffect(() => {
    let objectUrl: string | undefined;

    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setDisplayImageUrl(objectUrl);
    } else {
      setDisplayImageUrl(avatarURL ?? undefined);
    }

    // Cleanup: revoke the exact object URL we created
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, avatarURL]);

  /**
   * Handles file selection from the input element.
   * Validates file type and size before calling onFileSelect.
   */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];

    // No file selected (user cancelled)
    if (!file) {
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      NotificationToast.error(
        tCommon('invalidFileType', { types: 'JPEG, PNG, or GIF' }),
      );
      // Reset input to allow re-selecting the same file
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      NotificationToast.error(tCommon('fileTooLarge', { size: 5 }));
      // Reset input to allow re-selecting the same file
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    // File is valid, notify parent
    onFileSelect(file);
  }

  /**
   * Triggers the hidden file input when the avatar or edit button is clicked.
   */
  function handleClick(): void {
    inputRef.current?.click();
  }



  return (
    <div className={styles.container} data-testid={dataTestId}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={handleClick}
        aria-label={tCommon('editProfilePicture')}
      >
        <ProfileAvatarDisplay
          imageUrl={displayImageUrl}
          fallbackName={name}
          size={size}
          shape="circle"
          dataTestId={`${dataTestId}-avatar`} // i18n-ignore-line
        />
        <span
          className={styles.editBadge}
          data-testid={`${dataTestId}-edit-badge`}
        >
          <i className="fas fa-edit" aria-hidden="true" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
        data-testid={`${dataTestId}-input`}
        aria-label={tCommon('uploadProfilePicture')}
      />
    </div>
  );
}
