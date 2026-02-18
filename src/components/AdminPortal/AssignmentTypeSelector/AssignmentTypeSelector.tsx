import React, { useId } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
        <Chip
          label={t('volunteer')}
          variant={assignmentType === 'volunteer' ? 'filled' : 'outlined'}
          color={assignmentType === 'volunteer' ? 'primary' : 'default'}
          onClick={handleVolunteerClick}
          clickable={!isVolunteerDisabled}
          aria-disabled={isVolunteerDisabled}
          sx={{
            opacity: isVolunteerDisabled ? 0.6 : 1,
            cursor: isVolunteerDisabled ? 'not-allowed' : 'pointer',
          }}
        />
        <Chip
          label={t('volunteerGroup')}
          variant={assignmentType === 'volunteerGroup' ? 'filled' : 'outlined'}
          color={assignmentType === 'volunteerGroup' ? 'primary' : 'default'}
          onClick={handleVolunteerGroupClick}
          clickable={!isVolunteerGroupDisabled}
          aria-disabled={isVolunteerGroupDisabled}
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
