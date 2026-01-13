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
import { Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import styles from './VolunteerViewModal.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Avatar from 'shared-components/Avatar/Avatar';
import { HistoryToggleOff, TaskAlt, Cancel } from '@mui/icons-material';

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
      <Form className={styles.modalForm}>
        {/* Volunteer Name & Avatar */}
        <Form.Group className={styles.formGroup}>
          <FormControl fullWidth>
            <TextField
              label={t('volunteer')}
              variant="outlined"
              className={styles.noOutline}
              value={user.name}
              disabled
              slotProps={{
                input: {
                  startAdornment: (
                    <>
                      {user.avatarURL ? (
                        <img
                          src={user.avatarURL}
                          alt={t('volunteer')}
                          data-testid="volunteer_image"
                          className={styles.tableImage}
                        />
                      ) : (
<<<<<<< HEAD
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
=======
                        <Avatar
                          key={user.id + '1'}
                          containerStyle={styles.volunteerAvatar}
                          avatarStyle={styles.volunteerAvatar}
                          dataTestId="volunteer_avatar"
                          name={user.name}
                          alt={user.name}
                        />
>>>>>>> 93685b5836d (fix(events): enable user event dashboard access and correct Upcoming Events visibility)
                      )}
                    </>
                  ),
                },
              }}
            />
          </FormControl>
        </Form.Group>
        {/* Status and hours volunteered */}
        <Form.Group className={styles.statusGroup}>
          <TextField
            label={t('status')}
            fullWidth
            value={statusConfig.label}
            slotProps={{
              input: {
                startAdornment: statusConfig.icon,
                className: statusConfig.className,
              },
            }}
            disabled
          />

          <TextField
            label={t('hoursVolunteered')}
            variant="outlined"
            className={`${styles.noOutline} ${styles.hoursField}`}
            value={hoursVolunteered ?? '-'}
            disabled
          />
        </Form.Group>
        {/* Table for Associated Volunteer Groups */}
        {groups && groups.length > 0 && (
          <Form.Group>
            <Form.Label className={styles.groupsLabel}>
              {t('volunteerGroups')}
            </Form.Label>

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
          </Form.Group>
        )}
      </Form>
    </BaseModal>
  );
};

export default VolunteerViewModal;
