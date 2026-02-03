/**
 * Design token to pixel value mapping for MUI DataGrid column widths.
 *
 * MUI DataGrid column properties (width, minWidth, maxWidth) require numeric pixel values
 * and cannot accept CSS variables. This utility provides a mapping from design token names
 * to their equivalent pixel values, allowing DataGrid columns to use the design system
 * while satisfying MUI's type requirements.
 *
 * Values are derived from src/style/tokens/spacing.css (1rem = 16px)
 */

/**
 * Mapping of spacing token names to their pixel values.
 * Token names match the CSS variable names without the '--' prefix.
 */
export const spacingTokens: Record<string, number> = {
  'space-0': 0,
  'space-0-5': 1, // 0.0625rem = 1px
  'space-1': 2, // 0.125rem = 2px
  'space-2': 4, // 0.25rem = 4px
  'space-3': 8, // 0.5rem = 8px
  'space-4': 12, // 0.75rem = 12px
  'space-5': 16, // 1rem = 16px
  'space-6': 20, // 1.25rem = 20px
  'space-7': 24, // 1.5rem = 24px
  'space-8': 32, // 2rem = 32px
  'space-9': 40, // 2.5rem = 40px
  'space-10': 48, // 3rem = 48px
  'space-11': 64, // 4rem = 64px
  'space-12': 80, // 5rem = 80px
  'space-13': 96, // 6rem = 96px
  'space-14': 120, // 7.5rem = 120px
  'space-15': 150, // 9.375rem = 150px
  'space-16': 160, // 10rem = 160px
  'space-17': 220, // 13.75rem = 220px
  'space-18': 250, // 15.625rem = 250px
  'space-19': 272, // 17rem = 272px
  'space-20': 300, // 18.75rem = 300px
  'space-21': 320, // 20rem = 320px
  'space-22': 350, // 21.875rem = 350px
  'space-23': 400, // 25rem = 400px
  'space-24': 420, // 26.25rem = 420px
  'space-25': 500, // 31.25rem = 500px
  'space-26': 640, // 40rem = 640px
  'space-27': 800, // 50rem = 800px
  'space-28': 900, // 56.25rem = 900px
  'space-29': 1400, // 87.5rem = 1400px
};

/** Type representing valid spacing token names */
export type SpacingToken = keyof typeof spacingTokens;

/**
 * Converts a spacing token name to its pixel value.
 *
 * @param token - The spacing token name (e.g., 'space-15')
 * @returns The pixel value as a number
 * @throws Error if the token name is not found
 *
 * @example
 * ```ts
 * getSpacingValue('space-15') // returns 150
 * getSpacingValue('space-8')  // returns 32
 * ```
 */
export function getSpacingValue(token: SpacingToken): number {
  const value = spacingTokens[token];
  if (value === undefined) {
    throw new Error(
      `Unknown spacing token: "${token}". Valid tokens are: ${Object.keys(spacingTokens).join(', ')}`,
    );
  }
  return value;
}

/**
 * Type guard to check if a value is a valid spacing token name.
 *
 * @param value - The value to check
 * @returns True if the value is a valid spacing token name
 */
export function isSpacingToken(value: unknown): value is SpacingToken {
  return typeof value === 'string' && value in spacingTokens;
}
