// src/components/ActionItemForm/testObject.mocks.spec.ts

import { describe, it, expect } from 'vitest';
import {
  EVENT_VOLUNTEER_GROUP_LIST,
  EVENT_VOLUNTEER_LIST,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  ACTION_ITEM_CATEGORY_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import type { InterfaceActionItemInfo } from 'utils/interfaces';
import {
  actionItemCategory1,
  actionItemCategory2,
  baseActionItem,
  itemWithVolunteer,
  itemWithVolunteerImage,
  itemWithUser,
  itemWithUserImage,
  itemWithGroup,
  memberListQuery,
  volunteerListQuery,
  groupListQuery,
  actionItemCategoryListQuery,
} from './testObject.mocks';

// Smoke tests to cover all exports

describe('testObject.mocks exports', () => {
  it('actionItemCategory1 & actionItemCategory2 have correct ids and names', () => {
    expect(actionItemCategory1).toEqual({
      _id: 'actionItemCategoryId1',
      name: 'Category 1',
    });
    expect(actionItemCategory2).toEqual({
      _id: 'actionItemCategoryId2',
      name: 'Category 2',
    });
  });

  it('baseActionItem contains assigner and creator keys', () => {
    expect(baseActionItem).toHaveProperty('assigner');
    expect(baseActionItem).toHaveProperty('creator');
    // assigner shape
    expect(baseActionItem.assigner).toMatchObject({
      _id: 'userId',
      firstName: 'Wilt',
      lastName: 'Shepherd',
      image: null,
    });
    // creator shape
    expect(baseActionItem.creator).toMatchObject({
      _id: 'userId',
      firstName: 'Wilt',
      lastName: 'Shepherd',
      image: null,
      __typename: 'User',
    });
  });

  it('itemWithUser and itemWithUserImage follow InterfaceActionItemInfo shape', () => {
    [itemWithUser, itemWithUserImage].forEach((item) => {
      expect(item).toHaveProperty('_id');
      expect(item.assigneeType).toBe('User');
      expect(item.assigneeUser).toHaveProperty('_id');
      expect(item.assigneeUser).toHaveProperty('firstName');
      expect(item.assigneeUser).toHaveProperty('lastName');
      expect(item).toHaveProperty('actionItemCategory');
    });
    // image-specific case: second user mock has image string
    expect(itemWithUserImage.assigneeUser?.image).toBe('user-image');
  });

  it('itemWithGroup follows InterfaceActionItemInfo shape', () => {
    const item = itemWithGroup;
    expect(item._id).toBe('actionItemId3');
    expect(item.assigneeType).toBe('EventVolunteerGroup');
    expect(item.assigneeGroup).toHaveProperty('_id', 'volunteerGroupId1');
    expect(item.assigneeGroup).toHaveProperty('name', 'Group 1');
    expect(item).toHaveProperty('actionItemCategory');
  });

  it('memberListQuery returns correct request and result shapes', () => {
    expect(memberListQuery.request.query).toBe(MEMBERS_LIST);
    expect(memberListQuery.request.variables).toEqual({ id: 'orgId' });
    expect(memberListQuery.result.data.organizations[0]).toHaveProperty(
      'members',
    );
  });

  it('volunteerListQuery entries use correct query and return arrays', () => {
    volunteerListQuery.forEach((mock) => {
      expect(mock.request.query).toBe(EVENT_VOLUNTEER_LIST);
      expect(mock.request.variables.where).toHaveProperty('hasAccepted', true);
      expect(Array.isArray(mock.result.data.getEventVolunteers)).toBe(true);
    });
  });

  it('groupListQuery entries use correct query and return arrays', () => {
    groupListQuery.forEach((mock) => {
      expect(mock.request.query).toBe(EVENT_VOLUNTEER_GROUP_LIST);
      expect(mock.request.variables.where).toHaveProperty('eventId');
      expect(Array.isArray(mock.result.data.getEventVolunteerGroups)).toBe(
        true,
      );
    });
  });

  it('actionItemCategoryListQuery returns correct query, variables, and data array', () => {
    const mock = actionItemCategoryListQuery;
    expect(mock.request.query).toBe(ACTION_ITEM_CATEGORY_LIST);
    expect(mock.request.variables).toMatchObject({
      organizationId: 'orgId',
      where: { is_disabled: false },
    });
    expect(
      Array.isArray(mock.result.data.actionItemCategoriesByOrganization),
    ).toBe(true);
  });
});
