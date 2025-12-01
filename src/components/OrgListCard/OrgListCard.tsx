/**
 * OrgListCard Component
 *
 * This component represents a card displaying information about an organization.
 * It includes the organization's name, description, address, avatar, and the number of members.
 * A button is provided to navigate to the organization's dashboard for management.
 *
 * @component
 * @param {InterfaceOrgListCardPropsPG} props - The props for the component.
 * @param {InterfaceOrgInfoTypePG} props.data - The organization data.
 * @param {string} props.data.id - The unique identifier for the organization.
 * @param {string} props.data.avatarURL - The URL of the organization's avatar image.
 * @param {string} props.data.addressLine1 - The primary address of the organization.
 * @param {string} props.data.name - The name of the organization.
 * @param {string} props.data.description - A brief description of the organization.
 * @param {object} props.data.members - The members of the organization.
 * @param {Array} props.data.members.edges - The list of members in the organization.
 *
 * @returns {JSX.Element} A JSX element representing the organization card.
 *
 * @remarks
 * - The component uses `react-bootstrap` for the button and `@mui/material` for the tooltip.
 * - The `useNavigate` hook from `react-router-dom` is used for navigation.
 * - The `useTranslation` hook from `react-i18next` is used for localization.
 *
 * @example
 * ```tsx
 * <OrgListCard
 *   data={{
 *     id: '1',
 *     avatarURL: 'https://example.com/avatar.png',
 *     addressLine1: '123 Main St',
 *     name: 'Example Org',
 *     description: 'An example organization',
 *     members: { edges: [{ id: '1' }, { id: '2' }] },
 *   }}
 * />
 * ```
 */
import React from 'react';
import TruncatedText from './TruncatedText';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import type { InterfaceOrgInfoTypePG } from 'utils/interfaces';
import { Tooltip } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router';

export interface InterfaceOrgListCardPropsPG {
  data: InterfaceOrgInfoTypePG;
}

function OrgListCard({
  data: {
    id,
    avatarURL,
    addressLine1,
    name,
    description,
    members,
    membersCount,
  },
}: InterfaceOrgListCardPropsPG): JSX.Element {
  const navigate = useNavigate();

  function handleClick(): void {
    const url = `/orgdash/${id}`;
    navigate(url);
  }

  const { t } = useTranslation('translation', { keyPrefix: 'orgListCard' });
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      {/* Container for the organization card */}
      <div className={styles.orgCard}>
        <div className={styles.innerContainer} data-cy="orgCardContainer">
          {/* Container for the organization image */}
          <div className={styles.orgImgContainer}>
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={`${name} image`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Avatar
                name={name}
                alt={`${name} image`}
                dataTestId="emptyContainerForImage"
              />
            )}
          </div>
          <div className={styles.content}>
            <div>
              {/* Tooltip for the organization name */}
              <Tooltip title={name} placement="top-end">
                <h4 className={`${styles.orgName} fw-semibold`}>{name}</h4>
              </Tooltip>
              {/* Description of the organization */}
              <div className={`${styles.orgdesc} fw-semibold`}>
                <TruncatedText text={description} />
              </div>

              {/* Display the organization address if available */}
              {addressLine1 && (
                <div className={styles.address}>
                  <TruncatedText text={`${addressLine1}`} />
                </div>
              )}
              {/* Display the number of admins and members */}
              <h6 className={styles.orgadmin}>
                <div>
                  {tCommon('members')}:{' '}
                  <span>{membersCount ?? members?.edges.length ?? 0}</span>
                </div>
              </h6>
            </div>
            {/* Button to manage the organization */}
            <Button
              onClick={handleClick}
              data-testid="manageBtn"
              data-cy="manageBtn"
              className={styles.manageBtn}
            >
              {/* Show flask icon if the organization is a sample organization */}
              {/* {data && data?.isSampleOrganization && (
            <FlaskIcon
              fill="var(--bs-white)"
              width={12}
              className={styles.flaskIcon}
              title={t('sampleOrganization')}
              data-testid="flaskIcon"
            />
          )}
          {'  '} */}
              {t('manage')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default OrgListCard;
