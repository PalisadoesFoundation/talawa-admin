/**
 * Common constants for the application.
 * These were previously stored in locale files as non-translatable technical keys.
 */

/**
 * Date format for ISO date time strings.
 */
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

/**
 * Separator for ISO date time strings.
 */
export const DATE_TIME_SEPARATOR = 'T';

/**
 * Prefix for dummy date time for dayjs parsing.
 */
export const DUMMY_DATE_TIME_PREFIX = '2015-03-04T';

/**
 * Generates the data-testid for the people card.
 * @param id - The ID of the person.
 * @returns The formatted data-testid.
 */
export const TEST_ID_PEOPLE_CARD = (id: string): string => `people-card-${id}`;

/**
 * Generates the data-testid for the people sno badge.
 * @param id - The ID of the person.
 * @returns The formatted data-testid.
 */
export const TEST_ID_PEOPLE_SNO = (id: string): string => `people-sno-${id}`;

/**
 * Generates the data-testid for the delete event modal.
 * @param id - The ID of the event.
 * @returns The formatted data-testid.
 */
export const TEST_ID_DELETE_EVENT_MODAL = (id: string): string =>
  `deleteEventModal-${id}`;

/**
 * Generates the data-testid for the update event modal.
 * @param id - The ID of the event.
 * @returns The formatted data-testid.
 */
export const TEST_ID_UPDATE_EVENT_MODAL = (id: string): string =>
  `updateEventModal-${id}`;

/**
 * Date format for ISO date string (YYYY-MM-DD).
 */
export const DATE_FORMAT_ISO_DATE = 'YYYY-MM-DD';

/**
 * Generates the route for a user component.
 * @param compId - The component ID.
 * @throws Error If compId is missing or empty.
 * @returns The formatted route.
 */
export const ROUTE_USER = (compId: string): string => {
  if (!compId) {
    throw new Error('compId is required for ROUTE_USER');
  }
  return `user/${compId}`;
};

/**
 * Generates the route for a user component within an organization.
 * @param compId - The component ID.
 * @param orgId - The organization ID.
 * @throws Error If compId is missing or empty.
 * @returns The formatted route.
 */
export const ROUTE_USER_ORG = (
  compId: string,
  orgId: string | undefined,
): string => {
  if (!compId) {
    throw new Error('compId is required for ROUTE_USER_ORG');
  }
  return orgId ? `user/${compId}/${orgId}` : `user/${compId}`;
};

/**
 * Generates the backup environment filename.
 * @param timestamp - The timestamp.
 * @returns The formatted filename.
 */
export const FILE_NAME_TEMPLATE_BACKUP_ENV = (timestamp: string): string =>
  `.env.${timestamp}`;

/**
 * Identifier constant for user ID.
 */
export const IDENTIFIER_USER_ID = 'userId';

/**
 * Identifier constant for ID.
 */
export const IDENTIFIER_ID = 'id';

/**
 * Generates the data-testid for the people image.
 * @param id - The ID of the person.
 * @returns The formatted data-testid.
 */
export const TEST_ID_PEOPLE_IMAGE = (id: string): string =>
  `people-image-${id}`;

/**
 * Generates the data-testid for the people name.
 * @param id - The ID of the person.
 * @returns The formatted data-testid.
 */
export const TEST_ID_PEOPLE_NAME = (id: string): string => `people-name-${id}`;

/**
 * Generates the data-testid for the people email.
 * @param id - The ID of the person.
 * @returns The formatted data-testid.
 */
export const TEST_ID_PEOPLE_EMAIL = (id: string): string =>
  `people-email-${id}`;

/**
 * Generates the data-testid for the people role.
 * @param id - The ID of the person.
 * @returns The formatted data-testid.
 */
export const TEST_ID_PEOPLE_ROLE = (id: string): string => `people-role-${id}`;
