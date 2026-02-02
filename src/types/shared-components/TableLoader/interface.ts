/**
 * Props for the TableLoader component.
 * `@property` noOfRows - The number of rows to render in the table body.
 * `@property` headerTitles - An array of strings representing the titles for the table headers.
 * `@property` noOfCols - The number of columns to render if headerTitles is not provided.
 * `@property` data-testid - A custom data-testid attribute for testing purposes.
 */
export interface InterfaceTableLoaderProps {
  noOfRows: number;
  headerTitles?: string[];
  noOfCols?: number;
  'data-testid'?: string;
}
