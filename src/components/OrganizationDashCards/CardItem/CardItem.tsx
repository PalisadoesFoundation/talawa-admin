/**
 * Represents a card item component that displays information about an event, post, or membership request.
 *
 * @component
 * @param props - The properties for the `CardItem` component.
 *
 * @property {'Event' | 'Post' | 'MembershipRequest'} type - The type of the card item. Determines the layout and displayed information.
 * @property {string} title - The title of the card item. Displayed as the main heading, truncated to 25 characters if too long.
 * @property {string} [time] - The timestamp for posts, formatted as "MMM D, YYYY". Used when `type` is 'Post'.
 * @property {string} [startdate] - The start date of an event, formatted as "MMM D, YYYY". Used when `type` is 'Event'.
 * @property {string} [enddate] - The end date of an event, formatted as "MMM D, YYYY". Used when `type` is 'Event'.
 * @property {{ id: string | number; name: string }} [creator] - The creator of the card item. Displays the author's name if provided.
 * @property {string} [location] - The location of the event. Displays an icon and the location name if provided.
 *
 * @returns {JSX.Element} A styled card item component displaying the provided information.
 *
 * @example
 * ```tsx
 * <CardItem
 *   type="Event"
 *   title="Community Meetup"
 *   startdate="2023-10-01"
 *   enddate="2023-10-02"
 *   creator={{ id: 1, name: "John Doe" }}
 *   location="Central Park"
 * />
 * ```
 *
 * @remarks
 * - The component uses `dayjs` for date formatting.
 * - Icons for location and date are imported as React components.
 * - Styling is applied using CSS modules from `app-fixed.module.css`.
 */
import React from 'react';
import MarkerIcon from 'assets/svgs/cardItemLocation.svg?react';
import DateIcon from 'assets/svgs/cardItemDate.svg?react';
import dayjs from 'dayjs';
import styles from 'style/app-fixed.module.css';

export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
  startdate?: string;
  enddate?: string;
  creator?: { id: string | number; name: string };
  location?: string;
}

const CardItem = (props: InterfaceCardItem): JSX.Element => {
  const { creator, type, title, startdate, time, enddate, location } = props;
  return (
    <>
      <div className={`${styles.cardItem}`} data-testid="cardItem">
        {type != 'Event' && (
          <div className={`${styles.CardItemImage}`}>
            <img src="" alt="" />
          </div>
        )}

        <div
          className={`${styles.CardItemMainDiv} ${type === 'Event' ? styles.CardItemMainDivEvent : ''}`}
        >
          {title && (
            <div
              className={`${styles.cardItemtitle} ${styles.upcomingEventsTitle}`}
            >
              {title}
            </div>
          )}

          {type == 'Post' && time && (
            <span className={`${styles.CardItemDate}`}>
              Posted on:
              {dayjs(time).format('MMM D, YYYY')}
            </span>
          )}

          {creator && (
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
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
                {dayjs(startdate).format('MMM D, YYYY')}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardItem;
