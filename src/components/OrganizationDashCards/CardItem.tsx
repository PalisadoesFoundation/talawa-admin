import React from 'react';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import dayjs from 'dayjs';
import styles from './CardItem.module.css';
import { PersonAddAlt1Rounded } from '@mui/icons-material';

export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
}

const cardItem = (props: InterfaceCardItem): JSX.Element => {
  const { type, title, time } = props;
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
        {time ? (
          <span className={styles.time}>
            {dayjs(time).format('DD-MM-YYYY')}
          </span>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default cardItem;
