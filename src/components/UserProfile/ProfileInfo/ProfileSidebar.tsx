/**
 * ProfileSidebar Component
 *
 * This component renders the sidebar section of the user profile.
 * It displays user avatar, basic info, and action controls including
 * language selection and admin-specific settings.
 *
 * @param props - The component props
 * @param props.formData - The form data containing user information
 * @param props.isEditing - Whether the profile is in edit mode
 * @param props.setIsEditing - Function to toggle edit mode
 * @param props.pluginCreationAllowed - Whether plugin creation is allowed
 * @param props.setPluginCreationAllowed - Function to set plugin creation permission
 * @param props.adminApproved - Whether admin is approved
 * @param props.setAdminApproved - Function to set admin approval status
 * @param props.selectedLanguage - Currently selected language
 * @param props.setSelectedLanguage - Function to set selected language
 * @returns JSX element representing the profile sidebar
 */
import React from 'react';
import { Form, Card, Col } from 'react-bootstrap';
import { InterfaceUserData } from '../types';

interface InterfaceProfileSidebarProps {
  formData: Partial<InterfaceUserData>;
  isAdminView?: boolean;
  isOwnProfile?: boolean;
  pluginCreationAllowed: boolean;
  setPluginCreationAllowed: (value: boolean) => void;
  adminApproved: boolean;
  setAdminApproved: (value: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

const ProfileSidebar: React.FC<InterfaceProfileSidebarProps> = ({
  formData,
  isAdminView = false,
  isOwnProfile = false,
  pluginCreationAllowed,
  setPluginCreationAllowed,
  adminApproved,
  setAdminApproved,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  return (
    <Col lg={4}>
      {/* Profile Details Card */}
      <Card className="border-0 shadow-sm rounded-3 mb-4">
        <Card.Header
          className="border-0 rounded-top-3"
          style={{ backgroundColor: '#f8f9fa', padding: '16px 24px' }}
        >
          <h6 className="mb-0 fw-semibold" style={{ color: '#495057' }}>
            Profile Details
          </h6>
        </Card.Header>
        <Card.Body style={{ padding: '24px' }} className="text-center">
          <div className="mb-3">
            {formData.avatarURL ? (
              <img
                src={formData.avatarURL}
                alt={formData.name || 'User avatar'}
                className="rounded-circle mx-auto d-block"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.setAttribute(
                    'style',
                    'display: flex',
                  );
                }}
              />
            ) : null}
            {!formData.avatarURL && (
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: '80px',
                  height: '80px',
                  fontSize: '2rem',
                  backgroundColor: '#e9ecef',
                  color: '#6c757d',
                }}
                role="img"
                aria-label="User avatar"
              >
                {(formData.name || '')
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((part) => part[0]?.toUpperCase() || '')
                  .slice(0, 2)
                  .join('') || '??'}
              </div>
            )}
          </div>
          <h6 className="text-center mb-2 fw-semibold">
            {formData.name || 'Unknown User'}
          </h6>
          <p className="text-muted text-center small mb-3">
            {formData.emailAddress || 'No email provided'}
          </p>
        </Card.Body>
      </Card>

      {/* Actions Card */}
      <Card className="border-0 shadow-sm rounded-3">
        <Card.Header
          className="border-0 rounded-top-3"
          style={{ backgroundColor: '#f8f9fa', padding: '16px 24px' }}
        >
          <h6 className="mb-0 fw-semibold" style={{ color: '#495057' }}>
            Actions
          </h6>
        </Card.Header>
        <Card.Body style={{ padding: '24px' }}>
          {isAdminView && !isOwnProfile && (
            <>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: '14px', color: '#495057' }}>
                  Plugin Creation Allowed
                </span>
                <Form.Check
                  type="switch"
                  checked={pluginCreationAllowed}
                  onChange={(e) => setPluginCreationAllowed(e.target.checked)}
                  style={{ transform: 'scale(0.9)' }}
                />
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: '14px', color: '#495057' }}>
                  Admin Approved
                </span>
                <Form.Check
                  type="switch"
                  checked={adminApproved}
                  onChange={(e) => setAdminApproved(e.target.checked)}
                  style={{ transform: 'scale(0.9)' }}
                />
              </div>
            </>
          )}
          <div className="mb-3">
            <Form.Label className="fw-medium text-dark mb-2">
              Language
            </Form.Label>
            <Form.Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                borderRadius: '6px',
                border: '1px solid #e0e6ed',
                padding: '10px 12px',
                fontSize: '14px',
              }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Hindi">Hindi</option>
            </Form.Select>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProfileSidebar;
