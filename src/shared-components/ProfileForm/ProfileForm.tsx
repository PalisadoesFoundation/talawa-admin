/**
 * ProfileForm Component - Unified Profile Management (REFACTORED)
 *
 * This component provides a comprehensive profile management interface that handles
 * three distinct use cases:
 * - **User Profile**: When users view/edit their own profile (/user/settings)
 * - **Member Profile**: When admins view/edit organization member profiles (/member/:orgId/:userId)
 * - **Admin Profile**: When super admins view/edit admin profiles (/adminprofile/settings)
 *
 * REFACTORED ARCHITECTURE:
 * - useProfileFormState: Manages form state, validation, and field changes
 * - useProfileData: Handles GraphQL queries and mutations
 * - PersonalDetailsCard: Renders personal information section
 * - ContactInfoCard: Renders contact information section
 * - ActivityCards: Renders events and tags sections
 * - profileFormHelpers: Business logic utilities
 *
 * @returns The rendered ProfileForm component with context-appropriate layout
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { Card, Row, Col, Button } from 'react-bootstrap';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import useLocalStorage from 'utils/useLocalstorage';
import MemberAttendedEventsModal from 'components/MemberActivity/Modal/EventsAttendedMemberModal';
import ProfileFormWrapper from './ProfileFormWrapper';
import { languages } from 'utils/languages';

// Custom Hooks
import { useProfileFormState } from './hooks/useProfileFormState';
import { useProfileData } from './hooks/useProfileData';

// Sub-components
import PersonalDetailsCard from './PersonalDetailsCard';
import ContactInfoCard from './ContactInfoCard';
import ActivityCards from './ActivityCards';

// Utilities
import {
  prepareUpdatePayload,
  handleProfileUpdate,
  determineUserContext,
} from '../../utils/profileFormHelpers';

// Styles
import profileForm from './profileForm.module.css';

/**
 * Main ProfileForm Component
 */
const MemberDetail: React.FC = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const params = useParams();
  const { getItem, setItem } = useLocalStorage();

  // Modal state
  const [show, setShow] = useState(false);

  // Sidebar state
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  // Determine user context (isUser, isAdmin, or member view)
  const { isUser, isAdmin } = determineUserContext(location.pathname);
  const userId: string =
    (!(isUser || isAdmin)
      ? params.userId
      : getItem('userId') || getItem('id')) || '';

  // Initialize form state management hook
  const {
    formState,
    setFormState,
    selectedAvatar,
    setSelectedAvatar,
    isUpdated,
    setIsUpdated,
    fileInputRef,
    handleFieldChange,
    handleFileUpload,
    resetChanges,
    initializeFormState,
  } = useProfileFormState(tCommon);

  // Initialize data fetching hook
  const { userData, loading, executeUpdate } = useProfileData({
    userId,
    isUser,
    isAdmin,
    onDataLoaded: initializeFormState,
  });

  // Set page title
  useEffect(() => {
    document.title = t('title');
  }, [t]);

  /**
   * Handles profile update submission
   */
  const handleUserUpdate = async (): Promise<void> => {
    const input = await prepareUpdatePayload(
      formState,
      selectedAvatar,
      userId,
      isUser,
      isAdmin,
      tCommon,
    );

    if (!input) return;

    await handleProfileUpdate(
      executeUpdate,
      input,
      isUser,
      isAdmin,
      setItem,
      setSelectedAvatar,
      setIsUpdated,
      tCommon,
      t,
    );
  };

  /**
   * Toggles events attended modal
   */
  const handleEventsAttendedModal = (): void => {
    setShow(!show);
  };

  /**
   * Resets form to original state
   */
  const handleResetChanges = (): void => {
    resetChanges(userData);
  };

  return (
    <LoadingState isLoading={loading} variant="spinner">
      {/* Events Attended Modal */}
      {show && (
        <MemberAttendedEventsModal
          eventsAttended={userData?.user?.eventsAttended}
          show={show}
          setShow={setShow}
        />
      )}

      {/* Main Form Wrapper */}
      <ProfileFormWrapper
        isUser={isUser}
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        tCommon={tCommon}
      >
        <Row className="g-4 mt-1">
          {/* Left Column - Personal Details & Activity */}
          <Col md={6}>
            {/* Personal Details Card */}
            <PersonalDetailsCard
              formState={formState}
              setFormState={setFormState}
              selectedAvatar={selectedAvatar}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              userRole={userData?.user?.role}
              handleFieldChange={handleFieldChange}
              handleFileUpload={handleFileUpload}
            />

            {/* Activity Cards (Events & Tags) */}
            <ActivityCards
              eventsAttended={userData?.user?.eventsAttended || []}
              onViewAllEvents={handleEventsAttendedModal}
            />
          </Col>

          {/* Right Column - Contact Information */}
          <Col md={6}>
            <ContactInfoCard
              formState={formState}
              emailAddress={userData?.user?.emailAddress || ''}
              handleFieldChange={handleFieldChange}
            />
          </Col>

          {/* Action Buttons - Shown only when form is updated */}
          {isUpdated && (
            <Col md={12}>
              <Card.Footer className="border-top-0 d-flex justify-content-end gap-2 py-3 px-2">
                <Button
                  variant="outline-secondary"
                  onClick={handleResetChanges}
                  data-testid="resetChangesBtn"
                >
                  {tCommon('resetChanges')}
                </Button>
                <Button
                  variant="outline"
                  className={profileForm.member_details_style}
                  onClick={handleUserUpdate}
                  data-testid="saveChangesBtn"
                >
                  {tCommon('saveChanges')}
                </Button>
              </Card.Footer>
            </Col>
          )}
        </Row>
      </ProfileFormWrapper>
    </LoadingState>
  );
};

/**
 * Helper function to get language name from language code
 * @param code - Language code
 * @returns Language name or null if not found
 */
export const getLanguageName = (code: string): string | null => {
  const found = languages.find((data) => data.code === code);
  return found?.name ?? null;
};

export default MemberDetail;