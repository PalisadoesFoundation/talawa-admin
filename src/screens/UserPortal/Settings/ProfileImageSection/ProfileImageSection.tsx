/**
 * Renders the profile image section of the user settings
 *
 * This component displays:
 * - The user's current avatar or a default avatar
 * - An edit button to change the profile picture
 * - A hidden file input for image upload
 *
 * @remarks
 * The component handles two cases:
 * 1. When an avatar URL exists - displays the actual image
 * 2. When no avatar URL exists - displays a default avatar with user's initials
 *
 * The component uses Bootstrap classes and custom styling for layout and appearance.
 *
 * @example
 * ```tsx
 * <ProfileImageSection
 *   userDetails={{ name: "John Doe", avatarURL: "https://example.com/avatar.jpg" }}
 *   selectedAvatar={null}
 *   fileInputRef={fileInputRef}
 *   handleFileUpload={handleFileUpload}
 * />
 * ```
 */
import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';

interface InterfaceProfileImageSectionProps {
  /**
   * User details containing avatar URL and name
   */
  userDetails: {
    /**
     * URL of the user's avatar image
     */
    avatarURL?: string;
    /**
     * Name of the user
     */
    name: string;
  };
  /**
   * Currently selected avatar file
   */
  selectedAvatar: File | null;
  /**
   * Reference to the file input element
   */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  /**
   * Handler function for file upload events
   */
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageSection: React.FC<InterfaceProfileImageSectionProps> = ({
  userDetails,
  selectedAvatar,
  fileInputRef,
  handleFileUpload,
}) => {
  const { t } = useTranslation('translation');
  const normalizedAvatarUrl =
    userDetails?.avatarURL && userDetails.avatarURL.includes('127.0.0.1')
      ? userDetails.avatarURL.replace('127.0.0.1', 'localhost')
      : userDetails?.avatarURL;
  const uploadProfilePictureLabel = t('settings.uploadProfilePicture', {
    name: userDetails?.name || t('settings.profileSettings'),
    defaultValue: t('settings.editProfile'),
  });

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const handleUploadIconKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFileInput();
    }
  };
  return (
    <Col lg={12} className="mb-2">
      <div className="text-center mb-3">
        <div className="position-relative d-inline-block">
          <ProfileAvatarDisplay
            imageUrl={
              selectedAvatar
                ? sanitizeAvatars(selectedAvatar, normalizedAvatarUrl || '')
                : normalizedAvatarUrl
                  ? sanitizeAvatars(null, normalizedAvatarUrl)
                  : undefined
            }
            fallbackName={userDetails?.name}
            size="custom"
            shape="circle"
            customSize={80}
            border={false}
            className="rounded-circle"
            dataTestId="profile-avatar"
            objectFit="cover"
            enableEnlarge={true}
            crossOrigin="anonymous"
          />
          <button
            type="button"
            className="position-absolute bottom-0 right-0 p-2 bg-white rounded-circle border-0 cursor-pointer d-flex align-items-center justify-content-center"
            onClick={triggerFileInput}
            onKeyDown={handleUploadIconKeyDown}
            data-testid="uploadImageBtn"
            title={uploadProfilePictureLabel}
            aria-label={uploadProfilePictureLabel}
          >
            <i className="fas fa-edit fs-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <Form.Control
        accept="image/*"
        id="postphoto"
        name="photo"
        type="file"
        className={styles.cardControl}
        data-testid="fileInput"
        multiple={false}
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </Col>
  );
};

export default ProfileImageSection;
