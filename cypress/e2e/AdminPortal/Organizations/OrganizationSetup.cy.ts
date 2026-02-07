describe('Organization test data setup', () => {
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment().then(({ orgId: createdOrgId }) => {
      orgId = createdOrgId;
      expect(orgId).to.be.a('string').and.not.equal('');
    });
  });

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId);
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
});
