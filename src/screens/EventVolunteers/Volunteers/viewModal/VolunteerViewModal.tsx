/**
 * Modal that displays detailed volunteer information in read-only mode.
 *
 * component VolunteerViewModal
 * @param props - Component props from InterfaceVolunteerViewModal
 * @returns JSX.Element
 */
import { ViewModal } from 'shared-components/CRUDModalTemplate/ViewModal';

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
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { HistoryToggleOff, TaskAlt, Cancel } from '@mui/icons-material';

import type { InterfaceVolunteerViewModalProps } from 'types/AdminPortal/VolunteerViewModal/interface';

const VolunteerViewModal: React.FC<InterfaceVolunteerViewModalProps> = ({
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
    <ViewModal
      open={isOpen}
      title={t('volunteerDetails')}
      onClose={hide}
      data-testid="volunteerViewModal"
    >
      <div className={styles.modalForm}>
        {/* Volunteer Name & Avatar */}
        <div className={styles.formGroup}>
          <FormTextField
            name="volunteer"
            label={t('volunteer')}
            value={user.name}
            onChange={() => {}}
            disabled
            startAdornment={
              user.avatarURL ? (
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
              )
            }
            data-testid="volunteerName"
          />
        </div>
        {/* Status and hours volunteered */}
        <div className={styles.statusGroup}>
          <FormTextField
            name="status"
            label={t('status')}
            value={statusConfig.label}
            onChange={() => {}}
            disabled
            startAdornment={statusConfig.icon}
            className={statusConfig.className}
            data-testid="volunteerStatus"
          />

          <FormTextField
            name="hoursVolunteered"
            label={t('hoursVolunteered')}
            value={hoursVolunteered !== null ? String(hoursVolunteered) : '-'}
            onChange={() => {}}
            disabled
            className={styles.hoursField}
            data-testid="hoursVolunteered"
          />
        </div>
        {/* Table for Associated Volunteer Groups */}
        {groups && groups.length > 0 && (
          <div>
            <span id="volunteer-groups-label" className={styles.groupsLabel}>
              {t('volunteerGroups')}
            </span>

            <TableContainer
              component={Paper}
              variant="outlined"
              className={styles.modalTable}
              aria-labelledby="volunteer-groups-label"
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
    </ViewModal>
  );
};

export default VolunteerViewModal;
