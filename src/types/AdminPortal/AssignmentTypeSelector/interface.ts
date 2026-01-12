/**
 * Type representing the assignment target for action items.
 * - 'volunteer': Assign to individual volunteer
 * - 'volunteerGroup': Assign to volunteer group
 */
export type AssignmentType = 'volunteer' | 'volunteerGroup';

/**
 * Props for AssignmentTypeSelector component.
 */
export interface InterfaceAssignmentTypeSelectorProps {
  /** Current assignment type selection */
  assignmentType: AssignmentType;
  /** Callback fired when assignment type changes */
  onTypeChange: (type: AssignmentType) => void;
  /** Whether volunteer chip is disabled */
  isVolunteerDisabled: boolean;
  /** Whether volunteer group chip is disabled */
  isVolunteerGroupDisabled: boolean;
  /** Callback to clear volunteer selection */
  onClearVolunteer: () => void;
  /** Callback to clear volunteer group selection */
  onClearVolunteerGroup: () => void;
}
