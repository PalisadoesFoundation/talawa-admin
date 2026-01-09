import type { TFunction } from 'i18next';
import type { InterfaceTagData } from 'utils/interfaces';

/**
 * Props for TagNode component.
 */
export interface InterfaceTagNodeProps {
  tag: InterfaceTagData;
  checkedTags: Set<string>;
  toggleTagSelection: (tag: InterfaceTagData, isSelected: boolean) => void;
  t: TFunction<'translation', 'manageTag'>;
}
