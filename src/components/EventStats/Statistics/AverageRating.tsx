import React from 'react';
import styles from './Loader.module.css';
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACK_SCORE } from 'GraphQl/Queries/Queries';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

type ModalPropType = {
  eventId: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

export const AverageRating = (props: ModalPropType): JSX.Element => {
  const { data, loading } = useQuery(EVENT_FEEDBACK_SCORE, {
    variables: { id: props.eventId },
  });

  // Render the loading screen
  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title>
            <h4>Average Review Score</h4>
          </Card.Title>
          <Typography component="legend">
            Rated {(data.event.averageFeedbackScore | 0).toFixed(2)} / 10
          </Typography>
          <StyledRating
            name="customized-color"
            precision={0.5}
            max={10}
            readOnly
            value={data.event.averageFeedbackScore}
            icon={<FavoriteIcon fontSize="inherit" />}
            size="medium"
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
        </Card.Body>
      </Card>
    </>
  );
};
