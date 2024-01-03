import React from 'react';
import { ReactComponent as EventsIcon } from 'assets/svgs/eventsnew.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import { ReactComponent as MarkerIcon } from 'assets/svgs/locationnew.svg';
import { ReactComponent as DateIcon } from 'assets/svgs/datenew.svg';
import { ReactComponent as UserIcon } from 'assets/svgs/user.svg';
import dayjs from 'dayjs';
import styles from './CardItem.module.css';
import { PersonAddAlt1Rounded } from '@mui/icons-material';

export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
  startdate?: string;
  enddate?: string;
  creator?: any;
  location?: string;
}

const cardItem = (props: InterfaceCardItem): JSX.Element => {
  const { creator, type, title, startdate, time, enddate, location } = props;
  return (
    <>
      <div className={`${styles.cardItem} border-bottom`}>
        <div className={`${styles.iconWrapper} me-3`}>
          <div className={styles.themeOverlay} />
          {type == 'Event' ? (
            <EventsIcon width={40} height={40} />
          ) : type == 'Post' ? (
            <PostsIcon fill="var(--bs-primary)" width={20} height={20} />
          ) : (
            type == 'MembershipRequest' && (
              <PersonAddAlt1Rounded
                style={{ color: 'var(--bs-primary)' }}
                width={16}
                height={16}
              />
            )
          )}
        </div>

        <div className={styles.rightCard}>
          {creator && (
            <small className={styles.creator}>
              <UserIcon
                title="Post Creator"
                fill="var(--bs-primary)"
                width={20}
                height={20}
              />{' '}
              {'  '}
              <a>
                {creator.firstName} {creator.lastName}
              </a>
            </small>
          )}

          {title && <span className={styles.title}>{title}</span>}

          {location && (
            <span className={styles.location}>
              <MarkerIcon title="Event Location" width={22} height={22} />{' '}
              {location}
            </span>
          )}
          {type == 'Event' && startdate && (
            <span className={styles.time}>
              {type === 'Event' && (
                <DateIcon
                  title="Event Date"
                  fill="#4cd964"
                  width={20}
                  height={20}
                />
              )}{' '}
              {dayjs(startdate).format('MMM D, YYYY')} -{' '}
              {dayjs(enddate).format('MMM D, YYYY')}
            </span>
          )}
          {type == 'Post' && time && (
            <span className={styles.time}>
              {type === 'Post' && (
                <DateIcon
                  title="Event Date"
                  fill="#4cd964"
                  width={20}
                  height={20}
                />
              )}{' '}
              {dayjs(time).format('MMM D, YYYY')}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default cardItem;
