/**
 * Common constants for the application.
 * These were previously stored in locale files as non-translatable technical keys.
 */

/**
 * Date format for ISO date time strings.
 */
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

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
  `deleteEventModal${id}`;

/**
 * Generates the route for a user component.
 * @param compId - The component ID.
 * @returns The formatted route.
 */
export const ROUTE_USER = (compId: string): string => `user/${compId}`;

/**
 * Generates the route for a user component within an organization.
 * @param compId - The component ID.
 * @param orgId - The organization ID.
 * @returns The formatted route.
 */
export const ROUTE_USER_ORG = (
  compId: string,
  orgId: string | undefined,
): string => `user/${compId}/${orgId ?? ''}`;

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
 * Generates a dummy date time for dayjs parsing.
 * @deprecated Use DUMMY_DATE_TIME_PREFIX instead.
 * @param time - The time string (HH:mm:ss).
 * @returns The formatted ISO-like string.
 */
export const getDummyDateTime = (time: string): string =>
  `${DUMMY_DATE_TIME_PREFIX}${time}`;
