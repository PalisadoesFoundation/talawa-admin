// import React from 'react';
// import { ReactComponent as EventsIcon } from 'assets/svgs/cardItemEvent.svg';
// import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
// import { ReactComponent as MarkerIcon } from 'assets/svgs/cardItemLocation.svg';
// import { ReactComponent as DateIcon } from 'assets/svgs/cardItemDate.svg';
// import { ReactComponent as UserIcon } from 'assets/svgs/user.svg';
// import dayjs from 'dayjs';
// import styles from '../../components/OrganizationDashCards/CardItem.module.css';
// import { PersonAddAlt1Rounded } from '@mui/icons-material';

export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
  startdate?: string;
  creator?: any;
  location?: string;
}

// const EventAttendedCard = (props: InterfaceCardItem): JSX.Element => {
//   const { creator, type, title, startdate, time, location } = props;
//   return (
//     <>
//       <div
//         className={`${styles.cardItem} border-bottom py-3 pe-5 ps-4`}
//         data-testid="cardItem"
//       >
//         <div className={`${styles.iconWrapper} me-3`}>
//           <div className={styles.themeOverlay} />
//           {/* {type == 'Event' ? (
//             <EventsIcon fill="var(--bs-primary)" width={20} height={20} />
//           ) : type == 'Post' ? (
//             <PostsIcon fill="var(--bs-primary)" width={20} height={20} />
//           ) : (
//             type == 'MembershipRequest' && (
//               <PersonAddAlt1Rounded
//                 style={{ color: 'var(--bs-primary)' }}
//                 width={16}
//                 height={16}
//               />
//             )
//           )} */}
//           <div className='align-items-center text-center'>
//           <h2>
//           {dayjs(startdate).format('MMM').toUpperCase()}
//           </h2>
//           <h2>
//           {dayjs(time).format('D')}
//           </h2>
//           </div>
//         </div>

//         <div className={styles.rightCard}>
//           {creator && (
//             <small className={styles.creator}>
//               <UserIcon
//                 title="Post Creator"
//                 fill="var(--bs-primary)"
//                 width={20}
//                 height={20}
//               />{' '}
//               {'  '}
//               <a>
//                 {creator.firstName} {creator.lastName}
//               </a>
//             </small>
//           )}

//           {title && (
//             <span
//               className={`${styles.title} fst-normal fw-semibold --bs-black`}
//             >
//               {title}
//             </span>
//           )}

//           {location && (
//             <span className={`${styles.location} fst-normal fw-semibold`}>
//               <MarkerIcon
//                 title="Event Location"
//                 stroke="var(--bs-primary)"
//                 width={22}
//                 height={22}
//               />{' '}
//               {location}
//             </span>
//           )}
//           {type == 'Event' && startdate && (
//             <span className={`${styles.time} fst-normal fw-semibold`}>
//               {type === 'Event' && (
//                 <DateIcon
//                   title="Event Date"
//                   fill="var(--bs-gray-600)"
//                   width={20}
//                   height={20}
//                 />
//               )}{' '}
//               {dayjs(startdate).format('MMM D, YYYY')}
//             </span>
//           )}
//           {type == 'Post' && time && (
//             <span className={`${styles.time} fst-normal fw-semibold`}>
//               {type === 'Post' && (
//                 <DateIcon
//                   title="Event Date"
//                   fill="var(--bs-gray-600)"
//                   width={20}
//                   height={20}
//                 />
//               )}{' '}
//               {dayjs(time).format('MMM D, YYYY')}
//             </span>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default EventAttendedCard;
import React from 'react';
import dayjs from 'dayjs';
import { Card, Row, Col } from 'react-bootstrap';
import { ChevronRight } from '@mui/icons-material';

// interface InterfaceCardItem {
//   type: 'Event' | 'Post' | 'MembershipRequest';
//   title: string;
//   time?: string;
//   startdate?: string;
//   creator?: any;
//   location?: string;
// }

const EventAttendedCard = (props: InterfaceCardItem): JSX.Element => {
  const { title, startdate, time, location } = props;

  return (
    <Card className="border-0 border-bottom py-1 rounded-0">
      <Card.Body className="p-1">
        <Row className="align-items-center">
          <Col xs={3} md={2} className="text-center">
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 400, color: '#6c757d' }}>
                {dayjs(startdate).format('MMM').toUpperCase()}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 500, color: '#6c757d' }}>
                {dayjs(startdate).format('D')}
              </div>
            </div>
          </Col>
          <Col xs={7} md={9} className='mb-3'>
            <h5 className="mb-1">{title}</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
              {location}
            </p>
          </Col>
          <Col xs={2} md={1} className="text-end">
            <ChevronRight color="action" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EventAttendedCard;