import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import eventStatStyles from '../EventStats.module.css';
type ModalPropType = {
  data: {
    event: {
      _id: string;
      averageFeedbackScore: number | null;
      feedback: FeedbackType[];
    };
  };
};

type FeedbackType = {
  _id: string;
  rating: number;
  review: string | null;
};

export const ReviewStats = ({ data }: ModalPropType): JSX.Element => {
  const reviews = data.event.feedback.filter(
    (feedback: FeedbackType) => feedback.review != null,
  );

  return (
    <>
      <Card
        style={{
          overflowY: 'auto',
          marginBottom: '5px',
        }}
      >
        <Card.Body style={{ padding: '0px' }}>
          <Card.Header>
            <h3>Reviews</h3>
          </Card.Header>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <>
                <h5>Filled by {reviews.length} people.</h5>
                <div className="card user-review m-1" key={review._id}>
                  <div className="card-body">
                    <Rating name="read-only" value={review.rating} readOnly />
                    <p className="card-text">{review.review}</p>
                  </div>
                </div>
              </>
            ))
          ) : (
            <div
              className={eventStatStyles.centerText}
              style={{
                height: '40rem',
              }}
            >
              <p>No reviews Yet.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
