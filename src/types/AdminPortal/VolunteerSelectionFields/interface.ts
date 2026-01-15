import type { InterfaceEventVolunteerInfo } from 'types/Volunteer/interface';
import type { IEventVolunteerGroup } from 'types/shared-components/ActionItems/interface';
import type { AssignmentType } from 'types/AdminPortal/AssignmentTypeSelector/interface';

/**
 * Props for VolunteerSelectionFields component.
 */
export interface InterfaceVolunteerSelectionFieldsProps {
  /** Current assignment type determining which field to display */
  assignmentType: AssignmentType;
  /** List of available volunteers for selection */
  volunteers: InterfaceEventVolunteerInfo[];
  /** List of available volunteer groups for selection */
  volunteerGroups: IEventVolunteerGroup[];
  /** Currently selected volunteer (null if none selected) */
  selectedVolunteer: InterfaceEventVolunteerInfo | null;
  /** Currently selected volunteer group (null if none selected) */
  selectedVolunteerGroup: IEventVolunteerGroup | null;
  /** Callback fired when user selects a different volunteer */
  onVolunteerChange: (volunteer: InterfaceEventVolunteerInfo | null) => void;
  /** Callback fired when user selects a different volunteer group */
  onVolunteerGroupChange: (group: IEventVolunteerGroup | null) => void;
}
