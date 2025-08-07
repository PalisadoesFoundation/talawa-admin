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
        <div className={`${styles.CardItemImage}`}>
          <img src="" alt="" />
        </div>

        <div className={`${styles.CardItemMainDiv}`}>
          {title && (
            <div className={styles.cardItemtitle}>{title.slice(0, 25)}..</div>
          )}

          {type == 'Post' && time && (
            <span className={`${styles.CardItemDate}`}>
              Posted on: {dayjs(time).format('MMM D, YYYY')}
            </span>
          )}

          {type === 'Event' && (
            <div className="d-flex flex-column mt-2">
              {startdate && (
                <div
                  className="text-muted d-flex align-items-center mb-1"
                  style={{ fontSize: '12px' }}
                >
                  <DateIcon
                    title="Event Date"
                    fill="var(--bs-gray-500)"
                    width={14}
                    height={14}
                    className="me-2"
                    data-testid="date-icon"
                  />
                  {dayjs(startdate).format('MMM D, YYYY')}
                  {enddate && ` - ${dayjs(enddate).format('MMM D, YYYY')}`}
                </div>
              )}
              {location && (
                <div
                  className="text-muted d-flex align-items-center"
                  style={{ fontSize: '12px' }}
                >
                  <MarkerIcon
                    title="Event Location"
                    stroke="var(--bs-gray-500)"
                    width={14}
                    height={14}
                    className="me-2"
                    data-testid="marker-icon"
                  />
                  {location}
                </div>
              )}
              {startdate && (
                <div
                  className="text-muted d-flex align-items-center mt-1"
                  style={{ fontSize: '12px' }}
                >
                  <DateIcon
                    title="Event Time"
                    fill="var(--bs-gray-500)"
                    width={14}
                    height={14}
                    className="me-2"
                    data-testid="time-icon"
                  />
                  {dayjs(startdate).format('h:mm A')}
                  {enddate && ` - ${dayjs(enddate).format('h:mm A')}`}
                </div>
              )}
            </div>
          )}

          {creator && (
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              Author: {creator.name}
            </div>
          )}

          <div className={styles.rightCard}>
            {/* Keep original location/time for non-Event types */}
            {type != 'Event' && location && (
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
            {type != 'Event' && startdate && (
              <span className={`${styles.time} fst-normal fw-semibold`}>
                <DateIcon
                  title="Event Time"
                  fill="var(--bs-gray-600)"
                  width={20}
                  height={20}
                />{' '}
                {dayjs(startdate).format('h:mm A')}
                {enddate && ` - ${dayjs(enddate).format('h:mm A')}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardItem;
