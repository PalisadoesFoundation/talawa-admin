import { AdvertisementPage } from '../../../pageObjects/AdminPortal/AdvertisementPage';

// ─── Shared constants ────────────────────────────────────────────────────────
const orgId = '12345';
const userId = 'user-123';

const mockOrganization = {
  id: orgId,
  name: 'Test Org',
  description: 'Test Description',
  addressLine1: 'Test Address',
  addressLine2: null,
  city: 'Test City',
  state: 'Test State',
  postalCode: '12345',
  countryCode: 'US',
  avatarURL: null,
  createdAt: '2023-01-01T00:00:00.000Z',
  isUserRegistrationRequired: false,
};

// ─── Mock response builder ───────────────────────────────────────────────────
function buildMockResponses(adEdges: object[] = []): Record<string, object> {
  return {
    CurrentUser: {
      data: {
        user: {
          id: userId,
          name: 'Test Admin',
          emailAddress: 'admin@example.com',
          avatarURL: null,
          addressLine1: null,
          addressLine2: null,
          birthDate: null,
          city: null,
          countryCode: null,
          createdAt: '2023-01-01T00:00:00.000Z',
          description: null,
          educationGrade: null,
          employmentStatus: null,
          homePhoneNumber: null,
          isEmailAddressVerified: true,
          maritalStatus: null,
          mobilePhoneNumber: null,
          natalSex: null,
          naturalLanguageCode: null,
          postalCode: null,
          role: 'admin',
          state: null,
          updatedAt: '2023-01-01T00:00:00.000Z',
          workPhoneNumber: null,
          eventsAttended: [],
        },
      },
    },
    getCommunityData: {
      data: {
        community: {
          createdAt: '2023-01-01T00:00:00.000Z',
          facebookURL: null,
          githubURL: null,
          id: 'community-1',
          inactivityTimeoutDuration: 900,
          instagramURL: null,
          linkedinURL: null,
          logoMimeType: null,
          logoURL: null,
          name: 'Test Community',
          redditURL: null,
          slackURL: null,
          updatedAt: '2023-01-01T00:00:00.000Z',
          websiteURL: null,
          xURL: null,
          youtubeURL: null,
        },
      },
    },
    GetAllPlugins: { data: { getPlugins: [] } },
    getOrganizationBasicData: {
      data: { organization: { ...mockOrganization } },
    },
    GetOrganization: {
      data: {
        organization: {
          ...mockOrganization,
          creator: {
            id: userId,
            name: 'Test Admin',
            emailAddress: 'admin@example.com',
          },
          updater: {
            id: userId,
            name: 'Test Admin',
            emailAddress: 'admin@example.com',
          },
          members: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
          blockedUsers: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
          events: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
    getOrganizationData: {
      data: {
        organization: {
          ...mockOrganization,
          creator: {
            id: userId,
            name: 'Test Admin',
            emailAddress: 'admin@example.com',
          },
          updater: {
            id: userId,
            name: 'Test Admin',
            emailAddress: 'admin@example.com',
          },
          members: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
    UserJoinedOrganizations: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  id: orgId,
                  name: 'Test Org',
                  city: 'Test City',
                  countryCode: 'US',
                  addressLine1: 'Test Address',
                  postalCode: '12345',
                  state: 'Test State',
                  description: 'Test Description',
                  avatarURL: null,
                  membersCount: 1,
                  adminsCount: 1,
                  members: { edges: [{ node: { id: userId } }] },
                },
              },
            ],
            pageInfo: { hasNextPage: false },
          },
        },
      },
    },
    OrganizationMemberAdminCounts: {
      data: { organization: { id: orgId, membersCount: 1, adminsCount: 1 } },
    },
    getOrganizationPostsCount: {
      data: { organization: { id: orgId, postsCount: 0 } },
    },
    GetOrganizationEvents: {
      data: {
        organization: {
          eventsCount: 0,
          events: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
    GetOrganizationPosts: {
      data: { organization: { posts: { edges: [] } } },
    },
    GetBlockedUsersCount: {
      data: { organization: { id: orgId, blockedUsersCount: 0 } },
    },
    GetVenuesCount: {
      data: { organization: { id: orgId, venuesCount: 0 } },
    },
    Organization: {
      data: { organization: { id: orgId, membershipRequests: [] } },
    },
    OrganizationAdvertisements: {
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
    },
    AddAdvertisement: {
      data: { createAdvertisement: { id: 'new-ad-id' } },
    },
    UpdateAdvertisement: {
      data: { updateAdvertisement: { id: 'new-ad-id' } },
    },
    DeleteAdvertisement: {
      data: { deleteAdvertisement: { id: 'new-ad-id' } },
    },
    createPresignedUrl: {
      data: {
        createPresignedUrl: {
          presignedUrl: 'http://localhost:9000/talawa/test-upload',
          objectName: 'orgs/test-org/ads/default.png',
          requiresUpload: true,
        },
      },
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setupGraphQLIntercept(adEdges: object[] = []): void {
  const responses = buildMockResponses(adEdges);
  cy.intercept('POST', '**/graphql', (req) => {
    const opName: string = req.body.operationName ?? '';
    const normalizedName =
      opName === 'GetOrganizationData' ? 'getOrganizationData' : opName;
    req.reply(responses[normalizedName] ?? { data: {} });
  });
}

function visitWithAuth(url: string): void {
  cy.visit(url, {
    onBeforeLoad(win: Window) {
      win.localStorage.setItem(
        'Talawa-admin_token',
        JSON.stringify('fake-token'),
      );
      win.localStorage.setItem(
        'Talawa-admin_role',
        JSON.stringify('administrator'),
      );
      win.localStorage.setItem(
        'Talawa-admin_email',
        JSON.stringify('admin@example.com'),
      );
      win.localStorage.setItem('Talawa-admin_userId', JSON.stringify(userId));
      win.localStorage.setItem('Talawa-admin_id', JSON.stringify(userId));
      win.localStorage.setItem(
        'Talawa-admin_IsLoggedIn',
        JSON.stringify('TRUE'),
      );
    },
  });
}

function makeAdEdge(id: string, name: string): object {
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
 * Navigate to the ads page and wait until the page is FULLY stable.
 *
 * "Fully stable" means:
 * 1. The top-level container exists (React has mounted).
 * 2. The tab bar is rendered ("Active Campaigns" text exists),
 *    which only happens AFTER the loading spinner disappears.
 *    This is critical — the spinner removal shifts DOM children,
 *    causing React to remount the <PageHeader> subtree (including the
 *    createAdvertisement button). If we interact before this settles,
 *    Cypress grabs a button ref that immediately becomes detached.
 * 3. The createAdvertisement button is visible and ready to click.
 */
function navigateToAdsPage(adEdges: object[] = []): void {
  setupGraphQLIntercept(adEdges);
  visitWithAuth(`/admin/orgads/${orgId}`);

  // 1. Container mounted
  cy.get('[data-testid="advertisements"]').should('exist');

  // 2. Tabs rendered → loading is DONE → no more DOM shifts
  //    The default active tab is "archivedAds".  We MUST switch to
  //    "Active Campaigns" during setup so the tab content renders NOW,
  //    not later when the page-object clicks it again (which is a no-op).
  cy.contains('Active Campaigns').should('be.visible').click();

  // 3. Button is ready (it re-renders when loading finishes)
  cy.get('[data-testid="createAdvertisement"]').should('be.visible');

  // 4. If we expect ads, wait for at least one ad card to be rendered.
  //    This proves the GraphQL response was processed and React finished
  //    rendering the list.  Without this the test body might race ahead
  //    of the useEffect that populates activeAdvertisements state.
  if (adEdges.length > 0) {
    cy.get('[data-testid="AdEntry"]').should('exist');
  }
}

// ─── Test suite ──────────────────────────────────────────────────────────────
describe('Testing Admin Advertisement Management', () => {
  const adPage = new AdvertisementPage();

  it('create a new advertisement', () => {
    navigateToAdsPage();
    adPage.createAdvertisement(
      'Advertisement 1',
      'This is a test advertisement',
      'banner',
    );
  });

  it('create a new advertisement with file attachment', () => {
    navigateToAdsPage();
    adPage.createAdvertisementWithAttachment(
      'Advertisement with attachment',
      'This is a test advertisement',
      'banner',
      'advertisement_banner.png',
    );
  });

  it('shows the created advertisement under active campaigns and allows editing', () => {
    navigateToAdsPage([makeAdEdge('ad-1', 'Advertisement 1')]);
    adPage.verifyAndEditAdvertisement('Advertisement 1', 'Advertisement 2');
  });

  it('shows the updated advertisement under active campaigns and deletes it', () => {
    navigateToAdsPage([makeAdEdge('ad-1', 'Advertisement 2')]);
    adPage.verifyAndDeleteAdvertisement('Advertisement 2');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
