import React from 'react';
import TruncatedText from './TruncatedText';
// import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app.module.css';
import type { InterfaceOrgInfoTypePG } from 'utils/interfaces';
import { Tooltip } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router-dom';

/**
 * Props for the OrgListCard component
 */
export interface InterfaceOrgListCardPropsPG {
  data: InterfaceOrgInfoTypePG;
}

/**
 * Component for displaying a list card for an organization
 *
 * This component renders a card that displays information about an organization,
 * including its name, addressLine1, members, and admins. It also provides a button
 * to manage the organization, navigating to the organization's dashboard.
 *
 * @param props - The properties passed to the component
 * @returns JSX.Element representing an organization list card
 */
function OrgListCard({
  data: { id, avatarURL, addressLine1, name, description, members },
}: InterfaceOrgListCardPropsPG): JSX.Element {
  const navigate = useNavigate();
  // Query to check if the organization is a sample organization
  // const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
  //   variables: {
  //     isSampleOrganizationId: id,
  //   },
  // });

  // Handle click event to navigate to the organization dashboard
  function handleClick(): void {
    const url = `/orgdash/${id}`;
    // // Dont change the below two lines
    navigate(url);
  }

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgListCard',
  });
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      {/* Container for the organization card */}
      <div className={styles.orgCard}>
        <div className={styles.innerContainer}>
          {/* Container for the organization image */}
          <div className={styles.orgImgContainer}>
            {avatarURL ? (
              <img src={avatarURL} alt={`${name} image`} />
            ) : (
              <Avatar
                name={name}
                alt={`${name} image`}
                dataTestId="emptyContainerForImage"
              />
            )}
          </div>
          <div className={styles.content}>
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
                {tCommon('members')}: <span>{members.edges.length}</span>
              </div>
            </h6>
          </div>
        </div>
        {/* Button to manage the organization */}
        <Button
          onClick={handleClick}
          data-testid="manageBtn"
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
    </>
  );
}
export default OrgListCard;
