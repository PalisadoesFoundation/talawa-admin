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
import { ViewModal } from 'shared-components/CRUDModalTemplate/ViewModal';
import styles from './VolunteerGroupViewModal.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from 'shared-components/DataTable/DataTable';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { InterfaceVolunteerGroupViewModalProps } from 'types/shared-components/VolunteerGroupViewModal/interface';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

const VolunteerGroupViewModal: React.FC<
  InterfaceVolunteerGroupViewModalProps
> = ({ isOpen, hide, group }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');

  const { leader, creator, name, volunteersRequired, description, volunteers } =
    group;

  const volunteerRows = (volunteers ?? []).map((v, index) => ({
    ...v,
    __serial: index + 1,
  }));

  return (
    <ViewModal
      open={isOpen}
      title={t('groupDetails')}
      onClose={hide}
      data-testid="volunteerGroupViewModal"
    >
      <div>
        {/* Group name & Volunteers Required */}
        <div className={styles.formGroup}>
          <FormTextField
            name="name"
            label={tCommon('name')}
            value={name}
            onChange={() => {}}
            disabled
            data-testid="groupName"
          />
          {volunteersRequired !== null && volunteersRequired !== undefined && (
            <FormTextField
              name="volunteersRequired"
              label={tCommon('volunteersRequired')}
              value={String(volunteersRequired)}
              onChange={() => {}}
              disabled
              data-testid="volunteersRequired"
            />
          )}
        </div>
        {/* Input field to enter the group description */}
        {description && (
          <div className="mb-3">
            <FormTextField
              name="description"
              label={tCommon('description')}
              value={description}
              onChange={() => {}}
              disabled
              data-testid="groupDescription"
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <FormTextField
            name="leader"
            label={t('leader')}
            value={leader.name}
            onChange={() => {}}
            disabled
            startAdornment={
              <ProfileAvatarDisplay
                key={`${leader.id}-avatar`}
                imageUrl={leader.avatarURL}
                size="small"
                dataTestId="leader_avatar"
                fallbackName={leader.name}
                className={styles.tableimages}
              />
            }
            data-testid="groupLeader"
          />

          <FormTextField
            name="creator"
            label={t('creator')}
            value={creator.name}
            onChange={() => {}}
            disabled
            startAdornment={
              <ProfileAvatarDisplay
                key={`${creator.id}-avatar`}
                imageUrl={creator.avatarURL}
                size="small"
                dataTestId="creator_avatar"
                className={styles.tableimages}
                fallbackName={creator.name}
              />
            }
            data-testid="groupCreator"
          />
        </div>
        {/* Table for Associated Volunteers */}
        {volunteers && volunteers.length > 0 && (
          <div role="region" aria-labelledby="volunteers-heading">
            <h3 id="volunteers-heading" className={styles.volunteersLabel}>
              {t('volunteers')}
            </h3>

            <DataTable
              data={volunteerRows}
              columns={[
                {
                  id: 'serialNumber',
                  header: tCommon('serialNumber'),
                  accessor: '__serial',
                },
                {
                  id: 'name',
                  header: tCommon('name'),
                  accessor: (volunteer) => volunteer.user.name,
                },
              ]}
              loading={false}
              ariaLabel={t('groupTable')}
              tableClassName={styles.modalTable}
            />
          </div>
        )}
      </div>
    </ViewModal>
  );
};
export default VolunteerGroupViewModal;
