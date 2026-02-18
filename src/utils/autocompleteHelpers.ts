import type { InterfaceUserInfoPG } from 'utils/interfaces';

/**
 * Compares two user options by their IDs to determine equality in Autocomplete.
 *
 * @param option - The option from the list
 * @param value - The currently selected value
 * @returns true if the IDs match
 */
export const areOptionsEqual = (
  option: InterfaceUserInfoPG,
  value: InterfaceUserInfoPG,
): boolean => option.id === value.id;

/**
 * Gets the display label for a member, preferring First Last name, falling back to name.
 *
 * @param member - The user/member object
 * @returns The formatted name string
 */
export const getMemberLabel = (member: InterfaceUserInfoPG): string => {
  if (member.firstName || member.lastName) {
    return `${member.firstName || ''} ${member.lastName || ''}`.trim();
  }
  return member.name || '';
};
