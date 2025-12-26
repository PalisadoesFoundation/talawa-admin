/**
 * ContactCard.spec.tsx
 *
 * Unit tests for ContactCard component.
 * - Ensures rendering with and without image
 * - Ensures clicking selects the contact (setSelectedContact called)
 * - Ensures unseen messages badge renders when count > 0
 * - Ensures data-selected toggles when selectedContact equals id
 */

import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import ContactCard from './ContactCard';
import type { InterfaceContactCardProps } from 'types/Chat/interface';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

const link = new StaticMockLink([], true);

async function wait(ms = 50): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

const baseProps: InterfaceContactCardProps = {
  id: '1',
  title: 'Disha Talreja',
  image: '',
  lastMessage: 'Hey, are you free?',
  unseenMessages: 2,
  selectedContact: '',
  setSelectedContact: vi.fn(),
  isGroup: false,
};

const renderComponent = (props: InterfaceContactCardProps) =>
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ContactCard {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

describe('ContactCard [User Portal]', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact card container and text', async () => {
    renderComponent(baseProps);
    await wait();

    expect(
      screen.getByTestId(`contact-card-${baseProps.id}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`contact-title-${baseProps.id}`),
    ).toHaveTextContent(baseProps.title);
    expect(
      screen.getByTestId(`contact-lastMessage-${baseProps.id}`),
    ).toHaveTextContent(baseProps.lastMessage);
  });

  it('renders fallback Avatar when image is not provided', async () => {
    renderComponent(baseProps);
    await wait();

    expect(
      screen.getByTestId(`contact-container-${baseProps.id}`),
    ).toBeInTheDocument();
    expect(screen.queryByTestId(`contact-${baseProps.id}-image`)).toBeNull();
    expect(
      screen.getByRole('img', { name: baseProps.title }),
    ).toBeInTheDocument();
  });

  it('renders provided image when image prop exists', async () => {
    const props = { ...baseProps, image: 'http://example.com/avatar.png' };
    renderComponent(props);
    await wait();

    const img = screen.getByTestId(`contact-${props.id}-image`);
    expect(img).toBeInTheDocument();
    expect((img as HTMLImageElement).getAttribute('src')).toBe(
      'http://example.com/avatar.png',
    );
  });

  it('renders unseen messages badge when unseenMessages > 0', async () => {
    renderComponent(baseProps);
    await wait();

    const badge = screen.getByTestId(`contact-unseen-${baseProps.id}`);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(String(baseProps.unseenMessages));
  });

  it('calls setSelectedContact with id when clicked', async () => {
    const setSelectedContact = vi.fn();
    const props = { ...baseProps, setSelectedContact };
    renderComponent(props);
    await wait();

    await userEvent.click(screen.getByTestId(`contact-container-${props.id}`));
    await wait();

    expect(setSelectedContact).toHaveBeenCalledTimes(1);
    expect(setSelectedContact).toHaveBeenCalledWith(props.id);
  });

  it('marks data-selected true when selectedContact equals id', async () => {
    const props = { ...baseProps, selectedContact: baseProps.id };
    renderComponent(props);
    await wait();

    const container = screen.getByTestId(`contact-container-${props.id}`);
    expect(container).toHaveAttribute('data-selected', 'true');
  });

  it('does not render unseen badge when count is 0', async () => {
    const props = { ...baseProps, unseenMessages: 0 };
    renderComponent(props);
    await wait();

    expect(screen.queryByTestId(`contact-unseen-${props.id}`)).toBeNull();
  });

  it('calls setSelectedContact when clicked', () => {
    const setSelectedContact = vi.fn();

    render(
      <ContactCard {...baseProps} setSelectedContact={setSelectedContact} />,
    );

    fireEvent.click(screen.getByTestId(`contact-container-${baseProps.id}`));

    expect(setSelectedContact).toHaveBeenCalledWith(baseProps.id);
  });

  it('does not render lastMessage when lastMessage is not provided', async () => {
    const props = {
      ...baseProps,
      lastMessage: '', // falsy
    };

    renderComponent(props);
    await wait();

    expect(screen.queryByTestId(`contact-lastMessage-${props.id}`)).toBeNull();
  });

  it('marks data-selected false when selectedContact is different from id', async () => {
    const props = {
      ...baseProps,
      id: '1',
      selectedContact: '2',
    };

    renderComponent(props);
    await wait();

    const container = screen.getByTestId(`contact-container-${props.id}`);
    expect(container).toHaveAttribute('data-selected', 'false');
  });

  it('uses default unseenMessages value (0) when prop is undefined', async () => {
    const propsWithoutUnseen = {
      ...baseProps,
    };

    delete (propsWithoutUnseen as { unseenMessages?: number }).unseenMessages;

    renderComponent(propsWithoutUnseen);
    await wait();

    expect(
      screen.queryByTestId(`contact-unseen-${propsWithoutUnseen.id}`),
    ).toBeNull();
  });
});
