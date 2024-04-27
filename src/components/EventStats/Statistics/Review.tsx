import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';

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
                  <Rating name="read-only" value={review.rating} readOnly />
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
