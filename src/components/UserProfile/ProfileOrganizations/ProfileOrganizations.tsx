/**
 * ProfileOrganizations Component
 *
 * Displays the organizations that the user is a member of using USER_DETAILS query.
 * This is one of the tab contents for the profile view.
 *
 * @component
 * @param {InterfaceProfileOrganizationsProps} props - The props for the component.
 * @param {InterfaceUserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 *
 * @returns {JSX.Element} The rendered ProfileOrganizations component.
 */
import React from 'react';
import { useQuery } from '@apollo/client';
import { Business } from '@mui/icons-material';
import { Card, Spinner } from 'react-bootstrap';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { InterfaceUserData } from '../types';
import styles from 'components/UserPortal/UserProfile/common.module.css';

interface InterfaceProfileOrganizationsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
}

interface InterfaceOrganization {
  id: string;
  name: string;
}

const ProfileOrganizations: React.FC<InterfaceProfileOrganizationsProps> = ({
  user,
}) => {
  const { data, loading, error } = useQuery(USER_DETAILS, {
    variables: { input: { id: user.id } },
  });

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <div className="text-center">
          <Business
            style={{ fontSize: '48px', color: '#dc3545', opacity: 0.5 }}
          />
          <p className="text-danger mt-3">Failed to load organizations</p>
        </div>
      </div>
    );
  }

  const organizations =
    data?.user?.organizationsWhereMember?.edges?.map(
      (edge: { node: InterfaceOrganization }) => edge.node,
    ) || [];

  if (organizations.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: '400px',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <Business
          style={{
            fontSize: '64px',
            color: '#6c757d',
            marginBottom: '20px',
            opacity: 0.5,
          }}
        />
        <h5 className="text-secondary">No Organizations</h5>
        <p className="text-muted" style={{ maxWidth: '500px' }}>
          This user is not a member of any organizations yet. Organizations they
          join will appear here.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-0 rounded-4 mb-4">
      <Card.Body className={styles.cardBody}>
        <div className="mb-3">
          <h5 className="fw-semibold">Member Organizations</h5>
          <p className="text-muted small mb-0">
            {organizations.length}{' '}
            {organizations.length === 1 ? 'organization' : 'organizations'}
          </p>
        </div>
        <div className={styles.scrollableCardBody}>
          {organizations.map((org: InterfaceOrganization) => (
            <Card
              key={org.id}
              className="mb-3 border"
              data-testid="organization-item"
            >
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: '40px', height: '40px', flexShrink: 0 }}
                  >
                    <Business />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6
                      className="mb-0 fw-semibold"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {org.name}
                    </h6>
                    <small className="text-muted">Member</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileOrganizations;
