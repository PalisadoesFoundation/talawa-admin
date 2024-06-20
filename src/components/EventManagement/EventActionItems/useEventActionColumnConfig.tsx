import React from 'react';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import styles from './EventActionItems.module.css';

export type Props = {
  eventId: string;
  manageActionsHandler: (params: GridCellParams) => void;
};

type ColumnConfig = {
  columns: GridColDef[];
};
export const useEventActionColumnConfig = ({
  eventId,
  manageActionsHandler,
}: Props): ColumnConfig => {
  const columns: GridColDef[] = [
    {
      field: 'serialNo',
      headerName: '#',
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row?.index;
      },
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            to={`/member/${eventId}`}
            state={{ id: params.row._id }}
            className={styles.membername}
          >
            {params.row?.assignee.firstName +
              ' ' +
              params.row?.assignee.lastName}
          </Link>
        );
      },
    },
    {
      field: 'actionItemCategory',
      headerName: 'Action Item Category',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row.actionItemCategory.name;
      },
    },
    {
      field: 'notes',
      headerName: 'Notes',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row.preCompletionNotes;
      },
    },
    {
      field: 'completionNotes',
      headerName: 'Completion Notes',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row.postCompletionNotes;
      },
    },
    {
      field: 'options',
      headerName: 'Options',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            onClick={() => {
              manageActionsHandler(params);
            }}
            data-testid="updateAdminModalBtn"
          >
            Manage Actions
          </Button>
        );
      },
    },
  ];
  return {
    columns,
  };
};
