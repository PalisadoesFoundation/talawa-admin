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

describe('Testing Admin Advertisement Management', () => {
  const adPage = new AdvertisementPage();
  let adData: InterfaceAdvertisementData;
  const orgId = '12345';
  const userId = 'user-123';

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

    // Mock CurrentUser
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CurrentUser') {
        req.reply({
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
        });
      }
      // Mock OrganizationAdvertisements Query
      if (req.body.operationName === 'OrganizationAdvertisements') {
        req.reply({
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
        });
      }
      // Mock mutations response default success
      if (req.body.operationName === 'AddAdvertisement') {
        req.reply({
          data: {
            createAdvertisement: {
              id: 'new-ad-id',
            },
          },
        });
      }
      if (req.body.operationName === 'UpdateAdvertisement') {
        req.reply({
          data: {
            updateAdvertisement: {
              id: 'new-ad-id',
            },
          },
        });
      }
      if (req.body.operationName === 'DeleteAdvertisement') {
        req.reply({
          data: {
            deleteAdvertisement: {
              id: 'new-ad-id',
            },
          },
        });
      }
      if (req.body.operationName === 'UserJoinedOrganizations') {
        req.reply({
          data: {
            user: {
              organizationsWhereMember: {
                edges: [
                  {
                    node: {
                      id: orgId,
                      name: 'Test Org',
                      addressLine1: 'Test Address',
                      description: 'Test Description',
                      avatarURL: null,
                      membersCount: 1,
                      adminsCount: 1,
                      createdAt: '2023-01-01T00:00:00.000Z',
                    },
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                },
              },
            },
          },
        });
      }
      if (req.body.operationName === 'OrganizationMemberAdminCounts') {
        req.reply({
          data: {
            organization: { id: orgId, membersCount: 1, adminsCount: 1 },
          },
        });
      }
      if (req.body.operationName === 'getOrganizationPostsCount') {
        req.reply({ data: { organization: { id: orgId, postsCount: 0 } } });
      }
      if (req.body.operationName === 'GetOrganizationEvents') {
        req.reply({
          data: {
            organization: {
              eventsCount: 0,
              events: {
                edges: [],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
            },
          },
        });
      }
      if (req.body.operationName === 'GetOrganizationPosts') {
        req.reply({ data: { organization: { posts: { edges: [] } } } });
      }
      if (req.body.operationName === 'GetBlockedUsersCount') {
        req.reply({
          data: { organization: { id: orgId, blockedUsersCount: 0 } },
        });
      }
      if (req.body.operationName === 'GetVenuesCount') {
        req.reply({ data: { organization: { id: orgId, venuesCount: 0 } } });
      }
      if (req.body.operationName === 'Organization') {
        req.reply({
          data: { organization: { id: orgId, membershipRequests: [] } },
        });
      }

      // Mock Organization Query (for Dashboard)
      if (
        req.body.operationName === 'GetOrganization' ||
        req.body.operationName === 'GetOrganizationData'
      ) {
        req.reply({
          data: {
            organization: {
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
                pageInfo: {
                  hasNextPage: false,
                  endCursor: null,
                },
              },
              blockedUsers: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: null,
                },
              },
              events: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: null,
                },
              },
            },
          },
        });
      }

      if (req.body.operationName === 'createPresignedUrl') {
        req.reply({
          data: {
            createPresignedUrl: adData.mockPresignedUrl,
          },
        });
      }
    });

    cy.visit(`/admin/orgdash/${orgId}`);
    adPage.visitAdvertisementPage();
  });

  it('create a new advertisement', () => {
    // Spy on the mutation to verify it was called
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'AddAdvertisement') {
        req.alias = 'createAd';
        req.reply({
          data: { createAdvertisement: { id: 'new-ad-id' } },
        });
      }
    });

    adPage.createAdvertisement(
      adData.ad1.name,
      adData.ad1.description,
      adData.ad1.type,
    );
    cy.wait('@createAd');
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
    // Mock list with one ad
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
    // Mock list with updated ad
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
