/**
 * PersonalInfoSection Component
 *
 * This component renders the personal information section of the user profile form.
 * It includes fields for name, gender, birth date, education, employment status,
 * marital status, and profile image upload.
 *
 * @param props - The component props
 * @param props.formData - The form data containing user information
 * @param props.handleInputChange - Function to handle input changes
 * @param props.selectedImage - The selected image file for upload
 * @param props.imagePreview - The preview URL of the selected image
 * @param props.handleImageUpload - Function to handle image upload
 * @returns JSX element representing the personal information section
 */
import React, { useRef } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import {
  educationGradeEnum,
  employmentStatusEnum,
  maritalStatusEnum,
} from 'utils/formEnumFields';
import { InterfaceUserData } from '../types';

interface InterfacePersonalInfoSectionProps {
  formData: Partial<InterfaceUserData>;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
  imagePreview: string;
}

const PersonalInfoSection: React.FC<InterfacePersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
  handleImageUpload,
  selectedImage,
  imagePreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <Card className="border-0 shadow-sm rounded-3 mb-4">
      <Card.Header
        className="border-0 rounded-top-3"
        style={{ backgroundColor: '#f8f9fa', padding: '16px 24px' }}
      >
        <h6 className="mb-0 fw-semibold" style={{ color: '#495057' }}>
          Personal Information
        </h6>
      </Card.Header>
      <Card.Body style={{ padding: '24px' }}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                First Name
              </Form.Label>
              <Form.Control
                type="text"
                data-testid="inputName"
                value={formData.name?.split(' ')[0] || ''}
                onChange={(e) => {
                  const lastName =
                    formData.name?.split(' ').slice(1).join(' ') || '';
                  handleInputChange(
                    'name',
                    `${e.target.value} ${lastName}`.trim(),
                  );
                }}
                placeholder="First name"
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Last Name
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.name?.split(' ').slice(1).join(' ') || ''}
                onChange={(e) => {
                  const firstName = formData.name?.split(' ')[0] || '';
                  handleInputChange(
                    'name',
                    `${firstName} ${e.target.value}`.trim(),
                  );
                }}
                placeholder="Last name"
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Gender
              </Form.Label>
              <Form.Select
                value={formData.natalSex || ''}
                onChange={(e) => handleInputChange('natalSex', e.target.value)}
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select gender</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Birth Date
              </Form.Label>
              <Form.Control
                type="date"
                data-testid="birthDate"
                value={
                  formData.birthDate
                    ? dayjs(formData.birthDate).isValid()
                      ? dayjs(formData.birthDate).format('YYYY-MM-DD')
                      : ''
                    : ''
                }
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Educational Grade
              </Form.Label>
              <Form.Select
                value={formData.educationGrade || ''}
                onChange={(e) =>
                  handleInputChange('educationGrade', e.target.value)
                }
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select Grade</option>
                {educationGradeEnum.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Employment Status
              </Form.Label>
              <Form.Select
                value={formData.employmentStatus || ''}
                onChange={(e) =>
                  handleInputChange('employmentStatus', e.target.value)
                }
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select Status</option>
                {employmentStatusEnum.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Marital Status
              </Form.Label>
              <Form.Select
                value={formData.maritalStatus || ''}
                onChange={(e) =>
                  handleInputChange('maritalStatus', e.target.value)
                }
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select Status</option>
                {maritalStatusEnum.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Choose Image
              </Form.Label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  className="btn-hover"
                >
                  Choose
                </Button>
                <span className="text-muted" style={{ fontSize: '14px' }}>
                  {selectedImage ? selectedImage.name : 'Drop Your Image Here'}
                </span>
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #e0e6ed',
                    }}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PersonalInfoSection;
