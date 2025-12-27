/**
 * The `volunteerContainer` component is responsible for rendering a container
 * that allows users to toggle between viewing individual volunteers, volunteer groups,
 * and volunteer requests for a specific event within an organization.
 *
 * @remarks
 * - This component uses the `useTranslation` hook from `react-i18next` for internationalization.
 * - It retrieves `orgId` and `eventId` from the URL parameters using `useParams`.
 * - If either `orgId` or `eventId` is missing, the user is redirected to the home page.
 * - The component uses a toggle button group to switch between three views:
 *   - Individual volunteers
 *   - Volunteer groups
 *   - Volunteer requests
 *
 * @component
 * @returns A JSX element containing the toggle button group and the corresponding view.
 *
 * @example
 * ```tsx
 * <Route path="/organization/:orgId/event/:eventId/volunteers" element={<volunteerContainer />} />
 * ```
 *
 * @dependencies
 * - `react-icons/hi2` for user and group icons.
 * - `react-icons/fa6` for the file icon.
 * - `Volunteers`, `VolunteerGroups`, and `Requests` components for rendering respective views.
 * - `style/app-fixed.module.css` for styling the toggle button group.
 *
 * @internal
 * This component is part of the `EventVolunteers` feature in the Talawa Admin project.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import styles from 'style/app-fixed.module.css';
import { HiUserGroup, HiUser } from 'react-icons/hi2';
import Volunteers from './Volunteers/Volunteers';
import VolunteerGroups from './VolunteerGroups/VolunteerGroups';
import { FaRegFile } from 'react-icons/fa6';
import Requests from './Requests/Requests';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';

function volunteerContainer(): JSX.Element {
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
            to: `/user/organization/${orgId}`,
          },
          {
            translationKey: 'events',
            to: `/user/events/${orgId}`,
          },
          {
            translationKey: 'event',
          },
          {
            translationKey: 'Volunteers',
            to:
              dataType === 'individual'
                ? undefined
                : `/event/${orgId}/${eventId}`,
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

export default volunteerContainer;
