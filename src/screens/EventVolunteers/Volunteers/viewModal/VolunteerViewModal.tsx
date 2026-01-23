/**
 * VolunteerViewModal Component
 *
 * This component renders a modal to display detailed information about a volunteer.
 * It includes the volunteer's name, avatar, status, and hours volunteered.
 * The modal is styled using custom CSS classes and leverages
 * Material-UI and React-Bootstrap components for UI elements.
 *
 * @param isOpen - Determines whether the modal is visible.
 * @param hide - Function to close the modal.
 * @param volunteer - The volunteer's information.
 *
 * @returns JSX.Element - The rendered modal component.
 *
 * @remarks
 * - The modal displays the volunteer's name and avatar. If an avatar is not available,
 *   a fallback avatar is shown using the `Avatar` component.
 * - The volunteer's status is displayed with an icon indicating whether they have
 *   accepted or are pending.
 * - The number of hours volunteered by the volunteer is also displayed.
 *
 * dependencies
 * - `react-bootstrap` for modal and form components.
 * - `@mui/material` for Material-UI components like `TextField`.
 * - `react-i18next` for internationalization.
 * - `Avatar` component for rendering fallback avatars.
 *
 * @example
 * ```tsx
 * <VolunteerViewModal
 *   isOpen={true}
 *   hide={() => console.log('Modal closed')}
 *   volunteer={{
 *     user: { name: 'John Doe', avatarURL: '', id: '123' },
 *     hasAccepted: true,
 *     hoursVolunteered: 10,
 *   }}
 * />
 * ```
 */
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import styles from './VolunteerViewModal.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Avatar from 'shared-components/Avatar/Avatar';
import { HistoryToggleOff, TaskAlt, Cancel } from '@mui/icons-material';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';

export interface InterfaceVolunteerViewModal {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
}

const VolunteerViewModal: React.FC<InterfaceVolunteerViewModal> = ({
  isOpen,
  hide,
  volunteer,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');

  const { user, volunteerStatus, hoursVolunteered, groups } = volunteer;

  /**
   * Returns the status configuration based on volunteer status.
   * @param status - The volunteer's status ('accepted', 'rejected', or 'pending').
   * @returns An object containing the label, icon, and className for the status.
   */
  const getStatusConfig = (
    status: string,
  ): { label: string; icon: React.ReactNode; className: string } => {
    switch (status) {
      case 'accepted':
        return {
          label: t('accepted'),
          icon: <TaskAlt color="success" className={styles.statusIcon} />,
          className: styles.acceptedStatus,
        };
      case 'rejected':
        return {
          label: t('rejected'),
          icon: <Cancel color="error" className={styles.statusIcon} />,
          className: styles.rejectedStatus,
        };
      default:
        return {
          label: tCommon('pending'),
          icon: (
            <HistoryToggleOff color="warning" className={styles.statusIcon} />
          ),
          className: styles.pendingStatus,
        };
    }
  };

  const statusConfig = getStatusConfig(volunteerStatus);

  return (
    <BaseModal
      className={styles.volunteerViewModal}
      onHide={hide}
      show={isOpen}
      headerContent={
        <p className={styles.modalTitle}>{t('volunteerDetails')}</p>
      }
      dataTestId="volunteerViewModal"
    >
      <div className={styles.modalForm}>
        {/* Volunteer Name & Avatar */}
        <div className={styles.formGroup}>
          <FormTextField
            name="volunteer"
            label={t('volunteer')}
            value={user.name}
            disabled
            data-testid="volunteerName"
            startAdornment={
              <>
                {user.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={t('volunteer')}
                    data-testid="volunteer_image"
                    className={styles.tableImage}
                  />
                ) : (
                  <div className={styles.avatarContainer}>
                    <Avatar
                      key={`${user.id}-avatar`}
                      containerStyle={styles.imageContainer}
                      avatarStyle={styles.tableImage}
                      dataTestId="volunteer_avatar"
                      name={user.name}
                      alt={user.name}
                    />
                  </div>
                )}
              </>
            }
          />
        </div>
        {/* Status and hours volunteered */}
        <div className={styles.statusGroup}>
          <FormTextField
            name="status"
            label={t('status')}
            value={statusConfig.label}
            disabled
            data-testid="volunteerStatus"
            startAdornment={statusConfig.icon}
          />

          <FormTextField
            name="hoursVolunteered"
            label={t('hoursVolunteered')}
            value={hoursVolunteered?.toString() ?? '-'}
            disabled
            data-testid="hoursVolunteered"
          />
        </div>
        {/* Table for Associated Volunteer Groups */}
        {groups && groups.length > 0 && (
          <div>
            <label className={styles.groupsLabel}>{t('volunteerGroups')}</label>

            <TableContainer
              component={Paper}
              variant="outlined"
              className={styles.modalTable}
            >
              <Table aria-label={t('groupTable')}>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableHeader}>
                      {tCommon('serialNumber')}
                    </TableCell>
                    <TableCell className={styles.tableHeader}>
                      {t('group')}
                    </TableCell>
                    <TableCell className={styles.tableHeader} align="center">
                      {t('numVolunteersHeader')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group, index) => {
                    const { id, name, volunteers } = group;
                    return (
                      <TableRow key={id} className={styles.tableRow}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {name}
                        </TableCell>
                        <TableCell align="center">
                          {volunteers?.length || 0}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default VolunteerViewModal;
