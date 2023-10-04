import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

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

// eslint-disable-next-line @typescript-eslint/naming-convention
const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

export const AverageRating = ({ data }: ModalPropType): JSX.Element => {
  return (
    <>
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title>
            <h4>Average Review Score</h4>
          </Card.Title>
          <Typography component="legend">
            Rated {(data.event.averageFeedbackScore || 0).toFixed(2)} / 10
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
