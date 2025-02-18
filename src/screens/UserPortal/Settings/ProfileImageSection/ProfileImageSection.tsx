import React from 'react';
import { Form, Col } from 'react-bootstrap';
import Avatar from 'components/Avatar/Avatar';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import styles from '../Settings.module.css';

/**
 * Interface for ProfileImageSection component props
 */
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
  fileInputRef: React.RefObject<HTMLInputElement>;
  /**
   * Handler function for file upload events
   */
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
const ProfileImageSection: React.FC<InterfaceProfileImageSectionProps> = ({
  userDetails,
  selectedAvatar,
  fileInputRef,
  handleFileUpload,
}) => (
  <Col lg={12} className="mb-2">
    <div className="text-center mb-3">
      <div className="position-relative d-inline-block">
        {userDetails?.avatarURL ? (
          <img
            className="rounded-circle"
            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            src={sanitizeAvatars(selectedAvatar, userDetails.avatarURL)}
            alt="User"
            data-testid="profile-picture"
            crossOrigin="anonymous"
          />
        ) : (
          <Avatar
            name={userDetails.name}
            alt="User Image"
            size={60}
            dataTestId="profile-picture"
            radius={150}
          />
        )}
        <i
          className="fas fa-edit position-absolute bottom-0 right-0 p-2 bg-white rounded-circle"
          onClick={() => fileInputRef.current?.click()}
          data-testid="uploadImageBtn"
          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
          title="Edit profile picture"
          role="button"
          aria-label="Edit profile picture"
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

export default ProfileImageSection;
