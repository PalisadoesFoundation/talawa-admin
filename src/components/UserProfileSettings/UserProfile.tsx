/**
 * UserProfile component displays the profile details of a user.
 *
 * @remarks
 * This component is designed to show user information such as name, email,
 * profile picture, and the date the user joined. It uses React-Bootstrap for
 * styling and Material-UI icons for visual elements. The component also
 * supports tooltips for displaying additional information.
 *
 * @param props - Partial properties of the `InterfaceUser` type.
 * @param props.firstName - The first name of the user.
 * @param props.lastName - The last name of the user.
 * @param props.createdAt - The date when the user joined.
 * @param props.email - The email address of the user.
 * @param props.image - The URL of the user's profile picture.
 *
 * @returns A JSX element displaying the user's profile details.
 *
 * @example
 * ```tsx
 * <UserProfile
 *   firstName="John"
 *   lastName="Doe"
 *   createdAt="2023-01-01"
 *   email="john.doe@example.com"
 *   image="https://example.com/profile.jpg"
 * />
 * ```
 *
 * @dependencies
 * - `react-bootstrap` for Card and Button components.
 * - `@mui/icons-material` for CalendarMonthOutlinedIcon.
 * - `react-i18next` for translations.
 * - `react-tooltip` for tooltips.
 * - `Avatar` component for displaying a placeholder profile picture.
 *
 * @module UserProfile
 */
import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import type { InterfaceUser } from 'types/User/interface';

const joinedDate = (param: string | Date): string => {
  const date = typeof param === 'string' ? new Date(param) : param;
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const UserProfile: React.FC<Partial<InterfaceUser>> = ({
  firstName,
  lastName,
  createdAt,
  email,
  image,
}): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      <Card border="0" className="rounded-4 mb-4 ">
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
                {firstName && firstName.length > 10
                  ? firstName?.slice(0, 5) + '..'
                  : firstName}
              </span>
              <ReactTooltip id="name" />
              <span
                data-testid="userEmail"
                data-tooltip-id="email"
                data-tooltip-content={email}
              >
                {email && email.length > 10
                  ? email?.slice(0, 4) + '..' + email?.slice(email.indexOf('@'))
                  : email}
              </span>
              <ReactTooltip id="email" />
              <span className="d-flex">
                <CalendarMonthOutlinedIcon />
                <span className="d-flex align-end">
                  {tCommon('joined')} {createdAt && joinedDate(createdAt)}
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
