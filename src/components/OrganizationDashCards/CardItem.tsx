import React from 'react';
import { ReactComponent as EventsIcon } from 'assets/svgs/cardItemEvent.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import { ReactComponent as MarkerIcon } from 'assets/svgs/cardItemLocation.svg';
import { ReactComponent as DateIcon } from 'assets/svgs/cardItemDate.svg';
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
      <div className={`${styles.cardItem} border-bottom py-3 pe-5 ps-4`}>
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

          {title && (
            <span
              className={`${styles.title} fst-normal fw-semibold --bs-black`}
            >
              {title}
            </span>
          )}

          {location && (
            <span className={`${styles.location} fst-normal fw-semibold`}>
              <MarkerIcon
                title="Event Location"
                stroke="var(--bs-primary)"
                width={22}
                height={22}
              />{' '}
              {location}
            </span>
          )}
          {type == 'Event' && startdate && (
            <span className={`${styles.time} fst-normal fw-semibold`}>
              {type === 'Event' && (
                <DateIcon
                  title="Event Date"
                  fill="var(--bs-gray-600)"
                  width={20}
                  height={20}
                />
              )}{' '}
              {dayjs(startdate).format('MMM D, YYYY')} -{' '}
              {dayjs(enddate).format('MMM D, YYYY')}
            </span>
          )}
          {type == 'Post' && time && (
            <span className={`${styles.time} fst-normal fw-semibold`}>
              {type === 'Post' && (
                <DateIcon
                  title="Event Date"
                  fill="var(--bs-gray-600)"
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
