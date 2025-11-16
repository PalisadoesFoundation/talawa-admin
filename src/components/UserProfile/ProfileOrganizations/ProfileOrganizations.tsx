/**
 * ProfileOrganizations Component
 *
 * Displays the organizations that the user is a member of or administers.
 * This is one of the tab contents for the profile view.
 *
 * @component
 * @param {ProfileOrganizationsProps} props - The props for the component.
 * @param {UserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 *
 * @returns {JSX.Element} The rendered ProfileOrganizations component.
 */
import React, { useState } from 'react';
import { Button, Form, Row, Col, Card, Dropdown, Modal } from 'react-bootstrap';
import { InterfaceUserData } from '../types';

interface InterfaceProfileOrganizationsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
}

interface InterfaceOrganization {
  id: number;
  name: string;
  description: string;
  admins: string;
  members: string;
  role: string;
}

const ProfileOrganizations: React.FC<InterfaceProfileOrganizationsProps> = ({
  user,
}) => {
  // State management for organizations functionality
  const [selectedFilter, setSelectedFilter] = useState('Created Organizations');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name');
  const [editingOrg, setEditingOrg] = useState<InterfaceOrganization | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);

  // Backend data from USER_DETAILS or CURRENT_USER query
  // organizationsWhereMember field provides the data
  const backendOrgs = user?.organizationsWhereMember?.edges || [];

  // Map backend data to component format
  const allOrganizations: InterfaceOrganization[] = backendOrgs.map(
    (edge, index: number) => ({
      id: index + 1,
      name: edge.node?.name || 'Unknown Organization',
      description: edge.node?.description || '',
      admins: '0', // Not available in basic query
      members: '0', // Not available in basic query
      role: 'Member',
    }),
  );

  // Filter and search functionality
  const filteredOrganizations = allOrganizations
    .filter(
      (org: InterfaceOrganization) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a: InterfaceOrganization, b: InterfaceOrganization) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Sort by members count (convert string to number)
        return parseInt(b.members) - parseInt(a.members);
      }
    });

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'name' ? 'members' : 'name'));
  };

  const handleEditOrganization = (orgId: number) => {
    const orgToEdit = allOrganizations.find(
      (org: InterfaceOrganization) => org.id === orgId,
    );
    if (orgToEdit) {
      setEditingOrg({ ...orgToEdit });
      setShowEditModal(true);
    }
  };

  const handleSaveOrganization = async () => {
    if (editingOrg) {
      try {
        // TODO: Call GraphQL mutation to update organization
        // await updateOrganization({ variables: { id: editingOrg.id, name: editingOrg.name, description: editingOrg.description } });
        setShowEditModal(false);
        setEditingOrg(null);
      } catch (error) {
        console.error('Error updating organization:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingOrg(null);
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              style={{
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #dee2e6',
                color: '#495057',
                backgroundColor: '#e6f3ff',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              className="dropdown-toggle-hover"
              onMouseEnter={(e) => {
                const button = e.currentTarget as HTMLElement;
                button.style.backgroundColor = '#007bff';
                button.style.color = '#ffffff';
                button.style.borderColor = '#007bff';
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
              }}
              onMouseLeave={(e) => {
                const button = e.currentTarget as HTMLElement;
                button.style.backgroundColor = '#e6f3ff';
                button.style.color = '#495057';
                button.style.borderColor = '#dee2e6';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-filter me-2"></i>
              {selectedFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() => handleFilterChange('Created Organizations')}
              >
                Created Organizations
              </Dropdown.Item>
              <Dropdown.Item
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() => handleFilterChange('Joined Organizations')}
              >
                Joined Organizations
              </Dropdown.Item>
              <Dropdown.Item
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() =>
                  handleFilterChange('Organization User Belongs To')
                }
              >
                Organization User Belongs To
              </Dropdown.Item>
              <Dropdown.Item
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() => handleFilterChange('Blocked by Organizations')}
              >
                Blocked by Organizations
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleSort}
            style={{
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #dee2e6',
              color: '#495057',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const button = e.currentTarget as HTMLElement;
              button.style.backgroundColor = '#007bff';
              button.style.borderColor = '#007bff';
              button.style.color = '#ffffff';
              button.style.transform = 'translateY(-2px)';
              button.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
            }}
            onMouseLeave={(e) => {
              const button = e.currentTarget as HTMLElement;
              button.style.backgroundColor = 'transparent';
              button.style.borderColor = '#dee2e6';
              button.style.color = '#495057';
              button.style.transform = 'translateY(0)';
              button.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-sort me-2"></i>
            Sort ({sortOrder})
          </Button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Search created organizations"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '300px',
              borderRadius: '6px',
              border: '1px solid #dee2e6',
              padding: '8px 12px',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => console.log('Search clicked:', searchTerm)}
            style={{
              borderRadius: '6px',
              padding: '8px 12px',
              backgroundColor: '#007bff',
              border: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-search"></i>
          </Button>
        </div>
      </div>

      {/* Organizations Grid */}
      {filteredOrganizations.length === 0 ? (
        <div className="text-center py-5" style={{ color: '#6c757d' }}>
          <i
            className="fas fa-building"
            style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}
          />
          <h5>No organizations found</h5>
          <p>You are not a member of any organizations yet.</p>
        </div>
      ) : (
        <Row>
          {filteredOrganizations.map((org: InterfaceOrganization) => (
            <Col key={org.id} md={6} className="mb-4">
              <Card
                className="border-0 shadow-sm"
                style={{ borderRadius: '12px' }}
              >
                <Card.Body style={{ padding: '20px' }}>
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1">
                      <div
                        className="rounded me-3 bg-light d-flex align-items-center justify-content-center"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                        }}
                      >
                        <i
                          className="fas fa-building"
                          style={{
                            fontSize: '28px',
                            color: '#6c757d',
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6
                          className="mb-1 fw-semibold"
                          style={{ fontSize: '16px', color: '#212529' }}
                        >
                          {org.name}
                        </h6>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: '14px', marginBottom: '8px' }}
                        >
                          {org.description}
                        </p>
                        <div>
                          <div
                            className="text-muted"
                            style={{ fontSize: '12px', lineHeight: '1.4' }}
                          >
                            <span>Admins: </span>
                            <span className="fw-medium">{org.admins}</span>
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: '12px', lineHeight: '1.4' }}
                          >
                            <span>Members: </span>
                            <span className="fw-medium">{org.members}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditOrganization(org.id)}
                      style={{
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #007bff',
                        color: '#007bff',
                        backgroundColor: 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        const button = e.currentTarget as HTMLElement;
                        button.style.backgroundColor = '#007bff';
                        button.style.color = '#ffffff';
                        button.style.transform = 'scale(1.05)';
                        button.style.boxShadow =
                          '0 2px 4px rgba(0,123,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        const button = e.currentTarget as HTMLElement;
                        button.style.backgroundColor = 'transparent';
                        button.style.color = '#007bff';
                        button.style.transform = 'scale(1)';
                        button.style.boxShadow = 'none';
                      }}
                    >
                      <i
                        className="fas fa-edit me-1"
                        style={{ fontSize: '10px' }}
                      ></i>
                      Edit
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit Organization Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingOrg && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Organization Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingOrg.name}
                  onChange={(e) =>
                    setEditingOrg({ ...editingOrg, name: e.target.value })
                  }
                  placeholder="Enter organization name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingOrg.description}
                  onChange={(e) =>
                    setEditingOrg({
                      ...editingOrg,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter organization description"
                />
              </Form.Group>
              {/* Admin and member counts are derived and should not be editable */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveOrganization}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileOrganizations;
