import React from 'react';
import { Form, Col } from 'react-bootstrap';
import Avatar from 'components/Avatar/Avatar';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import styles from '../Settings.module.css';

interface InterfaceProfileImageSectionProps {
  userDetails: {
    avatarURL?: string;
    name: string;
  };
  selectedAvatar: File | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
