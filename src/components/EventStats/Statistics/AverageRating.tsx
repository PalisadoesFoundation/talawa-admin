import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import { Row, Col } from 'react-bootstrap';
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

export const AverageRating = ({ data }: ModalPropType): JSX.Element => {
  return (
    <>
      <Card>
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <div>
                <h4 className="mb-0">Average Review Score</h4>
              </div>
            </Col>
            <Col>
              <Typography component="legend">
                <h5 className="mb-0">
                  Rated {data.event.averageFeedbackScore.toFixed()} / 5
                </h5>
              </Typography>
            </Col>
          </Row>
          {/* <Rating
            name="customized-color"
            precision={0.5}
            max={5}
            readOnly
            value={data.event.averageFeedbackScore}
            icon={<FavoriteIcon fontSize="inherit" />}
            size="medium"
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#ff6d75',
              },
              '& .MuiRating-iconHover': {
                color: '#ff3d47',
              },
            }}
          /> */}
        </Card.Body>
      </Card>
    </>
  );
};
