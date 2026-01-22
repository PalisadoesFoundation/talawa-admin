/**
 * RecurringEventVolunteerModal - Modal for choosing recurring event volunteer scope
 *
 * Allows users to choose whether to volunteer for an entire event series or just a specific instance.
 * Adapts messaging based on individual volunteering vs joining a volunteer group.
 */
import React, { useState } from 'react';
import { Button } from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './RecurringEventVolunteerModal.module.css';
import type { InterfaceRecurringEventVolunteerModalProps } from 'types/UserPortal/RecurringEventVolunteerModal/interface';

/**
 * RecurringEventVolunteerModal component
 *
 * @param show - Whether the modal is visible.
 * @param onHide - Callback to close the modal.
 * @param eventName - Name of the event.
 * @param eventDate - Date of the current event instance.
 * @param onSelectSeries - Handler for entire-series selection.
 * @param onSelectInstance - Handler for single-instance selection.
 * @param isForGroup - Whether joining a volunteer group.
 * @param groupName - Name of the volunteer group (if applicable).
 * @returns JSX.Element
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
  const { t, i18n } = useTranslation('translation', {
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

  const dateObj = new Date(eventDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
      }).format(dateObj)
    : eventDate;
  const hasGroup = isForGroup && Boolean(groupName);
  const groupLabel = groupName ?? '';
  const title = hasGroup
    ? t('joinGroupTitle', { groupName: groupLabel, eventName })
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
      <p id="volunteerScopePrompt" className="mb-4">
        {hasGroup
          ? t('joinGroupQuestion', { groupName: groupLabel })
          : t('volunteerQuestion')}
      </p>

      <div
        className={styles.radioGroup}
        role="radiogroup"
        aria-labelledby="volunteerScopePrompt"
      >
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
                {hasGroup
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
                {hasGroup
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
