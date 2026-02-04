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

Note: Always clean up mocks after each test. See
`docs/docs/docs/developer-resources/e2e-testing.md#mock-cleanup-and-test-isolation`
to prevent test flakiness in parallel/sharded runs.

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
