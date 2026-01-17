/**
 * VolunteerGroupViewModal Component
 *
 * This component renders a modal to display detailed information about a volunteer group.
 * It includes group details such as name, description, leader, creator, and a list of associated volunteers.
 *
 * @component
 * @param {InterfaceVolunteerGroupViewModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is open or closed.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {InterfaceVolunteerGroupInfo} props.group - The volunteer group information to display.
 *
 * @returns {React.FC} A React functional component that renders the modal.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for layout and `@mui/material` for form controls.
 * - The `useTranslation` hook is used for internationalization.
 * - Displays leader and creator information with avatars or fallback initials.
 * - Volunteer count is available through the volunteers resolver in the API.
 *
 * @example
 * ```tsx
 * <VolunteerGroupViewModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   group={{
 *     id: "group-123",
 *     name: "Group A",
 *     description: "This is a test group.",
 *     leader: { id: "1", name: "John Doe", avatarURL: null },
 *     creator: { id: "2", name: "Jane Smith", avatarURL: null },
 *     volunteersRequired: 5,
 *     createdAt: "2024-01-01T00:00:00Z",
 *     event: { id: "event-123" }
 *   }}
 * />
 * ```
 */
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
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

export interface InterfaceVolunteerGroupViewModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo;
}

const VolunteerGroupViewModal: React.FC<InterfaceVolunteerGroupViewModal> = ({
  isOpen,
  hide,
  group,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
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
                value={leader.name}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {leader.avatarURL ? (
                        <img
                          src={leader.avatarURL}
                          alt="Volunteer"
                          data-testid="leader_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={leader.id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImages}
                            dataTestId="leader_avatar"
                            name={leader.name}
                            alt={leader.name}
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
                value={creator.name}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {creator.avatarURL ? (
                        <img
                          src={creator.avatarURL}
                          alt="Volunteer"
                          data-testid="creator_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={creator.id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImages}
                            dataTestId="creator_avatar"
                            name={creator.name}
                            alt={creator.name}
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
                      const { name: volunteerName } = volunteer.user;
                      return (
                        <TableRow
                          key={volunteer.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {volunteerName}
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
