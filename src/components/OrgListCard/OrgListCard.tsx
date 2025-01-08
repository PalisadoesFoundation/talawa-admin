import React from 'react';
import TruncatedText from './TruncatedText';
// import {useState} from 'react';
import FlaskIcon from 'assets/svgs/flask.svg?react';
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

/**
 * Props for the OrgListCard component
 */
export interface InterfaceOrgListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

/**
 * Component for displaying a list card for an organization
 *
 * This component renders a card that displays information about an organization,
 * including its name, address, members, and admins. It also provides a button
 * to manage the organization, navigating to the organization's dashboard.
 *
 * @param props - The properties passed to the component
 * @returns JSX.Element representing an organization list card
 */
function orgListCard(props: InterfaceOrgListCardProps): JSX.Element {
  // Destructure data from props
  const { _id, admins, image, address, members, name } = props.data;

  // Query to check if the organization is a sample organization
  const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
    variables: {
      isSampleOrganizationId: _id,
    },
  });

  // Use navigate hook from react-router-dom to navigate to the organization dashboard
  const navigate = useNavigate();

  // Query to get the organization list
  const {
    data: userData,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: _id },
  });

  // Handle click event to navigate to the organization dashboard
  function handleClick(): void {
    const url = '/orgdash/' + _id;

    // Dont change the below two lines
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
            {/* Tooltip for the organization name */}
            <Tooltip title={name} placement="top-end">
              <h4 className={`${styles.orgName} fw-semibold`}>{name}</h4>
            </Tooltip>
            {/* Description of the organization */}
            <div className={`${styles.orgdesc} fw-semibold`}>
              <TruncatedText
                text={userData?.organizations[0]?.description || ''}
              />
            </div>

            {/* Display the organization address if available */}
            {address?.city && (
              <div className={styles.address}>
                <TruncatedText
                  text={`${address?.line1}, ${address?.city}, ${address?.countryCode}`}
                />
              </div>
            )}
            {/* Display the number of admins and members */}
            <h6 className={styles.orgadmin}>
              {tCommon('admins')}: <span>{admins.length}</span> &nbsp; &nbsp;
              &nbsp; {tCommon('members')}: <span>{members.length}</span>
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
