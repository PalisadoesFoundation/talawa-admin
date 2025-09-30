import React from 'react';

function MockChart(): React.ReactElement | null {
  return null;
}

export const PieChart = MockChart;
export const BarChart = MockChart;
export const LineChart = MockChart;
export const pieArcClasses: Record<string, string> = {};
export const pieArcLabelClasses: Record<string, string> = {};

export default {};
