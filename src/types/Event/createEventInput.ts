import dayjs from 'dayjs';
import type { IEventFormInput, IMutationCreateEventInput } from './interface';

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const ensureValidTimestamp = (value: string, fieldName: string): string => {
  if (!dayjs(value).isValid()) {
    throw new Error(`Invalid ${fieldName} timestamp.`);
  }
  return value;
};

/**
 * Maps flexible UI/form create-event input to GraphQL mutation input.
 *
 * Contract:
 * - All-day events must use `startDate` + `endDate`.
 * - Timed events must use `startAt` + `endAt`.
 */
export const mapCreateEventInputToMutationInput = (
  input: IEventFormInput,
): IMutationCreateEventInput => {
  if (!input.organizationId || input.organizationId.trim() === '') {
    throw new Error('organizationId is required to create an event.');
  }

  const baseInput = {
    name: input.name,
    organizationId: input.organizationId,
    allDay: input.allDay,
    isPublic: input.isPublic,
    isRegisterable: input.isRegisterable,
    isInviteOnly: input.isInviteOnly,
    ...(input.description !== undefined && { description: input.description }),
    ...(input.location !== undefined && { location: input.location }),
    ...(input.recurrence !== undefined && { recurrence: input.recurrence }),
  };

  if (input.allDay) {
    if (input.startAt || input.endAt) {
      throw new Error(
        'Cannot provide startAt/endAt when allDay is true. Use startDate/endDate instead.',
      );
    }

    if (!input.startDate || !input.endDate) {
      throw new Error(
        'startDate and endDate are required when allDay is true.',
      );
    }

    if (!ISO_DATE_ONLY.test(input.startDate)) {
      throw new Error('startDate must be in YYYY-MM-DD format.');
    }

    if (!ISO_DATE_ONLY.test(input.endDate)) {
      throw new Error('endDate must be in YYYY-MM-DD format.');
    }

    const startDate = dayjs(input.startDate);
    const endDate = dayjs(input.endDate);

    if (!startDate.isValid() || !endDate.isValid()) {
      throw new Error('Invalid startDate/endDate value for all-day event.');
    }

    if (!endDate.isAfter(startDate)) {
      throw new Error('endDate must be greater than startDate.');
    }

    return {
      ...baseInput,
      startDate: input.startDate,
      endDate: input.endDate,
    };
  }

  if (!input.startAt || !input.endAt) {
    throw new Error('startAt and endAt are required when allDay is false.');
  }

  const startAt = ensureValidTimestamp(input.startAt, 'startAt');
  const endAt = ensureValidTimestamp(input.endAt, 'endAt');

  if (dayjs(endAt).isBefore(dayjs(startAt))) {
    throw new Error('endAt must be greater than or equal to startAt.');
  }

  return {
    ...baseInput,
    startAt,
    endAt,
  };
};
