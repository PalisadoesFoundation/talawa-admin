import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import styles from '../../style/app.module.css';
import { HiUserGroup, HiUser } from 'react-icons/hi2';
import Volunteers from './Volunteers/Volunteers';
import VolunteerGroups from './VolunteerGroups/VolunteerGroups';
import { FaRegFile } from 'react-icons/fa6';
import Requests from './Requests/Requests';

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

  const [dataType, setDataType] = useState<'individual' | 'group' | 'requests'>(
    'individual',
  );

  return (
    <div>
      <div className="mt-2 mb-4 d-flex justify-content-between">
        <span className={styles.titlemodal} data-testid="dataTypeTitle">
          {t(
            `${dataType === 'group' ? 'volunteerGroups' : dataType === 'individual' ? 'volunteers' : 'requests'}`,
          )}
        </span>
        <div className="d-flex justify-content-center">
          <div
            className={`btn-group ${styles.toggleGroup}`}
            role="group"
            aria-label="Basic radio toggle button group"
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
              data-testid="individualRadio"
            >
              <HiUser className="me-1" />
              {t('individuals')}
            </label>

            <input
              type="radio"
              className={`btn-check ${styles.toggleBtn}`}
              name="btnradio"
              id="groupsRadio"
              onChange={() => setDataType('group')}
              checked={dataType === 'group'}
            />
            <label
              className={`btn btn-outline-primary ${styles.toggleBtn}`}
              htmlFor="groupsRadio"
              data-testid="groupsRadio"
            >
              <HiUserGroup className="me-1" />
              {t('groups')}
            </label>

            <input
              type="radio"
              className={`btn-check ${styles.toggleBtn}`}
              name="btnradio"
              id="requestsRadio"
              onChange={() => setDataType('requests')}
              checked={dataType === 'requests'}
            />
            <label
              className={`btn btn-outline-primary ${styles.toggleBtn}`}
              htmlFor="requestsRadio"
              data-testid="requestsRadio"
            >
              <FaRegFile className="me-1 mb-1" />
              {t('requests')}
            </label>
          </div>
        </div>
      </div>

      {dataType === 'individual' ? (
        <Volunteers />
      ) : dataType === 'group' ? (
        <VolunteerGroups />
      ) : (
        <Requests />
      )}
    </div>
  );
}

export default volunteerContainer;
