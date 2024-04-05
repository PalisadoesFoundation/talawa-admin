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
<<<<<<< HEAD
        'TableLoader error Either headerTitles or noOfCols is required !',
=======
        'TableLoader error Either headerTitles or noOfCols is required !'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                  },
=======
                  }
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
