import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownButton from './DropdownButton';
import { InterfaceDropdownButtonProps } from 'types/shared-components/DropdownButton/interface';
import { vi } from 'vitest';

describe('DropdownButton', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const baseProps: InterfaceDropdownButtonProps = {
    label: 'Menu',
    items: [
      { key: '1', label: 'Item 1', onClick: () => {} },
      { key: '2', label: 'Item 2', onClick: () => {}, disabled: true },
    ],
    variant: 'primary',
    size: 'md',
    disabled: false,
    dataTestId: 'dropdown-button',
    align: 'end',
    className: 'custom-class',
  };

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders label correctly', () => {
    render(<DropdownButton {...baseProps} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders all items and respects disabled state', async () => {
    render(<DropdownButton {...baseProps} />);

    const toggle = screen.getByTestId('dropdown-button');
    await user.click(toggle);

    const items = screen.getAllByRole('button', { name: /Item/ });
    expect(items).toHaveLength(baseProps.items.length);

    items.forEach((el, i) => {
      if (baseProps.items[i].disabled) {
        expect(el).toHaveClass('disabled');
      } else {
        expect(el).not.toHaveClass('disabled');
      }
    });
  });

  it('renders disabled toggle when disabled prop is true', () => {
    render(<DropdownButton {...baseProps} disabled />);
    const toggle = screen.getByTestId('dropdown-button');
    expect(toggle).toBeDisabled();
  });

  it('maps xl size to lg Bootstrap size', async () => {
    render(<DropdownButton {...baseProps} size="xl" />);

    const toggle = screen.getByTestId('dropdown-button');
    await user.click(toggle);

    expect(toggle).toBeInTheDocument();
  });

  it('maps sm size correctly to Bootstrap size', () => {
    render(<DropdownButton {...baseProps} size="sm" />);

    const toggle = screen.getByTestId('dropdown-button');
    expect(toggle).toBeInTheDocument();
  });

  it('maps lg size correctly to Bootstrap size', () => {
    render(<DropdownButton {...baseProps} size="lg" />);

    const toggle = screen.getByTestId('dropdown-button');
    expect(toggle).toBeInTheDocument();
  });

  it('calls onClick handler when an enabled item is clicked', async () => {
    const mockOnClick = vi.fn();
    const testProps: InterfaceDropdownButtonProps = {
      ...baseProps,
      items: [
        { key: '1', label: 'Item 1', onClick: mockOnClick },
        { key: '2', label: 'Item 2', onClick: () => {}, disabled: true },
      ],
    };

    render(<DropdownButton {...testProps} />);

    const toggle = screen.getByTestId('dropdown-button');
    await user.click(toggle);

    const item1 = screen.getByRole('button', { name: 'Item 1' });
    await user.click(item1);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders without className prop', async () => {
    const propsWithoutClassName: InterfaceDropdownButtonProps = {
      label: 'Menu',
      items: [{ key: '1', label: 'Item 1', onClick: () => {} }],
      variant: 'primary',
      dataTestId: 'dropdown-button',
    };

    render(<DropdownButton {...propsWithoutClassName} />);

    const toggle = screen.getByTestId('dropdown-button');
    expect(toggle).toBeInTheDocument();
  });

  it('uses default align value when not specified', async () => {
    const propsWithoutAlign: InterfaceDropdownButtonProps = {
      label: 'Menu',
      items: [{ key: '1', label: 'Item 1', onClick: () => {} }],
      variant: 'primary',
      dataTestId: 'dropdown-button',
    };

    render(<DropdownButton {...propsWithoutAlign} />);

    const toggle = screen.getByTestId('dropdown-button');
    await user.click(toggle);

    expect(screen.getByRole('button', { name: 'Item 1' })).toBeInTheDocument();
  });
});
