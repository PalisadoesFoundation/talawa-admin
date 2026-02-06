import { render, screen } from '@testing-library/react';
import { LoadingMoreRows } from './LoadingMoreRows';

describe('LoadingMoreRows', () => {
  it('uses default skeletonRows value when not provided', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: () => null,
      },
    ];

    render(
      <table>
        <tbody>
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={false}
            hasRowActions={false}
          />
        </tbody>
      </table>,
    );

    // default skeletonRows = 5
    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`skeleton-append-${i}`)).toBeInTheDocument();
    }
  });
});
