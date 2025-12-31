/**
 * @file AdvertisementsMocks.constants.ts
 * @description Constants for advertisement mocks.
 */

export const dateConstants = {
  create: {
    startAtISO: '2024-12-31T18:30:00.000Z',
    endAtISO: '2030-02-01T18:30:00.000Z',
    startAtCalledWith: '2024-12-31T00:00:00.000Z',
    endAtCalledWith: '2030-02-01T00:00:00.000Z',
    startISOReceived: '2024-12-30T18:30:00.000Z',
    endISOReceived: '2030-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
  update: {
    startAtISO: '2024-12-31T18:30:00.000Z',
    endAtISO: '2030-02-01T18:30:00.000Z',
    startAtCalledWith: '2024-12-31T00:00:00.000Z',
    endAtCalledWith: '2030-02-01T00:00:00.000Z',
    startISOReceived: '2024-12-30T18:30:00.000Z',
    endISOReceived: '2030-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
};

export const { create: createDates, update: updateDates } = dateConstants;
