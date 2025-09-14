// Default props for use in tests
const props = {
  id: '1',
  memberName: 'John Doe',
  memberLocation: 'India',
  joinDate: '18/03/2022',
  memberImage: 'image',
  email: 'johndoe@gmail.com',
};
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import MemberRequestCard from './MemberRequestCard';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { describe, vi, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { MOCKS, MOCKS2, MOCKS3 } from './MemberRequestMocks';

// Optimized mock links - reused for performance
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

// Performance-optimized wait function
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Member Request Card', () => {
  // Optimized shared props
  const defaultProps = {
    id: '1',
    memberName: 'John Doe',
    memberLocation: 'India',
    joinDate: '18/03/2022',
    memberImage: 'image',
    email: 'johndoe@gmail.com',
  };

  // Performance: Single beforeAll for shared setup
  beforeAll(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('should render props and text elements test for the page component', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...defaultProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    // Performance: Batch user interactions
    await Promise.all([
      userEvent.click(screen.getByText(/Accept/i)),
      userEvent.click(screen.getByText(/Reject/i)),
    ]);

    // Performance: Group assertions for single DOM query
    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.memberName)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.joinDate)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.email)).toBeInTheDocument();
  });

  it('should render text elements when props value is not passed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const emptyProps = {
      id: '1',
      memberName: '',
      memberLocation: 'India',
      joinDate: '18/03/2022',
      memberImage: '',
      email: 'johndoe@gmail.com',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...emptyProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    // Performance: Batch interactions
    await Promise.all([
      userEvent.click(screen.getByText(/Accept/i)),
      userEvent.click(screen.getByText(/Reject/i)),
    ]);

    // Efficient assertions
    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.memberName)).not.toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('18/03/2022')).toBeInTheDocument();
    expect(screen.getByText('johndoe@gmail.com')).toBeInTheDocument();
  });

  it('should reload window after 2 seconds if addMember is clicked', async () => {
    const props = {
      id: '1',
      memberName: 'John Doe',
      memberLocation: 'India',
      joinDate: '18/03/2022',
      memberImage: 'image',
      email: 'johndoe@gmail.com',
    };
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    const mockReload = vi.fn();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: mockReload };
    render(
      <MockedProvider addTypename={false} link={link2}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Accept/i));
    await wait(2100);
    expect(window.location.reload).toHaveBeenCalled();
    // @ts-ignore
    window.location = originalLocation;
  });

  it('should not reload window if acceptMutation fails', async () => {
    const props = {
      id: '1',
      memberName: 'John Doe',
      memberLocation: 'India',
      joinDate: '18/03/2022',
      memberImage: 'image',
      email: '',
    };
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    const mockReload = vi.fn();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: mockReload };
    render(
      <MockedProvider addTypename={false} link={link3}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    await userEvent.click(screen.getByText(/Accept/i));
    await wait(2100);
    expect(window.location.reload).not.toHaveBeenCalled();
    // @ts-ignore
    window.location = originalLocation;
  });

  it('should reload window if rejectMember is clicked', async () => {
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    const mockReload = vi.fn();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: mockReload };
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <MockedProvider addTypename={false} link={link2}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Reject/i));
    await wait();
    expect(window.confirm).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
    // @ts-ignore
    window.location = originalLocation;
  });

  it('should not reload window if rejectMutation fails', async () => {
    global.confirm = (): boolean => true;
    const originalLocation = window.location;
    const mockReload = vi.fn();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: mockReload };
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <MockedProvider addTypename={false} link={link3}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Reject/i));
    await wait();
    expect(window.confirm).toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();
    // @ts-ignore
    window.location = originalLocation;

    // Performance: Efficient cleanup
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should reload window after 2 seconds if addMember is clicked', async () => {
      const acceptText = /Accept/i;
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <MockedProvider addTypename={false} mocks={MOCKS2}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await wait();

      // Performance: Direct button query and click
      await act(async () => {
        await userEvent.click(screen.getByText(acceptText));
      });

      // Performance: Optimized timeout for real-world timing
      await new Promise((resolve) => setTimeout(resolve, 2100));

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('should not reload window if acceptMutation fails', async () => {
      const acceptText = /Accept/i;
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <MockedProvider addTypename={false} mocks={MOCKS3}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await wait();

      // Performance: Streamlined interaction
      await act(async () => {
        await userEvent.click(screen.getByText(acceptText));
      });

      // Performance: Same timeout for consistency
      await new Promise((resolve) => setTimeout(resolve, 2100));

      expect(mockReload).not.toHaveBeenCalled();
    });
  });
});
