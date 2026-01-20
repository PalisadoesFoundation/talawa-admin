import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { PeoplePage } from '../../pageObjects/AdminPortal/PeoplePage';

const dashboard = new AdminDashboardPage();
const peoplePage = new PeoplePage();

describe('Admin People Tab', () => {
  beforeEach(() => {
    // Mock GraphQL Backend
    cy.intercept('POST', '**/graphql', (req) => {
      const { operationName } = req.body;

      if (operationName === 'SignIn') {
        req.alias = 'signInRequest';
        req.reply({
          data: {
            signIn: {
              user: {
                id: '123',
                name: 'Test Admin',
                emailAddress: 'admin@example.com',
                role: 'administrator',
              },
              accessToken: 'mock-token',
              refreshToken: 'mock-refresh',
            },
          },
        });
      }

      if (operationName === 'CurrentUser') {
        req.reply({
          data: {
            user: {
              id: '123',
              name: 'Test Admin',
              emailAddress: 'admin@example.com',
              role: 'administrator',
              isAdmin: true,
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              postalCode: '',
              countryCode: '',
              avatarURL: '',
              createdAt: new Date().toISOString(),
              firstName: 'Test',
              lastName: 'Admin',
              isEmailAddressVerified: true,
              eventsAttended: [],
            },
          },
        });
      }

      if (operationName === 'OrganizationFilterList') {
        req.reply({
          data: {
            organizations: [
              {
                id: 'org-1',
                name: 'Test Org',
                isMember: true,
                membersCount: 10,
                adminsCount: 2,
                description: 'Description',
                addressLine1: 'Address',
                avatarURL: '',
                createdAt: new Date().toISOString(),
              },
            ],
          },
        });
      }

      if (operationName === 'GetOrganizationMembers') {
        req.alias = 'getMembers';
        req.reply({
          data: {
            organization: {
              members: {
                edges: [
                  {
                    node: {
                      id: 'u1',
                      name: 'Wilt Shepherd',
                      role: 'user',
                      emailAddress: 'wilt@test.com',
                      createdAt: new Date().toISOString(),
                      avatarURL: null,
                    },
                  },
                  {
                    node: {
                      id: 'u2',
                      name: 'administrator',
                      role: 'admin',
                      emailAddress: 'admin@test.com',
                      createdAt: new Date().toISOString(),
                      avatarURL: null,
                    },
                  },
                  {
                    node: {
                      id: 'u3',
                      name: 'Praise Norris',
                      role: 'user',
                      emailAddress: 'praise@test.com',
                      createdAt: new Date().toISOString(),
                      avatarURL: null,
                    },
                  },
                ],
                pageInfo: { hasNextPage: false, endCursor: 'end' },
              },
            },
          },
        });
      }

      if (operationName === 'allUsers') {
        req.alias = 'getAllUsers';
        req.reply({
          data: {
            allUsers: {
              edges: [
                {
                  node: {
                    id: 'u3',
                    name: 'Praise Norris',
                    role: 'user',
                    emailAddress: 'praise@test.com',
                    avatarURL: null,
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false },
            },
          },
        });
      }

      if (operationName === 'CreateOrganizationMembership') {
        req.alias = 'createMembership';
        req.reply({
          data: {
            createOrganizationMembership: {
              id: 'new-membership-id',
            },
          },
        });
      }

      if (operationName === 'RemoveMember') {
        req.alias = 'removeMember';
        req.reply({
          data: {
            deleteOrganizationMembership: {
              id: 'deleted-membership-id',
            },
          },
        });
      }
    });

    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    peoplePage.visitPeoplePage();
    cy.wait('@getMembers'); // Wait for initial list load
  });

  it('should search a particular member and then reset to all members', () => {
    peoplePage
      .searchMemberByName('Wilt Shepherd')
      .verifyMemberInList('Wilt Shepherd');
    peoplePage.resetSearch();
    peoplePage
      .verifyMemberInList('Wilt Shepherd')
      .verifyMemberInList('administrator');
  });

  it('add an existing member to the organization', () => {
    const member = 'Praise Norris';
    peoplePage.clickAddExistingMember();
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'allUsers') {
        req.alias = 'userSearch';
      }
    });
    peoplePage.searchAndSelectUser(member);
    peoplePage.confirmAddUser(member);
    cy.wait('@createMembership'); // Wait for mutation
  });

  it('delete a member from the organization', () => {
    peoplePage.deleteMember('Praise Norris');
    // deleteMember triggers RemoveMember mutation
    cy.wait('@removeMember');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
