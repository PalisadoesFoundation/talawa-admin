import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MemberDetail from './MemberDetail';
import { ReactNode } from 'react';

/* -------------------- mocks -------------------- */

// mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// mock MUI LocalizationProvider
vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual<typeof import('@mui/x-date-pickers')>(
    '@mui/x-date-pickers',
  );

  return {
    ...actual,
    LocalizationProvider: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: vi.fn(),
}));

// mock child components
vi.mock('./UserContactDetails', () => ({
  default: ({ id }: { id?: string }) => (
    <div data-testid="user-contact-details">{id}</div>
  ),
}));

vi.mock('components/UserDetails/UserOrganizations', () => ({
  default: () => <div data-testid="user-organizations" />,
}));

vi.mock('components/UserDetails/UserEvents', () => ({
  default: () => <div data-testid="user-events" />,
}));

vi.mock('components/UserDetails/UserTags', () => ({
  default: () => <div data-testid="user-tags" />,
}));

// ✅ FIXED mock path (THIS was the bug)
vi.mock('shared-components/PeopleTabNavButton/PeopleTabNavButton', () => ({
  default: ({
    title,
    action,
    isActive,
  }: {
    title: string;
    action: () => void;
    isActive: boolean;
  }) => (
    <button
      data-testid={`tab-${title}`}
      data-active={isActive}
      onClick={action}
    >
      {title}
    </button>
  ),
}));

/* -------------------- tests -------------------- */

describe('MemberDetail', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders overview tab by default', () => {
    render(<MemberDetail id="123" />);

    expect(screen.getByTestId('tab-overview')).toBeInTheDocument();
    expect(screen.getByTestId('user-contact-details')).toHaveTextContent('123');
    expect(screen.getByTestId('tab-overview')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('switches to organizations tab', () => {
    render(<MemberDetail />);

    fireEvent.click(screen.getByTestId('tab-organizations'));

    expect(screen.getByTestId('user-organizations')).toBeInTheDocument();
    expect(screen.getByTestId('tab-organizations')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('switches to tags tab', () => {
    render(<MemberDetail />);

    fireEvent.click(screen.getByTestId('tab-tags'));

    expect(screen.getByTestId('user-tags')).toBeInTheDocument();
  });

  it('switches to events tab', () => {
    render(<MemberDetail />);

    fireEvent.click(screen.getByTestId('tab-events'));

    expect(screen.getByTestId('user-events')).toBeInTheDocument();
    expect(screen.getByTestId('tab-events')).toHaveAttribute(
      'data-active',
      'true',
    );
  });
});
