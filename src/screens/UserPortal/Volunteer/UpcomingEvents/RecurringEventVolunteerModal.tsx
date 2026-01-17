/**
 * RecurringEventVolunteerModal - Modal for choosing recurring event volunteer scope
 *
 * Allows users to choose whether to volunteer for an entire event series or just a specific instance.
 * Adapts messaging based on individual volunteering vs joining a volunteer group.
 */
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './RecurringEventVolunteerModal.module.css';

/**
 * Props for RecurringEventVolunteerModal component
 */
interface InterfaceRecurringEventVolunteerModalProps {
  /** Controls the visibility of the modal */
  show: boolean;
  /** Callback function to hide/close the modal */
  onHide: () => void;
  /** The name of the recurring event */
  eventName: string;
  /** The date of the current event instance */
  eventDate: string;
  /** Callback when user chooses to volunteer for entire series */
  onSelectSeries: () => void;
  /** Callback when user chooses to volunteer for this instance only */
  onSelectInstance: () => void;
  /** Optional flag indicating if this is for joining a volunteer group */
  isForGroup?: boolean;
  /** Optional name of the volunteer group being joined */
  groupName?: string;
}

/**
 * RecurringEventVolunteerModal component
 *
 * @param props - Component props
 * @returns Modal component for volunteer scope selection
 */
const RecurringEventVolunteerModal: React.FC<
  InterfaceRecurringEventVolunteerModalProps
> = ({
  show,
  onHide,
  eventName,
  eventDate,
  onSelectSeries,
  onSelectInstance,
  isForGroup = false,
  groupName,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'recurringEventVolunteerModal',
  });
  const [selectedOption, setSelectedOption] = useState<'series' | 'instance'>(
    'series',
  );

  /**
   * Handles form submission by calling the appropriate callback based on user selection
   */
  const handleSubmit = () => {
    if (selectedOption === 'series') {
      onSelectSeries();
    } else {
      onSelectInstance();
    }
  };

  const formattedDate = new Date(eventDate).toLocaleDateString();
  const title = isForGroup
    ? t('joinGroupTitle', { groupName, eventName })
    : t('volunteerTitle', { eventName });

  const footer = (
    <>
      <Button variant="secondary" onClick={onHide}>
        {t('cancel')}
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        data-testid="submitVolunteerBtn"
      >
        {t('submitRequest')}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={onHide}
      title={title}
      footer={footer}
      centered
      dataTestId="recurringEventModal"
    >
      <p className="mb-4">
        {isForGroup
          ? t('joinGroupQuestion', { groupName })
          : t('volunteerQuestion')}
      </p>

      <div className={styles.radioGroup}>
        <div className={`${styles.radioOption} mb-3`}>
          <label htmlFor="seriesOption" className={styles.radioLabel}>
            <input
              type="radio"
              name="volunteerScope"
              id="seriesOption"
              checked={selectedOption === 'series'}
              onChange={() => setSelectedOption('series')}
              className={styles.radioInput}
              data-testid="volunteerForSeriesOption"
            />
            <div className={styles.radioContent}>
              <strong>{t('volunteerForSeries')}</strong>
              <div className="small text-muted">
                {isForGroup
                  ? t('joinGroupForSeries')
                  : t('volunteerForSeriesDesc')}
              </div>
            </div>
          </label>
        </div>

        <div className={styles.radioOption}>
          <label htmlFor="instanceOption" className={styles.radioLabel}>
            <input
              type="radio"
              name="volunteerScope"
              id="instanceOption"
              checked={selectedOption === 'instance'}
              onChange={() => setSelectedOption('instance')}
              className={styles.radioInput}
              data-testid="volunteerForInstanceOption"
            />
            <div className={styles.radioContent}>
              <strong>{t('volunteerForInstance')}</strong>
              <div className="small text-muted">
                {isForGroup
                  ? t('joinGroupForInstance', { date: formattedDate })
                  : t('volunteerForInstanceDesc', { date: formattedDate })}
              </div>
            </div>
          </label>
        </div>
      </div>
    </BaseModal>
  );
};

export default RecurringEventVolunteerModal;
