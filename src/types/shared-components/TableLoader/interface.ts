/**
 * InterfaceTableLoader defines the props for the TableLoader component.
 */
export interface InterfaceTableLoader {
  /** The number of rows to render. */
  noOfRows: number;
  /** Optional array of header titles. */
  headerTitles?: string[];
  /** Optional number of columns (required if headerTitles is missing). */
  noOfCols?: number;
  /** Optional test ID for the component. */
  'data-testid'?: string;
}
