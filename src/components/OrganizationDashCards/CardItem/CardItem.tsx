import React from 'react';
// import EventsIcon from 'assets/svgs/cardItemEvent.svg?react';
// import PostsIcon from 'assets/svgs/post.svg?react';
import MarkerIcon from 'assets/svgs/cardItemLocation.svg?react';
import DateIcon from 'assets/svgs/cardItemDate.svg?react';
// import UserIcon from 'assets/svgs/user.svg?react';
import dayjs from 'dayjs';
import styles from '../../../style/app-fixed.module.css';
// import { PersonAddAlt1Rounded } from '@mui/icons-material';
// import { height } from '@mui/system';

/**
 * Interface for the CardItem component's props.
 */
export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
  startdate?: string;
  enddate?: string;
  creator?: {
    id: string | number;
    name: string;
  };
  location?: string;
}

/**
 * Component to display a card item with various types such as Event, Post, or MembershipRequest.
 *
 * @param props - Props for the CardItem component.
 * @returns JSX element representing the card item.
 */

const CardItem = (props: InterfaceCardItem): JSX.Element => {
  const { creator, type, title, startdate, time, enddate, location } = props;
  return (
    <>
      <div className={`${styles.cardItem}`} data-testid="cardItem">
        <div className={`${styles.CardItemImage}`}>
          <img src="" alt="" />
        </div>

        <div className={`${styles.CardItemMainDiv}`}>
          {title && (
            <div className={styles.cardItemtitle}>{title.slice(0, 25)}..</div>
          )}

          {type == 'Post' && time && (
            <span className={`${styles.CardItemDate}`}>
              Posted on:
              {dayjs(time).format('MMM D, YYYY')}
            </span>
          )}

          {creator && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              Author: {creator.name}
            </div>
          )}

          <div className={styles.rightCard}>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CardItem;
