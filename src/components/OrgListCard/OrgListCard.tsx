import React from 'react';
import { ReactComponent as FlaskIcon } from 'assets/svgs/flask.svg';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrgListCard.module.css';
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

export interface InterfaceOrgListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function orgListCard(props: InterfaceOrgListCardProps): JSX.Element {
  const { _id, admins, image, address, members, name } = props.data;

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

    // Dont change the below two lines
    navigate(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgListCard',
  });

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
            {address && address.city && (
              <div className={styles.address}>
                <h6 className="text-secondary">
                  <span className="address-line">{address.line1}, </span>
                  <span className="address-line">{address.city}, </span>
                  <span className="address-line">{address.countryCode}</span>
                </h6>
              </div>
            )}
            <h6 className={styles.orgadmin}>
              {t('admins')}: <span>{admins.length}</span> &nbsp; &nbsp; &nbsp;{' '}
              {t('members')}: <span>{members.length}</span>
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
export default orgListCard;
