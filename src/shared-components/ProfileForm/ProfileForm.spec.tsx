import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import MemberDetail from './ProfileForm';
import { useProfileLogic } from './hooks/useProfileLogic';

// 1. Mock the custom hook to control the state directly
vi.mock('./hooks/useProfileLogic');

// 2. Mock Child Components to avoid deep rendering issues
vi.mock('shared-components/LoadingState/LoadingState', () => ({
  default: ({
    isLoading,
    children,
  }: {
    isLoading: boolean;
    children: React.ReactNode;
  }) => <div data-testid="loading-state">{isLoading ? 'Loading...' : children}</div>,
}));

vi.mock('components/MemberActivity/Modal/EventsAttendedMemberModal', () => ({
  default: () => <div data-testid="events-modal">Events Modal</div>,
}));

vi.mock('./ProfileFormWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-wrapper">{children}</div>
  ),
}));

vi.mock('./PersonalDetailsCard', () => ({
  default: () => <div data-testid="personal-details-card">Personal Details</div>,
}));

vi.mock('./ContactInfoCard', () => ({
  default: () => <div data-testid="contact-info-card">Contact Info</div>,
}));

vi.mock('./MemberActivitySection', () => ({
  default: () => <div data-testid="member-activity-section">Member Activity</div>,
}));

// Mock the Button to capture clicks easily
vi.mock('shared-components/Button/Button', () => ({
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('MemberDetail Component', () => {
  // Setup default mock values
  const mockHandlers = {
    handleFileUpload: vi.fn(),
    handleFieldChange: vi.fn(),
    resetChanges: vi.fn(),
    handleUserUpdate: vi.fn(),
    handleEventsAttendedModal: vi.fn(),
  };

  const defaultHookValues = {
    formState: {},
    userData: { user: { eventsAttended: [], emailAddress: 'test@example.com' } },
    loading: false,
    isUpdated: false,
    selectedAvatar: null,
    fileInputRef: { current: null },
    show: false,
    hideDrawer: false,
    setHideDrawer: vi.fn(),
    setShow: vi.fn(),
    isUser: false,
    handlers: mockHandlers,
    t: (key: string) => key,
    tCommon: (key: string) => key,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the hook to return default values before each test
    (useProfileLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      defaultHookValues,
    );
  });

  test('renders loading state correctly', () => {
    // Override hook to return loading: true
    (useProfileLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHookValues,
      loading: true,
    });

    render(<MemberDetail />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Child components should not render while loading
    expect(screen.queryByTestId('personal-details-card')).not.toBeInTheDocument();
  });

  test('renders all child components when loading is false', () => {
    render(<MemberDetail />);

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('personal-details-card')).toBeInTheDocument();
    expect(screen.getByTestId('member-activity-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-info-card')).toBeInTheDocument();
  });

  test('renders events modal when show is true', () => {
    (useProfileLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHookValues,
      show: true,
    });

    render(<MemberDetail />);
    expect(screen.getByTestId('events-modal')).toBeInTheDocument();
  });

  test('does not render events modal when show is false', () => {
    render(<MemberDetail />);
    expect(screen.queryByTestId('events-modal')).not.toBeInTheDocument();
  });

  test('renders footer buttons only when isUpdated is true', () => {
    (useProfileLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHookValues,
      isUpdated: true,
    });

    render(<MemberDetail />);
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
  });

  test('does not render footer buttons when isUpdated is false', () => {
    render(<MemberDetail />);
    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('saveChangesBtn')).not.toBeInTheDocument();
  });

  test('calls resetChanges handler when reset button is clicked', async () => {
    (useProfileLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHookValues,
      isUpdated: true,
    });

    render(<MemberDetail />);
    const user = userEvent.setup();
    
    await user.click(screen.getByTestId('resetChangesBtn'));

    expect(mockHandlers.resetChanges).toHaveBeenCalledTimes(1);
  });

  test('calls handleUserUpdate handler when save button is clicked', async () => {
    (useProfileLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHookValues,
      isUpdated: true,
    });

    render(<MemberDetail />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('saveChangesBtn'));

    expect(mockHandlers.handleUserUpdate).toHaveBeenCalledTimes(1);
  });
});