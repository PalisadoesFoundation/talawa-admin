import { AdvertisementPage } from '../../../pageObjects/AdminPortal/AdvertisementPage';

/**
 * Build a mock ad edge with endAt set to +1 year (so it appears under
 * "Active Campaigns" instead of "Archived Ads").
 */
function makeAdEdge(
  orgId: string,
  id: string,
  name: string,
): Record<string, unknown> {
  const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  return {
    node: {
      id,
      name,
      description: 'This is a test advertisement',
      type: 'banner',
      startAt: new Date().toISOString(),
      endAt: future,
      organization: { id: orgId },
      createdAt: new Date().toISOString(),
      attachments: [],
    },
  };
}

/**
 * Mock ONLY the OrganizationAdvertisements query so it returns controlled
 * ad data.  All other GraphQL operations pass through to the real backend.
 */
function mockAdList(orgId: string, adEdges: Record<string, unknown>[]): void {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'OrganizationAdvertisements') {
      req.reply({
        data: {
          organization: {
            advertisements: {
              edges: adEdges,
              pageInfo: {
                startCursor: adEdges.length > 0 ? 'c1' : null,
                endCursor: adEdges.length > 0 ? 'c1' : null,
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          },
        },
      });
    }
  });
}

/**
 * Mock only the mutations that modify advertisements (update / delete)
 * so the test toast assertions pass without needing a real ad in the
 * backend.  All other GraphQL operations pass through.
 */
function mockAdMutations(): void {
  cy.intercept('POST', '**/graphql', (req) => {
    const op = req.body.operationName ?? '';
    if (op === 'UpdateAdvertisement') {
      req.reply({ data: { updateAdvertisement: { id: 'mock-ad-1' } } });
    }
    if (op === 'DeleteAdvertisement') {
      req.reply({ data: { deleteAdvertisement: { id: 'mock-ad-1' } } });
    }
  });
}

describe('Testing Admin Advertisement Management', () => {
  const adPage = new AdvertisementPage();
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
      },
    );
  });

  beforeEach(() => {
    cy.loginByApi('admin');
  });

  // ── Test 1 — create ad (real backend) ──────────────────────────────────────
  it('create a new advertisement', () => {
    cy.visit(`/admin/orgads/${orgId}`);
    adPage.waitForPageReady();
    adPage.createAdvertisement(
      'Advertisement 1',
      'This is a test advertisement',
      'banner',
    );
  });

  // ── Test 2 — create ad with file attachment ────────────────────────────────
  // The page object mocks the MinIO PUT.  We additionally mock the
  // createPresignedUrl query so the frontend gets a URL to "upload" to.
  it('create a new advertisement with file attachment', () => {
    // Mock both presignedUrl (MinIO not reachable on CI) and the
    // AddAdvertisement mutation (backend can't validate unmocked upload).
    cy.intercept('POST', '**/graphql', (req) => {
      const op = req.body.operationName ?? '';
      if (op === 'createPresignedUrl') {
        req.reply({
          data: {
            createPresignedUrl: {
              presignedUrl: 'http://localhost:9000/talawa/test-upload',
              objectName: 'orgs/test-org/ads/default.png',
              requiresUpload: true,
            },
          },
        });
      }
      if (op === 'AddAdvertisement') {
        req.reply({
          data: { createAdvertisement: { id: 'mock-ad-attachment' } },
        });
      }
    });
    cy.visit(`/admin/orgads/${orgId}`);
    adPage.waitForPageReady();
    adPage.createAdvertisementWithAttachment(
      'Advertisement with attachment',
      'This is a test advertisement',
      'banner',
      'advertisement_banner.png',
    );
  });

  // ── Test 3 — verify + edit (mock ad list so the ad is "active") ────────────
  it('shows the created advertisement under active campaigns and allows editing', () => {
    mockAdList(orgId, [makeAdEdge(orgId, 'mock-ad-1', 'Advertisement 1')]);
    mockAdMutations();
    cy.visit(`/admin/orgads/${orgId}`);
    adPage.waitForPageReady();
    adPage.verifyAndEditAdvertisement('Advertisement 1', 'Advertisement 2');
  });

  // ── Test 4 — verify + delete ───────────────────────────────────────────────
  it('shows the updated advertisement under active campaigns and deletes it', () => {
    mockAdList(orgId, [makeAdEdge(orgId, 'mock-ad-1', 'Advertisement 2')]);
    mockAdMutations();
    cy.visit(`/admin/orgads/${orgId}`);
    adPage.waitForPageReady();
    adPage.verifyAndDeleteAdvertisement('Advertisement 2');
  });

  after(() => {
    cy.cleanupTestOrganization(orgId);
  });
});
