import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { mapCreateEventInputToMutationInput } from './createEventInput';
import type { IEventFormInput } from './interface';

dayjs.extend(utc);

describe('mapCreateEventInputToMutationInput', () => {
  const baseInput: Omit<
    IEventFormInput,
    | 'name'
    | 'organizationId'
    | 'allDay'
    | 'isPublic'
    | 'isRegisterable'
    | 'isInviteOnly'
  > & {
    name: string;
    organizationId: string | undefined;
    allDay: boolean;
    isPublic: boolean;
    isRegisterable: boolean;
    isInviteOnly: boolean;
  } = {
    name: 'Event',
    organizationId: 'org123',
    allDay: true,
    isPublic: false,
    isRegisterable: true,
    isInviteOnly: true,
  };

  it('maps timestamp-based input directly', () => {
    const fixedStartMs = Date.UTC(2026, 2, 13, 10, 0, 0);
    const fixedEndMs = Date.UTC(2026, 2, 13, 11, 0, 0);
    const input: IEventFormInput = {
      ...baseInput,
      allDay: false,
      startAt: dayjs.utc(fixedStartMs).toISOString(),
      endAt: dayjs.utc(fixedEndMs).toISOString(),
    };

    const mapped = mapCreateEventInputToMutationInput(input);

    expect(mapped.startAt).toBe(input.startAt);
    expect(mapped.endAt).toBe(input.endAt);
    expect(mapped.organizationId).toBe('org123');
  });

  it('maps date-only all-day input to date-only mutation fields', () => {
    const startDate = dayjs().add(30, 'days').format('YYYY-MM-DD');
    const endDate = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');

    const input: IEventFormInput = {
      ...baseInput,
      allDay: true,
      startDate,
      endDate,
    };

    const mapped = mapCreateEventInputToMutationInput(input);

    expect(mapped.startDate).toBe(startDate);
    expect(mapped.endDate).toBe(endDate);
    expect(mapped.startAt).toBeUndefined();
    expect(mapped.endAt).toBeUndefined();
  });

  it('throws when all-day endDate is not after startDate', () => {
    const startDate = dayjs().add(30, 'days').format('YYYY-MM-DD');

    const input: IEventFormInput = {
      ...baseInput,
      allDay: true,
      startDate,
      endDate: startDate,
    };

    expect(() => mapCreateEventInputToMutationInput(input)).toThrow(
      'endDate must be greater than startDate.',
    );
  });

  it('throws when organizationId is missing', () => {
    const input: IEventFormInput = {
      ...baseInput,
      organizationId: undefined,
      startAt: dayjs.utc(Date.UTC(2026, 2, 13, 10, 0, 0)).toISOString(),
      endAt: dayjs.utc(Date.UTC(2026, 2, 13, 11, 0, 0)).toISOString(),
    };

    expect(() => mapCreateEventInputToMutationInput(input)).toThrow(
      'organizationId is required to create an event.',
    );
  });

  it('throws when all-day event is missing dates', () => {
    const input: IEventFormInput = {
      ...baseInput,
    };

    expect(() => mapCreateEventInputToMutationInput(input)).toThrow(
      'startDate and endDate are required when allDay is true.',
    );
  });

  it('throws when all-day event provides timestamps', () => {
    const startDate = dayjs().add(45, 'days').format('YYYY-MM-DD');
    const endDate = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');

    const input: IEventFormInput = {
      ...baseInput,
      startAt: dayjs.utc(Date.UTC(2026, 2, 13, 10, 0, 0)).toISOString(),
      endAt: dayjs.utc(Date.UTC(2026, 2, 13, 11, 0, 0)).toISOString(),
      startDate,
      endDate,
    };

    expect(() => mapCreateEventInputToMutationInput(input)).toThrow(
      'Cannot provide startAt/endAt when allDay is true. Use startDate/endDate instead.',
    );
  });
});
