/**
 * AdvertisementsMocks module is responsible for providing the necessary mock data,
 * Apollo Client configuration, and utilities for testing the Advertisements component.
 * It simulates various backend responses to facilitate isolated frontend testing.
 *
 * @remarks
 * - Configures a mock `ApolloClient` with `authLink` to simulate bearer token headers.
 * - Defines `dateConstants` to ensure consistent date assertions across timezones.
 * - Provides tailored mock scenarios: Active/Completed lists, Infinite Scrolling, and Error states.
 * - Includes mutation mocks for Creating, Updating, and Deleting advertisements.
 * - Uses `act` wrappers in utility functions to handle async React state updates.
 *
 * @example
 * ```tsx
 * import { getActiveAdvertisementMocks } from './AdvertisementsMocks';
 * import { MockedProvider } from '@apollo/client/testing';
 *
 * render(
 * <MockedProvider mocks={getActiveAdvertisementMocks}>
 * <Advertisements />
 * </MockedProvider>
 * );
 * ```
 *
 * @file AdvertisementsMocks.ts
 * @category Mocks
 */

// Re-export types
export type * from './AdvertisementsMocks.types';

// Re-export constants
export {
  dateConstants,
  createDates,
  updateDates,
} from './AdvertisementsMocks.constants';

// Re-export utilities
export {
  client,
  wait,
  createAdvertisementNode,
  createAdvertisementListMock,
  createBatchNodes,
  createMutationMock,
} from './AdvertisementsMocks.utils';

// Re-export mock data
export {
  emptyMocks,
  getCompletedAdvertisementMocks,
  getActiveAdvertisementMocks,
  deleteAdvertisementMocks,
  initialArchivedData,
  initialActiveData,
  filterActiveAdvertisementData,
  filterCompletedAdvertisementData,
  createAdvertisement,
  createAdvertisementWithoutName,
  createAdvertisementWithEndDateBeforeStart,
  createAdvertisementError,
  updateAdMocks,
  fetchErrorMocks,
} from './AdvertisementsMocks.data';
