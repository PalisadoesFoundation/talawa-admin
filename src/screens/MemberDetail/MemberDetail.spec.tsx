import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

vi.mock(
  'shared-components/PeopleTabNavbarButton/PeopleTabNavbarButton',
  () => ({
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
        type="button"
        data-active={isActive}
        onClick={action}
      >
        {title}
      </button>
    ),
  }),
);

/* -------------------- tests -------------------- */

describe('MemberDetail', () => {
  afterEach(() => {
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

  it('switches to organizations tab', async () => {
    render(<MemberDetail />);

    await userEvent.click(screen.getByTestId('tab-organizations'));

    expect(screen.getByTestId('user-organizations')).toBeInTheDocument();
    expect(screen.getByTestId('tab-organizations')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('switches to tags tab', async () => {
    render(<MemberDetail />);

    await userEvent.click(screen.getByTestId('tab-tags'));

    expect(screen.getByTestId('user-tags')).toBeInTheDocument();
  });

  it('switches to events tab', async () => {
    render(<MemberDetail />);

    await userEvent.click(screen.getByTestId('tab-events'));

    expect(screen.getByTestId('user-events')).toBeInTheDocument();
    expect(screen.getByTestId('tab-events')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('switches back to overview tab when overview button is clicked', async () => {
    render(<MemberDetail id="123" />);

    // Step 1: switch away from overview
    await userEvent.click(screen.getByTestId('tab-events'));
    expect(screen.getByTestId('user-events')).toBeInTheDocument();

    // Step 2: click overview tab
    await userEvent.click(screen.getByTestId('tab-overview'));

    // Step 3: overview content is rendered again
    expect(screen.getByTestId('user-contact-details')).toHaveTextContent('123');

    // Step 4: overview tab is active
    expect(screen.getByTestId('tab-overview')).toHaveAttribute(
      'data-active',
      'true',
    );
  });
});
