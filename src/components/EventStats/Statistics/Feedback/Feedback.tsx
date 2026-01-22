/**
 * FeedbackStats Component
 *
 * This component renders a feedback analysis section for an event, including a pie chart
 * visualization of feedback ratings and a summary of the number of attendees who provided feedback.
 *
 * @param props - The props object containing event data. It includes:
 *   - data: The data object containing event details.
 *   - data.event: The event object.
 *   - data.event.feedback: An array of feedback objects for the event.
 *
 * @returns A React component that displays a feedback analysis card with a pie chart.
 *
 * @remarks
 * - The pie chart uses the `@mui/x-charts/PieChart` library for visualization.
 * - Feedback ratings are visualized with colors ranging from green (high ratings) to red (low ratings).
 * - If no feedback is available, a message prompts attendees to submit feedback.
 *
 * @example
 * ```tsx
 * const eventData = {
 *   event: {
 *     feedback: [
 *       { rating: 5 },
 *       { rating: 4 },
 *       { rating: 3 },
 *     ],
 *   },
 * };
 * <FeedbackStats data={eventData} />;
 * ```
 *
 */
import React, { useMemo } from 'react';
import {
  PieChart,
  pieArcClasses,
  pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import Card from 'react-bootstrap/Card';
import type { Feedback } from 'types/Event/type';
import type { InterfaceStatsModal } from 'types/Event/interface';
import { useTranslation } from 'react-i18next';
import './Feedback.module.css';

// Fallback colors in case CSS variables are not available (SSR, tests)
const FALLBACK_COLORS = [
  '#57bb8a',
  '#94bd77',
  '#d4c86a',
  '#e9b861',
  '#e79a69',
  '#dd776e',
];

export const FeedbackStats = ({
  data,
}: InterfaceStatsModal): React.JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventStats.feedback',
  });

  // Memoize colors to avoid getComputedStyle on every render
  const ratingColors = useMemo(() => {
    if (typeof document === 'undefined') return FALLBACK_COLORS;
    const getCSSVariable = (varName: string): string => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      return value || '';
    };
    const colors = [
      getCSSVariable('--rating-color-5'),
      getCSSVariable('--rating-color-4'),
      getCSSVariable('--rating-color-3'),
      getCSSVariable('--rating-color-2'),
      getCSSVariable('--rating-color-1'),
      getCSSVariable('--rating-color-0'),
    ];
    // Return fallback if any color is empty
    return colors.some((c) => !c) ? FALLBACK_COLORS : colors;
  }, []);

  // Count the number of feedbacks for each rating
  const count: Record<number, number> = {};

  data.event.feedback.forEach((feedback: Feedback) => {
    if (feedback.rating in count) count[feedback.rating]++;
    else count[feedback.rating] = 1;
  });

  // Prepare data for the pie chart
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
            <h3>{t('title')}</h3>
          </Card.Title>
          <h5>{t('filledByCount', { count: data.event.feedback.length })}</h5>
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
                  highlightScope: { fade: 'global', highlight: 'item' },
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
            <>{t('emptyState')}</>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
