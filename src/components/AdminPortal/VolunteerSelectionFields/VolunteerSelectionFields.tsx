import type { FC } from 'react';
import { Form } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { InterfaceVolunteerSelectionFieldsProps } from 'types/AdminPortal/VolunteerSelectionFields/interface';
import type { InterfaceEventVolunteerInfo } from 'types/Volunteer/interface';
import type { IEventVolunteerGroup } from 'types/shared-components/ActionItems/interface';
import styles from 'style/app-fixed.module.css';

/**
 * A component for selecting volunteers or volunteer groups.
 * Displays the appropriate Autocomplete field based on assignment type.
 *
 * @param props - Component props from InterfaceVolunteerSelectionFieldsProps
 * @returns Autocomplete dropdown for volunteer or volunteer group selection
 */
const VolunteerSelectionFields: FC<InterfaceVolunteerSelectionFieldsProps> = ({
  assignmentType,
  volunteers,
  volunteerGroups,
  selectedVolunteer,
  selectedVolunteerGroup,
  onVolunteerChange,
  onVolunteerGroupChange,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  if (assignmentType === 'volunteer') {
    return (
      <Form.Group className="mb-3 w-100">
        <Autocomplete
          className={`${styles.noOutline} w-100`}
          data-testid="volunteerSelect"
          data-cy="volunteerSelect"
          options={volunteers}
          value={selectedVolunteer}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          filterSelectedOptions={true}
          getOptionLabel={(volunteer: InterfaceEventVolunteerInfo): string => {
            return volunteer.user?.name || t('unknownVolunteer');
          }}
          onChange={(_, newVolunteer): void => {
            onVolunteerChange(newVolunteer);
          }}
          renderInput={(params) => (
            <TextField {...params} label={t('volunteer')} required />
          )}
        />
      </Form.Group>
    );
  }

  return (
    <Form.Group className="mb-3 w-100">
      <Autocomplete
        className={`${styles.noOutline} w-100`}
        data-testid="volunteerGroupSelect"
        data-cy="volunteerGroupSelect"
        options={volunteerGroups}
        value={selectedVolunteerGroup}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        filterSelectedOptions={true}
        getOptionLabel={(group: IEventVolunteerGroup): string => {
          return group.name;
        }}
        onChange={(_, newGroup): void => {
          onVolunteerGroupChange(newGroup);
        }}
        renderInput={(params) => (
          <TextField {...params} label={t('volunteerGroup')} required />
        )}
      />
    </Form.Group>
  );
};

export default VolunteerSelectionFields;
