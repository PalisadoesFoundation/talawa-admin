import React from 'react';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import type { TFunction } from 'i18next';
import dayjs from 'dayjs';
import { Button } from 'shared-components/Button';
import Avatar from 'shared-components/Avatar/Avatar';
import { currencySymbols } from 'utils/currency';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import styles from './PledgeColumns.module.css';

/**
 * Props for the getPledgeColumns function.
 */
interface InterfacePledgeColumnsProps {
  t: TFunction<'translation', undefined>;
  tCommon: TFunction<'common', undefined>;
  id: string | undefined;
  handleClick: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    users: InterfaceUserInfoPG[],
  ) => void;
  handleOpenModal: (
    pledge: InterfacePledgeInfo | null,
    mode: 'edit' | 'create',
  ) => void;
  handleDeleteClick: (pledge: InterfacePledgeInfo) => void;
}

/**
 * Returns the column definitions for the pledges DataGrid.
 * @param props - The props containing translation functions and event handlers.
 * @returns An array of GridColDef for the pledges table.
 */
export const getPledgeColumns = ({
  t,
  tCommon,
  id,
  handleClick,
  handleOpenModal,
  handleDeleteClick,
}: InterfacePledgeColumnsProps): GridColDef[] => [
  {
    field: 'pledgers',
    headerName: t('pledges.pledgers'),
    flex: 3,
    minWidth: 50,
    align: 'left',
    headerAlign: 'center',
    headerClassName: `${styles.tableHeader}`,
    sortable: false,
    renderCell: (params: GridCellParams) => {
      const users = params.row.users || [];
      const mainUsers = users.slice(0, 1);
      const extraUsers = users.slice(1);

      return (
        <div className={`d-flex ${styles.flexWrapGap} ${styles.maxHeight120}`}>
          {mainUsers.map((user: InterfaceUserInfoPG, index: number) => (
            <div
              className={styles.pledgerContainer}
              key={`${params.row.id}-main-${index}`}
              data-testid={`mainUser-${params.row.id}-${index}`}
            >
              {user.avatarURL ? (
                <img
                  src={user.avatarURL}
                  alt={user.name}
                  className={styles.TableImagePledge}
                />
              ) : (
                <Avatar
                  containerStyle={styles.imageContainerPledge}
                  avatarStyle={styles.TableImagePledge}
                  name={user.name}
                  alt={user.name}
                />
              )}
              <span>{user.name}</span>
            </div>
          ))}
          {extraUsers.length > 0 && (
            <div
              className={styles.moreContainer}
              aria-describedby={id}
              role="button"
              tabIndex={0}
              onClick={(event) => handleClick(event, extraUsers)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleClick(event, extraUsers);
                }
              }}
              data-testid={`moreContainer-${params.row.id}`}
            >
              {tCommon('moreCount', { count: extraUsers.length })}
            </div>
          )}
        </div>
      );
    },
  },
  {
    field: 'pledgeDate',
    headerName: t('pledges.pledgeDate'),
    flex: 1,
    minWidth: 150,
    align: 'center',
    headerAlign: 'center',
    headerClassName: `${styles.tableHeader}`,
    sortable: false,
    renderCell: (params: GridCellParams) =>
      params.row.pledgeDate
        ? dayjs(params.row.pledgeDate).format('DD/MM/YYYY')
        : '-',
  },
  {
    field: 'amount',
    headerName: t('pledges.pledged'),
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: `${styles.tableHeader}`,
    sortable: false,
    renderCell: (params: GridCellParams) => (
      <div
        className="d-flex justify-content-center fw-bold"
        data-testid="amountCell"
      >
        {currencySymbols[params.row.currency as keyof typeof currencySymbols] ||
          ''}
        {params.row.amount?.toLocaleString('en-US') ?? 0}
      </div>
    ),
  },
  {
    field: 'donated',
    headerName: t('pledges.donated'),
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: `${styles.tableHeader}`,
    sortable: false,
    renderCell: (params: GridCellParams) => (
      <div
        className="d-flex justify-content-center fw-bold"
        data-testid="paidCell"
      >
        {currencySymbols[params.row.currency as keyof typeof currencySymbols]}0
      </div>
    ),
  },
  {
    field: 'action',
    headerName: tCommon('action'),
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: `${styles.tableHeader}`,
    sortable: false,
    renderCell: (params: GridCellParams) => (
      <>
        <Button
          variant="success"
          size="sm"
          className={`me-2 ${styles.editButton}`}
          data-testid="editPledgeBtn"
          onClick={() =>
            handleOpenModal(params.row as InterfacePledgeInfo, 'edit')
          }
        >
          <i className="fa fa-edit" />
        </Button>
        <Button
          size="sm"
          variant="danger"
          className="rounded"
          data-testid="deletePledgeBtn"
          onClick={() => handleDeleteClick(params.row as InterfacePledgeInfo)}
        >
          <i className="fa fa-trash" />
        </Button>
      </>
    ),
  },
];
