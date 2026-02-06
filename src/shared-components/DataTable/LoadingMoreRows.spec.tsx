import { cleanup, render, screen } from '@testing-library/react';
import { LoadingMoreRows } from './LoadingMoreRows';

const columns = [{ id: 'name', header: 'Name', accessor: () => null }];

describe('LoadingMoreRows', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders default 5 skeleton rows when skeletonRows is not provided', () => {
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

    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`skeleton-append-${i}`)).toBeInTheDocument();
    }
  });

  it('renders the specified number of skeleton rows', () => {
    render(
      <table>
        <tbody>
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={false}
            hasRowActions={false}
            skeletonRows={3}
          />
        </tbody>
      </table>,
    );
    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`skeleton-append-${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByTestId('skeleton-append-3')).not.toBeInTheDocument();
  });

  it('renders extra cell when effectiveSelectable is true', () => {
    render(
      <table>
        <tbody>
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={true}
            hasRowActions={false}
          />
        </tbody>
      </table>,
    );

    const cells = screen.getAllByTestId('data-skeleton-cell');
    expect(cells.length).toBe(5 * 2);
  });

  it('renders extra cell when hasRowActions is true', () => {
    render(
      <table>
        <tbody>
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={false}
            hasRowActions={true}
          />
        </tbody>
      </table>,
    );

    const cells = screen.getAllByTestId('data-skeleton-cell');
    expect(cells.length).toBe(5 * 2);
  });

  it('renders extra cells when both effectiveSelectable and hasRowActions are true', () => {
    render(
      <table>
        <tbody>
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={true}
            hasRowActions={true}
          />
        </tbody>
      </table>,
    );

    const cells = screen.getAllByTestId('data-skeleton-cell');
    expect(cells.length).toBe(5 * 3);
  });

  it('renders no skeleton rows when skeletonRows is 0', () => {
    render(
      <table>
        <tbody>
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={false}
            hasRowActions={false}
            skeletonRows={0}
          />
        </tbody>
      </table>,
    );

    expect(screen.queryByTestId('skeleton-append-0')).not.toBeInTheDocument();
  });
});
