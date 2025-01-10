import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useTranslation } from 'react-i18next';
import styles from './UserProfileSettings.module.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface InterfaceUserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;
  email: string;
  image: string;
}
const joinedDate = (param: string): string => {
  const date = new Date(param);
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * UserProfile component displays user profile details including an avatar or profile image, name, email, and join date.
 * It also provides a button to copy the profile link.
 *
 * @param  props - The properties to be passed into the component.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param email - The email address of the user.
 * @param image - The URL of the user's profile image.
 * @returns The JSX element for the user profile card.
 */
const UserProfile: React.FC<InterfaceUserProfile> = ({
  firstName,
  lastName,
  createdAt,
  email,
  image,
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings',
  });
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      <Card border="0" className="rounded-4 mb-4">
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{t('profileDetails')}</div>
        </div>
        <Card.Body className={styles.cardBody}>
          <div className={`d-flex mb-2 ${styles.profileContainer}`}>
            <div className={styles.imgContianer}>
              {image && image !== 'null' ? (
                <img src={image} alt={`profile picture`} />
              ) : (
                <Avatar
                  name={`${firstName} ${lastName}`}
                  alt={`dummy picture`}
                />
              )}
            </div>
            <div className={styles.profileDetails}>
              <span
                style={{ fontWeight: '700', fontSize: '28px' }}
                data-tooltip-id="name"
                data-tooltip-content={`${firstName} ${lastName}`}
              >
                {firstName.length > 10
                  ? firstName.slice(0, 5) + '..'
                  : firstName}
              </span>
              <ReactTooltip id="name" />
              <span
                data-testid="userEmail"
                data-tooltip-id="email"
                data-tooltip-content={email}
              >
                {email.length > 10
                  ? email.slice(0, 4) + '..' + email.slice(email.indexOf('@'))
                  : email}
              </span>
              <ReactTooltip id="email" />
              <span className="d-flex">
                <CalendarMonthOutlinedIcon />
                <span className="d-flex align-end">
                  {tCommon('joined')} {joinedDate(createdAt)}
                </span>
              </span>
            </div>
          </div>
          <div className="mt-4 mb-1 d-flex justify-content-center">
            <Button data-testid="copyProfileLink">{t('copyLink')}</Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserProfile;
