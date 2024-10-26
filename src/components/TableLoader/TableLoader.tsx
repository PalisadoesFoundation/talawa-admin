import React, { useEffect } from 'react';
import styles from './TableLoader.module.css';
import { Table } from 'react-bootstrap';

export interface InterfaceTableLoader {
  noOfRows: number;
  headerTitles?: string[];
  noOfCols?: number;
}

/**
 * The TableLoader component displays a loading skeleton for tables.
 * It shows a specified number of rows and columns as placeholders
 * with a shimmering effect to indicate loading content.
 *
 * @param props - The properties for the TableLoader component.
 * @param noOfRows - The number of rows to display.
 * @param headerTitles - Optional. The titles for the table headers.
 * @param noOfCols - Optional. The number of columns if headerTitles is not provided.
 *
 * @returns The JSX element representing the table loader.
 */
const tableLoader = (props: InterfaceTableLoader): JSX.Element => {
  const { noOfRows, headerTitles, noOfCols } = props;

  useEffect(() => {
    if (headerTitles == undefined && noOfCols == undefined) {
      throw new Error(
        'TableLoader error Either headerTitles or noOfCols is required !',
      );
    }
  }, []);

  return (
    <>
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
    </>
  );
};

export default tableLoader;
