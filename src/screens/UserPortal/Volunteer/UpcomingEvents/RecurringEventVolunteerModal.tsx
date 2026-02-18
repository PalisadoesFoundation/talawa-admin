/**
 * Modal for choosing recurring event volunteer scope.
 *
 * component RecurringEventVolunteerModal
 * @param props - Component props from InterfaceRecurringEventVolunteerModalProps.
 * @returns JSX.Element.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import type { InterfaceRecurringEventVolunteerModalProps } from 'types/UserPortal/RecurringEventVolunteerModal/interface';
import styles from './RecurringEventVolunteerModal.module.css';

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
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });

  const [selectedOption, setSelectedOption] = useState<'series' | 'instance'>(
    'series',
  );

  /**
   * Handles form submission by calling the appropriate callback based on user selection
   */
  const handleSubmit = (): void => {
    if (selectedOption === 'series') {
      onSelectSeries();
    } else {
      onSelectInstance();
    }
  };

  const formattedDate = new Date(eventDate).toLocaleDateString();

  const title = isForGroup
    ? t('recurringGroupTitle', { groupName, eventName })
    : t('recurringVolunteerTitle', { eventName });

  const description = isForGroup
    ? t('recurringGroupDescription', { groupName })
    : t('recurringVolunteerDescription');

  const seriesLabel = t('volunteerForEntireSeries');
  const seriesDescription = isForGroup
    ? t('joinGroupForSeriesDescription')
    : t('volunteerForSeriesDescription');

  const instanceLabel = t('volunteerForThisInstanceOnly');
  const instanceDescription = isForGroup
    ? t('joinGroupForInstanceDescription', { date: formattedDate })
    : t('volunteerForInstanceDescription', { date: formattedDate });

  return (
    <CRUDModalTemplate
      open={show}
      title={title}
      onClose={onHide}
      onPrimary={handleSubmit}
      primaryText={t('submitRequest')}
      data-testid="recurringEventModal"
    >
      <p className="mb-4">{description}</p>

      <fieldset className={styles.radioFieldset}>
        <legend className={styles.radioLegend}>{t('volunteerScope')}</legend>
        <div className={styles.radioGroup}>
          <div className={styles.radioOption}>
            <input
              type="radio"
              name="volunteerScope"
              id="seriesOption"
              value="series"
              checked={selectedOption === 'series'}
              onChange={() => setSelectedOption('series')}
              data-testid="volunteerForSeriesOption"
            />
            <label htmlFor="seriesOption" className={styles.radioLabel}>
              <strong>{seriesLabel}</strong>
              <div className={styles.radioDescription}>{seriesDescription}</div>
            </label>
          </div>

          <div className={styles.radioOption}>
            <input
              type="radio"
              name="volunteerScope"
              id="instanceOption"
              value="instance"
              checked={selectedOption === 'instance'}
              onChange={() => setSelectedOption('instance')}
              data-testid="volunteerForInstanceOption"
            />
            <label htmlFor="instanceOption" className={styles.radioLabel}>
              <strong>{instanceLabel}</strong>
              <div className={styles.radioDescription}>
                {instanceDescription}
              </div>
            </label>
          </div>
        </div>
      </fieldset>
    </CRUDModalTemplate>
  );
};

export default RecurringEventVolunteerModal;
