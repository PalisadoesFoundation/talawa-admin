import { sortAndSlicePostsByCreatedAt } from './handleLatestFeed';
import { sortAndSliceEventsByStartDate } from './handleLatestFeed';
import type { InterfaceQueryOrganizationPostListItem } from './interfaces';
import type { InterfaceQueryOrganizationEventListItem } from './interfaces';

describe('sortAndSliceEventsByStartDate', () => {
  it('should sort events by start date in ascending order', () => {
    const events = [
      { startDate: '2023-10-10' },
      { startDate: '2023-10-05' },
      { startDate: '2023-10-15' },
    ] as InterfaceQueryOrganizationEventListItem[];

    const sortedEvents = sortAndSliceEventsByStartDate(events);

    expect(sortedEvents).toEqual([
      { startDate: '2023-10-05' },
      { startDate: '2023-10-10' },
      { startDate: '2023-10-15' },
    ]);
  });

  it('should handle an empty array', () => {
    const events = [] as InterfaceQueryOrganizationEventListItem[];

    const sortedEvents = sortAndSliceEventsByStartDate(events);

    expect(sortedEvents).toEqual([]);
  });
});

describe('sortAndSlicePostsByCreatedAt', () => {
  it('should sort posts by creation date in descending order', () => {
    const posts = [
      { createdAt: '2023-10-10' },
      { createdAt: '2023-10-05' },
      { createdAt: '2023-10-15' },
    ] as InterfaceQueryOrganizationPostListItem[];

    const sortedPosts = sortAndSlicePostsByCreatedAt(posts);

    expect(sortedPosts).toEqual([
      { createdAt: '2023-10-15' },
      { createdAt: '2023-10-10' },
      { createdAt: '2023-10-05' },
    ]);
  });

  it('should handle an empty array', () => {
    const posts = [] as InterfaceQueryOrganizationPostListItem[];

    const sortedPosts = sortAndSlicePostsByCreatedAt(posts);

    expect(sortedPosts).toEqual([]);
  });
});
