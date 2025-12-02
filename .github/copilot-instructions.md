# Talawa Admin - Copilot Instructions

## Project Overview

Talawa Admin is a **React 19 + TypeScript** web portal for managing non-profit organizations. It connects to [talawa-api](https://github.com/PalisadoesFoundation/talawa-api) via GraphQL.

## Architecture

### Directory Structure

- `src/screens/` - Full page views (e.g., `OrganizationDashboard`, `LoginPage`)
- `src/components/` - Reusable UI components (strictly functional, use React hooks)
- `src/GraphQl/Queries/` & `src/GraphQl/Mutations/` - All GraphQL operations
- `src/types/` - TypeScript interfaces organized by domain (Event, User, Organization, etc.)
- `src/state/` - Redux store with `@reduxjs/toolkit`
- `src/plugin/` - Microkernel plugin system for extensibility
- `src/utils/` - Utility functions (localStorage wrapper, i18n, validators)

### Key Patterns

**Component Structure:**

```tsx
// PascalCase for components and their files
// Co-located CSS modules: ComponentName.module.css
import styles from './ComponentName.module.css';

const ComponentName = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'componentKey' });
  // ...
};
```

**GraphQL Usage:**

```tsx
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_NAME } from 'GraphQl/Queries/Queries';

const { data, loading, error } = useQuery(QUERY_NAME, {
  variables: { id: orgId },
});
```

**LocalStorage (prefixed `Talawa-admin_`):**

```tsx
import useLocalStorage from 'utils/useLocalstorage';
const { getItem, setItem } = useLocalStorage();
const userId = getItem('id');
```

## Coding Conventions

### Naming

- **Interfaces**: Must start with `I` or `Interface` prefix (e.g., `IEvent`, `InterfaceIOrgList`)
- **Type aliases/Enums**: PascalCase (e.g., `UserRole`, `FilterPeriod`)
- **Type parameters**: Prefix with `T` (e.g., `TData`, `TVariables`)
- **Components/Files**: PascalCase for React components; camelCase for utilities

### Styling

- Use **CSS Modules** (`.module.css`) with `styles.className` syntax
- Leverage **React-Bootstrap** and **MUI** components - never plain Bootstrap classes
- Import Bootstrap utilities directly: `className={`${styles.custom} bg-danger`}`

### Internationalization

All user-facing strings must use i18n:

```tsx
const { t } = useTranslation('translation', { keyPrefix: 'screenName' });
const { t: tCommon } = useTranslation('common');
const { t: tErrors } = useTranslation('errors');
// Usage: t('keyName'), tCommon('save'), tErrors('networkError')
```

Translation files: `public/locales/{lang}/translation.json`, `common.json`, `errors.json`

### TypeScript

- `strict: true` is enforced - no `any` types allowed
- All functions should have explicit return types
- Use absolute imports from `src/` (configured in tsconfig: `baseUrl: "src"`)

## Testing

### Unit Tests (Vitest + React Testing Library)

```bash
pnpm test              # Run all tests
pnpm test:watch        # Interactive mode with UI
pnpm test:coverage     # With coverage report
```

**Test file pattern:** `ComponentName.spec.tsx` co-located with component

**Test structure:**

```tsx
import { MockedProvider } from '@apollo/react-testing';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [{ request: { query: QUERY }, result: { data: {...} } }];
const link = new StaticMockLink(MOCKS, true);

render(
  <MockedProvider link={link} addTypename={false}>
    <I18nextProvider i18n={i18nForTest}>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </I18nextProvider>
  </MockedProvider>
);
```

### E2E Tests (Cypress)

```bash
pnpm cypress:open      # Interactive mode
pnpm cypress:run       # Headless
```

Tests in `cypress/e2e/`, page objects in `cypress/pageObjects/`

## Commands Reference

```bash
pnpm serve             # Start dev server (port 4321)
pnpm build             # Production build
pnpm lint:fix          # Fix ESLint issues
pnpm format:fix        # Fix Prettier formatting
pnpm typecheck         # TypeScript validation
pnpm generate-docs     # Generate TypeDoc documentation
```

## TSDoc Requirements

Every component/function needs TSDoc comments. AI tools rely on these for understanding:

````tsx
/**
 * Brief description of the component.
 * @param props - Component props
 * @returns The rendered component
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
````

## Environment

- **Node.js 24+** required (enforced in `package.json`)
- **pnpm** as package manager (version 10.4.1)
- Environment variables: `REACT_APP_TALAWA_URL`, `REACT_APP_RECAPTCHA_SITE_KEY`
