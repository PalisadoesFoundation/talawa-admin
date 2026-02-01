/**
 * UserTableRow Component
 *
 * A reusable table row component for displaying user information in both DataGrid and table modes.
 * Supports flexible action buttons, optional linking, and comprehensive accessibility features.
 *
 * @param user - User information to display (id, name, email, avatar, createdAt)
 * @param rowNumber - Optional row number for table mode display
 * @param linkPath - Optional path to make user name clickable as a link
 * @param actions - Array of action buttons with configurable variants and handlers
 * @param showJoinedDate - Whether to display the user's joined date (default: true)
 * @param onRowClick - Callback when row is clicked (excludes button/link clicks)
 * @param isDataGrid - Whether to render as DataGrid cell or table row (default: true)
 * @param compact - Whether to use compact spacing and sizing (default: false)
 * @param testIdPrefix - Prefix for test IDs (default: 'user-table-row')
 * @returns JSX element representing the user table row
 */
import React, { memo, useCallback, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from 'shared-components/Button/Button';
import Tooltip from 'shared-components/Tooltip/Tooltip';
import styles from './UserTableRow.module.css';
import {
  InterfaceUserTableRowProps,
  InterfaceActionButton,
} from 'types/AdminPortal/UserTableRow/interface';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

const mapVariantToBootstrap = (v: InterfaceActionButton['variant']): string => {
  switch (v) {
    case 'danger':
      return 'outline-danger';
    case 'success':
      return 'outline-success';
    case 'primary':
      return 'outline-primary';
    default:
      return 'outline-secondary';
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
    const email = user.emailAddress || t('email');
    const name = user.name || t('name');
    const joined = user.createdAt
      ? dayjs(user.createdAt).format('YYYY-MM-DD')
      : t('notFound');

    const handleRowClick = useCallback(
      (e: MouseEvent) => {
        if (!onRowClick) return;
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('a')) return;
        onRowClick(user);
      },
      [onRowClick, user],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!onRowClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick(user);
        }
      },
      [onRowClick, user],
    );

    const renderActions = () => {
      if (!actions?.length) return null;
      return (
        <Stack direction="row" spacing={compact ? 0.5 : 1}>
          {actions.map((action, idx) => {
            const variant = mapVariantToBootstrap(action.variant);
            const label = action.label;
            const aria = action.ariaLabel || label;
            const key = action.testId || `${action.label}-${idx}`;

            return (
              <Tooltip key={key} content={label}>
                <span>
                  <Button
                    size={compact ? 'sm' : 'md'}
                    variant={variant}
                    onClick={() => action.onClick(user)}
                    disabled={action.disabled}
                    aria-label={aria}
                    data-testid={
                      action.testId || `${testIdPrefix}-action-${idx}`
                    }
                    icon={action.icon}
                    iconPosition="start"
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
        />
        <Stack spacing={0}>
          {linkPath ? (
            <Typography
              variant={compact ? 'body2' : 'body1'}
              component={Link}
              to={linkPath}
              data-field="name"
            >
              {name}
            </Typography>
          ) : (
            <Typography variant={compact ? 'body2' : 'body1'} data-field="name">
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
            {t('joined')}: {joined}
          </Typography>
        )}
        {renderActions()}
      </Stack>
    );

    if (isDataGrid) {
      return (
        <Box
          onClick={onRowClick ? handleRowClick : undefined}
          onKeyDown={onRowClick ? handleKeyDown : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          sx={{
            gap: compact ? 1 : 2,
          }}
          className={`${styles.gridCell} ${onRowClick ? styles.gridCellPointer : ''}`}
          data-testid={`${testIdPrefix}-gridcell-${user.id}`}
          aria-label={t('user')}
        >
          {left}
          {right}
        </Box>
      );
    }

    return (
      <tr
        onClick={onRowClick ? handleRowClick : undefined}
        onKeyDown={onRowClick ? handleKeyDown : undefined}
        tabIndex={onRowClick ? 0 : undefined}
        className={onRowClick ? styles.tableRowPointer : undefined}
        data-testid={`${testIdPrefix}-tr-${user.id}`}
        aria-label={t('user')}
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
