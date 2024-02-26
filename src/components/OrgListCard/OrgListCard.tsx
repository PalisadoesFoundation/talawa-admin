import React from 'react';
import { ReactComponent as FlaskIcon } from 'assets/svgs/flask.svg';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrgListCard.module.css';
import { useHistory } from 'react-router-dom';
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

export interface InterfaceOrgListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function orgListCard(props: InterfaceOrgListCardProps): JSX.Element {
  const { _id } = props.data;

  const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
    variables: {
      isSampleOrganizationId: _id,
    },
  });

  const {
    data: userData,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: _id },
  });

  const history = useHistory();

  function handleClick(): void {
    const url = '/orgdash/id=' + _id;

    // Dont change the below two lines
    window.location.replace(url);
    history.push(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgListCard',
  });

  return (
    <>
      <div className={styles.orgCard}>
        <div className={styles.innerContainer}>
          <div className={styles.orgImgContainer}>
            <img
              src={
                userData?.organizations[0].image
                  ? userData?.organizations[0].image
                  : `https://api.dicebear.com/5.x/initials/svg?seed=${userData?.organizations[0].name
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join('')}`
              }
              alt={`${userData?.organizations[0].name} image`}
              data-testid={
                userData?.organizations[0].image ? '' : 'emptyContainerForImage'
              }
            />
          </div>
          <div className={styles.content}>
            <Tooltip
              title={userData?.organizations[0].name}
              placement="top-end"
            >
              <h4 className={`${styles.orgName} fw-semibold`}>
                {userData?.organizations[0].name}
              </h4>
            </Tooltip>
            <h6 className={`${styles.orgdesc} fw-semibold`}>
              <span>{userData?.organizations[0].description}</span>
            </h6>
            <h6 className={styles.orgadmin}>
              {t('admins')}:{' '}
              <span>{userData?.organizations[0].admins.length}</span>
            </h6>
            <h6 className={styles.orgmember}>
              {t('members')}:{' '}
              <span>{userData?.organizations[0].members.length}</span>
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
            />
          )}
          {'  '}
          {t('manage')}
        </Button>
      </div>
    </>
  );
}
export default orgListCard;
