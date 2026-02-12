describe('Organization test data setup', () => {
  let orgId = '';
  const userIds: string[] = [];

  before(() => {
    cy.setupTestEnvironment().then(({ orgId: createdOrgId }) => {
      orgId = createdOrgId;
      expect(orgId).to.be.a('string').and.not.equal('');
    });
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId, { userIds });
    }
  });

  afterEach(() => {
    cy.clearAllGraphQLMocks();
  });

  it('seeds event data for a new organization', () => {
    cy.seedTestData('events', { orgId }).then(({ eventId }) => {
      expect(eventId).to.be.a('string').and.not.equal('');
    });
  });

  it('seeds post data for a new organization', () => {
    cy.seedTestData('posts', { orgId }).then(({ postId }) => {
      expect(postId).to.be.a('string').and.not.equal('');
    });
  });

  it('seeds volunteer data for a new event', () => {
    cy.seedTestData('events', { orgId })
      .then(({ eventId }) => {
        return cy.seedTestData('volunteers', { eventId });
      })
      .then(({ volunteerId, userId }) => {
        expect(volunteerId).to.be.a('string').and.not.equal('');
        if (userId) {
          userIds.push(userId);
        }
      });
  });
});
