import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import styles from './EventVolunteers.module.css';
import { HiUserGroup, HiUser } from 'react-icons/hi2';
import Volunteers from './Volunteers';
import VolunteerGroups from './VolunteerGroups';

/**
 * Container Component for Volunteer or VolunteerGroups as per selection.
 *
 * This component allows users switch between Volunteers and VolunteerGroups.
 *
 * @returns The rendered component.
 */
function volunteerContainer(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });

  // Get the organization ID and event ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [dataType, setDataType] = useState<'individual' | 'group'>(
    'individual',
  );

  return (
    <div>
      <div className="mt-2 mb-4 d-flex justify-content-between">
        <span className={styles.titlemodal}>
          {t(`${dataType === 'group' ? 'volunteerGroups' : 'volunteers'}`)}
        </span>
        <div className="d-flex justify-content-center">
          <div
            className={`btn-group ${styles.toggleGroup}`}
            role="group"
            aria-label="Toggle between Pledged and Raised amounts"
          >
            <input
              type="radio"
              className={`btn-check ${styles.toggleBtn}`}
              name="btnradio"
              id="individualRadio"
              checked={dataType === 'individual'}
              onChange={() => setDataType('individual')}
            />
            <label
              className={`btn btn-outline-primary ${styles.toggleBtn}`}
              htmlFor="individualRadio"
            >
              <HiUser className="me-1" />
              {t('individuals')}
            </label>

            <input
              type="radio"
              className={`btn-check`}
              name="btnradio"
              id="groupsRadio"
              onChange={() => setDataType('group')}
              checked={dataType === 'group'}
            />
            <label
              className={`btn btn-outline-primary ${styles.toggleBtn}`}
              htmlFor="groupsRadio"
            >
              <HiUserGroup className="me-1" />
              {t('groups')}
            </label>
          </div>
        </div>
      </div>

      {dataType === 'individual' ? <Volunteers /> : <VolunteerGroups />}
    </div>
  );
}

export default volunteerContainer;
