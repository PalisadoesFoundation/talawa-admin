import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import ProfileImageSection from './ProfileImageSection/ProfileImageSection';
import SidebarToggle from './SideToggle/SideToggle';
import useLocalStorage from 'utils/useLocalstorage';
import { MOCKS } from './SettingsMocks';

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn(() => 'test-id'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

vi.mock('@dicebear/core', () => ({
  createAvatar: vi.fn(() => ({
    toDataUri: vi.fn(() => 'mocked-avatar-url'),
  })),
}));

// Create mock links
const link = new StaticMockLink(MOCKS, true);

// Test component render functions
const renderProfileHeader = (): ReturnType<typeof render> => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <ProfileHeader title="Test Title" />
      </BrowserRouter>
    </MockedProvider>,
  );
};

const renderProfileImageSection = (): ReturnType<typeof render> => {
  const fileInputRef = React.createRef<HTMLInputElement>();
  const handleFileUpload = vi.fn();
  return render(
    <ProfileImageSection
      userDetails={{ name: 'Test User', avatarURL: 'test.jpg' }}
      selectedAvatar={null}
      fileInputRef={fileInputRef}
      handleFileUpload={handleFileUpload}
    />,
  );
};

const renderSidebarToggle = (): ReturnType<typeof render> => {
  return render(<SidebarToggle hideDrawer={false} setHideDrawer={vi.fn()} />);
};

describe('Settings Components', () => {
  beforeEach(() => {
    const { setItem } = useLocalStorage();
    setItem('name', 'Test User');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('ProfileHeader Component', () => {
    it('renders with correct title', () => {
      renderProfileHeader();
      expect(screen.getByTestId('profile-header-title')).toHaveTextContent(
        'Test Title',
      );
    });

    it('renders profile dropdown', () => {
      renderProfileHeader();
      expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    });
  });

  describe('ProfileImageSection Component', () => {
    it('renders with avatar URL', () => {
      renderProfileImageSection();
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    it('renders default avatar when no URL provided', () => {
      render(
        <ProfileImageSection
          userDetails={{ name: 'Test User', avatarURL: '' }}
          selectedAvatar={null}
          fileInputRef={React.createRef()}
          handleFileUpload={vi.fn()}
        />,
      );
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });
  });

  describe('SidebarToggle Component', () => {
    it('renders toggle button', () => {
      renderSidebarToggle();
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    });

    it('changes icon on state change', () => {
      render(<SidebarToggle hideDrawer={true} setHideDrawer={vi.fn()} />);
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });
  });
});
