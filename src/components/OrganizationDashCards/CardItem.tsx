import React from 'react';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import { ReactComponent as MarkerIcon } from 'assets/svgs/location.svg';
import { ReactComponent as DateIcon } from 'assets/svgs/date.svg';
import { ReactComponent as UserIcon } from 'assets/svgs/user.svg';
import dayjs from 'dayjs';
import styles from './CardItem.module.css';
import { PersonAddAlt1Rounded } from '@mui/icons-material';

export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
  creator?: any;
  location?: string;
}

const cardItem = (props: InterfaceCardItem): JSX.Element => {
  const { creator, type, title, time, location } = props;
  return (
    <>
      <div className={`${styles.cardItem} border-bottom`}>
        <div className={`${styles.iconWrapper} me-3`}>
          <div className={styles.themeOverlay} />
          {type == 'Event' ? (
            <EventsIcon fill="var(--bs-primary)" width={20} height={20} />
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
        <span className={styles.title}>{`${title}`}</span>

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

          {location && (
            <span className={styles.location}>
              <MarkerIcon
                title="Event Location"
                fill="var(--bs-primary)"
                width={20}
                height={20}
              />{' '}
              {location}
            </span>
          )}
          {time && (
            <span className={styles.time}>
              {type === 'Event' && (
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
