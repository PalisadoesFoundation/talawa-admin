import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
<<<<<<< HEAD
=======
import { styled } from '@mui/material/styles';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

type ModalPropType = {
  data: {
    event: {
      _id: string;
      averageFeedbackScore: number;
      feedback: FeedbackType[];
    };
  };
};

type FeedbackType = {
  _id: string;
  rating: number;
  review: string | null;
};

<<<<<<< HEAD
=======
// eslint-disable-next-line @typescript-eslint/naming-convention
const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const AverageRating = ({ data }: ModalPropType): JSX.Element => {
  return (
    <>
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title>
            <h4>Average Review Score</h4>
          </Card.Title>
          <Typography component="legend">
            Rated {data.event.averageFeedbackScore.toFixed(2)} / 5
          </Typography>
<<<<<<< HEAD
          <Rating
=======
          <StyledRating
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            name="customized-color"
            precision={0.5}
            max={5}
            readOnly
            value={data.event.averageFeedbackScore}
            icon={<FavoriteIcon fontSize="inherit" />}
            size="medium"
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
<<<<<<< HEAD
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#ff6d75',
              },
              '& .MuiRating-iconHover': {
                color: '#ff3d47',
              },
            }}
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          />
        </Card.Body>
      </Card>
    </>
  );
};
