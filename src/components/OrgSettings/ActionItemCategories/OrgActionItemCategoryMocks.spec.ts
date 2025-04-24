// src/components/ActionItemCategory/categoryMocks.spec.ts

import { describe, it, expect } from 'vitest';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './OrgActionItemCategoryMocks';

/**
 * Validate the main mock array: contains multiple LIST queries,
 * one CREATE, and three UPDATE mocks.
 */
describe('categoryMocks: MOCKS array', () => {
  it('exports a non-empty array of mocks', () => {
    expect(Array.isArray(MOCKS)).toBe(true);
    expect(MOCKS.length).toBeGreaterThan(0);
  });

  it('contains exactly five ACTION_ITEM_CATEGORY_LIST mocks', () => {
    const listMocks = MOCKS.filter(
      (m) => m.request.query === ACTION_ITEM_CATEGORY_LIST,
    );
    expect(listMocks.length).toBe(5);
    listMocks.forEach((mock) => {
      expect(mock.request.variables).toMatchObject({
        organizationId: 'orgId',
        where: expect.any(Object),
        orderBy: expect.stringMatching(/createdAt_(ASC|DESC)/),
      });
      expect(
        Array.isArray(mock.result.data.actionItemCategoriesByOrganization),
      ).toBe(true);
    });
  });

  it('contains exactly one CREATE_ACTION_ITEM_CATEGORY_MUTATION mock', () => {
    const createMocks = MOCKS.filter(
      (m) => m.request.query === CREATE_ACTION_ITEM_CATEGORY_MUTATION,
    );
    expect(createMocks.length).toBe(1);
    const createVars = createMocks[0].request.variables;
    expect(createVars).toEqual({
      name: 'Category 2',
      isDisabled: true,
      organizationId: 'orgId',
    });
    expect(createMocks[0].result.data.createActionItemCategory).toHaveProperty(
      '_id',
      'categoryId3',
    );
  });

  it('contains exactly three UPDATE_ACTION_ITEM_CATEGORY_MUTATION mocks', () => {
    const updateMocks = MOCKS.filter(
      (m) => m.request.query === UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
    );
    expect(updateMocks.length).toBe(3);
    updateMocks.forEach((mock) => {
      const vars = mock.request.variables;
      expect(vars).toHaveProperty('name');
      expect([true, false]).toContain(vars.isDisabled);
      expect(vars).toHaveProperty('actionItemCategoryId', 'categoryId');
      expect(mock.result.data.updateActionItemCategory).toHaveProperty(
        '_id',
        'categoryId',
      );
    });
  });
});

/**
 * Validate the empty and error mock sets.
 */
describe('categoryMocks: empty and error scenarios', () => {
  it('MOCKS_EMPTY returns an empty categories array', () => {
    expect(MOCKS_EMPTY).toHaveLength(1);
    const mock = MOCKS_EMPTY[0];
    expect(mock.request.query).toBe(ACTION_ITEM_CATEGORY_LIST);
    expect(mock.result.data.actionItemCategoriesByOrganization).toEqual([]);
  });

  it('MOCKS_ERROR entries include error objects', () => {
    expect(MOCKS_ERROR).toHaveLength(3);
    MOCKS_ERROR.forEach((mock) => {
      if (mock.request.query === ACTION_ITEM_CATEGORY_LIST) {
        expect(mock.request.query).toBe(ACTION_ITEM_CATEGORY_LIST);
      } else {
        expect([
          CREATE_ACTION_ITEM_CATEGORY_MUTATION,
          UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
        ]).toContain(mock.request.query);
      }
      expect(mock.error).toBeInstanceOf(Error);
      expect(mock.error.message).toBe('Mock Graphql Error');
    });
  });
});
