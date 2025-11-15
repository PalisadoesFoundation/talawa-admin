/**
 * ProfileEvents Component - Exactly matching Figma Design
 *
 * This component displays user's events with filters, search, and event cards
 * exactly matching the Figma design specifications.
 */
import React, { useState } from 'react';
import { Button, Form, Row, Col, Card, Dropdown, Modal } from 'react-bootstrap';
import { InterfaceUserData } from '../types';

interface InterfaceProfileEventsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
  isEditing: boolean;
  onSave: (data: Partial<InterfaceUserData>) => Promise<void>;
}

const ProfileEvents: React.FC<InterfaceProfileEventsProps> = () => {
  // TODO: Use user, isOwnProfile, isEditing, onSave props for real implementation
  // State management for events functionality
  const [selectedFilter, setSelectedFilter] = useState('Created Events');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [editingEvent, setEditingEvent] = useState<{
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: string;
  } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock events data
  const allEvents = [
    {
      id: 1,
      title: 'Lorem ipsum dolor ammet',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      startTime: '18:00',
      endTime: '22:00',
      date: '16th Dec 2023',
    },
    {
      id: 2,
      title: 'Community Meeting',
      description: 'Monthly community gathering and updates',
      startTime: '19:00',
      endTime: '21:00',
      date: '20th Dec 2023',
    },
    {
      id: 3,
      title: 'Workshop Session',
      description: 'Technical workshop on new features',
      startTime: '14:00',
      endTime: '17:00',
      date: '25th Dec 2023',
    },
    {
      id: 4,
      title: 'Team Building',
      description: 'Fun activities and team bonding',
      startTime: '10:00',
      endTime: '16:00',
      date: '30th Dec 2023',
    },
    {
      id: 5,
      title: 'Training Program',
      description: 'Skills development and training',
      startTime: '09:00',
      endTime: '12:00',
      date: '5th Jan 2024',
    },
    {
      id: 6,
      title: 'Annual Conference',
      description: 'Yearly conference with keynote speakers',
      startTime: '08:00',
      endTime: '18:00',
      date: '15th Jan 2024',
    },
  ];

  // Filter and search functionality with sorting
  const filteredEvents = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const base = Array.isArray(allEvents) ? allEvents : [];
    const bySearch = q
      ? base.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.description?.toLowerCase().includes(q),
        )
      : base;
    // Sort by title for now (can be extended to date when real date fields exist)
    return [...bySearch].sort((a, b) =>
      sortOrder === 'title' ? a.title.localeCompare(b.title) : 0,
    );
  }, [allEvents, searchTerm, sortOrder]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'title' ? 'date' : 'title'));
  };

  const handleEditEvent = (eventId: number) => {
    const eventToEdit = allEvents.find((event) => event.id === eventId);
    if (eventToEdit) {
      setEditingEvent({ ...eventToEdit });
      setShowEditModal(true);
    }
  };

  const handleSaveEvent = async () => {
    if (editingEvent) {
      try {
        // TODO: Call GraphQL mutation to update event
        // await updateEventMutation({ variables: { id: editingEvent.id, ...editingEvent } });
        setShowEditModal(false);
        setEditingEvent(null);
      } catch (error) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingEvent(null);
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
                onClick={() => handleFilterChange('Created Events')}
              >
                Created Events
              </Dropdown.Item>
              <Dropdown.Item
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() => handleFilterChange('Admin For Events')}
              >
                Admin For Events
              </Dropdown.Item>
              <Dropdown.Item
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() => handleFilterChange('Registered Events')}
              >
                Registered Events
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
          >
            <i className="fas fa-sort me-2"></i>
            Sort ({sortOrder})
          </Button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Search created events"
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
            onClick={() => {
              /* Search already applied via onChange */
            }}
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

      {/* Events Grid */}
      <Row>
        {filteredEvents.length === 0 && (
          <Col md={12} className="text-muted text-center py-4">
            No events found
          </Col>
        )}
        {filteredEvents.map((event, index) => (
          <Col key={event.id} md={6} className="mb-4">
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: '12px',
                borderLeft: index === 0 ? '4px solid #007bff' : 'none',
              }}
            >
              <Card.Body style={{ padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-center">
                      <div
                        className="fw-bold"
                        style={{
                          fontSize: '24px',
                          color: '#007bff',
                          lineHeight: '1.2',
                        }}
                      >
                        {event.startTime}
                      </div>
                      <small
                        className="text-muted"
                        style={{ fontSize: '12px' }}
                      >
                        {event.date}
                      </small>
                    </div>
                    <div
                      className="text-center mx-3"
                      style={{ minWidth: '30px' }}
                    >
                      <small
                        className="text-muted fw-medium"
                        style={{ fontSize: '12px' }}
                      >
                        TO
                      </small>
                    </div>
                    <div className="text-center">
                      <div
                        className="fw-bold"
                        style={{
                          fontSize: '24px',
                          color: '#007bff',
                          lineHeight: '1.2',
                        }}
                      >
                        {event.endTime}
                      </div>
                      <small
                        className="text-muted"
                        style={{ fontSize: '12px' }}
                      >
                        {event.date}
                      </small>
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditEvent(event.id)}
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
                      const target = e.currentTarget as HTMLElement;
                      target.style.backgroundColor = '#007bff';
                      target.style.color = '#ffffff';
                      target.style.transform = 'scale(1.05)';
                      target.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.backgroundColor = 'transparent';
                      target.style.color = '#007bff';
                      target.style.transform = 'scale(1)';
                      target.style.boxShadow = 'none';
                    }}
                  >
                    <i
                      className="fas fa-edit me-1"
                      style={{ fontSize: '10px' }}
                    ></i>
                    Edit
                  </Button>
                </div>

                <h6
                  className="mb-2 fw-semibold"
                  style={{ fontSize: '16px', color: '#212529' }}
                >
                  {event.title}
                </h6>
                <p
                  className="text-muted mb-0"
                  style={{ fontSize: '14px', lineHeight: '1.4' }}
                >
                  {event.description}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingEvent && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter event title"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingEvent.date}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          date: e.target.value,
                        })
                      }
                      placeholder="Enter event date"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={editingEvent.startTime}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={editingEvent.endTime}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter event description"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileEvents;
