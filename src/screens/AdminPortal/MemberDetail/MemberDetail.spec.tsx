import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemberDetail from './MemberDetail';
import { ReactNode } from 'react';

/* -------------------- mocks -------------------- */

// mock react-router params - default mock
const mockUseParams = vi.fn((): { userId?: string } => ({
  userId: '123',
}));

const mockGetItem = vi.fn().mockReturnValue(null);
// Explicit null default for clarity
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
  }),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}));

// mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// mock LocalizationProvider (your shared wrapper)
vi.mock('shared-components/DateRangePicker', () => ({
  LocalizationProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
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
  default: ({ id }: { id?: string }) => <div data-testid="user-tags">{id}</div>,
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
        type="button"
        data-testid={`tab-${title}`}
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
    vi.restoreAllMocks();
    cleanup();
    mockGetItem.mockReturnValue(null);
  });

  it('renders noUserId message when userId is not provided', () => {
    // Override the mock to return no userId
    mockUseParams.mockReturnValueOnce({
      userId: undefined,
    });

    mockGetItem.mockReturnValueOnce(null).mockReturnValueOnce(null);
    render(<MemberDetail />);

    // Should render the noUserId message
    expect(screen.getByText('noUserId')).toBeInTheDocument();

    // Should NOT render any tabs or content
    expect(screen.queryByTestId('tab-overview')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('user-contact-details'),
    ).not.toBeInTheDocument();
  });

  it('renders overview tab by default with userId from route', () => {
    render(<MemberDetail />);

    expect(screen.getByTestId('tab-overview')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByTestId('user-contact-details')).toHaveTextContent('123');
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

  it('switches to events tab', async () => {
    render(<MemberDetail />);

    await userEvent.click(screen.getByTestId('tab-events'));

    expect(screen.getByTestId('user-events')).toBeInTheDocument();
    expect(screen.getByTestId('tab-events')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('switches to tags tab and passes userId', async () => {
    render(<MemberDetail />);

    await userEvent.click(screen.getByTestId('tab-tags'));

    expect(screen.getByTestId('user-tags')).toHaveTextContent('123');
    expect(screen.getByTestId('tab-tags')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('switches back to overview tab', async () => {
    render(<MemberDetail />);

    await userEvent.click(screen.getByTestId('tab-events'));
    expect(screen.getByTestId('user-events')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('tab-overview'));
    expect(screen.getByTestId('user-contact-details')).toHaveTextContent('123');
    expect(screen.getByTestId('tab-overview')).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('falls back to localStorage userId when URL param is missing', () => {
    mockUseParams.mockReturnValueOnce({
      userId: undefined,
    });

    // first call -> getItem('id') -> null
    // second call -> getItem('userId') -> 999
    mockGetItem.mockReturnValueOnce(null).mockReturnValueOnce('999');

    render(<MemberDetail />);

    expect(screen.getByTestId('user-contact-details')).toHaveTextContent('999');
  });

  it('falls back to admin id when param missing', () => {
    mockUseParams.mockReturnValueOnce({
      userId: undefined,
    });

    // getItem('id') -> 777
    mockGetItem.mockReturnValueOnce('777');

    render(<MemberDetail />);

    expect(screen.getByTestId('user-contact-details')).toHaveTextContent('777');
  });
});
