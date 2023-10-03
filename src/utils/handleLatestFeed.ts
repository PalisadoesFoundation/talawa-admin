import type { InterfaceQueryOrganizationPostListItem } from './interfaces';
import type { InterfaceQueryOrganizationEventListItem } from './interfaces';

function sortAndSliceEventsByStartDate(
  events: InterfaceQueryOrganizationEventListItem[]
): InterfaceQueryOrganizationEventListItem[] {
  return events
    .sort(
      (
        eventA: InterfaceQueryOrganizationEventListItem,
        eventB: InterfaceQueryOrganizationEventListItem
      ) => {
        const dateA = new Date(eventA.startDate);
        const dateB = new Date(eventB.startDate);

        return dateA.getTime() - dateB.getTime();
      }
    )
    .slice(0, 5);
}

function sortAndSlicePostsByCreatedAt(
  posts: InterfaceQueryOrganizationPostListItem[]
): InterfaceQueryOrganizationPostListItem[] {
  return posts
    .sort(
      (
        postA: InterfaceQueryOrganizationPostListItem,
        postB: InterfaceQueryOrganizationPostListItem
      ) => {
        const dateA = new Date(postA.createdAt);
        const dateB = new Date(postB.createdAt);

        return dateB.getTime() - dateA.getTime();
      }
    )
    .slice(0, 5);
}

export { sortAndSliceEventsByStartDate, sortAndSlicePostsByCreatedAt };
