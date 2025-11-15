/**
 * UserProfile Component
 *
 * A unified profile component that matches the Figma design and can be used
 * in both Admin and User portals. Provides tabbed interface for viewing
 * user information, organizations, events, and tags (admin only).
 *
 * @component
 * @param {UserProfileProps} props - The props for the component.
 * @param {string} [props.userId] - Optional user ID to fetch and display details.
 * @param {boolean} [props.isOwnProfile] - Whether this is the current user's own profile.
 * @param {boolean} [props.isAdminView] - Whether this is being viewed by an admin.
 *
 * @returns {JSX.Element} The rendered UserProfile component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` and `useMutation` hooks for data operations.
 * - Implements tabbed interface: Profile, Organizations, Events, Tags (admin only).
 * - Provides responsive design that works on different screen sizes.
 * - Handles both view and edit modes for profile information.
 *
 * @example
 * ```tsx
 * <UserProfile userId="12345" isOwnProfile={true} showEditButton={true} />
 * ```
 */
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Nav, Tab, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from 'style/app-fixed.module.css';
import { CURRENT_USER, USER_DETAILS } from 'GraphQl/Queries/Queries';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import Loader from 'components/Loader/Loader';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import ProfileOrganizations from './ProfileOrganizations/ProfileOrganizations';
import ProfileEvents from './ProfileEvents/ProfileEvents';
import ProfileTags from './ProfileTags/ProfileTags';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceUserProfileProps {
  userId?: string;
  isOwnProfile?: boolean;
  isAdminView?: boolean;
}

interface InterfaceUserData {
  id: string;
  name: string;
  emailAddress: string;
  avatarURL?: string;
  description?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
  homePhoneNumber?: string;
  mobilePhoneNumber?: string;
  workPhoneNumber?: string;
  educationGrade?: string;
  employmentStatus?: string;
  maritalStatus?: string;
  natalSex?: string;
  naturalLanguageCode?: string;
  createdAt: string;
  role?: string;
}

const UserProfile: React.FC<InterfaceUserProfileProps> = ({
  userId,
  isOwnProfile = false,
  isAdminView = false,
}) => {
  const { t: tCommon } = useTranslation('common');
  // Try to get location, fallback to null if Router context is missing (e.g., in tests)
  let location: ReturnType<typeof useLocation> | null = null;
  try {
    location = useLocation();
  } catch {
    // Router context not available, location will remain null
  }
  const { getItem } = useLocalStorage();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    isAdminView ? 'ADMIN' : 'USER',
  );
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user ID from various sources
  const currentUserId = userId || location?.state?.id || getItem('id');
  const userRole = getItem('role');
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  // Determine which query to use based on whether it's own profile or not
  const { data, loading, error, refetch } = useQuery(
    isOwnProfile ? CURRENT_USER : USER_DETAILS,
    {
      variables: isOwnProfile ? {} : { input: { id: currentUserId } },
      skip: !isOwnProfile && !currentUserId,
      errorPolicy: 'all',
    },
  );

  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);

  // Fallback demo data - only used when backend is unavailable
  const DEMO_USER_DATA: InterfaceUserData = React.useMemo(
    () => ({
      id: currentUserId || 'demo-user-123',
      name: 'John Doe',
      emailAddress: 'johndoe@example.com',
      avatarURL: undefined,
      description: 'Software Developer | Open Source Enthusiast',
      birthDate: '1990-01-15',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'San Francisco',
      state: 'California',
      countryCode: 'US',
      postalCode: '94102',
      homePhoneNumber: '+1-415-555-0123',
      mobilePhoneNumber: '+1-415-555-0456',
      workPhoneNumber: '+1-415-555-0789',
      educationGrade: 'GRADUATE',
      employmentStatus: 'EMPLOYED',
      maritalStatus: 'SINGLE',
      natalSex: 'MALE',
      naturalLanguageCode: 'en',
      createdAt: '2023-01-01T00:00:00.000Z',
      role: (userRole as string) || 'USER',
    }),
    [currentUserId, userRole],
  );

  // Priority: real backend data > demo data (only if backend fails)
  const userData: InterfaceUserData | null = React.useMemo(() => {
    // If we have real data from backend, use it
    if (data) {
      return isOwnProfile ? data.currentUser : data.user;
    }
    // Only use demo data if backend fails or is unavailable
    if (error) {
      return DEMO_USER_DATA;
    }
    // While loading, return null
    return null;
  }, [data, isOwnProfile, error, DEMO_USER_DATA]);

  useEffect(() => {
    if (error) {
      toast.info('Unable to fetch profile data. Showing demo data.', {
        toastId: 'profile-demo-data',
        autoClose: 3000,
      });
    }
  }, [error]);

  // Always show content, even during loading or error (with demo data)
  if (loading && !userData) return <Loader />;

  // Always use userData (which includes DEMO_USER_DATA as fallback)
  const displayUserData = userData || DEMO_USER_DATA;

  const handleSaveProfile = async (updatedData: Partial<InterfaceUserData>) => {
    try {
      await updateUser({
        variables: { input: updatedData },
      });
      toast.success(tCommon('updatedSuccessfully', { item: 'Profile' }));
      setIsEditing(false);
      refetch();
    } catch (error) {
      errorHandler(null, error);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
    // Add role change logic here
  };

  const getTabIcon = (tabKey: string) => {
    switch (tabKey) {
      case 'profile':
        return 'fas fa-user';
      case 'organizations':
        return 'fas fa-building';
      case 'events':
        return 'fas fa-calendar';
      case 'tags':
        return 'fas fa-tags';
      default:
        return 'fas fa-circle';
    }
  };

  const tabs = [
    { key: 'profile', label: 'Overview', component: ProfileInfo },
    {
      key: 'organizations',
      label: 'Organizations',
      component: ProfileOrganizations,
    },
    { key: 'events', label: 'Events', component: ProfileEvents },
  ];

  // Add Tags tab only for admin view
  if (isAdminView || isAdmin) {
    tabs.push({ key: 'tags', label: 'Tags', component: ProfileTags });
  }

  return (
    <div
      className={styles.mainContainer}
      style={{
        marginTop: '-25px',
        overflow: 'visible',
        padding: '5px 20px 15px 20px',
      }}
    >
      {/* Top Right Profile Box */}
      <div
        className="d-flex justify-content-end align-items-center mb-4"
        style={{
          position: 'relative',
          zIndex: 1001,
          overflow: 'visible',
        }}
      >
        <div
          className="d-flex align-items-center p-3 shadow"
          ref={dropdownRef}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1001,
            minWidth: '280px',
            maxWidth: '320px',
            border: '1px solid #e0e6ed',
            overflow: 'visible',
          }}
        >
          <div
            className="rounded-circle text-white d-flex align-items-center justify-content-center me-3"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#007bff',
              fontSize: '16px',
              fontWeight: '500',
              color: '#ffffff',
            }}
          >
            {displayUserData?.name
              ? displayUserData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'UN'}
          </div>
          <div
            className="d-flex align-items-center"
            style={{ flex: 1, minWidth: 0 }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="fw-semibold"
                data-testid="profile-name"
                style={{
                  fontSize: '16px',
                  color: '#212529',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '180px',
                }}
              >
                {displayUserData?.name || 'User Name'}
              </div>
              <div
                className="text-muted"
                data-testid="profile-email"
                style={{
                  fontSize: '13px',
                  color: '#6c757d',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '180px',
                }}
              >
                {displayUserData?.emailAddress || 'user@example.com'}
              </div>
              <div className="position-relative">
                <small
                  className="text-muted fw-medium"
                  style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={showRoleDropdown}
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowRoleDropdown(!showRoleDropdown);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {(
                    (displayUserData?.role || userRole || 'USER') as string
                  ).toUpperCase()}
                </small>
                {showRoleDropdown && (
                  <div
                    className="position-absolute bg-white border rounded shadow-sm"
                    style={{
                      top: '100%',
                      right: '0',
                      minWidth: '100px',
                      zIndex: 1000,
                      marginTop: '4px',
                    }}
                  >
                    <div
                      className="px-3 py-2 text-center"
                      style={{
                        fontSize: '12px',
                        cursor: 'pointer',
                        borderBottom:
                          selectedRole !== 'ADMIN' ? '1px solid #eee' : 'none',
                      }}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRoleChange('ADMIN')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRoleChange('ADMIN');
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      ADMIN
                    </div>
                    <div
                      className="px-3 py-2 text-center"
                      style={{
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => handleRoleChange('USER')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRoleChange('USER');
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      USER
                    </div>
                  </div>
                )}
              </div>
            </div>
            <i
              className="fas fa-chevron-down ms-2"
              style={{
                fontSize: '12px',
                color: '#6c757d',
                cursor: 'pointer',
                transform: showRoleDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
              role="button"
              tabIndex={0}
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowRoleDropdown(!showRoleDropdown);
                }
              }}
              aria-label="Toggle role dropdown"
            ></i>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0px' }}>
        <Tab.Container
          id="profile-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || 'profile')}
        >
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Header
              className="border-0 rounded-top-3"
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px 24px',
                position: 'sticky',
                top: '0',
                zIndex: 100,
              }}
            >
              <Nav variant="pills" className="border-0">
                {tabs.map((tab) => (
                  <Nav.Item key={tab.key}>
                    <Nav.Link
                      eventKey={tab.key}
                      data-testid={`${tab.key}-tab`}
                      className="px-3 py-2"
                      style={{
                        color: activeTab === tab.key ? '#495057' : '#6c757d',
                        backgroundColor:
                          activeTab === tab.key ? '#ffffff' : 'transparent',
                        border:
                          activeTab === tab.key
                            ? '1px solid #dee2e6'
                            : '1px solid transparent',
                        borderRadius: '8px',
                        marginRight: '8px',
                        fontSize: '14px',
                        fontWeight: activeTab === tab.key ? '500' : '400',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <i className={`me-2 ${getTabIcon(tab.key)}`}></i>
                      {tab.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Header>
            <Card.Body
              style={{
                padding: '20px',
                height: 'calc(100vh - 300px)',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Tab.Content>
                {tabs.map((tab) => (
                  <Tab.Pane key={tab.key} eventKey={tab.key}>
                    <tab.component
                      user={displayUserData}
                      isOwnProfile={isOwnProfile}
                      onSave={handleSaveProfile}
                      isEditing={isEditing}
                    />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </div>
    </div>
  );
};

export default UserProfile;
