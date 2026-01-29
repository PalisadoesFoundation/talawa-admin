/**
 * UserProfile component displays the profile details of a user.
 *
 * @remarks
 * This component is designed to show user information such as name, email,
 * profile picture, and the date the user joined. It uses React-Bootstrap for
 * styling and Material-UI icons for visual elements. The component also
 * supports tooltips for displaying additional information.
 *
 * @returns A JSX element displaying the user's profile details.
 *
 * @example
 * ```tsx
 * <UserProfile
 *   firstName="John"
 *   lastName="Doe"
 *   createdAt=dayjs().subtract(1, 'year').format('YYYY-MM-DD')
 *   email="john.doe@example.com"
 *   image="https://example.com/profile.jpg"
 * />
 * ```
 *
 * Dependencies
 * - `react-bootstrap` for Card component.
 * - `shared-components/Button/Button` for the Button component.
 * - `@mui/icons-material` for CalendarMonthOutlinedIcon.
 * - `react-i18next` for translations.
 * - `react-tooltip` for tooltips.
 * - `Avatar` component for displaying a placeholder profile picture.
 *
 */
import Avatar from 'shared-components/Avatar/Avatar';
import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'shared-components/Button/Button';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useTranslation } from 'react-i18next';
import styles from './UserProfile.module.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import type { InterfaceUser } from 'types/shared-components/User/interface';

const joinedDate = (
  param: string | Date | null | undefined,
  unavailableText: string,
): string => {
  if (!param) {
    return unavailableText;
  }
  const date = typeof param === 'string' ? new Date(param) : param;
  if (Number.isNaN(date.getTime())) {
    return unavailableText;
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
            <div className={styles.imgContainer}>
              {image && image !== 'null' ? (
                <img src={image} alt={t('profilePicture')} />
              ) : (
                <Avatar
                  name={`${firstName} ${lastName}`}
                  alt={t('dummyPicture')}
                />
              )}
            </div>
            <div className={styles.profileDetails}>
              <span
                className={styles.userProfileName}
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
                  {tCommon('joined')}{' '}
                  {joinedDate(createdAt, tCommon('unavailable'))}
                </span>
              </span>
            </div>
          </div>
          <div className="mt-4 mb-1 d-flex justify-content-center">
            {/* TODO(#6707): Implement copy-to-clipboard functionality for profile link */}
            <Button data-testid="copyProfileLink">{t('copyLink')}</Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserProfile;
