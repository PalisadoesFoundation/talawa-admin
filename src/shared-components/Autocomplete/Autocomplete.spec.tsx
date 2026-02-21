import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Autocomplete } from './Autocomplete';

interface IUser {
  id: number;
  name: string;
}

const USERS: IUser[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
];

/**
 * Helper to safely handle freeSolo union type
 */
const getUserOptionLabel = (option: IUser | string): string =>
  typeof option === 'string' ? option : option.name;

describe('Shared Component: Autocomplete', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // ----------------------------
  // Rendering tests
  // ----------------------------

  describe('Rendering', () => {
    it('renders with label', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          label="Select User"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(screen.getByLabelText('Select User')).toBeInTheDocument();
    });

    it('renders default placeholder', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(
        screen.getByPlaceholderText('Select an option'),
      ).toBeInTheDocument();
    });

    it('renders custom placeholder', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          placeholder="Choose user"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(screen.getByPlaceholderText('Choose user')).toBeInTheDocument();
    });

    it('applies custom className and testId', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          className="custom-class"
          dataTestId="custom-autocomplete"
          getOptionLabel={getUserOptionLabel}
        />,
      );

      const element = screen.getByTestId('custom-autocomplete');

      expect(element).toBeInTheDocument();

      expect(element).toHaveClass('custom-class');
    });

    it('renders helperText and error state', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          error
          helperText="Error occurred"
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });
  });

  // ----------------------------
  // State tests
  // ----------------------------

  describe('States', () => {
    it('shows loading spinner', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          loading
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('respects disabled state', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          disabled
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });
    describe('Fallback logic coverage', () => {
      it('uses default getOptionLabel fallback for object options', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        const objectOptions = [{ id: 1 }, { id: 2 }];

        render(
          <Autocomplete<{ id: number }>
            id="object-autocomplete"
            options={objectOptions}
            value={null}
            onChange={onChangeSpy}
            dataTestId="object-autocomplete"
          />,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        const options = await screen.findAllByRole('option');

        await user.click(options[0]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);

        expect(onChangeSpy).toHaveBeenCalledWith(objectOptions[0]);
      });

      it('uses default getOptionLabel fallback for string options', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        render(
          <Autocomplete<string>
            id="string-autocomplete"
            options={['One', 'Two']}
            value={null}
            onChange={onChangeSpy}
          />,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        expect(screen.getByText('One')).toBeInTheDocument();
      });

      it('uses default isOptionEqualToValue fallback when comparing values', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        render(
          <Autocomplete<string>
            id="equality-autocomplete"
            options={['One', 'Two']}
            value={'One'}
            onChange={onChangeSpy}
          />,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        const option = await screen.findByText('Two');

        await user.click(option);

        expect(onChangeSpy).toHaveBeenCalledWith('Two');
      });

      it('does not render loading spinner when loading is false', () => {
        const onChangeSpy = vi.fn();

        render(
          <Autocomplete<string>
            id="no-loading"
            options={['One']}
            value={null}
            onChange={onChangeSpy}
          />,
        );

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      it('renders input with correct data-testid suffix', () => {
        const onChangeSpy = vi.fn();

        render(
          <Autocomplete<string>
            id="test-id-check"
            options={['One']}
            value={null}
            onChange={onChangeSpy}
            dataTestId="custom-id"
          />,
        );

        expect(screen.getByTestId('custom-id-input')).toBeInTheDocument();
      });

      it('respects disableClearable behavior', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        render(
          <Autocomplete<string, false, true>
            id="disable-clearable"
            options={['One', 'Two']}
            value={'One'}
            disableClearable
            onChange={onChangeSpy}
          />,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        await user.click(await screen.findByText('Two'));

        expect(onChangeSpy).toHaveBeenCalledWith('Two');
      });
    });
  });

  // ----------------------------
  // Interaction tests
  // ----------------------------

  describe('Interactions', () => {
    it('calls onChange when selecting option', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={null}
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      const input = screen.getByRole('combobox');

      await user.click(input);

      const option = await screen.findByText('John Doe');

      await user.click(option);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      expect(onChangeSpy).toHaveBeenCalledWith(USERS[0]);
    });

    it('supports multiple selection', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser, true>
          id="user-autocomplete"
          options={USERS}
          value={[]}
          multiple
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      const input = screen.getByRole('combobox');

      await user.click(input);

      const option = await screen.findByText('John Doe');

      await user.click(option);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      expect(onChangeSpy).toHaveBeenCalledWith([USERS[0]]);
    });

    it('supports freeSolo input', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser, false, false, true>
          id="user-autocomplete"
          options={USERS}
          value={null}
          freeSolo
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      const input = screen.getByRole('combobox');

      await user.type(input, 'Custom User');
      await user.keyboard('{Enter}');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      expect(onChangeSpy).toHaveBeenCalledWith('Custom User');
    });
  });

  // ----------------------------
  // Default logic tests
  // ----------------------------

  describe('Default logic', () => {
    it('uses default getOptionLabel fallback', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<string>
          id="string-autocomplete"
          options={['One', 'Two']}
          value={null}
          onChange={onChangeSpy}
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('uses default isOptionEqualToValue fallback', () => {
      const onChangeSpy = vi.fn();

      render(
        <Autocomplete<IUser>
          id="user-autocomplete"
          options={USERS}
          value={USERS[0]}
          onChange={onChangeSpy}
          getOptionLabel={getUserOptionLabel}
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});
