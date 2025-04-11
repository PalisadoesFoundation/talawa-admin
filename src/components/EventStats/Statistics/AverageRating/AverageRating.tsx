/**
 * Component: AverageRating
 *
 * This component displays the average review score for an event using a styled card layout.
 * It utilizes Material-UI's `Rating` component to visually represent the score with custom icons.
 *
 * @param {InterfaceStatsModal} props - The props object containing event statistics data.
 * @param {object} props.data - The data object containing event-related statistics.
 * @param {object} props.data.event - The event object containing feedback details.
 * @param {number} [props.data.event.averageFeedbackScore] - The average feedback score for the event.
 *   This value is displayed as a numeric score and visually represented using the `Rating` component.
 *
 * @returns {JSX.Element} A React component that renders the average review score with a styled card.
 *
 * @remarks
 * - The `Rating` component uses custom icons (`FavoriteIcon` and `FavoriteBorderIcon`) to represent filled and empty states.
 * - The `precision` prop of the `Rating` component is set to `0.5` to allow half-star ratings.
 * - The `styles` object is imported from a CSS module to apply custom styling to the card and rating icons.
 *
 * @example
 * ```tsx
 * <AverageRating data={{ event: { averageFeedbackScore: 4.5 } }} />
 * ```
 *
 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import styles from 'style/app-fixed.module.css';
import type { InterfaceStatsModal } from 'types/Event/interface';

export const AverageRating = ({ data }: InterfaceStatsModal): JSX.Element => {
  return (
    <>
      <Card className={styles.cardContainer}>
        <Card.Body>
          <Card.Title>
            <h4>Average Review Score</h4>
          </Card.Title>
          <Typography component="legend">
            Rated {data.event.averageFeedbackScore?.toFixed(2)} / 5
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
