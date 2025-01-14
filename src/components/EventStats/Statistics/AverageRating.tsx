import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import styles from '../../../style/app.module.css';
// Props for the AverageRating component
type ModalPropType = {
  data: {
    event: {
      _id: string;
      averageFeedbackScore: number;
      feedback: FeedbackType[];
    };
  };
};

// Type representing individual feedback
type FeedbackType = {
  _id: string;
  rating: number;
  review: string | null;
};

/**
 * Component that displays the average rating for an event.
 * Shows a rating value and a star rating icon.
 *
 * @param data - Data containing the average feedback score to be displayed.
 * @returns JSX element representing the average rating card with a star rating.
 */
export const AverageRating = ({ data }: ModalPropType): JSX.Element => {
  return (
    <>
      <Card className={styles.cardContainer}>
        <Card.Body>
          <Card.Title>
            <h4>Average Review Score</h4>
          </Card.Title>
          <Typography component="legend">
            Rated {data.event.averageFeedbackScore.toFixed(2)} / 5
          </Typography>
          <Rating
            name="customized-color"
            precision={0.5}
            max={5}
            readOnly
            value={data.event.averageFeedbackScore}
            icon={<FavoriteIcon fontSize="inherit" />}
            size="medium"
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            classes={{
              iconFilled: styles.ratingFilled,
              iconHover: styles.ratingHover,
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
