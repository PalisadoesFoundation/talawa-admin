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
  const normalizedAvatarUrl =
    userDetails?.avatarURL && userDetails.avatarURL.includes('127.0.0.1')
      ? userDetails.avatarURL.replace('127.0.0.1', 'localhost')
      : userDetails?.avatarURL;
  return (
    <Col lg={12} className="mb-2">
      <div className="text-center mb-3">
        <div className="position-relative d-inline-block">
          <ProfileAvatarDisplay
            imageUrl={
              normalizedAvatarUrl
                ? sanitizeAvatars(selectedAvatar, normalizedAvatarUrl)
                : undefined
            }
            fallbackName={userDetails?.name}
            size="medium"
            shape="circle"
            customSize={60}
            border={false}
            className="rounded-circle"
            style={{ width: 80, height: 80, objectFit: 'cover' }}
            dataTestId="profile-avatar"
            objectFit="cover"
            enableEnlarge={true}
            crossOrigin="anonymous"
          />
          <i
            className="fas fa-edit position-absolute bottom-0 right-0 p-2 bg-white rounded-circle"
            onClick={() => fileInputRef.current?.click()}
            data-testid="uploadImageBtn"
            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
            title={userDetails?.name}
            role="button"
            aria-label={userDetails?.name}
            tabIndex={0}
          />
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
