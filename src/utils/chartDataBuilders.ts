/**
 * Utility functions for building chart data configurations.
 * These functions help centralize chart data creation logic and reduce
 * component file length.
 */

import { getChartColors } from './chartColors';
import type { ChartData } from 'chart.js';

/**
 * Builds attendance trends chart data for line charts.
 * @param eventLabels - Array of event labels (dates)
 * @param attendeeCounts - Array of total attendee counts
 * @param maleCounts - Array of male attendee counts
 * @param femaleCounts - Array of female attendee counts
 * @param otherCounts - Array of other/intersex attendee counts
 * @param t - Translation function
 * @returns Chart data configuration for a line chart
 */
export const buildAttendanceChartData = (
  eventLabels: string[],
  attendeeCounts: number[],
  maleCounts: number[],
  femaleCounts: number[],
  otherCounts: number[],
  t: (key: string) => string,
): ChartData<'line'> => {
  const colors = getChartColors();
  return {
    labels: eventLabels,
    datasets: [
      {
        label: t('attendeeCount'),
        data: attendeeCounts,
        fill: true,
        borderColor: colors.green,
      },
      {
        label: t('maleAttendees'),
        data: maleCounts,
        fill: false,
        borderColor: colors.blue,
      },
      {
        label: t('femaleAttendees'),
        data: femaleCounts,
        fill: false,
        borderColor: colors.pink,
      },
      {
        label: t('otherAttendees'),
        data: otherCounts,
        fill: false,
        borderColor: colors.gold,
      },
    ],
  };
};

/**
 * Builds demographics chart data for bar charts.
 * @param categoryLabels - Array of category labels (e.g., ['Male', 'Female', 'Other'] or age groups)
 * @param categoryData - Array of counts for each category
 * @param selectedCategory - The selected category type ('Gender' or 'Age')
 * @param t - Translation function
 * @returns Chart data configuration for a bar chart
 */
export const buildDemographicsChartData = (
  categoryLabels: string[],
  categoryData: number[],
  selectedCategory: string,
  t: (key: string) => string,
): ChartData<'bar'> => {
  const colors = getChartColors();
  return {
    labels: categoryLabels,
    datasets: [
      {
        label:
          selectedCategory === 'Gender'
            ? t('genderDistribution')
            : t('ageDistribution'),
        data: categoryData,
        backgroundColor: [
          colors.chartBlueAlpha,
          colors.chartOrangeAlpha,
          colors.chartGreenAlpha,
          colors.chartRedAlpha,
          colors.chartPurpleAlpha,
          colors.chartBrownAlpha,
        ],
        borderColor: [
          colors.chartBlue,
          colors.chartOrange,
          colors.chartGreen,
          colors.chartRed,
          colors.chartPurple,
          colors.chartBrown,
        ],
        borderWidth: 2,
      },
    ],
  };
};
