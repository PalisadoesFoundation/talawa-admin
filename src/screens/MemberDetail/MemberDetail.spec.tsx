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

// mock navbar button
vi.mock('shared-components/PeopleTab/PeopleTabNavbarButton', () => ({
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

    expect(educationDropdownBtn).toBeInTheDocument();

    // Test initial mock data has grade_8 which displays as "Grade-8"
    expect(educationDropdownBtn).toHaveTextContent('Grade-8');

    // Click the dropdown button to open it
    await userEvent.click(educationDropdownBtn);

    expect(
      screen.getByTestId('educationgrade-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options
    const option = screen.getByTestId('change-educationgrade-btn-kg'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(educationDropdownBtn).toHaveTextContent('Kg');

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

  it('switches to events tab', () => {
    render(<MemberDetail />);

    expect(employmentStatus).toBeInTheDocument();

    // Test initial state
    expect(employmentStatus).toHaveTextContent('None'); // Or whatever your initial value is

    // Click the dropdown button to open it
    await userEvent.click(employmentStatus);

    expect(
      screen.getByTestId('employmentstatus-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options
    const option = screen.getByTestId('change-employmentstatus-btn-full_time'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(employmentStatus).toHaveTextContent('Full-Time');
  });

  test('renders maritial status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('maritalstatus-dropdown-container'),
    ).toBeInTheDocument();

    // Find the dropdown by the fieldName from DynamicDropDown props
    const maritialStatus = screen.getByTestId('maritalstatus-dropdown-btn');
    expect(maritialStatus).toBeInTheDocument();

    // Test initial mock data has engaged which displays as "Engaged"
    expect(maritialStatus).toHaveTextContent('Engaged');

    // Click the dropdown button to open it
    await userEvent.click(maritialStatus);

    expect(
      screen.getByTestId('maritalstatus-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options
    const option = screen.getByTestId('change-maritalstatus-btn-single');
    await userEvent.click(option);

    // Verify the selection was made
    expect(maritialStatus).toHaveTextContent('Single');
  });

  test('renders gender status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('natalsex-dropdown-container'),
    ).toBeInTheDocument();

    // Find the dropdown by the fieldName from DynamicDropDown props
    const natalSexStatus = screen.getByTestId('natalsex-dropdown-btn');
    expect(natalSexStatus).toBeInTheDocument();

    // Test initial mock data has male which displays as "Male"
    expect(natalSexStatus).toHaveTextContent('Male');

    // Click the dropdown button to open it
    await userEvent.click(natalSexStatus);

    expect(screen.getByTestId('natalsex-dropdown-menu')).toBeInTheDocument();

    // Find and click one of the options (change to female to verify selection works)
    const option = screen.getByTestId('change-natalsex-btn-female'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(natalSexStatus).toHaveTextContent('Female');
  });

  test('handles profile picture edit button click', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const uploadImageBtn = screen.getByTestId('uploadImageBtn');
    expect(uploadImageBtn).toBeInTheDocument();

    // Mock the file input click
    const fileInput = screen.getByTestId('fileInput');
    const fileInputClickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(screen.getByTestId('tab-events'));

    expect(screen.getByTestId('user-events')).toBeInTheDocument();
  });

  it('switches to tags tab', () => {
    render(<MemberDetail />);

    fireEvent.click(screen.getByTestId('tab-tags'));

    expect(screen.getByTestId('user-tags')).toBeInTheDocument();
  });
});
