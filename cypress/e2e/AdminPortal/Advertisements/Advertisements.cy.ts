import { AdvertisementPage } from '../../../pageObjects/AdminPortal/AdvertisementPage';

interface InterfaceAdvertisementData {
  ad1: {
    name: string;
    description: string;
    type: string;
  };
  ad2: {
    updatedName: string;
  };
  mockPresignedUrl: {
    presignedUrl: string;
    objectName: string;
    requiresUpload: boolean;
  };
}

// Shared mock data
const orgId = '12345';
const userId = 'user-123';

/** Minimal org object reused across multiple mocks */
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

/**
 * Map of GraphQL operationName → response body.
 * Every query/mutation the app fires during these tests MUST have an entry here,
 * otherwise the request falls through to the real (non-existent) backend and the
 * component that issued it either hangs or renders an error state – which is the
 * root cause of every CI timeout we have been chasing.
 */
function buildMockResponses(
  adData: InterfaceAdvertisementData,
): Record<string, object> {
  return {
    // ── Auth / User ──────────────────────────────────────────────────
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

    // ── Community ────────────────────────────────────────────────────
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

    // ── Plugins ──────────────────────────────────────────────────────
    GetAllPlugins: { data: { getPlugins: [] } },

    // ── Organization basic (used by SidebarOrgSection) ───────────────
    getOrganizationBasicData: {
      data: { organization: { ...mockOrganization } },
    },

    // ── Organization detailed (used by Dashboard) ────────────────────
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

    // ── Org joined list (sidebar org switcher) ───────────────────────
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

    // ── Dashboard stats ──────────────────────────────────────────────
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

    // ── Advertisements ───────────────────────────────────────────────
    OrganizationAdvertisements: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              startCursor: 'cursor',
              endCursor: 'cursor',
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
        createPresignedUrl: adData.mockPresignedUrl,
      },
    },
  };
}

describe('Testing Admin Advertisement Management', () => {
  const adPage = new AdvertisementPage();
  let adData: InterfaceAdvertisementData;

  before(() => {
    cy.fixture('admin/advertisements').then((data) => {
      const ad1 = data.advertisements?.[0];
      adData = {
        ad1: {
          name: ad1?.name ?? 'Advertisement 1',
          description: ad1?.description ?? 'This is a test advertisement',
          type: ad1?.type ?? 'Popup Ad',
        },
        ad2: {
          updatedName: data.advertisements?.[1]?.name ?? 'Advertisement 2',
        },
        mockPresignedUrl: data.mockPresignedUrl ?? {
          presignedUrl: 'http://localhost:9000/talawa/test-upload',
          objectName: 'orgs/test-org/ads/default.png',
          requiresUpload: true,
        },
      };
    });
  });

  beforeEach(() => {
    // Mock Login
    cy.window().then((win) => {
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
    });

    // Single intercept that handles ALL GraphQL requests.
    // Unmatched operations get a safe empty response instead of hitting
    // the real backend (which would fail and hang the test).
    cy.intercept('POST', '**/graphql', (req) => {
      const opName: string = req.body.operationName ?? '';
      const responses = buildMockResponses(adData);

      // GetOrganizationData and GetOrganization share the same response
      const normalizedName =
        opName === 'GetOrganizationData' ? 'getOrganizationData' : opName;

      if (responses[normalizedName]) {
        req.reply(responses[normalizedName]);
      } else {
        // Catch-all: return empty data so the app doesn't crash
        req.reply({ data: {} });
      }
    });

    cy.visit(`/admin/orgdash/${orgId}`);
    // Wait for the sidebar navigation to be fully rendered before
    // interacting. The Advertisement link appearing proves the dashboard
    // and sidebar have loaded, Redux targets are set, and the component
    // tree is ready.
    cy.get('[data-cy="leftDrawerButton-Advertisement"]', {
      timeout: 30000,
    }).should('be.visible');
    adPage.visitAdvertisementPage();
  });

  it('create a new advertisement', () => {
    adPage.createAdvertisement(
      adData.ad1.name,
      adData.ad1.description,
      adData.ad1.type,
    );
  });

  it('create a new advertisement with file attachment', () => {
    adPage.createAdvertisementWithAttachment(
      `${adData.ad1.name} with attachment`,
      adData.ad1.description,
      adData.ad1.type,
      'advertisement_banner.png',
    );
  });

  it('shows the created advertisement under active campaigns and allows editing', () => {
    // Override the default empty list with one ad
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'OrganizationAdvertisements') {
        req.reply({
          data: {
            organization: {
              advertisements: {
                edges: [
                  {
                    node: {
                      id: 'ad-1',
                      name: adData.ad1.name,
                      description: adData.ad1.description,
                      type: adData.ad1.type,
                      startAt: new Date().toISOString(),
                      endAt: new Date().toISOString(),
                      organization: { id: orgId },
                      createdAt: new Date().toISOString(),
                      attachments: [],
                    },
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        });
      }
    });
    adPage.visitAdvertisementPage(); // Reload to get the list
    adPage.verifyAndEditAdvertisement(adData.ad1.name, adData.ad2.updatedName);
  });

  it('shows the updated advertisement under active campaigns and deletes it', () => {
    // Override with updated ad
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'OrganizationAdvertisements') {
        req.reply({
          data: {
            organization: {
              advertisements: {
                edges: [
                  {
                    node: {
                      id: 'ad-1',
                      name: adData.ad2.updatedName,
                      description: adData.ad1.description,
                      type: adData.ad1.type,
                      startAt: new Date().toISOString(),
                      endAt: new Date().toISOString(),
                      organization: { id: orgId },
                      createdAt: new Date().toISOString(),
                      attachments: [],
                    },
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        });
      }
    });
    adPage.visitAdvertisementPage();
    adPage.verifyAndDeleteAdvertisement(adData.ad2.updatedName);
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
