import React from 'react';
import { ReactComponent as FlaskIcon } from 'assets/svgs/flask.svg';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrgPeopleOrganizationsCard.module.css';
import { useNavigate } from 'react-router-dom';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceQueryOrganizationsListObject,
} from 'utils/interfaces';
import {
  IS_SAMPLE_ORGANIZATION_QUERY,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Tooltip } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';

export interface InterfaceOrgPeopleOrganizationCardProps {
  data: InterfaceOrgConnectionInfoType;
}

/**
 * OrgPeopleOrganizationsCard component displays a card with information about an organization and its people.
 *
 * This component is responsible for rendering a card that provides detailed information about a specific organization,
 * including its name, image, number of admins, and number of members. It also includes functionality to navigate to
 * the organization's dashboard and manage the organization.
 *
 * @param props - The properties passed to the component.
 * @returns A JSX element representing the organization and people card.
 *
 * @example
 * ```tsx
 * const organizationData = {
 *   _id: 'org123',
 *   admins: ['admin1', 'admin2'],
 *   image: 'https://example.com/image.png',
 *   members: ['member1', 'member2', 'member3'],
 *   name: 'Example Organization',
 * };
 *
 * <OrgPeopleOrganizationsCard data={organizationData} />
 * ```
 */

function OrgPeopleOrganizationsCard({
  data: { _id, admins, image, members, name },
}: InterfaceOrgPeopleOrganizationCardProps): JSX.Element {
  const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
    variables: {
      isSampleOrganizationId: _id,
    },
  });

  const navigate = useNavigate();
  const {
    data: userData,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: _id },
  });

  function handleClick(): void {
    const url = '/orgdash/' + _id;
    navigate(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgListCard',
  });
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      <div className={styles.orgCard}>
        <div className={styles.innerContainer}>
          <div className={styles.orgImgContainer}>
            {image ? (
              <img src={image} alt={`${name} image`} />
            ) : (
              <Avatar
                name={name}
                alt={`${name} image`}
                dataTestId="emptyContainerForImage"
              />
            )}
          </div>

          <div className={styles.content}>
            <Tooltip title={name} placement="top-end">
              <h4 className={`${styles.orgName} fw-semibold`}>{name}</h4>
            </Tooltip>
            <h6 className={`${styles.orgdesc} fw-semibold`}>
              <span>{userData?.organizations[0].description}</span>
            </h6>

            <h6 className={styles.orgadmin}>
              {tCommon('admins')}: <span> {admins.length}</span>
            </h6>

            <h6 className={styles.orgadmin}>
              {tCommon('members')}: <span>{members.length}</span>
            </h6>
          </div>
        </div>

        <Button
          onClick={handleClick}
          data-testid="manageBtn"
          className={styles.manageBtn}
        >
          {data && data?.isSampleOrganization && (
            <FlaskIcon
              fill="var(--bs-white)"
              width={12}
              className={styles.flaskIcon}
              title={t('sampleOrganization')}
              data-testid="flaskIcon"
            />
          )}
          {'  '}
          {t('manage')}
        </Button>
      </div>
    </>
  );
}
export default OrgPeopleOrganizationsCard;
