import React from 'react';
import dayjs from 'dayjs';
import Button from 'shared-components/Button';
import Avatar from 'shared-components/Avatar/Avatar';
import { currencySymbols } from 'utils/currency';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import styles from './PledgeColumns.module.css';

export interface InterfacePledgeTableRow {
  id: string;
  original: InterfacePledgeInfo;
  users: InterfaceUserInfoPG[];
  endDate: Date;
  pledgeDate: Date;
  amount: number;
  currency: string;
}

/**
 * Props for the getPledgeColumns function.
 */
interface InterfacePledgeColumnsProps {
  labels: {
    pledgers: string;
    pledgeDate: string;
    pledged: string;
    donated: string;
    action: string;
    edit: string;
  };
  getMoreCountLabel: (count: number) => string;
  id: string | undefined;
  handleClick: (
    event:
      | React.MouseEvent<HTMLSpanElement>
      | React.KeyboardEvent<HTMLSpanElement>,
    users: InterfaceUserInfoPG[],
  ) => void;
  handleOpenModal: (
    pledge: InterfacePledgeInfo | null,
    mode: 'edit' | 'create',
  ) => void;
}

/**
 * Returns the column definitions for the pledges DataGrid.
 * @param props - The props containing translation functions and event handlers.
 * @returns An array of DataTable columns for the pledges table.
 */
export const getPledgeColumns = ({
  labels,
  getMoreCountLabel,
  id,
  handleClick,
  handleOpenModal,
}: InterfacePledgeColumnsProps): IColumnDef<InterfacePledgeTableRow>[] => [
  {
    id: 'pledgers',
    header: labels.pledgers,
    accessor: 'users',
    render: (value, row) => {
      const users = (value as InterfaceUserInfoPG[]) || [];
      const mainUsers = users.slice(0, 1);
      const extraUsers = users.slice(1);

      return (
        <div className={`d-flex ${styles.flexWrapGap} ${styles.maxHeight120}`}>
          {mainUsers.map((user: InterfaceUserInfoPG, index: number) => (
            <div
              className={styles.pledgerContainer}
              key={`${row.id}-main-${index}`}
              data-testid={`mainUser-${row.id}-${index}`}
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
            <span
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
              data-testid={`moreContainer-${row.id}`}
            >
              {getMoreCountLabel(extraUsers.length)}
            </span>
          )}
        </div>
      );
    },
    meta: {
      sortable: false,
    },
  },
  {
    id: 'pledgeDate',
    header: labels.pledgeDate,
    accessor: 'pledgeDate',
    render: (value) =>
      value ? dayjs(String(value)).format('DD/MM/YYYY') : '-',
    meta: {
      sortable: true,
      sortFn: (a, b) =>
        dayjs(a.pledgeDate).valueOf() - dayjs(b.pledgeDate).valueOf(),
    },
  },
  {
    id: 'amount',
    header: labels.pledged,
    accessor: 'amount',
    render: (value, row) => (
      <div
        className="d-flex justify-content-center fw-bold"
        data-testid="amountCell"
      >
        {currencySymbols[row.currency as keyof typeof currencySymbols] || ''}
        {((value as number) ?? 0).toLocaleString('en-US')}
      </div>
    ),
    meta: {
      sortable: true,
      align: 'center',
    },
  },
  {
    id: 'donated',
    header: labels.donated,
    accessor: 'amount',
    render: (_value, row) => (
      <div
        className="d-flex justify-content-center fw-bold"
        data-testid="paidCell"
      >
        {currencySymbols[row.currency as keyof typeof currencySymbols]}0
      </div>
    ),
    meta: {
      sortable: false,
      align: 'center',
    },
  },
  {
    id: 'action',
    header: labels.action,
    accessor: 'id',
    render: (_value, row) => (
      <Button
        size="sm"
        className={styles.editButton}
        data-testid="editPledgeBtn"
        onClick={() => handleOpenModal(row.original, 'edit')}
      >
        <i className="fa fa-edit me-1" />
        {labels.edit}
      </Button>
    ),
    meta: {
      sortable: false,
      align: 'center',
    },
  },
];
