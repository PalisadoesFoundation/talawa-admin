import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Autocomplete } from './Autocomplete';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

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
  beforeEach(() => {
    vi.resetModules();
  });

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
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            label="Select User"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      expect(screen.getByLabelText('Select User')).toBeInTheDocument();
    });

    it('renders default placeholder', () => {
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      expect(screen.getByPlaceholderText('Select Options')).toBeInTheDocument();
    });

    it('renders custom placeholder', () => {
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            placeholder="Choose user"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      expect(screen.getByPlaceholderText('Choose user')).toBeInTheDocument();
    });

    it('applies custom className and testId', () => {
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            className="custom-class"
            dataTestId="custom-autocomplete"
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      const element = screen.getByTestId('custom-autocomplete');

      expect(element).toBeInTheDocument();

      expect(element).toHaveClass('custom-class');
    });

    it('renders helperText and error state', () => {
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            error
            helperText="Error occurred"
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            loading
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('respects disabled state', () => {
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            disabled
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });
    describe('Fallback logic coverage', () => {
      it('uses default getOptionLabel fallback for object options', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        const objectOptions = [{ id: 1 }, { id: 2 }];

        render(
          <I18nextProvider i18n={i18nForTest}>
            <Autocomplete<{ id: number }>
              id="object-autocomplete"
              options={objectOptions}
              value={null}
              onChange={onChangeSpy}
              dataTestId="object-autocomplete"
            />
          </I18nextProvider>,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        const options = await screen.findAllByRole('option');

        await user.click(options[0]);
        await waitFor(() => {
          expect(onChangeSpy).toHaveBeenCalledTimes(1);
          expect(onChangeSpy).toHaveBeenCalledWith(objectOptions[0]);
        });
      });
      it('warns once in development when getOptionLabel is not provided for object options', async () => {
        const user = userEvent.setup();
        const originalEnv = process.env.NODE_ENV;
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const onChangeSpy = vi.fn();

        try {
          process.env.NODE_ENV = 'development';
          render(
            <I18nextProvider i18n={i18nForTest}>
              <Autocomplete<{ id: number }>
                id="warn-test"
                options={[{ id: 1 }, { id: 2 }]}
                value={null}
                onChange={onChangeSpy}
                dataTestId="warn-test"
              />
            </I18nextProvider>,
          );
          await user.click(screen.getByRole('combobox'));
          await user.click(
            await screen.findAllByRole('option').then((o) => o[0]),
          );
          await user.click(screen.getByRole('combobox'));
          await user.click(
            await screen.findAllByRole('option').then((o) => o[1]),
          );
          await waitFor(() => {
            expect(warnSpy).toHaveBeenCalledWith(
              expect.stringContaining('getOptionLabel is not provided'),
            );
          });
          expect(warnSpy).toHaveBeenCalledTimes(3);
        } finally {
          process.env.NODE_ENV = originalEnv;
        }
      });

      it('uses default getOptionLabel fallback for string options', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        render(
          <I18nextProvider i18n={i18nForTest}>
            <Autocomplete<string>
              id="string-autocomplete"
              options={['One', 'Two']}
              value={null}
              onChange={onChangeSpy}
            />
          </I18nextProvider>,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);
        await waitFor(() => {
          expect(screen.getByText('One')).toBeInTheDocument();
        });
      });

      it('uses default isOptionEqualToValue fallback when comparing values', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        render(
          <I18nextProvider i18n={i18nForTest}>
            <Autocomplete<string>
              id="equality-autocomplete"
              options={['One', 'Two']}
              value={'One'}
              onChange={onChangeSpy}
            />
          </I18nextProvider>,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        const option = await screen.findByText('Two');

        await user.click(option);
        await waitFor(() => {
          expect(onChangeSpy).toHaveBeenCalledWith('Two');
        });
      });

      it('does not render loading spinner when loading is false', () => {
        const onChangeSpy = vi.fn();

        render(
          <I18nextProvider i18n={i18nForTest}>
            <Autocomplete<string>
              id="no-loading"
              options={['One']}
              value={null}
              onChange={onChangeSpy}
            />
          </I18nextProvider>,
        );

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      it('renders input with correct data-testid suffix', () => {
        const onChangeSpy = vi.fn();

        render(
          <I18nextProvider i18n={i18nForTest}>
            <Autocomplete<string>
              id="test-id-check"
              options={['One']}
              value={null}
              onChange={onChangeSpy}
              dataTestId="custom-id"
            />
          </I18nextProvider>,
        );

        expect(screen.getByTestId('custom-id-input')).toBeInTheDocument();
      });

      it('respects disableClearable behavior', async () => {
        const user = userEvent.setup();
        const onChangeSpy = vi.fn();

        render(
          <I18nextProvider i18n={i18nForTest}>
            <Autocomplete<string, false, true>
              id="disable-clearable"
              options={['One', 'Two']}
              value={'One'}
              disableClearable
              onChange={onChangeSpy}
            />
          </I18nextProvider>,
        );

        const input = screen.getByRole('combobox');

        await user.click(input);

        await user.click(await screen.findByText('Two'));
        await waitFor(() => {
          expect(onChangeSpy).toHaveBeenCalledWith('Two');
        });
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
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser>
            id="user-autocomplete"
            options={USERS}
            value={null}
            onChange={onChangeSpy}
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      const input = screen.getByRole('combobox');

      await user.click(input);

      const option = await screen.findByText('John Doe');

      await user.click(option);
      await waitFor(() => {
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(USERS[0]);
      });
    });

    it('supports multiple selection', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser, true>
            id="user-autocomplete"
            options={USERS}
            value={[]}
            multiple
            onChange={onChangeSpy}
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      const input = screen.getByRole('combobox');

      await user.click(input);

      const option = await screen.findByText('John Doe');

      await user.click(option);
      await waitFor(() => {
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith([USERS[0]]);
      });
    });

    it('supports freeSolo input', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<IUser, false, false, true>
            id="user-autocomplete"
            options={USERS}
            value={null}
            freeSolo
            onChange={onChangeSpy}
            getOptionLabel={getUserOptionLabel}
          />
        </I18nextProvider>,
      );

      const input = screen.getByRole('combobox');

      await user.type(input, 'Custom User');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith('Custom User');
      });
    });
    it('uses custom renderInput when provided', () => {
      const customRenderInput = vi.fn((params) => (
        <input {...params.inputProps} data-testid="custom-input" />
      ));
      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<string>
            id="custom-render"
            options={['One']}
            value={null}
            onChange={vi.fn()}
            renderInput={customRenderInput}
          />
        </I18nextProvider>,
      );
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
      expect(customRenderInput).toHaveBeenCalled();
    });

    it('forwards textFieldProps to the underlying TextField', () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <Autocomplete<string>
            id="tf-props"
            options={['One']}
            value={null}
            onChange={vi.fn()}
            textFieldProps={{
              size: 'small',
              InputProps: {
                endAdornment: <span data-testid="custom-adornment" />,
              },
            }}
          />
        </I18nextProvider>,
      );
      expect(
        screen.getByRole('combobox').closest('.MuiInputBase-sizeSmall'),
      ).toBeTruthy();
      expect(screen.getByTestId('custom-adornment')).toBeInTheDocument();
    });
  });
});
