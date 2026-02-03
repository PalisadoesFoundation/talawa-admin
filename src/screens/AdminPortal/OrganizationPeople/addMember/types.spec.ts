import { describe, it, expect } from 'vitest';
import { OrganizationMembershipRole } from './types';
import type { IEdge, IUserDetails, IQueryVariable } from './types';

describe('OrganizationPeople addMember types', () => {
  it('exports OrganizationMembershipRole enum correctly', () => {
    expect(OrganizationMembershipRole.ADMIN).toBe('administrator');
    expect(OrganizationMembershipRole.REGULAR).toBe('regular');
  });

  it('allows IEdge type usage', () => {
    const edge: IEdge = {
      cursor: 'cursor',
      node: {
        id: '1',
        name: 'User',
        role: 'regular',
        avatarURL: 'url',
        emailAddress: 'user@test.com',
      },
    };

    expect(edge.node.id).toBe('1');
  });

  it('allows IUserDetails type usage', () => {
    const user: IUserDetails = {
      id: '1',
      name: 'User',
      emailAddress: 'user@test.com',
    };

    expect(user.emailAddress).toContain('@');
  });

  it('allows IQueryVariable type usage', () => {
    const query: IQueryVariable = {
      orgId: 'org',
      first: 10,
      where: {
        role: {
          equal: 'administrator',
        },
      },
    };

    expect(query.where?.role.equal).toBe('administrator');
  });
});
