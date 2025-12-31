/**
 * UserTableRow Component
 *
 * A reusable table row component for displaying user information in a consistent format
 * across different screens. Supports both 2-column and 4-column layouts with optional
 * joined date display and customizable actions.
 *
 * @example
 * // Basic usage with 2-column layout (User + Actions)
 * <UserTableRow
 *   user={{
 *     id: "1",
 *     name: "John Doe",
 *     emailAddress: "john@example.com",
 *     createdAt: "2023-01-01T00:00:00Z"
 *   }}
 *   rowNumber={1}
 *   showJoinedDate={false}
 *   actions={[
 *     {
 *       label: "Edit",
 *       onClick: () => handleEdit("1"),
 *       variant: "primary",
 *       testId: "editUser1"
 *     }
 *   ]}
 * />
 *
 * @example
 * // 4-column layout with joined date (# + User + Joined + Actions)
 * <UserTableRow
 *   user={{
 *     id: "2",
 *     name: "Jane Smith",
 *     emailAddress: "jane@example.com",
 *     createdAt: "2023-02-01T00:00:00Z"
 *   }}
 *   rowNumber={2}
 *   showJoinedDate={true}
 *   actions={[
 *     {
 *       label: "Block",
 *       onClick: () => handleBlock("2"),
 *       variant: "danger",
 *       icon: <BlockIcon />,
 *       testId: "blockUser2"
 *     }
 *   ]}
 *   testIdPrefix="block-user"
 * />
 *
 * @example
 * // With clickable row and link path
 * <UserTableRow
 *   user={userData}
 *   rowNumber={3}
 *   linkPath="/users/3"
 *   onRowClick={() => navigate("/users/3")}
 *   showJoinedDate={true}
 *   actions={[]}
 * />
 */
import React, { memo, useCallback, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import styles from './UserTableRow.module.css';
import {
  InterfaceUserTableRowProps,
  InterfaceActionButton,
} from 'types/AdminPortal/UserTableRow/interface';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

const mapVariantToColor = (v: InterfaceActionButton['variant']) => {
  switch (v) {
    case 'danger':
      return 'error';
    case 'success':
      return 'success';
    case 'primary':
      return 'primary';
    default:
      return 'inherit';
  }
};

export const UserTableRow: React.FC<InterfaceUserTableRowProps> = memo(
  (props) => {
    const {
      user,
      rowNumber,
      linkPath,
      actions = [],
      showJoinedDate = true,
      onRowClick,
      isDataGrid = true,
      compact = false,
      testIdPrefix = 'user-table-row',
    } = props;

    const { t } = useTranslation('common');
    const email = user.emailAddress || t('no_email', 'No email');
    const name = user.name || t('no_name', 'No name');
    const joined = user.createdAt
      ? dayjs(user.createdAt).format('YYYY-MM-DD')
      : t('na', 'N/A');

    const handleRowClick = useCallback(
      (e: MouseEvent) => {
        if (!onRowClick) return;
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        onRowClick(user);
      },
      [onRowClick, user],
    );

    const renderActions = () => {
      if (!actions?.length) return null;
      return (
        <Stack direction="row" spacing={compact ? 0.5 : 1}>
          {actions.map((action, idx) => {
            const color = mapVariantToColor(action.variant);
            const label = action.label;
            const aria = action.ariaLabel || label;

            return (
              <Tooltip key={idx} title={label}>
                <span>
                  <Button
                    size={compact ? 'small' : 'medium'}
                    variant="outlined"
                    color={
                      color as
                        | 'primary'
                        | 'secondary'
                        | 'error'
                        | 'success'
                        | 'inherit'
                    }
                    onClick={() => action.onClick(user)}
                    disabled={action.disabled}
                    aria-label={aria}
                    data-testid={
                      action.testId || `${testIdPrefix}-action-${idx}`
                    }
                    startIcon={action.icon}
                  >
                    {label}
                  </Button>
                </span>
              </Tooltip>
            );
          })}
        </Stack>
      );
    };

    const left = (
      <Stack direction="row" alignItems="center" spacing={compact ? 1 : 1.5}>
        <ProfileAvatarDisplay
          fallbackName={name}
          imageUrl={user.avatarURL}
          size={compact ? 'small' : 'medium'}
          dataTestId={`${testIdPrefix}-avatar-${user.id}`}
        />
        <Stack spacing={0}>
          {linkPath ? (
            <Typography
              variant={compact ? 'body2' : 'body1'}
              component={Link}
              to={linkPath}
            >
              {name}
            </Typography>
          ) : (
            <Typography variant={compact ? 'body2' : 'body1'}>
              {name}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            data-testid={`${testIdPrefix}-email-${user.id}`}
          >
            {email}
          </Typography>
        </Stack>
      </Stack>
    );

    const right = (
      <Stack direction="row" spacing={compact ? 1 : 2} alignItems="center">
        {showJoinedDate && (
          <Typography
            variant="body2"
            color="text.secondary"
            data-testid={`${testIdPrefix}-joined-${user.id}`}
          >
            {t('joined', 'Joined')}: {joined}
          </Typography>
        )}
        {renderActions()}
      </Stack>
    );

    if (isDataGrid) {
      return (
        <Box
          onClick={onRowClick ? handleRowClick : undefined}
          sx={{
            gap: compact ? 1 : 2,
          }}
          className={`${styles.gridCell} ${onRowClick ? styles.gridCellPointer : ''}`}
          data-testid={`${testIdPrefix}-gridcell-${user.id}`}
          aria-label={t('user_row', 'User row')}
        >
          {left}
          {right}
        </Box>
      );
    }

    return (
      <tr
        onClick={onRowClick ? handleRowClick : undefined}
        className={onRowClick ? styles.tableRowPointer : undefined}
        data-testid={`${testIdPrefix}-tr-${user.id}`}
        aria-label={t('user_row', 'User row')}
      >
        {typeof rowNumber === 'number' && (
          <td data-testid={`${testIdPrefix}-no-${user.id}`}>{rowNumber}</td>
        )}
        <td>{left}</td>
        {showJoinedDate && <td>{joined}</td>}
        <td>{renderActions()}</td>
      </tr>
    );
  },
);

export default UserTableRow;
