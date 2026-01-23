import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownButton from './DropdownButton';
import { InterfaceDropdownButtonProps } from 'types/shared-components/DropdownButton/interface';

describe('DropdownButton', () => {
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
});
