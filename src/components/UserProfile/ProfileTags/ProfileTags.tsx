/**
 * ProfileTags Component
 *
 * Displays the tags associated with the user. This tab is only visible to administrators.
 * This is one of the tab contents for the profile view.
 *
 * @component
 * @param {ProfileTagsProps} props - The props for the component.
 * @param {UserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 *
 * @returns {JSX.Element} The rendered ProfileTags component.
 */
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { InterfaceUserData } from '../types';

interface InterfaceProfileTagsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
}

const ProfileTags: React.FC<InterfaceProfileTagsProps> = () =>
  // { user, isOwnProfile }
  {
    // State management for tags functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('name');

    // Mock tags data
    const allTags = [
      {
        id: 1,
        name: 'Lorem Ipsum',
        assignedTo: '167',
        createdOn: '18:00 12 May 2023',
        createdBy: 'John Doe',
      },
      {
        id: 2,
        name: 'Tech Skills',
        assignedTo: '245',
        createdOn: '14:30 15 May 2023',
        createdBy: 'Jane Smith',
      },
      {
        id: 3,
        name: 'Leadership',
        assignedTo: '89',
        createdOn: '09:15 18 May 2023',
        createdBy: 'Mike Johnson',
      },
      {
        id: 4,
        name: 'Creative',
        assignedTo: '156',
        createdOn: '16:45 20 May 2023',
        createdBy: 'Sarah Wilson',
      },
      {
        id: 5,
        name: 'Communication',
        assignedTo: '203',
        createdOn: '11:20 22 May 2023',
        createdBy: 'David Brown',
      },
    ];

    // Filter and search functionality
    const filteredTags = allTags
      .filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortOrder === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          // Sort by date (assuming createdOn format is consistent)
          return (
            new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
          );
        }
      });

    const handleSearch = (term: string) => {
      setSearchTerm(term);
    };

    const handleSort = () => {
      setSortOrder((prev) => (prev === 'name' ? 'date' : 'name'));
    };

    // TODO: Implement real GraphQL query when backend is ready
    // For now, showing mock data

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-2">
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
                button.style.zIndex = '1000';
              }}
              onMouseLeave={(e) => {
                const button = e.currentTarget as HTMLElement;
                button.style.backgroundColor = 'transparent';
                button.style.borderColor = '#dee2e6';
                button.style.color = '#495057';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
                button.style.zIndex = 'auto';
              }}
            >
              <i className="fas fa-sort me-2"></i>
              Sort ({sortOrder})
            </Button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="text"
              placeholder="Search tags"
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

        <div
          className="rounded-3 p-4 shadow-sm"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e0e6ed' }}
        >
          <div className="table-responsive">
            <table
              className="table table-hover mb-0"
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th
                    className="fw-semibold pb-3 pt-3"
                    style={{
                      fontSize: '14px',
                      color: '#495057',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      padding: '12px 16px',
                    }}
                  >
                    Tag name
                  </th>
                  <th
                    className="fw-semibold pb-3 pt-3"
                    style={{
                      fontSize: '14px',
                      color: '#495057',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      padding: '12px 16px',
                    }}
                  >
                    Assigned to
                  </th>
                  <th
                    className="fw-semibold pb-3 pt-3"
                    style={{
                      fontSize: '14px',
                      color: '#495057',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      padding: '12px 16px',
                    }}
                  >
                    Created on
                  </th>
                  <th
                    className="fw-semibold pb-3 pt-3"
                    style={{
                      fontSize: '14px',
                      color: '#495057',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6',
                      padding: '12px 16px',
                    }}
                  >
                    Created by
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag, index) => (
                  <tr
                    key={tag.id}
                    style={{
                      borderBottom: '1px solid #e9ecef',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                    }}
                  >
                    <td
                      className="py-3"
                      style={{
                        fontSize: '14px',
                        color: '#212529',
                        fontWeight: '500',
                        padding: '12px 16px',
                      }}
                    >
                      <i
                        className="fas fa-tag me-2"
                        style={{ color: '#007bff' }}
                      ></i>
                      {tag.name}
                    </td>
                    <td
                      className="py-3"
                      style={{
                        fontSize: '14px',
                        color: '#495057',
                        padding: '12px 16px',
                      }}
                    >
                      <span className="badge bg-primary rounded-pill">
                        {tag.assignedTo}
                      </span>
                    </td>
                    <td
                      className="py-3"
                      style={{
                        fontSize: '14px',
                        color: '#6c757d',
                        padding: '12px 16px',
                      }}
                    >
                      <i
                        className="fas fa-clock me-2"
                        style={{ color: '#6c757d' }}
                      ></i>
                      {tag.createdOn}
                    </td>
                    <td
                      className="py-3"
                      style={{
                        fontSize: '14px',
                        color: '#007bff',
                        padding: '12px 16px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: Navigate to creator's profile
                          // e.g., navigate(`/profile/${tag.creatorId}`)
                        }}
                        style={{
                          color: '#007bff',
                          textDecoration: 'none',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                        }}
                      >
                        <i className="fas fa-user me-2"></i>
                        {tag.createdBy}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

export default ProfileTags;
