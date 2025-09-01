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

  beforeAll(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('should render props and text elements test for the page component', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

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
    vi.spyOn(window, 'confirm').mockReturnValue(false);

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

    let mockReload: any;

    beforeEach(() => {
      mockReload = vi.fn();

      // Use Object.defineProperty for TypeScript compatibility
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          reload: mockReload,
        },
        writable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should reload window after 2 seconds if addMember is clicked', async () => {
      const acceptText = /Accept/i;
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MockedProvider addTypename={false} mocks={MOCKS2}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...testProps} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      const buttons = screen.queryAllByRole('button');
      console.log(
        'Button texts:',
        buttons.map((b: HTMLElement) => b.textContent),
      );
      await act(async () => {
        await userEvent.click(screen.getByText(acceptText));
      });
      await new Promise((r) => setTimeout(r, 2100));
      expect(mockReload).toHaveBeenCalled();
    });

    it('should not reload window if acceptMutation fails', async () => {
      const acceptText = /Accept/i;
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MockedProvider addTypename={false} mocks={MOCKS3}>
          <I18nextProvider i18n={i18nForTest}>
            <MemberRequestCard {...testProps} />
          </I18nextProvider>
        </MockedProvider>,
      );
      await wait();
      const buttonsAccept = screen.queryAllByRole('button');
      console.log(
        'Button texts:',
        buttonsAccept.map((b: HTMLElement) => b.textContent),
      );
      await act(async () => {
        await userEvent.click(screen.getByText(acceptText));
      });
      await new Promise((r) => setTimeout(r, 2100));
      expect(mockReload).not.toHaveBeenCalled();
    });
  });
});
