/**
 * A React functional component that renders a table skeleton loader.
 * This component is useful for displaying a placeholder table while data is being loaded.
 *
 * @component
 * @param props - The properties for the TableLoader component.
 * @param props.noOfRows - The number of rows to render in the table body.
 * @param props.headerTitles - (Optional) An array of strings representing the titles for the table headers.
 *                              If provided, the number of columns will be determined by the length of this array.
 * @param props.noOfCols - (Optional) The number of columns to render in the table.
 *                         This is required if `headerTitles` is not provided.
 * @param props.data-testid - (Optional) A custom `data-testid` attribute for testing purposes.
 *
 * @throws {Error} Throws an error if neither `headerTitles` nor `noOfCols` is provided.
 *
 * @returns A JSX element representing the table skeleton loader.
 *
 * @example
 * // Example usage with header titles
 * <TableLoader noOfRows={5} headerTitles={['Name', 'Age', 'Location']} />
 *
 * @example
 * // Example usage with number of columns
 * <TableLoader noOfRows={3} noOfCols={4} />
 *
 * @remarks
 * - The component uses a shimmer effect for the loading placeholders.
 * - The `styles.loadingItem` class is applied to each cell for the shimmer effect.
 * - The `react-bootstrap` Table component is used for table structure.
 */
import React, { useEffect } from 'react';
import styles from './TableLoader.module.css';
import { Table } from 'react-bootstrap';

export interface InterfaceTableLoader {
  noOfRows: number;
  headerTitles?: string[];
  noOfCols?: number;
  'data-testid'?: string;
}

const tableLoader = (props: InterfaceTableLoader): JSX.Element => {
  const { noOfRows, headerTitles, noOfCols, 'data-testid': dataTestId } = props;

  useEffect(() => {
    if (headerTitles == undefined && noOfCols == undefined) {
      throw new Error(
        'TableLoader error Either headerTitles or noOfCols is required !',
      );
    }
  }, []);

  return (
    <div data-testid={dataTestId || 'TableLoader'}>
      <Table className="mb-4" responsive>
        <thead>
          <tr>
            {headerTitles
              ? headerTitles.map((title, index) => {
                  return <th key={index}>{title}</th>;
                })
              : noOfCols &&
                [...Array(noOfCols)].map((_, index) => {
                  return <th key={index} />;
                })}
          </tr>
        </thead>

        <tbody>
          {[...Array(noOfRows)].map((_, rowIndex) => {
            return (
              <tr
                key={rowIndex}
                className="mb-4"
                data-testid={`row-${rowIndex}-tableLoading`}
              >
                {[...Array(headerTitles ? headerTitles?.length : noOfCols)].map(
                  (_, colIndex) => {
                    return (
                      <td
                        key={colIndex}
                        data-testid={`row-${rowIndex}-col-${colIndex}-tableLoading`}
                      >
                        <div className={`${styles.loadingItem} shimmer`} />
                      </td>
                    );
                  },
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default tableLoader;
