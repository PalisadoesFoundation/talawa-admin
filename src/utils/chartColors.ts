/**
 * Utility functions for retrieving chart colors from CSS variables.
 * This module centralizes color management for charts, ensuring consistency
 * and making it easier to update colors across the application.
 */

/**
 * Helper function to get CSS variable values from the document root.
 * @param variableName - The name of the CSS variable (e.g., '--chart-green')
 * @returns The value of the CSS variable, or an empty string if not available
 */
export const getCSSVariable = (variableName: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  }
  // Fallback for SSR or when window is not available
  return '';
};

/**
 * Function to get all chart colors from CSS variables.
 * This function should be called during render to ensure CSS variables are available.
 * @returns An object containing all chart color values from CSS variables
 */
export const getChartColors = () => ({
  green: getCSSVariable('--chart-green'),
  blue: getCSSVariable('--chart-blue'),
  pink: getCSSVariable('--chart-pink'),
  gold: getCSSVariable('--chart-gold'),
  chartBlue: getCSSVariable('--chart-blue-solid'),
  chartBlueAlpha: getCSSVariable('--chart-blue-alpha'),
  chartOrange: getCSSVariable('--chart-orange-solid'),
  chartOrangeAlpha: getCSSVariable('--chart-orange-alpha'),
  chartGreen: getCSSVariable('--chart-green-solid'),
  chartGreenAlpha: getCSSVariable('--chart-green-alpha'),
  chartRed: getCSSVariable('--chart-red-solid'),
  chartRedAlpha: getCSSVariable('--chart-red-alpha'),
  chartPurple: getCSSVariable('--chart-purple-solid'),
  chartPurpleAlpha: getCSSVariable('--chart-purple-alpha'),
  chartBrown: getCSSVariable('--chart-brown-solid'),
  chartBrownAlpha: getCSSVariable('--chart-brown-alpha'),
});
