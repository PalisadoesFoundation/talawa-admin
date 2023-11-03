import React, { useEffect } from 'react';
import styles from './TableLoader.module.css';
import { Table } from 'react-bootstrap';

export interface InterfaceTableLoader {
  noOfRows: number;
  headerTitles?: string[];
  noOfCols?: number;
}

const tableLoader = (props: InterfaceTableLoader): JSX.Element => {
  const { noOfRows, headerTitles, noOfCols } = props;

  useEffect(() => {
    if (headerTitles == undefined && noOfCols == undefined) {
      throw new Error(
        'TableLoader error Either headerTitles or noOfCols is required !'
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
                  }
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
