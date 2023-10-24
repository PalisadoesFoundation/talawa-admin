import React from 'react';
import {
  PieChart,
  pieArcClasses,
  pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import Card from 'react-bootstrap/Card';

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

export const FeedbackStats = ({ data }: ModalPropType): JSX.Element => {
  const ratingColors = [
    '#57bb8a', // Green
    '#94bd77',
    '#d4c86a',
    '#e9b861',
    '#e79a69',
    '#dd776e', // Red
  ];

  const count: Record<number, number> = {};

  data.event.feedback.forEach((feedback: FeedbackType) => {
    if (feedback.rating in count) count[feedback.rating]++;
    else count[feedback.rating] = 1;
  });

  const chartData = [];
  for (let rating = 0; rating <= 5; rating++) {
    if (rating in count)
      chartData.push({
        id: rating,
        value: count[rating],
        label: `${rating} (${count[rating]})`,
        color: ratingColors[5 - rating],
      });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h3>Feedback Analysis</h3>
          </Card.Title>
          <h5>
            {data.event.feedback.length} people have filled feedback for this
            event.
          </h5>
          {data.event.feedback.length ? (
            <PieChart
              colors={ratingColors}
              series={[
                {
                  data: chartData,
                  arcLabel: (item) => `${item.id} (${item.value})`,
                  innerRadius: 30,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  startAngle: 0,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              sx={{
                [`& .${pieArcClasses.faded}`]: {
                  fill: 'gray',
                },
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'black',
                  fontSize: '15px',
                },
                [`& .${pieArcLabelClasses.faded}`]: {
                  display: 'none',
                },
              }}
              width={380}
              height={380}
            />
          ) : (
            <>Please ask attendees to submit feedback for insights!</>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
