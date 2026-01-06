/**
 * A React functional component that renders a table skeleton loader.
 * This component is useful for displaying a placeholder table while data is being loaded.
 *

 * @param props - The properties for the TableLoader component.
 *
 * @throws Error
 * Throws an error if neither `headerTitles` nor `noOfCols` is provided.
 *
 * @returns A JSX element representing the table skeleton loader.
 *
 * @example
 * ```tsx
 * <TableLoader noOfRows={5} headerTitles={['Name', 'Age', 'Location']} />
 * ```
 *
 * @example
 * ```tsx
 * <TableLoader noOfRows={3} noOfCols={4} />
 * ```
 *
 * @remarks
 * - The component uses a shimmer effect for the loading placeholders.
 * - The `styles.loadingItem` class is applied to each cell for the shimmer effect.
 * - The `react-bootstrap` Table component is used for table structure.
 */
import React, { useEffect } from 'react';
import styles from './TableLoader.module.css';
import { Table } from 'react-bootstrap';

import { InterfaceTableLoader } from '../../types/shared-components/TableLoader/interface';

const TableLoader = (props: InterfaceTableLoader): JSX.Element => {
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

export default TableLoader;
