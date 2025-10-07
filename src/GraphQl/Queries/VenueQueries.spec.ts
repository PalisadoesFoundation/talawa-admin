import { describe, it, expect } from 'vitest';
import { parse, OperationDefinitionNode, FieldNode } from 'graphql';
import { GET_ORGANIZATION_VENUES_PG } from './Queries';

describe('Venue Queries', () => {
  it('GET_ORGANIZATION_VENUES_PG should be valid GraphQL', () => {
    expect(() =>
      parse(GET_ORGANIZATION_VENUES_PG.loc?.source.body || ''),
    ).not.toThrow();
  });

  it('GET_ORGANIZATION_VENUES_PG query should be defined correctly', () => {
    expect(GET_ORGANIZATION_VENUES_PG).toBeDefined();
    expect(GET_ORGANIZATION_VENUES_PG.kind).toBe('Document');
  });

  it('GET_ORGANIZATION_VENUES_PG should have correct operation name and variables', () => {
    const definition = GET_ORGANIZATION_VENUES_PG
      .definitions[0] as OperationDefinitionNode;
    expect(definition.operation).toBe('query');
    expect(definition.name?.value).toBe('GetOrganizationVenues');

    const variables = definition.variableDefinitions || [];
    expect(variables.length).toBe(3);

    const idVar = variables.find((v) => v.variable.name.value === 'id');
    expect(idVar).toBeDefined();
    expect(idVar?.type.kind).toBe('NonNullType');

    const firstVar = variables.find((v) => v.variable.name.value === 'first');
    expect(firstVar).toBeDefined();
    expect(firstVar?.type.kind).toBe('NamedType');

    const afterVar = variables.find((v) => v.variable.name.value === 'after');
    expect(afterVar).toBeDefined();
    expect(afterVar?.type.kind).toBe('NamedType');
  });

  it('GET_ORGANIZATION_VENUES_PG should request correct venue fields from AST', () => {
    const definition = GET_ORGANIZATION_VENUES_PG
      .definitions[0] as OperationDefinitionNode;
    const organizationField = definition.selectionSet
      .selections[0] as FieldNode;
    expect(organizationField.name.value).toBe('organization');

    const venuesField = organizationField.selectionSet
      ?.selections[0] as FieldNode;
    expect(venuesField.name.value).toBe('venues');

    const edgesField = venuesField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'edges',
    ) as FieldNode;
    expect(edgesField).toBeDefined();

    const nodeField = edgesField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'node',
    ) as FieldNode;
    expect(nodeField).toBeDefined();

    const nodeFields = nodeField.selectionSet?.selections.map(
      (sel) => (sel as FieldNode).name.value,
    );
    expect(nodeFields).toContain('id');
    expect(nodeFields).toContain('name');
    expect(nodeFields).toContain('description');
    expect(nodeFields).toContain('capacity');
    expect(nodeFields).toContain('attachments');
    expect(nodeFields).toContain('createdAt');
    expect(nodeFields).toContain('updatedAt');
  });

  it('GET_ORGANIZATION_VENUES_PG should include pagination structure', () => {
    const definition = GET_ORGANIZATION_VENUES_PG
      .definitions[0] as OperationDefinitionNode;
    const organizationField = definition.selectionSet
      .selections[0] as FieldNode;
    const venuesField = organizationField.selectionSet
      ?.selections[0] as FieldNode;

    const venueFields = venuesField.selectionSet?.selections.map(
      (sel) => (sel as FieldNode).name.value,
    );
    expect(venueFields).toContain('edges');
    expect(venueFields).toContain('pageInfo');

    const edgesField = venuesField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'edges',
    ) as FieldNode;
    const edgeFields = edgesField.selectionSet?.selections.map(
      (sel) => (sel as FieldNode).name.value,
    );
    expect(edgeFields).toContain('node');
    expect(edgeFields).toContain('cursor');

    const pageInfoField = venuesField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'pageInfo',
    ) as FieldNode;
    const pageInfoFields = pageInfoField.selectionSet?.selections.map(
      (sel) => (sel as FieldNode).name.value,
    );
    expect(pageInfoFields).toContain('hasNextPage');
    expect(pageInfoFields).toContain('endCursor');
  });

  it('GET_ORGANIZATION_VENUES_PG should include attachment fields', () => {
    const definition = GET_ORGANIZATION_VENUES_PG
      .definitions[0] as OperationDefinitionNode;
    const organizationField = definition.selectionSet
      .selections[0] as FieldNode;
    const venuesField = organizationField.selectionSet
      ?.selections[0] as FieldNode;
    const edgesField = venuesField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'edges',
    ) as FieldNode;
    const nodeField = edgesField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'node',
    ) as FieldNode;

    const attachmentsField = nodeField.selectionSet?.selections.find(
      (sel) => (sel as FieldNode).name.value === 'attachments',
    ) as FieldNode;
    expect(attachmentsField).toBeDefined();

    const attachmentFields = attachmentsField.selectionSet?.selections.map(
      (sel) => (sel as FieldNode).name.value,
    );
    expect(attachmentFields).toContain('url');
    expect(attachmentFields).toContain('mimeType');
  });

  it('GET_ORGANIZATION_VENUES_PG should have string representation as supplemental check', () => {
    const queryString = GET_ORGANIZATION_VENUES_PG.loc?.source.body;

    expect(queryString).toContain('query GetOrganizationVenues');
    expect(queryString).toContain('$id: String!');
    expect(queryString).toContain('organization(input: { id: $id })');
    expect(queryString).toContain('venues(first: $first, after: $after)');
  });
});
