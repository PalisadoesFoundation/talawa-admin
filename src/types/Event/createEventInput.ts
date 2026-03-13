import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { ICreateEventInput, IMutationCreateEventInput } from './interface';

dayjs.extend(utc);

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const ensureValidTimestamp = (value: string, fieldName: string): string => {
  if (!dayjs(value).isValid()) {
    throw new Error(`Invalid ${fieldName} timestamp.`);
  }
  return value;
};

/**
 * Maps flexible UI/form create-event input to GraphQL's strict mutation input.
 *
 * Accepted input forms:
 * - Timed/all-day timestamp payload: `startAt` + `endAt`
 * - Legacy date-only payload: `startDate` (+ optional `endDate`)
 *
 * For date-only payloads, `endDate` is treated as an exclusive date when present.
 */
export const mapCreateEventInputToMutationInput = (
  input: ICreateEventInput,
): IMutationCreateEventInput => {
  if (!input.organizationId || input.organizationId.trim() === '') {
    throw new Error('organizationId is required to create an event.');
  }

  let startAt: string;
  let endAt: string;

  if (input.startAt && input.endAt) {
    startAt = ensureValidTimestamp(input.startAt, 'startAt');
    endAt = ensureValidTimestamp(input.endAt, 'endAt');
  } else if (input.startDate) {
    if (!ISO_DATE_ONLY.test(input.startDate)) {
      throw new Error('startDate must be in YYYY-MM-DD format.');
    }

    const startDate = dayjs.utc(input.startDate).startOf('day');
    const exclusiveEndDate = input.endDate
      ? dayjs.utc(input.endDate).startOf('day')
      : startDate.add(1, 'day');

    if (!exclusiveEndDate.isValid()) {
      throw new Error('endDate must be in YYYY-MM-DD format when provided.');
    }

    if (!exclusiveEndDate.isAfter(startDate)) {
      throw new Error('endDate must be after startDate.');
    }

    startAt = startDate.toISOString();
    endAt = exclusiveEndDate.subtract(1, 'millisecond').toISOString();
  } else {
    throw new Error(
      'Either startAt/endAt or startDate must be provided for createEvent.',
    );
  }

  if (dayjs(endAt).isBefore(dayjs(startAt))) {
    throw new Error('endAt must be greater than or equal to startAt.');
  }

  return {
    name: input.name,
    startAt,
    endAt,
    organizationId: input.organizationId,
    allDay: input.allDay,
    isPublic: input.isPublic,
    isRegisterable: input.isRegisterable,
    isInviteOnly: input.isInviteOnly,
    ...(input.description !== undefined && { description: input.description }),
    ...(input.location !== undefined && { location: input.location }),
    ...(input.recurrence !== undefined && { recurrence: input.recurrence }),
  };
};
