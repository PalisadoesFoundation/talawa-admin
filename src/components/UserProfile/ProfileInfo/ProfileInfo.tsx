/**
 * ProfileInfo Component - Exactly matching Figma Design
 *
 * This component displays and allows editing of user's personal information,
 * contact details, and address information with exact Figma styling.
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PersonalInfoSection from './PersonalInfoSection';
import ContactInfoSection from './ContactInfoSection';
import ProfileSidebar from './ProfileSidebar';
import { InterfaceUserData } from '../types';

interface InterfaceProfileInfoProps {
  user: InterfaceUserData;
  onSave: (data: Partial<InterfaceUserData>) => Promise<void>;
  isOwnProfile?: boolean;
}

const ProfileInfo: React.FC<InterfaceProfileInfoProps> = ({
  user,
  onSave,
  isOwnProfile = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<InterfaceUserData>>(user);

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [pluginCreationAllowed, setPluginCreationAllowed] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Prevent saving if admin is viewing another user's profile
    if (!isOwnProfile) {
      toast.warning("You cannot edit another user's profile from this view.");
      return;
    }
    try {
      await onSave({
        ...formData,
        naturalLanguageCode: selectedLanguage,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData(user);
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Row>
      <Col lg={8}>
        <PersonalInfoSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleImageUpload={handleImageUpload}
          selectedImage={selectedImage}
          imagePreview={imagePreview}
        />
        <ContactInfoSection
          formData={formData}
          handleInputChange={handleInputChange}
        />
        {isEditing && (
          <div className="d-flex gap-3 mb-4">
            <Button
              variant="outline-secondary"
              onClick={handleReset}
              style={{
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #6c757d',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              className="btn-outline-hover"
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              style={{
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              className="btn-hover"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Col>
      <ProfileSidebar
        formData={formData}
        pluginCreationAllowed={pluginCreationAllowed}
        setPluginCreationAllowed={setPluginCreationAllowed}
        adminApproved={adminApproved}
        setAdminApproved={setAdminApproved}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </Row>
  );
};

export default ProfileInfo;
