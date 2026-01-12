/**
 * VolunteerGroupViewModal Component
 *
 * This component renders a modal to display detailed information about a volunteer group.
 * It includes group details such as name, description, leader, creator, and a list of associated volunteers.
 *
 * @param isOpen - Determines whether the modal is open or closed.
 * @param hide - Function to close the modal.
 * @param group - The volunteer group information to display.
 *
 * @returns React.FC - A React functional component that renders the modal.
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
 *     createdAt: dayjs().toISOString(),
 *     event: { id: "event-123" }
 *   }}
 * />
 * ```
 */
import { Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
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
import Avatar from 'shared-components/Avatar/Avatar';

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
    <BaseModal
      className={styles.volunteerCreateModal}
      onHide={hide}
      show={isOpen}
      headerContent={<p className={styles.titlemodal}>{t('groupDetails')}</p>}
      dataTestId="volunteerGroupViewModal"
    >
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
          {volunteersRequired !== null && volunteersRequired !== undefined && (
            <FormControl fullWidth>
              <TextField
                required
                label={tCommon('volunteersRequired')}
                variant="outlined"
                className={styles.noOutline}
                value={volunteersRequired}
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
              slotProps={{
                input: {
                  startAdornment: (
                    <>
                      {leader.avatarURL ? (
                        <img
                          src={leader.avatarURL}
                          alt={leader.name}
                          data-testid="leader_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={`${leader.id}-avatar`}
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
                },
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
              slotProps={{
                input: {
                  startAdornment: (
                    <>
                      {creator.avatarURL ? (
                        <img
                          src={creator.avatarURL}
                          alt={t('volunteer')}
                          data-testid="creator_image"
                          className={styles.TableImages}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={`${creator.id}-avatar`}
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
                },
              }}
            />
          </FormControl>
        </Form.Group>
        {/* Table for Associated Volunteers */}
        {volunteers && volunteers.length > 0 && (
          <Form.Group>
            <Form.Label
              className={`fw-lighter ms-2 mb-0 ${styles.volunteersLabel}`}
            >
              {t('volunteers')}
            </Form.Label>

            <TableContainer
              component={Paper}
              variant="outlined"
              className={styles.modalTable}
            >
              <Table aria-label={t('groupTable')}>
                <TableHead>
                  <TableRow>
                    <TableCell className="fw-bold">
                      {tCommon('serialNumber')}
                    </TableCell>
                    <TableCell className="fw-bold">{tCommon('name')}</TableCell>
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
    </BaseModal>
  );
};
export default VolunteerGroupViewModal;
