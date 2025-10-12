/**
 * VolunteerViewModal Component
 *
 * This component renders a modal to display detailed information about a volunteer.
 * It includes the volunteer's name, avatar, status, and hours volunteered.
 * The modal is styled using custom CSS classes and leverages
 * Material-UI and React-Bootstrap components for UI elements.
 *
 * @component
 * @param {InterfaceVolunteerViewModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {InterfaceEventVolunteerInfo} props.volunteer - The volunteer's information.
 *
 * @returns {React.FC} A React functional component.
 *
 * @remarks
 * - The modal displays the volunteer's name and avatar. If an avatar is not available,
 *   a fallback avatar is shown using the `Avatar` component.
 * - The volunteer's status is displayed with an icon indicating whether they have
 *   accepted or are pending.
 * - The number of hours volunteered by the volunteer is also displayed.
 *
 * @dependencies
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
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
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
import Avatar from 'components/Avatar/Avatar';
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

  return (
    <Modal className={styles.volunteerViewModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.modalTitle}>{t('volunteerDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseButton}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
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
                InputProps={{
                  startAdornment: (
                    <>
                      {user.avatarURL ? (
                        <img
                          src={user.avatarURL}
                          alt="Volunteer"
                          data-testid="volunteer_image"
                          className={styles.tableImage}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={user.id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.tableImage}
                            dataTestId="volunteer_avatar"
                            name={user.name}
                            alt={user.name}
                          />
                        </div>
                      )}
                    </>
                  ),
                }}
              />
            </FormControl>
          </Form.Group>
          {/* Status and hours volunteered */}
          <Form.Group className={styles.statusGroup}>
            <TextField
              label={t('status')}
              fullWidth
              value={
                volunteerStatus === 'accepted'
                  ? t('accepted')
                  : volunteerStatus === 'rejected'
                    ? t('rejected')
                    : tCommon('pending')
              }
              InputProps={{
                startAdornment: (
                  <>
                    {volunteerStatus === 'accepted' ? (
                      <TaskAlt color="success" className={styles.statusIcon} />
                    ) : volunteerStatus === 'rejected' ? (
                      <Cancel color="error" className={styles.statusIcon} />
                    ) : (
                      <HistoryToggleOff
                        color="warning"
                        className={styles.statusIcon}
                      />
                    )}
                  </>
                ),
                className:
                  volunteerStatus === 'accepted'
                    ? styles.acceptedStatus
                    : volunteerStatus === 'rejected'
                      ? styles.rejectedStatus
                      : styles.pendingStatus,
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
                Volunteer Groups Joined
              </Form.Label>

              <TableContainer
                component={Paper}
                variant="outlined"
                className={styles.modalTable}
              >
                <Table aria-label="group table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles.tableHeader}>
                        Sr. No.
                      </TableCell>
                      <TableCell className={styles.tableHeader}>
                        Group Name
                      </TableCell>
                      <TableCell className={styles.tableHeader} align="center">
                        No. of Members
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
      </Modal.Body>
    </Modal>
  );
};

export default VolunteerViewModal;
