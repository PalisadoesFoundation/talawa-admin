import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
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

export interface InterfaceVolunteerGroupViewModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo;
}

/**
 * A modal dialog for viewing volunteer group information for an event.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param group - The volunteer group to display in the modal.
 *
 * @returns The rendered modal component.
 *
 * The `VolunteerGroupViewModal` component displays all the fields of a volunteer group in a modal dialog.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - fields for volunteer name, status, hours volunteered, groups, and assignments.
 */

const VolunteerGroupViewModal: React.FC<InterfaceVolunteerGroupViewModal> = ({
  isOpen,
  hide,
  group,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const { leader, creator, name, volunteersRequired, description, volunteers } =
    group;

  return (
    <Modal className={styles.volunteerCreateModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('groupDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="volunteerViewModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form className="p-3">
          {/* Group name & Volunteers Required */}
          <Form.Group className="d-flex gap-3 mb-3">
            <FormControl fullWidth>
              <TextField
                required
                label={tCommon('name')}
                variant="outlined"
                className={styles.noOutline}
                value={name}
                disabled
              />
            </FormControl>
            {description && (
              <FormControl fullWidth>
                <TextField
                  required
                  label={tCommon('volunteersRequired')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={volunteersRequired ?? '-'}
                  disabled
                />
              </FormControl>
            )}
          </Form.Group>
          {/* Input field to enter the group description */}
          {description && (
            <Form.Group className="mb-3">
              <FormControl fullWidth>
                <TextField
                  multiline
                  rows={2}
                  label={tCommon('description')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={description}
                  disabled
                />
              </FormControl>
            </Form.Group>
          )}
          <Form.Group className="mb-3 d-flex gap-3">
            <FormControl fullWidth>
              <TextField
                label={t('leader')}
                variant="outlined"
                className={styles.noOutline}
                value={leader.firstName + ' ' + leader.lastName}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {leader.image ? (
                        <img
                          src={leader.image}
                          alt="Volunteer"
                          data-testid="leader_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={leader._id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImages}
                            dataTestId="leader_avatar"
                            name={leader.firstName + ' ' + leader.lastName}
                            alt={leader.firstName + ' ' + leader.lastName}
                          />
                        </div>
                      )}
                    </>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label={t('creator')}
                variant="outlined"
                className={styles.noOutline}
                value={creator.firstName + ' ' + creator.lastName}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {creator.image ? (
                        <img
                          src={creator.image}
                          alt="Volunteer"
                          data-testid="creator_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={creator._id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImages}
                            dataTestId="creator_avatar"
                            name={creator.firstName + ' ' + creator.lastName}
                            alt={creator.firstName + ' ' + creator.lastName}
                          />
                        </div>
                      )}
                    </>
                  ),
                }}
              />
            </FormControl>
          </Form.Group>
          {/* Table for Associated Volunteers */}
          {volunteers && volunteers.length > 0 && (
            <Form.Group>
              <Form.Label
                className="fw-lighter ms-2 mb-0"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--search-button-border)',
                }}
              >
                Volunteers
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
                      <TableCell className="fw-bold">Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {volunteers.map((volunteer, index) => {
                      const { firstName, lastName } = volunteer.user;
                      return (
                        <TableRow
                          key={index + 1}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {firstName + ' ' + lastName}
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
export default VolunteerGroupViewModal;
