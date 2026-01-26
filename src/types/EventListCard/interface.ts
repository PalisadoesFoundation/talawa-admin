import type { InterfaceEvent } from 'types/Event/interface';
import type { TFunction } from 'i18next';

export interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

export interface InterfaceEventListCardModalsProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  // Use TFunction to match expected types and avoid $TFunctionBrand errors
  t: TFunction<'translation', undefined>;
  tCommon: TFunction<'translation', undefined>;
}
