import React from 'react';
import { ReactComponent as FlaskIcon } from 'assets/svgs/flask.svg';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrgListCard.module.css';
import { useHistory } from 'react-router-dom';
import type { InterfaceOrgConnectionInfoType } from 'utils/interfaces';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Tooltip } from '@mui/material';

export interface InterfaceOrgListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function orgListCard(props: InterfaceOrgListCardProps): JSX.Element {
  const { _id, admins, image, address, members, name, description } =
    props.data;

  const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
    variables: {
      isSampleOrganizationId: _id,
    },
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
                image
                  ? image
                  : `https://api.dicebear.com/5.x/initials/svg?seed=${name
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join('')}`
              }
              alt={`${name} image`}
              data-testid={image ? '' : 'emptyContainerForImage'}
            />
          </div>
          <div className={styles.content}>
            <Tooltip title={name} placement="top-end">
              <h4 className={styles.orgName}>{name}</h4>
            </Tooltip>
            {description && (
              <div>
                <h6>
                  About Us:{' '}
                  <span title={description}>
                    {description.length > 55
                      ? description.substring(0, 55) + '...'
                      : description}
                  </span>
                </h6>
              </div>
            )}
            {address && address.city && (
              <div>
                <h6 className="text-secondary">
                  <span className="address-line">
                    {address.city}
                    {address.postalCode ? ', ' + address.postalCode : ''}
                  </span>
                  <span className="address-line">
                    {address.state ? ', ' + address.state : ''}
                  </span>
                  <br />
                  <span className="address-line">{address.countryCode}</span>
                </h6>
              </div>
            )}
            <h6>
              {t('admins')}: <span>{admins.length}</span>
              &nbsp;{t('members')}: <span>{members.length}</span>
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
