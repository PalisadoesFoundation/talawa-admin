import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import MemberRequestCard from './MemberRequestCard';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { describe, vi, expect } from 'vitest';
import { MOCKS, MOCKS2, MOCKS3 } from './MemberRequestMocks';

const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Member Request Card', () => {
  const props = {
    id: '1',
    memberName: 'John Doe',
    memberLocation: 'India',
    joinDate: '18/03/2022',
    memberImage: 'image',
    email: 'johndoe@gmail.com',
  };

  global.alert = vi.fn();

  it('should render props and text elements test for the page component', async () => {
    global.confirm = (): boolean => true;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Accept/i));
    await userEvent.click(screen.getByText(/Reject/i));

    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.getByText(props.memberName)).toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
  });

  it('should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <MemberRequestCard
            id="1"
            memberName=""
            memberLocation="India"
            joinDate="18/03/2022"
            memberImage=""
            email="johndoe@gmail.com"
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByText(/Accept/i));
    await userEvent.click(screen.getByText(/Reject/i));

    expect(screen.getByAltText(/userImage/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    expect(screen.queryByText(props.memberName)).not.toBeInTheDocument();
    expect(screen.getByText(props.memberLocation)).toBeInTheDocument();
    expect(screen.getByText(props.joinDate)).toBeInTheDocument();
    expect(screen.getByText('johndoe@gmail.com')).toBeInTheDocument();
  });

  describe('window reload and mutation tests', () => {
    const testProps = {
      id: '1',
      memberName: 'John Doe',
      memberLocation: 'India',
      joinDate: '18/03/2022',
      memberImage: 'image',
      email: 'johndoe@gmail.com',
    };
    let originalLocation: Location;
    let reloadSpy: jest.Mock;
    let confirmSpy: any;

    beforeEach(() => {
      originalLocation = window.location;
      // @ts-expect-error - Mocking window.location for testing
      delete window.location;
      // @ts-expect-error - Mocking window.location for testing
      window.location = { ...originalLocation, reload: vi.fn() };
      reloadSpy = window.location.reload as any;
    });

    afterEach(() => {
      vi.restoreAllMocks();
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });

    it('should reload window after 2 seconds if addMember is clicked', async () => {
      global.confirm = (): boolean => true;
      render(
        <MockedProvider addTypename={false} link={link2}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...testProps} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      await userEvent.click(screen.getByText(/Accept/i));
      await wait(2100);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not reload window if acceptMutation fails', async () => {
      global.confirm = (): boolean => true;
      render(
        <MockedProvider addTypename={false} link={link3}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...testProps} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      await userEvent.click(screen.getByText(/Accept/i));
      await wait(2100);
      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should reload window if rejectMember is clicked', async () => {
      global.confirm = (): boolean => true;
      confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MockedProvider addTypename={false} link={link2}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...testProps} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      await userEvent.click(screen.getByText(/Reject/i));
      await wait();
      expect(confirmSpy).toHaveBeenCalled();
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not reload window if rejectMutation fails', async () => {
      global.confirm = (): boolean => true;
      confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MockedProvider addTypename={false} link={link3}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...testProps} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      await userEvent.click(screen.getByText(/Reject/i));
      await wait();
      expect(confirmSpy).toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });
});
