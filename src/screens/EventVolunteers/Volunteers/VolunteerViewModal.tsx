import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import styles from '../../../style/app.module.css';
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
import { HistoryToggleOff, TaskAlt } from '@mui/icons-material';

export interface InterfaceVolunteerViewModal {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
}

/**
 * A modal dialog for viewing volunteer information for an event.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param volunteer - The volunteer object to be displayed.
 *
 * @returns The rendered modal component.
 *
 * The `VolunteerViewModal` component displays all the fields of a volunteer in a modal dialog.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - fields for volunteer name, status, hours volunteered, groups, and assignments.
 */

const VolunteerViewModal: React.FC<InterfaceVolunteerViewModal> = ({
  isOpen,
  hide,
  volunteer,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const { user, hasAccepted, hoursVolunteered, groups } = volunteer;

  return (
    <Modal className={styles.volunteerCreateModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('volunteerDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form className="p-3">
          {/* Volunteer Name & Avatar */}
          <Form.Group className="mb-3">
            <FormControl fullWidth>
              <TextField
                label={t('volunteer')}
                variant="outlined"
                className={styles.noOutline}
                value={user.firstName + ' ' + user.lastName}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Volunteer"
                          data-testid="volunteer_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={user._id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImages}
                            dataTestId="volunteer_avatar"
                            name={user.firstName + ' ' + user.lastName}
                            alt={user.firstName + ' ' + user.lastName}
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
          <Form.Group className="d-flex gap-3 mx-auto mb-2">
            <TextField
              label={t('status')}
              fullWidth
              value={hasAccepted ? t('accepted') : tCommon('pending')}
              InputProps={{
                startAdornment: (
                  <>
                    {hasAccepted ? (
                      <TaskAlt color="success" className="me-2" />
                    ) : (
                      <HistoryToggleOff color="warning" className="me-2" />
                    )}
                  </>
                ),
                style: {
                  color: hasAccepted ? 'green' : '#ed6c02',
                },
              }}
              inputProps={{
                style: {
                  WebkitTextFillColor: hasAccepted ? 'green' : '#ed6c02',
                },
              }}
              disabled
            />

            <TextField
              label={t('hoursVolunteered')}
              variant="outlined"
              className={`${styles.noOutline} w-100`}
              value={hoursVolunteered ?? '-'}
              disabled
            />
          </Form.Group>
          {/* Table for Associated Volunteer Groups */}
          {groups && groups.length > 0 && (
            <Form.Group>
              <Form.Label
                className="fw-lighter ms-2 mb-0"
                style={{
                  fontSize: '0.8rem',
                  color: 'grey',
                }}
              >
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
                      <TableCell className="fw-bold">Sr. No.</TableCell>
                      <TableCell className="fw-bold">Group Name</TableCell>
                      <TableCell className="fw-bold" align="center">
                        No. of Members
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groups.map((group, index) => {
                      const { _id, name, volunteers } = group;
                      return (
                        <TableRow
                          key={_id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {name}
                          </TableCell>
                          <TableCell align="center">
                            {volunteers.length}
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
