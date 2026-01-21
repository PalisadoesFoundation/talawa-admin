import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import Button from 'shared-components/Button/Button';
import MemberAttendedEventsModal from 'components/MemberActivity/Modal/EventsAttendedMemberModal';
import ProfileFormWrapper from './ProfileFormWrapper';
import { useProfileLogic } from './hooks/useProfileLogic';
import PersonalDetailsCard from './PersonalDetailsCard';
import ContactInfoCard from './ContactInfoCard';
import MemberActivitySection from './MemberActivitySection';
import styles from './ProfileForm.module.css';

const MemberDetail: React.FC = (): JSX.Element => {
  const {
    formState,
    userData,
    loading,
    isUpdated,
    selectedAvatar,
    fileInputRef,
    show,
    hideDrawer,
    setHideDrawer,
    setShow,
    isUser,
    handlers,
    t,
    tCommon,
  } = useProfileLogic();

  return (
    <LoadingState isLoading={loading} variant="spinner">
      {show && (
        <MemberAttendedEventsModal
          eventsAttended={userData?.user?.eventsAttended}
          show={show}
          setShow={setShow}
        />
      )}
      <ProfileFormWrapper
        isUser={isUser}
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        tCommon={tCommon}
      >
        <Row className="g-4 mt-1">
          {/* Left Column: Personal Details & Activity */}
          <Col md={6}>
            <PersonalDetailsCard
              formState={formState}
              userData={userData}
              t={t}
              tCommon={tCommon}
              fileInputRef={fileInputRef}
              selectedAvatar={selectedAvatar}
              handleFileUpload={handlers.handleFileUpload}
              handleFieldChange={handlers.handleFieldChange}
            />

            {/* UPDATED: Removed t={t} prop as it is now handled internally */}
            <MemberActivitySection
              events={userData?.user?.eventsAttended}
              onViewAll={handlers.handleEventsAttendedModal}
            />
          </Col>

          {/* Right Column: Contact Information */}
          <Col md={6}>
            <ContactInfoCard
              formState={formState}
              email={userData?.user?.emailAddress}
              t={t}
              tCommon={tCommon}
              handleFieldChange={handlers.handleFieldChange}
            />
          </Col>

          {/* Footer: Action Buttons */}
          {isUpdated && (
            <Col md={12}>
              <Card.Footer className=" border-top-0 d-flex justify-content-end gap-2 py-3 px-2">
                <Button
                  variant="outline-secondary"
                  onClick={handlers.resetChanges}
                  data-testid="resetChangesBtn"
                >
                  {tCommon('resetChanges')}
                </Button>
                <Button
                  variant="outline"
                  className={styles.member_details_style}
                  onClick={handlers.handleUserUpdate}
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

export default MemberDetail;