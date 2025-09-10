/**
 * Unit tests for GraphQL queries defined in ActionItemQueries.ts
 * Framework: Vitest (compatible with Jest-style APIs)
 */

import { describe, it, expect } from 'vitest';
import { ACTION_ITEM_LIST, ACTION_ITEMS_BY_USER } from './ActionItemQueries';
import type { DocumentNode, OperationDefinitionNode } from 'graphql';
import { Kind, print } from 'graphql';

function getOperation(doc: DocumentNode): OperationDefinitionNode {
  expect(doc.kind).toBe(Kind.DOCUMENT);
  expect(doc.definitions.length).toBeGreaterThan(0);
  const op = doc.definitions.find(
    (d): d is OperationDefinitionNode => d.kind === Kind.OPERATION_DEFINITION
  );
  if (!op) throw new Error('No operation definition found');
  return op;
}

function getFieldNamesFromSelection(node: any): string[] {
  const selectionSet = node?.selectionSet;
  if (!selectionSet) return [];
  return selectionSet.selections
    .filter((s: any) => s.kind === Kind.FIELD)
    .map((s: any) => s.name.value);
}

function getField(node: any, fieldName: string): any | undefined {
  const selectionSet = node?.selectionSet;
  if (!selectionSet) return undefined;
  return selectionSet.selections.find(
    (s: any) => s.kind === Kind.FIELD && s.name.value === fieldName
  );
}

describe('ActionItemQueries › ACTION_ITEM_LIST', () => {
  it('uses query operation with name "ActionItemsByOrganization"', () => {
    const op = getOperation(ACTION_ITEM_LIST);
    expect(op.operation).toBe('query');
    expect(op.name?.value).toBe('ActionItemsByOrganization');
  });

  it('declares a single non-null $input: QueryActionItemsByOrganizationInput!', () => {
    const op = getOperation(ACTION_ITEM_LIST);
    expect(op.variableDefinitions?.length).toBe(1);
    const v = op.variableDefinitions![0];
    expect(v.variable.name.value).toBe('input');
    expect(v.type.kind).toBe(Kind.NON_NULL_TYPE);
    const named = v.type.kind === Kind.NON_NULL_TYPE ? v.type.type : v.type;
    expect(named.kind).toBe(Kind.NAMED_TYPE);
    expect((named as any).name.value).toBe('QueryActionItemsByOrganizationInput');
  });

  it('selects root field actionItemsByOrganization(input: $input)', () => {
    const op = getOperation(ACTION_ITEM_LIST);
    const rootNames = getFieldNamesFromSelection(op);
    expect(rootNames).toContain('actionItemsByOrganization');

    const root = getField(op, 'actionItemsByOrganization');
    expect(root?.arguments?.length ?? 0).toBe(1);
    const arg = root!.arguments![0];
    expect(arg.name.value).toBe('input');
    expect(arg.value.kind).toBe(Kind.VARIABLE);
    expect((arg.value as any).name.value).toBe('input');
  });

  it('requests expected top-level scalar fields', () => {
    const op = getOperation(ACTION_ITEM_LIST);
    const root = getField(op, 'actionItemsByOrganization');
    const scalars = getFieldNamesFromSelection(root);
    [
      'id',
      'assignedAt',
      'completionAt',
      'createdAt',
      'isCompleted',
      'preCompletionNotes',
      'postCompletionNotes',
    ].forEach((f) => expect(scalars).toContain(f));
  });

  it('requests expected nested objects and fields', () => {
    const op = getOperation(ACTION_ITEM_LIST);
    const root = getField(op, 'actionItemsByOrganization');

    const nestedExpectations: ReadonlyArray<[string, string[]]> = [
      ['assignee', ['id', 'name', 'avatarURL']],
      ['category', ['id', 'name']],
      ['event', ['id', 'name']],
      ['organization', ['id', 'name']],
      ['creator', ['id', 'name']],
      ['updater', ['id', 'name']],
    ];

    nestedExpectations.forEach(([obj, fields]) => {
      const node = getField(root, obj);
      expect(node, `Expected nested object "${obj}"`).toBeTruthy();
      const names = getFieldNamesFromSelection(node);
      fields.forEach((sub) => expect(names).toContain(sub));
    });
  });

  it('does NOT include "description" on event or organization for this query', () => {
    const op = getOperation(ACTION_ITEM_LIST);
    const root = getField(op, 'actionItemsByOrganization');

    const event = getField(root, 'event');
    expect(getFieldNamesFromSelection(event)).not.toContain('description');

    const org = getField(root, 'organization');
    expect(getFieldNamesFromSelection(org)).not.toContain('description');
  });

  it('print snapshot contains sentinel fields to prevent accidental removals', () => {
    const s = print(ACTION_ITEM_LIST);
    expect(s).toContain('query ActionItemsByOrganization');
    expect(s).toContain('$input: QueryActionItemsByOrganizationInput!');
    expect(s).toContain('actionItemsByOrganization');
    expect(s).toContain('preCompletionNotes');
    expect(s).toContain('postCompletionNotes');
    expect(s).toContain('avatarURL');
  });
});

describe('ActionItemQueries › ACTION_ITEMS_BY_USER', () => {
  it('uses query operation with name "ActionItemsByUser"', () => {
    const op = getOperation(ACTION_ITEMS_BY_USER);
    expect(op.operation).toBe('query');
    expect(op.name?.value).toBe('ActionItemsByUser');
  });

  it('declares a single non-null $input: QueryActionItemsByUserInput!', () => {
    const op = getOperation(ACTION_ITEMS_BY_USER);
    expect(op.variableDefinitions?.length).toBe(1);
    const v = op.variableDefinitions![0];
    expect(v.variable.name.value).toBe('input');
    expect(v.type.kind).toBe(Kind.NON_NULL_TYPE);
    const named = v.type.kind === Kind.NON_NULL_TYPE ? v.type.type : v.type;
    expect(named.kind).toBe(Kind.NAMED_TYPE);
    expect((named as any).name.value).toBe('QueryActionItemsByUserInput');
  });

  it('selects root field actionItemsByUser(input: $input)', () => {
    const op = getOperation(ACTION_ITEMS_BY_USER);
    const rootNames = getFieldNamesFromSelection(op);
    expect(rootNames).toContain('actionItemsByUser');

    const root = getField(op, 'actionItemsByUser');
    expect(root?.arguments?.length ?? 0).toBe(1);
    const arg = root!.arguments![0];
    expect(arg.name.value).toBe('input');
    expect(arg.value.kind).toBe(Kind.VARIABLE);
    expect((arg.value as any).name.value).toBe('input');
  });

  it('requests expected top-level scalar fields', () => {
    const op = getOperation(ACTION_ITEMS_BY_USER);
    const root = getField(op, 'actionItemsByUser');
    const scalars = getFieldNamesFromSelection(root);

    [
      'id',
      'isCompleted',
      'assignedAt',
      'completionAt',
      'preCompletionNotes',
      'postCompletionNotes',
      'createdAt',
    ].forEach((f) => expect(scalars).toContain(f));
  });

  it('requests expected nested objects with correct fields (incl. descriptions where applicable)', () => {
    const op = getOperation(ACTION_ITEMS_BY_USER);
    const root = getField(op, 'actionItemsByUser');

    const nestedExpectations: ReadonlyArray<[string, string[]]> = [
      ['assignee', ['id', 'name']],
      ['creator', ['id', 'name']],
      ['updater', ['id', 'name']],
      ['category', ['id', 'name', 'description']],
      ['event', ['id', 'description']], // event here has description (no name)
      ['organization', ['id', 'name', 'description']],
    ];

    nestedExpectations.forEach(([obj, fields]) => {
      const node = getField(root, obj);
      expect(node, `Expected nested object "${obj}"`).toBeTruthy();
      const names = getFieldNamesFromSelection(node);
      fields.forEach((sub) => expect(names).toContain(sub));
    });
  });

  it('does NOT include "name" on event for this query', () => {
    const op = getOperation(ACTION_ITEMS_BY_USER);
    const root = getField(op, 'actionItemsByUser');
    const event = getField(root, 'event');
    expect(getFieldNamesFromSelection(event)).not.toContain('name');
  });

  it('print snapshot contains sentinel fields to prevent accidental removals', () => {
    const s = print(ACTION_ITEMS_BY_USER);
    expect(s).toContain('query ActionItemsByUser');
    expect(s).toContain('$input: QueryActionItemsByUserInput!');
    expect(s).toContain('actionItemsByUser');
    expect(s).toContain('category');
    expect(s).toContain('organization');
    expect(s).toContain('description');
  });
});

describe('ActionItemQueries › defensive', () => {
  it('exports are valid GraphQL DocumentNode instances', () => {
    const docs: unknown[] = [ACTION_ITEM_LIST, ACTION_ITEMS_BY_USER];
    docs.forEach((doc) => {
      expect(doc && typeof doc).toBe('object');
      expect((doc as DocumentNode).kind).toBe(Kind.DOCUMENT);
      const op = getOperation(doc as DocumentNode);
      expect(op.kind).toBe(Kind.OPERATION_DEFINITION);
    });
  });
});