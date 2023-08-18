import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrgListCard.module.css';
import { useHistory } from 'react-router-dom';
import AboutImg from 'assets/images/defaultImg.png';
import type { InterfaceOrgConnectionInfoType } from 'utils/interfaces';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * Props for the `OrgListCard` component.
 * @typedef {Object} InterfaceOrgListCardProps
 * @property {InterfaceOrgConnectionInfoType} data - Data representing organization information.
 */

/**
 * `OrgDashListCard` is a React component that displays information about an organization in a list card format.
 * It provides details such as the organization name, location, number of admins, number of members,
 * and a "Manage" button to navigate to the organization dashboard.
 * @component
 *
 * @param {InterfaceOrgListCardProps} props - Props for the component.
 * @returns {JSX.Element} A JSX element representing the organization list card.
 */

export interface InterfaceOrgListCardProps {
  data: InterfaceOrgConnectionInfoType;
}

function superDashListCard(props: InterfaceOrgListCardProps): JSX.Element {
  const { _id, admins, image, location, members, name } = props.data;

  const history = useHistory();

  /**
   * Handle the click event when the "Manage" button is clicked.
   * Redirects the user to the organization dashboard page.
   * @private
   * @returns {void}
   */
  function handleClick(): void {
    const url = '/orgdash/id=' + _id;

    // Replace the current URL with the new one and navigate to it
    // (Dont change the below two lines)
    window.location.replace(url);
    history.push(url);
  }

  // Retrieve translation functions from react-i18next
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgListCard',
  });

  // The main JSX structure representing the organization list card
  return (
    <>
      <div className={styles.orgCard}>
        <div className={styles.innerContainer}>
          <div className={styles.orgImgContainer}>
            <div className={styles.overlayTheme} />
            {image ? (
              <img
                src={image}
                className={styles.orgimg}
                alt={`${name} image`}
              />
            ) : (
              <img
                src={AboutImg}
                className={styles.orgimg}
                alt={`default image`}
              />
            )}
          </div>
          <div className={styles.content}>
            <h5>{name}</h5>
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
        <Button onClick={handleClick} data-testid="manageBtn">
          {t('manage')}
        </Button>
      </div>
    </>
  );
}
export default superDashListCard;
