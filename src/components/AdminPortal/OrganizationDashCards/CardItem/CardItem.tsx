/**
 * Represents a card item component that displays information about an event, post, or membership request.
 *
 *
 * @returns JSX.Element - A styled card item component displaying the provided information.
 *
 * @example
 * ```tsx
 * <CardItem
 *   type="Event"
 *   title="Community Meetup"
 *   startdate=dayjs().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')
 *   enddate=dayjs().subtract(1, 'year').month(9).date(2).format('YYYY-MM-DD')
 *   creator={{ id: 1, name: "John Doe" }}
 *   location="Central Park"
 * />
 * ```
 *
 * @remarks
 * - The component uses `dayjs` for date formatting.
 * - Icons for location and date are imported as React components.
 * - Styling is applied using CSS modules from `CardItem.module.css`.
 */
import React, { useState, useEffect } from 'react';
import MarkerIcon from 'assets/svgs/cardItemLocation.svg?react';
import DateIcon from 'assets/svgs/cardItemDate.svg?react';
import dayjs from 'dayjs';
import styles from './CardItem.module.css';
import Avatar from 'shared-components/Avatar/Avatar';
import DefaultImg from 'assets/images/defaultImg.png';
import type { InterfaceCardItem } from 'types/AdminPortal/OrganizationDashCards/CardItem/interface';
import { useTranslation } from 'react-i18next';

const CardItem = (props: InterfaceCardItem): JSX.Element => {
  const { creator, type, title, startdate, enddate, time, location, image } =
    props;
  const [imgOk, setImgOk] = useState(true);
  const { t: tCommon } = useTranslation('common');

  // Reset imgOk when image prop changes to allow retrying with new URL
  useEffect(() => {
    if (image) {
      setImgOk(true);
    }
  }, [image]);

  return (
    <>
      <div className={`${styles.cardItem}`} data-testid="cardItem">
        {type !== 'Event' && (
          <div className={styles.CardItemImage}>
            {image && imgOk ? (
              <img
                src={image}
                alt={`${title} ${tCommon('avatar')}`}
                crossOrigin="anonymous"
                className={styles.CardItemImage}
                loading="lazy"
                decoding="async"
                onError={() => setImgOk(false)}
              />
            ) : type === 'MembershipRequest' ? (
              <Avatar
                data-testid="display-img"
                avatarStyle={styles.CardItemImage}
                name={`${title}`}
                alt=""
              />
            ) : (
              <img
                src={DefaultImg}
                alt={`${title}`}
                crossOrigin="anonymous"
                className={styles.CardItemImage}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        )}

        <div
          className={`${styles.CardItemMainDiv} ${type === 'Event' ? styles.CardItemMainDivEvent : ''}`}
        >
          {title && (
            <div
              className={`${styles.cardItemtitle} ${styles.upcomingEventsTitle} `}
              title={title}
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
            <div className={styles.cardItemAuthor}>Author: {creator.name}</div>
          )}

          <div className={styles.rightCard}>
            {location && (
              <span className={`${styles.location} fst-normal fw-semibold`}>
                <MarkerIcon
                  title={tCommon('location')}
                  stroke="var(--bs-primary)"
                  width={22}
                  height={22}
                />{' '}
                {location}
              </span>
            )}
            {type == 'Event' && startdate && enddate && (
              <span className={`${styles.time} fst-normal fw-semibold`}>
                {type === 'Event' && (
                  <DateIcon
                    title={tCommon('eventDate')}
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
