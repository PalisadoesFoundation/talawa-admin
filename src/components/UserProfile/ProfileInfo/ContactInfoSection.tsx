/**
 * ContactInfoSection Component
 *
 * This component renders the contact information section of the user profile form.
 * It includes fields for email, phone numbers, and address information.
 *
 * @param props - The component props
 * @param props.formData - The form data containing user information
 * @param props.handleInputChange - Function to handle input changes
 * @returns JSX element representing the contact information section
 */
import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { countryOptions } from 'utils/formEnumFields';
import { InterfaceUserData } from '../types';

interface InterfaceContactInfoSectionProps {
  formData: Partial<InterfaceUserData>;
  handleInputChange: (field: string, value: string) => void;
}

const ContactInfoSection: React.FC<InterfaceContactInfoSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-3 mb-4">
      <Card.Header
        className="border-0 rounded-top-3"
        style={{ backgroundColor: '#f8f9fa', padding: '16px 24px' }}
      >
        <h6 className="mb-0 fw-semibold" style={{ color: '#495057' }}>
          Contact Information
        </h6>
      </Card.Header>
      <Card.Body style={{ padding: '24px' }}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Phone no.
              </Form.Label>
              <Form.Control
                type="tel"
                value={formData.mobilePhoneNumber || ''}
                onChange={(e) =>
                  handleInputChange('mobilePhoneNumber', e.target.value)
                }
                placeholder="Enter phone number"
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
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                data-testid="inputEmail"
                value={formData.emailAddress || ''}
                onChange={(e) =>
                  handleInputChange('emailAddress', e.target.value)
                }
                placeholder="Enter email address"
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
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                data-testid="inputPassword"
                placeholder="Enter new password (leave blank to keep current)"
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
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Address Line 1
              </Form.Label>
              <Form.Control
                type="text"
                data-testid="addressLine1"
                value={formData.addressLine1 || ''}
                onChange={(e) =>
                  handleInputChange('addressLine1', e.target.value)
                }
                placeholder="Street address"
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
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Address Line 2
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.addressLine2 || ''}
                onChange={(e) =>
                  handleInputChange('addressLine2', e.target.value)
                }
                placeholder="Apt, suite, etc. (optional)"
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
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">
                Country
              </Form.Label>
              <Form.Select
                data-testid="inputCountry"
                value={formData.countryCode || ''}
                onChange={(e) =>
                  handleInputChange('countryCode', e.target.value)
                }
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e0e6ed',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select Country</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark mb-2">City</Form.Label>
              <Form.Control
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
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
                State
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
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
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContactInfoSection;
