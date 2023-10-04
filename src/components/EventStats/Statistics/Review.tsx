import React, { useState, useEffect } from 'react';
import styles from './Loader.module.css';
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';

type ModalPropType = {
  eventId: string;
};

type FeedbackType = {
  _id: string;
  rating: number;
  review?: string;
};

export const ReviewStats = (props: ModalPropType): JSX.Element => {
  const [reviews, setReviews] = useState<FeedbackType[]>([]);

  const { data: feedbackData, loading: feedbackLoading } = useQuery(
    EVENT_FEEDBACKS,
    {
      variables: { id: props.eventId },
    }
  );

  useEffect(() => {
    if (feedbackLoading) {
      setReviews([]);
      return;
    }

    setReviews(
      feedbackData.event.feedback.filter(
        (feedback: FeedbackType) => feedback.review != null
      )
    );
  }, [feedbackLoading, feedbackData, props.eventId]);

  // Render the loading screen
  if (feedbackLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Card
        style={{
          width: '300px',
          maxHeight: '350px',
          overflow: 'auto',
          marginBottom: '5px',
        }}
      >
        <Card.Body>
          <Card.Title>
            <h3>Reviews</h3>
          </Card.Title>
          <h5>Filled by {reviews.length} people.</h5>
          {reviews.length ? (
            reviews.map((review) => (
              <div className="card user-review m-1" key={review._id}>
                <div className="card-body">
                  <Rating name="read-only" value={review.rating / 2} readOnly />
                  <p className="card-text">{review.review}</p>
                </div>
              </div>
            ))
          ) : (
            <>Waiting for people to talk about the event...</>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
