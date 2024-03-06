import React, { useState } from 'react';
import { ActionItemsModal } from './ActionItemsModal';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './ActionItemsWrapper.module.css';
import { useTranslation } from 'react-i18next';

type PropType = {
  orgId: string;
  eventId: string;
};

export const ActionItemsWrapper = (props: PropType): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="light"
        className="text-secondary"
        aria-label="eventDashboardActionItems"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Action Items" fill="var(--bs-secondary)" />
        </div>
        {t('eventActionItems')}
      </Button>
      {showModal && (
        <ActionItemsModal
          show={showModal}
          handleClose={(): void => setShowModal(false)}
          orgId={props.orgId}
          eventId={props.eventId}
        />
      )}
    </>
  );
};
