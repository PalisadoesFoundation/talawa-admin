// Unit tests for: collapsibleDropdown

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocking dependencies
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  NavLink: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock styles

// Mock types
type MockTargetsType = {
  name: string;
  url?: string;
  subTargets?: { name: string; icon: string; url: string }[];
};

interface MockInterfaceCollapsibleDropdown {
  showDropdown: boolean;
  target: MockTargetsType;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

describe('collapsibleDropdown() collapsibleDropdown method', () => {
  let mockSetShowDropdown: jest.MockedFunction<
    React.Dispatch<React.SetStateAction<boolean>>
  >;
  let mockNavigate: jest.MockedFunction<ReturnType<typeof useNavigate>>;
  let mockLocation: jest.MockedFunction<ReturnType<typeof useLocation>>;

  beforeEach(() => {
    mockSetShowDropdown = jest.fn();
    mockNavigate = jest.fn();
    mockLocation = { pathname: '/somepath' } as any;

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  describe('Happy Paths', () => {
    it('should render the component with dropdown closed initially', () => {
      const mockProps: MockInterfaceCollapsibleDropdown = {
        showDropdown: false,
        target: { name: 'Dashboard', subTargets: [] },
        setShowDropdown: mockSetShowDropdown,
      } as any;

      const { getByTestId } = render(<CollapsibleDropdown {...mockProps} />);
      const button = getByTestId('collapsible-dropdown');

      expect(button).toHaveClass('text-secondary');
      expect(button).not.toHaveClass('text-white');
    });

    it('should toggle dropdown visibility on button click', () => {
      const mockProps: MockInterfaceCollapsibleDropdown = {
        showDropdown: false,
        target: { name: 'Dashboard', subTargets: [] },
        setShowDropdown: mockSetShowDropdown,
      } as any;

      const { getByTestId } = render(<CollapsibleDropdown {...mockProps} />);
      const button = getByTestId('collapsible-dropdown');

      fireEvent.click(button);
      expect(mockSetShowDropdown).toHaveBeenCalledWith(true);
    });

    it('should render sub-targets when dropdown is open', () => {
      const mockProps: MockInterfaceCollapsibleDropdown = {
        showDropdown: true,
        target: {
          name: 'Dashboard',
          subTargets: [{ name: 'Sub1', icon: 'icon1', url: '/sub1' }],
        },
        setShowDropdown: mockSetShowDropdown,
      } as any;

      const { getByText } = render(<CollapsibleDropdown {...mockProps} />);
      expect(getByText('Sub1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty subTargets gracefully', () => {
      const mockProps: MockInterfaceCollapsibleDropdown = {
        showDropdown: true,
        target: { name: 'Dashboard', subTargets: [] },
        setShowDropdown: mockSetShowDropdown,
      } as any;

      const { queryByText } = render(<CollapsibleDropdown {...mockProps} />);
      expect(queryByText('Sub1')).not.toBeInTheDocument();
    });

    it('should update dropdown visibility based on location pathname', () => {
      mockLocation.pathname = '/orgstore';
      const mockProps: MockInterfaceCollapsibleDropdown = {
        showDropdown: false,
        target: { name: 'Dashboard', subTargets: [] },
        setShowDropdown: mockSetShowDropdown,
      } as any;

      render(<CollapsibleDropdown {...mockProps} />);
      expect(mockSetShowDropdown).toHaveBeenCalledWith(true);
    });
  });
});

// End of unit tests for: collapsibleDropdown
