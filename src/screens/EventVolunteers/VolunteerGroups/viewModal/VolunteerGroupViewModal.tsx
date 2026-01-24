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
 * @returns JSX.Element - The rendered modal component.
 *
 * @remarks
 * - The modal uses `BaseModal` from shared-components and `@mui/material` for form controls.
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
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './VolunteerGroupViewModal.module.css';
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
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';

import type { InterfaceVolunteerGroupViewModalProps } from 'types/AdminPortal/VolunteerGroupViewModal/interface';

const VolunteerGroupViewModal: React.FC<
  InterfaceVolunteerGroupViewModalProps
> = ({ isOpen, hide, group }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');

  const { leader, creator, name, volunteersRequired, description, volunteers } =
    group;

  return (
    <BaseModal
      className={styles.volunteerGroupViewModal}
      onHide={hide}
      show={isOpen}
      headerContent={<p className={styles.titlemodal}>{t('groupDetails')}</p>}
      dataTestId="volunteerGroupViewModal"
    >
      <div className="p-3">
        {/* Group name & Volunteers Required */}
        <div className="d-flex gap-3 mb-3">
          <div className="flex-grow-1">
            <FormTextField
              name="name"
              label={tCommon('name')}
              value={name}
              disabled
              data-testid="groupName"
            />
          </div>
          {volunteersRequired !== null && volunteersRequired !== undefined && (
            <div className="flex-grow-1">
              <FormTextField
                name="volunteersRequired"
                label={tCommon('volunteersRequired')}
                value={volunteersRequired.toString()}
                disabled
                data-testid="volunteersRequired"
              />
            </div>
          )}
        </div>
        {/* Input field to enter the group description */}
        {description && (
          <div className="mb-3">
            <FormTextField
              name="description"
              label={tCommon('description')}
              value={description}
              disabled
              as="textarea"
              rows={2}
              data-testid="groupDescription"
            />
          </div>
        )}
        <div className="mb-3 d-flex gap-3">
          <div className="flex-grow-1">
            <FormTextField
              name="leader"
              label={t('leader')}
              value={leader.name}
              disabled
              data-testid="leaderField"
              startAdornment={
                <>
                  {leader.avatarURL ? (
                    <img
                      src={leader.avatarURL}
                      alt={leader.name}
                      data-testid="leader_image"
                      className={styles.tableImages}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={`${leader.id}-avatar`}
                        containerStyle={styles.imageContainer}
                        avatarStyle={styles.tableImages}
                        dataTestId="leader_avatar"
                        name={leader.name}
                        alt={leader.name}
                      />
                    </div>
                  )}
                </>
              }
            />
          </div>

          <div className="flex-grow-1">
            <FormTextField
              name="creator"
              label={t('creator')}
              value={creator.name}
              disabled
              data-testid="creatorField"
              startAdornment={
                <>
                  {creator.avatarURL ? (
                    <img
                      src={creator.avatarURL}
                      alt={creator.name}
                      data-testid="creator_image"
                      className={styles.tableImages}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={`${creator.id}-avatar`}
                        containerStyle={styles.imageContainer}
                        avatarStyle={styles.tableImages}
                        dataTestId="creator_avatar"
                        name={creator.name}
                        alt={creator.name}
                      />
                    </div>
                  )}
                </>
              }
            />
          </div>
        </div>
        {/* Table for Associated Volunteers */}
        {volunteers && volunteers.length > 0 && (
          <div>
            <h5 className={`fw-lighter ms-2 mb-0 ${styles.volunteersLabel}`}>
              {t('volunteers')}
            </h5>

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
          </div>
        )}
      </div>
    </BaseModal>
  );
};
export default VolunteerGroupViewModal;
