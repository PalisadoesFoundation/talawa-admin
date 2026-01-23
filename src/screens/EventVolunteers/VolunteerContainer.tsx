/**
 * Renders the event volunteer container that lets users toggle between individuals, groups, and requests.
 *
 * @remarks
 * Redirects to the home page if either `orgId` or `eventId` is missing from the route.
 *
 * @example
 * ```tsx
 * <Route path="/admin/event/:orgId/:eventId/volunteers" element={<VolunteerContainer />} />
 * ```
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import styles from './VolunteerContainer.module.css';
import { HiUserGroup, HiUser } from 'react-icons/hi2';
import Volunteers from './Volunteers/Volunteers';
import VolunteerGroups from './VolunteerGroups/VolunteerGroups';
import { FaRegFile } from 'react-icons/fa6';
import Requests from './Requests/Requests';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';

function VolunteerContainer(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });

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
      <SafeBreadcrumbs
        items={[
          {
            translationKey: 'organization',
            to: `/admin/orgdash/${orgId}`,
          },
          {
            translationKey: 'events',
            to: `/admin/orgevents/${orgId}`,
          },
          {
            translationKey: 'event',
            to: `/admin/event/${orgId}/${eventId}`,
          },
          {
            translationKey: 'Volunteers',
            to:
              dataType === 'individual'
                ? undefined
                : `/admin/event/${orgId}/${eventId}/volunteers`,
            isCurrent: dataType === 'individual',
          },
          ...(dataType === 'group'
            ? [
                {
                  translationKey: 'groups',
                  isCurrent: true,
                },
              ]
            : dataType === 'requests'
              ? [
                  {
                    translationKey: 'requests',
                    isCurrent: true,
                  },
                ]
              : []),
        ]}
      />
      <div className="mt-2 mb-4 d-flex justify-content-between">
        <div className="ms-auto">
          <div
            className={`btn-group ${styles.toggleGroup}`}
            role="group"
            aria-label={t('toggleGroupAriaLabel')}
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

export default VolunteerContainer;
