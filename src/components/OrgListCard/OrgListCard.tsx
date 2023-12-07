import React from 'react';
import { ReactComponent as FlaskIcon } from 'assets/svgs/flask.svg';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrgListCard.module.css';
import { useHistory } from 'react-router-dom';
import type { InterfaceOrgConnectionInfoType } from 'utils/interfaces';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';

export interface InterfaceOrgListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function orgListCard(props: InterfaceOrgListCardProps): JSX.Element {
  const { _id, admins, image, location, members, name } = props.data;

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
            {image ? (
              <img
                src={image}
                className={styles.orgimg}
                alt={`${name} image`}
              />
            ) : (
              <div
                className={styles.emptyImg}
                data-testid="emptyContainerForImage"
              />
            )}
          </div>
          <div className={styles.content}>
            <h4>{name} </h4>
            <h6 className="text-secondary">
              <LocationOnIcon fontSize="inherit" className="fs-5" />
              {location}
            </h6>
            <h6>
              {t('admins')}: <span>{admins.length}</span>
            </h6>
            <h6>
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
              width={20}
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
