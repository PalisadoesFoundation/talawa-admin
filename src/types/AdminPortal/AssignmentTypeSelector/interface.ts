/**
 * Type for assignment selection - either volunteer or volunteer group.
 */
export type AssignmentType = 'volunteer' | 'volunteerGroup';

/**
 * Props interface for the AssignmentTypeSelector component.
 */
export interface InterfaceAssignmentTypeSelectorProps {
  /** Current assignment type selection */
  assignmentType: AssignmentType;
  /** Callback fired when assignment type changes */
  onTypeChange: (type: AssignmentType) => void;
  /** Whether the volunteer chip is disabled */
  isVolunteerDisabled: boolean;
  /** Whether the volunteer group chip is disabled */
  isVolunteerGroupDisabled: boolean;
  /** Callback to clear volunteer selection when switching to volunteer group */
  onClearVolunteer: () => void;
  /** Callback to clear volunteer group selection when switching to volunteer */
  onClearVolunteerGroup: () => void;
}
