# Cypress End-to-End Testing

Documentation on how to run cypress end to end testing can be found either:

1. [Online](https://docs-admin.talawa.io/docs/developer-resources/e2e-testing) or,
2. [Locally](../docs/docs/docs/developer-resources/e2e-testing.md)

## Fixture Library

Fixtures live under `cypress/fixtures/` and are organized by domain for
consistency and reuse:

- `auth/` - credential and user fixtures for login flows
- `admin/` - organizations, events, people, action items, advertisements, tags,
  venues
- `user/` - posts, volunteers, campaigns, donations
- `api/graphql/` - GraphQL responses grouped by operationName

Datasets are intentionally minimal, include edge cases (empty arrays, long names,
Unicode), and avoid PII.

### Using fixtures with GraphQL utilities

```ts
cy.mockGraphQLOperation(
  'OrganizationListBasic',
  'api/graphql/organizations.success.json',
);

cy.mockGraphQLOperation(
  'CreateOrganization',
  'api/graphql/createOrganization.success.json',
);

cy.mockGraphQLOperation(
  'CreateOrganization',
  'api/graphql/createOrganization.error.conflict.json',
);
```

#### Mock cleanup and test isolation

Because `testIsolation` is set to `false`, Cypress intercepts can persist
between tests in the same spec. Always clear GraphQL mocks after each test to
avoid leaking intercepts across tests or shards:

```ts
afterEach(() => {
  cy.clearAllGraphQLMocks();
});
```

If multiple tests in the same spec target the same operationName, explicitly
clean up at the end of each test:

```ts
it('mocks a successful query', () => {
  cy.mockGraphQLOperation(
    'OrganizationListBasic',
    'api/graphql/organizations.success.json',
  );
  // test steps...
  cy.clearAllGraphQLMocks();
});
```

Best practices:

- Prefer `testIsolation: true` for new specs when possible.
- In parallel/sharded runs, mocks can race if not cleared; keep mocks scoped per
  test and always reset intercepts after each test.
- If multiple mocks target the same operation, ensure explicit cleanup between
  them or scope each mock to a single test to avoid collisions.

### Auth fixtures

`auth/users.json` contains user metadata (id, name, email, role). Use
`auth/credentials.json` for login/passwords:

```ts
cy.fixture('auth/credentials').then((users) => {
  const admin = users.admin;
  // admin.email + admin.password
});
```

### Using JSON fixtures directly

```ts
cy.fixture('admin/organizations').then((data) => {
  expect(data.organizations).to.have.length(2);
});
```
