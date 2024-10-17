import React from 'react';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import styles from './EventActionItems.module.css';
import type { InterfaceActionItemInfo } from 'utils/interfaces';
import { useTranslation } from 'react-i18next';

export type Props = {
  eventId: string;
  handleActionItemStatusChange: (actionItem: InterfaceActionItemInfo) => void;
  showPreviewModal: (actionItem: InterfaceActionItemInfo) => void;
  handleEditClick: (actionItem: InterfaceActionItemInfo) => void;
};

type ColumnConfig = {
  /** Configuration for the columns of the data grid. */
  columns: GridColDef[];
};

const popover = (
  actionItemId: string,
  actionItemNotes: string,
): JSX.Element => {
  return (
    <Popover
      id={`popover-${actionItemId}`}
      data-testid={`popover-${actionItemId}`}
    >
      <Popover.Body>{actionItemNotes}</Popover.Body>
    </Popover>
  );
};

export const useEventActionColumnConfig = ({
  eventId,
  handleActionItemStatusChange,
  showPreviewModal,
  handleEditClick,
}: Props): ColumnConfig => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventActionItems',
  });
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
        const actionItem = params.row;
        return (
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="right"
            overlay={popover(actionItem._id, actionItem.preCompletionNotes)}
          >
            <span data-testid="actionItemPreCompletionNotesOverlay">
              {actionItem.preCompletionNotes.length > 25
                ? `${actionItem.preCompletionNotes.substring(0, 25)}...`
                : actionItem.preCompletionNotes}
            </span>
          </OverlayTrigger>
        );
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
        const actionItem = params.row;
        return actionItem.isCompleted ? (
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="right"
            overlay={popover(actionItem._id, actionItem.postCompletionNotes)}
          >
            <span
              data-testid="actionItemPostCompletionNotesOverlay"
              className="ms-3 "
            >
              {actionItem.postCompletionNotes?.length > 25
                ? `${actionItem.postCompletionNotes.substring(0, 25)}...`
                : actionItem.postCompletionNotes}
            </span>
          </OverlayTrigger>
        ) : (
          <span className="text-body-tertiary ms-3 fst-italic">
            {t('actionItemActive')}
          </span>
        );
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
          <div className="d-flex align-items-center ms-4 gap-2">
            <input
              type="checkbox"
              id="actionItemStatusChangeCheckbox"
              data-testid="actionItemStatusChangeCheckbox"
              className="form-check-input d-inline mt-0 me-1"
              checked={params.row.isCompleted}
              style={{ height: '16px', width: '16px' }}
              onChange={() => handleActionItemStatusChange(params.row)}
            />
            <Button
              data-testid="previewActionItemModalBtn"
              className={`${styles.actionItemsOptionsButton} d-flex align-items-center justify-content-center`}
              variant="outline-secondary"
              size="sm"
              onClick={() => showPreviewModal(params.row)}
            >
              <i className="fas fa-info fa-sm"></i>
            </Button>
            <Button
              size="sm"
              data-testid="editActionItemModalBtn"
              onClick={() => handleEditClick(params.row)}
              className={`${styles.actionItemsOptionsButton} d-flex align-items-center justify-content-center`}
              variant="outline-secondary"
            >
              {' '}
              <i className="fas fa-edit fa-sm"></i>
            </Button>
          </div>
        );
      },
    },
  ];
  return {
    columns,
  };
};
