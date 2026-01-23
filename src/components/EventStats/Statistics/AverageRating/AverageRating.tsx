/**
 * Component: AverageRating
 *
 * This component displays the average review score for an event using a styled card layout.
 * It utilizes Material-UI's `Rating` component to visually represent the score with custom icons.
 *
 * @param data - Event statistics data for the AverageRating component.
 *
 * @returns A React component that renders the average review score with a styled card.
 *
 * @remarks
 * - The `Rating` component uses custom icons (`FavoriteIcon` and `FavoriteBorderIcon`) to represent filled and empty states.
 * - The `precision` prop of the `Rating` component is set to `0.5` to allow half-star ratings.
 * - The `styles` object is imported from a CSS module to apply custom styling to the card and rating icons.
 *
 * @example
 * ```tsx
 * <AverageRating data=\{\{ event: \{ averageFeedbackScore: 4.5 \} \}\} />
 * ```
 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import styles from './AverageRating.module.css';
import type { InterfaceStatsModal } from 'types/Event/interface';

export const AverageRating = ({ data }: InterfaceStatsModal): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventStats.averageRating',
  });

  const safeScore = data.event.averageFeedbackScore ?? 0;

  return (
    <>
      <Card className={styles.cardContainer}>
        <Card.Body>
          <Card.Title>
            <h4>{t('title')}</h4>
          </Card.Title>
          <Typography component="legend">
            {t('rated', {
              score: safeScore.toFixed(2),
            })}
          </Typography>
          <Rating
            name="customized-color"
            precision={0.5}
            max={5}
            readOnly
            value={safeScore}
            icon={<FavoriteIcon className={styles.ratingIcon} />}
            size="medium"
            emptyIcon={
              <FavoriteBorderIcon className={styles.ratingEmptyIcon} />
            }
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
