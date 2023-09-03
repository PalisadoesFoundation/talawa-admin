import React from 'react';
import styles from './TableLoader.module.css';
import { Table } from 'react-bootstrap';

interface InterfaceTableLoader {
  noOfRows: number;
  headerTitles: string[];
}

const tableLoader = (props: InterfaceTableLoader): JSX.Element => {
  const { noOfRows, headerTitles } = props;

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            {headerTitles.map((title, index) => {
              return <th key={index}>{title}</th>;
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
                {[...Array(headerTitles?.length)].map((_, colIndex) => {
                  return (
                    <td
                      key={colIndex}
                      data-testid={`row-${rowIndex}-col-${colIndex}-tableLoading`}
                    >
                      <div className={`${styles.loadingItem} shimmer`} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default tableLoader;
