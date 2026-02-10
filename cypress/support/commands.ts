/// <reference types="cypress" />
import { getApiPattern } from './graphql-utils';

export {};

type AuthRole = 'superAdmin' | 'admin' | 'user';

type AuthOptions = {
  role?: AuthRole;
  email?: string;
  password?: string;
  token?: string;
  userId?: string;
  apiUrl?: string;
  recaptchaToken?: string;
};

type SetupTestEnvironmentOptions = {
  orgName?: string;
  description?: string;
  auth?: AuthOptions;
};

type CreateTestOrganizationPayload = {
  name: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  isUserRegistrationRequired?: boolean;
  auth?: AuthOptions;
};

type SeedEventPayload = {
  orgId: string;
  name?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  isPublic?: boolean;
  isRegisterable?: boolean;
  auth?: AuthOptions;
};

type SeedUserDetails = {
  name?: string;
  email?: string;
  password?: string;
  role?: 'administrator' | 'regular';
  isEmailAddressVerified?: boolean;
};

type SeedUserPayload = SeedUserDetails & {
  auth?: AuthOptions;
};

type SeedVolunteerPayload = {
  eventId: string;
  userId?: string;
  user?: SeedUserDetails;
  auth?: AuthOptions;
  userAuth?: AuthOptions;
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  recurringEventInstanceId?: string;
};

type SeedPostPayload = {
  orgId: string;
  caption?: string;
  body?: string;
  isPinned?: boolean;
  auth?: AuthOptions;
};

type CleanupTestOrganizationOptions = {
  auth?: AuthOptions;
  userIds?: string[];
  allowNotFound?: boolean;
};

type SignInTaskResult = { token: string; userId: string };
type AuthSession = { token: string; userId?: string };
type CreateOrganizationTaskResult = { orgId: string };
type CreateEventTaskResult = { eventId: string };
type CreateUserTaskResult = {
  userId: string;
  authenticationToken?: string;
};
type CreateVolunteerTaskResult = { volunteerId: string };
type CreatePostTaskResult = { postId: string };

type CredentialRecord = { email: string; password: string };
type CredentialFixture = Record<AuthRole, CredentialRecord>;

const DEFAULT_TEST_PASSWORD = 'Pass@123';

const roleToEnvKey = (
  role: AuthRole,
): { emailKey: string; passwordKey: string } => {
  switch (role) {
    case 'superAdmin':
      return {
        emailKey: 'E2E_SUPERADMIN_EMAIL',
        passwordKey: 'E2E_SUPERADMIN_PASSWORD',
      };
    case 'user':
      return { emailKey: 'E2E_USER_EMAIL', passwordKey: 'E2E_USER_PASSWORD' };
    case 'admin':
      return { emailKey: 'E2E_ADMIN_EMAIL', passwordKey: 'E2E_ADMIN_PASSWORD' };
    default:
      throw new Error(`Unknown AuthRole: ${role}`);
  }
};

const normalizeAuthRole = (role: string): AuthRole => {
  if (role === 'superadmin') return 'superAdmin';
  if (role === 'admin' || role === 'user' || role === 'superAdmin') {
    return role;
  }
  throw new Error(
    `Unknown auth role "${role}". Expected "admin", "user", or "superAdmin".`,
  );
};

const resolveCredentials = (
  role: AuthRole,
  overrides?: Partial<CredentialRecord>,
): Cypress.Chainable<CredentialRecord> => {
  if (overrides?.email && overrides?.password) {
    return cy.wrap({ email: overrides.email, password: overrides.password });
  }

  const { emailKey, passwordKey } = roleToEnvKey(role);
  const envEmail = Cypress.env(emailKey) as string | undefined;
  const envPassword = Cypress.env(passwordKey) as string | undefined;
  if (envEmail && envPassword) {
    return cy.wrap({ email: envEmail, password: envPassword });
  }

  return cy
    .fixture('auth/credentials')
    .then((credentials: CredentialFixture) => {
      const user = credentials[role];
      if (!user) {
        throw new Error(
          `User role "${role}" not found in auth/credentials fixture`,
        );
      }
      return user;
    });
};

const resolveAuthSession = (
  auth?: AuthOptions,
): Cypress.Chainable<AuthSession> => {
  if (auth?.token) {
    return cy.wrap({ token: auth.token, userId: auth.userId }, { log: false });
  }
  // resolveAuthSession defaults role to 'admin' unless auth.role overrides it.
  const role = auth?.role ?? 'admin';
  return resolveCredentials(role, auth).then((credentials) => {
    return cy
      .task('gqlSignIn', {
        apiUrl: auth?.apiUrl,
        email: credentials.email,
        password: credentials.password,
        recaptchaToken: auth?.recaptchaToken,
      })
      .then((result) => {
        const { token, userId } = result as SignInTaskResult;
        if (!token) {
          throw new Error('SignIn task failed to return a token.');
        }
        return { token, userId };
      });
  });
};

const resolveAuthToken = (auth?: AuthOptions): Cypress.Chainable<string> =>
  resolveAuthSession(auth).then((session) => session.token);

const getSecureRandomSuffix = (length = 8): string => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, length);
  }

  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  }

  return String(Date.now()).slice(0, length);
};

const makeUniqueLabel = (prefix: string): string => {
  const suffix = `${Date.now()}-${getSecureRandomSuffix(8)}`;
  return `${prefix} ${suffix}`;
};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * @param role - The user role (e.g., 'superadmin', 'admin', 'user')
       */
      loginByApi(role: string): Chainable<Subject>;
      /**
       * @param expectedMessage - The expected text (string or RegExp)
       */
      assertToast(expectedMessage: string | RegExp): Chainable<void>;
      /**
       * Reset GraphQL intercepts back to pass-through behavior.
       * @returns Chainable
       */
      clearAllGraphQLMocks(): Chainable<Subject>;
      setupTestEnvironment(
        options?: SetupTestEnvironmentOptions,
      ): Chainable<{ orgId: string }>;
      createTestOrganization(
        payload: CreateTestOrganizationPayload,
      ): Chainable<{ orgId: string }>;
      seedTestData(
        kind: 'events',
        payload: SeedEventPayload,
      ): Chainable<{ eventId: string }>;
      seedTestData(
        kind: 'volunteers',
        payload: SeedVolunteerPayload,
      ): Chainable<{
        volunteerId: string;
        userId?: string;
        email?: string;
        password?: string;
      }>;
      seedTestData(
        kind: 'posts',
        payload: SeedPostPayload,
      ): Chainable<{ postId: string }>;
      cleanupTestOrganization(
        orgId: string,
        options?: CleanupTestOrganizationOptions,
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginByApi', (role: string) => {
  const resolvedRole = normalizeAuthRole(role);
  const sessionName = `login-${resolvedRole}`;
  const loginPath = resolvedRole === 'user' ? '/' : '/admin';
  const currentUserQuery = `
    query CurrentUser {
      currentUser {
        id
      }
    }
  `;
  const storagePrefix = 'Talawa-admin';
  const setAuthStorage = (
    win: Window,
    token: string,
    userId?: string,
  ): void => {
    const setItem = (key: string, value: unknown) => {
      win.localStorage.setItem(
        `${storagePrefix}_${key}`,
        JSON.stringify(value),
      );
    };
    setItem('token', token);
    if (userId) {
      setItem('userId', userId);
      setItem('id', userId);
    }
    setItem('IsLoggedIn', 'TRUE');
  };

  return cy.session(
    sessionName,
    () => {
      resolveCredentials(resolvedRole).then((user) => {
        const apiUrl =
          (Cypress.env('apiUrl') as string | undefined) ||
          'http://localhost:4000/graphql';

        return cy
          .task('gqlSignIn', {
            apiUrl,
            email: user.email,
            password: user.password,
          })
          .then((result) => {
            const { token, userId } = result as SignInTaskResult;
            if (!token) {
              const { emailKey, passwordKey } = roleToEnvKey(resolvedRole);
              throw new Error(
                `Login failed: SignIn did not return a token. Verify credentials for role "${resolvedRole}" via ${emailKey}/${passwordKey} or cypress/fixtures/auth/credentials.json.`,
              );
            }

            cy.visit(loginPath, {
              onBeforeLoad(win) {
                setAuthStorage(win, token, userId);
              },
            });

            return cy
              .request({
                method: 'POST',
                url: apiUrl,
                headers: {
                  authorization: `Bearer ${token}`,
                },
                body: {
                  query: currentUserQuery,
                },
              })
              .then((response) => {
                if (response.status !== 200) {
                  throw new Error(
                    `Login health check failed with status ${response.status}.`,
                  );
                }
                const currentUserId =
                  response.body?.data?.currentUser?.id ||
                  response.body?.data?.user?.id;
                if (!currentUserId) {
                  throw new Error(
                    'Login health check failed: currentUser is missing.',
                  );
                }
              });
          });
      });
    },
    { cacheAcrossSpecs: true },
  );
});

Cypress.Commands.add('assertToast', (expectedMessage: string | RegExp) => {
  cy.get('.Toastify__toast', { timeout: 5000 })
    .should('be.visible')
    .and('contain.text', expectedMessage);
});

Cypress.Commands.add('clearAllGraphQLMocks', () => {
  cy.intercept('POST', getApiPattern(), (req) => {
    req.continue();
  });
});

Cypress.Commands.add(
  'setupTestEnvironment',
  (options: SetupTestEnvironmentOptions = {}) => {
    const orgName = options.orgName || makeUniqueLabel('E2E Org');
    return cy
      .createTestOrganization({
        name: orgName,
        description: options.description ?? 'E2E organization',
        auth: options.auth,
      })
      .then(({ orgId }) => ({ orgId }));
  },
);

Cypress.Commands.add(
  'createTestOrganization',
  (payload: CreateTestOrganizationPayload) => {
    return resolveAuthSession(payload.auth).then(({ token, userId }) => {
      return cy
        .task('createTestOrganization', {
          apiUrl: payload.auth?.apiUrl,
          token,
          input: {
            name: payload.name,
            description: payload.description ?? 'E2E organization',
            addressLine1: payload.addressLine1,
            addressLine2: payload.addressLine2,
            city: payload.city,
            state: payload.state,
            postalCode: payload.postalCode,
            countryCode: payload.countryCode,
            isUserRegistrationRequired: payload.isUserRegistrationRequired,
          },
        })
        .then((result) => {
          const { orgId } = result as CreateOrganizationTaskResult;
          if (!orgId) {
            throw new Error('createTestOrganization did not return orgId.');
          }
          if (!userId) {
            return { orgId };
          }
          return resolveAuthToken({
            role: 'superAdmin',
            apiUrl: payload.auth?.apiUrl,
          }).then((membershipToken) => {
            return cy
              .task('createOrganizationMembership', {
                apiUrl: payload.auth?.apiUrl,
                token: membershipToken,
                input: {
                  memberId: userId,
                  organizationId: orgId,
                  role: 'administrator',
                },
              })
              .then(() => ({ orgId }));
          });
        });
    });
  },
);

Cypress.Commands.add(
  'seedTestData',
  (
    kind: 'events' | 'volunteers' | 'posts',
    payload: SeedEventPayload | SeedVolunteerPayload | SeedPostPayload,
  ) => {
    if (kind === 'events') {
      const eventPayload = payload as SeedEventPayload;
      const startAt = eventPayload.startAt ?? new Date().toISOString();
      const endAt =
        eventPayload.endAt ??
        new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const name = eventPayload.name || makeUniqueLabel('E2E Event');
      return resolveAuthToken(eventPayload.auth).then((token) => {
        return cy
          .task('createTestEvent', {
            apiUrl: eventPayload.auth?.apiUrl,
            token,
            input: {
              name,
              description: eventPayload.description ?? 'E2E event',
              organizationId: eventPayload.orgId,
              startAt,
              endAt,
              location: eventPayload.location ?? 'Virtual',
              isPublic: eventPayload.isPublic ?? true,
              isRegisterable: eventPayload.isRegisterable ?? true,
            },
          })
          .then((result) => {
            const { eventId } = result as CreateEventTaskResult;
            if (!eventId) {
              throw new Error('seedTestData(events) did not return eventId.');
            }
            return { eventId };
          });
      });
    }

    const createSeedUser = (userPayload: SeedUserPayload) => {
      const email =
        userPayload.email ||
        `e2e-user-${Date.now()}-${getSecureRandomSuffix(8)}@example.com`;
      const password = userPayload.password || DEFAULT_TEST_PASSWORD;
      const name = userPayload.name || makeUniqueLabel('E2E User');
      const role = userPayload.role ?? 'regular';
      return resolveAuthToken({ role: 'superAdmin', ...userPayload.auth }).then(
        (token) => {
          return cy
            .task('createTestUser', {
              apiUrl: userPayload.auth?.apiUrl,
              token,
              input: {
                name,
                emailAddress: email,
                password,
                role,
                isEmailAddressVerified:
                  userPayload.isEmailAddressVerified ?? true,
              },
            })
            .then((result) => {
              const { userId } = result as CreateUserTaskResult;
              if (!userId) {
                throw new Error('createTestUser did not return userId.');
              }
              return { userId, email, password };
            });
        },
      );
    };

    if (kind === 'posts') {
      const postPayload = payload as SeedPostPayload;
      const caption = postPayload.caption || makeUniqueLabel('E2E Post');
      const body = postPayload.body ?? 'E2E post body';
      const isPinned = postPayload.isPinned ?? false;
      return resolveAuthToken(postPayload.auth).then((token) => {
        return cy
          .task('createTestPost', {
            apiUrl: postPayload.auth?.apiUrl,
            token,
            input: {
              caption,
              body,
              organizationId: postPayload.orgId,
              isPinned,
            },
          })
          .then((result) => {
            const { postId } = result as CreatePostTaskResult;
            if (!postId) {
              throw new Error('seedTestData(posts) did not return postId.');
            }
            return { postId };
          });
      });
    }

    const volunteerPayload = payload as SeedVolunteerPayload;
    const userChain = volunteerPayload.userId
      ? cy.wrap({
          userId: volunteerPayload.userId,
          email: undefined,
          password: undefined,
        })
      : createSeedUser({
          ...(volunteerPayload.user ?? {}),
          auth: volunteerPayload.userAuth,
        });

    return userChain.then(({ userId, email, password }) => {
      if (!userId) {
        throw new Error('seedTestData(volunteers) missing userId.');
      }
      return resolveAuthToken(volunteerPayload.auth).then((token) => {
        return cy
          .task('createTestVolunteer', {
            apiUrl: volunteerPayload.auth?.apiUrl,
            token,
            input: {
              eventId: volunteerPayload.eventId,
              userId,
              scope: volunteerPayload.scope,
              recurringEventInstanceId:
                volunteerPayload.recurringEventInstanceId,
            },
          })
          .then((result) => {
            const { volunteerId } = result as CreateVolunteerTaskResult;
            if (!volunteerId) {
              throw new Error(
                'seedTestData(volunteers) did not return volunteerId.',
              );
            }
            return { volunteerId, userId, email, password };
          });
      });
    });
  },
);

Cypress.Commands.add(
  'cleanupTestOrganization',
  (orgId: string, options: CleanupTestOrganizationOptions = {}) => {
    return resolveAuthToken(options.auth).then((token) => {
      const apiUrl = options.auth?.apiUrl;
      return cy
        .task('deleteTestOrganization', {
          apiUrl,
          token,
          orgId,
          allowNotFound: options.allowNotFound ?? true,
        })
        .then(() => {
          const userIds = options.userIds ?? [];
          if (userIds.length === 0) {
            return undefined;
          }
          return cy.wrap(userIds).each((userId) => {
            return cy.task('deleteTestUser', {
              apiUrl,
              token,
              userId,
              allowNotFound: true,
            });
          });
        });
    });
  },
);
