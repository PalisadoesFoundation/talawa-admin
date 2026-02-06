import React, { useId } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import type {
  InterfaceAssignmentTypeSelectorProps,
  AssignmentType,
} from 'types/AdminPortal/AssignmentTypeSelector/interface';

export type { AssignmentType };

/**
 * Chip-based toggle selector for choosing assignment type (volunteer or volunteer group).
 *
 * @param props - Component props from InterfaceAssignmentTypeSelectorProps
 * @returns Chip toggle component for assignment type selection
 */
const AssignmentTypeSelector: React.FC<
  InterfaceAssignmentTypeSelectorProps
> = ({
  assignmentType,
  onTypeChange,
  isVolunteerDisabled,
  isVolunteerGroupDisabled,
  onClearVolunteer,
  onClearVolunteerGroup,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const labelId = useId();

  const handleVolunteerClick = (): void => {
    if (!isVolunteerDisabled && assignmentType !== 'volunteer') {
      onTypeChange('volunteer');
      onClearVolunteerGroup();
    }
  };

  const handleVolunteerGroupClick = (): void => {
    if (!isVolunteerGroupDisabled && assignmentType !== 'volunteerGroup') {
      onTypeChange('volunteerGroup');
      onClearVolunteer();
    }
  };

  return (
    <Box className="mb-3">
      <Typography variant="subtitle2" className="mb-2" id={labelId}>
        {t('assignTo')}
      </Typography>
      <Box
        component="fieldset"
        className="d-flex gap-2 border-0 p-0 m-0"
        aria-labelledby={labelId}
      >
        <StatusBadge
          label={t('volunteer')}
          variant={assignmentType === 'volunteer' ? 'primary' : 'default'}
          chipVariant={assignmentType === 'volunteer' ? 'filled' : 'outlined'}
          onClick={handleVolunteerClick}
          clickable={!isVolunteerDisabled}
          ariaLabel={t('volunteer')}
          sx={{
            opacity: isVolunteerDisabled ? 0.6 : 1,
            cursor: isVolunteerDisabled ? 'not-allowed' : 'pointer',
          }}
        />
        <StatusBadge
          label={t('volunteerGroup')}
          variant={assignmentType === 'volunteerGroup' ? 'primary' : 'default'}
          chipVariant={
            assignmentType === 'volunteerGroup' ? 'filled' : 'outlined'
          }
          onClick={handleVolunteerGroupClick}
          clickable={!isVolunteerGroupDisabled}
          ariaLabel={t('volunteerGroup')}
          sx={{
            opacity: isVolunteerGroupDisabled ? 0.6 : 1,
            cursor: isVolunteerGroupDisabled ? 'not-allowed' : 'pointer',
          }}
        />
      </Box>
    </Box>
  );
};

export default AssignmentTypeSelector;
