import { describe, it, expect } from 'vitest';
import { GET_ORGANIZATION_VENUES_PG } from './Queries';

describe('Venue Queries', () => {
  it('GET_ORGANIZATION_VENUES_PG query should be defined correctly', () => {
    expect(GET_ORGANIZATION_VENUES_PG).toBeDefined();
    expect(GET_ORGANIZATION_VENUES_PG.kind).toBe('Document');
  });

  it('GET_ORGANIZATION_VENUES_PG should have correct query structure', () => {
    const queryString = GET_ORGANIZATION_VENUES_PG.loc?.source.body;

    expect(queryString).toContain('query GetOrganizationVenues');
    expect(queryString).toContain('$id: String!');
    expect(queryString).toContain('$first: Int');
    expect(queryString).toContain('$after: String');
    expect(queryString).toContain('organization(input: { id: $id })');
    expect(queryString).toContain('venues(first: $first, after: $after)');
  });

  it('GET_ORGANIZATION_VENUES_PG should request venue fields', () => {
    const queryString = GET_ORGANIZATION_VENUES_PG.loc?.source.body;

    expect(queryString).toContain('id');
    expect(queryString).toContain('name');
    expect(queryString).toContain('description');
    expect(queryString).toContain('capacity');
    expect(queryString).toContain('attachments');
    expect(queryString).toContain('createdAt');
    expect(queryString).toContain('updatedAt');
  });

  it('GET_ORGANIZATION_VENUES_PG should include pagination fields', () => {
    const queryString = GET_ORGANIZATION_VENUES_PG.loc?.source.body;

    expect(queryString).toContain('edges');
    expect(queryString).toContain('node');
    expect(queryString).toContain('cursor');
    expect(queryString).toContain('pageInfo');
    expect(queryString).toContain('hasNextPage');
    expect(queryString).toContain('endCursor');
  });

  it('GET_ORGANIZATION_VENUES_PG should include attachment fields', () => {
    const queryString = GET_ORGANIZATION_VENUES_PG.loc?.source.body;

    expect(queryString).toContain('attachments');
    expect(queryString).toContain('url');
    expect(queryString).toContain('mimeType');
  });
});
