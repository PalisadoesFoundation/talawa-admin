import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import styles from './SearchBar.module.css';
import type {
  InterfaceSearchBarProps,
  InterfaceSearchBarRef,
} from 'types/SearchBar/interface';
import Button from 'shared-components/Button';

const mergeClassNames = (
  ...classes: Array<string | false | undefined>
): string => classes.filter(Boolean).join(' ');

/**
 * Shared SearchBar component that centralizes all search UI across the app.
 *
 * @remarks
 * - Supports both controlled and uncontrolled usage.
 * - Emits change, search, and clear callbacks for flexible data handling.
 * - Offers multiple visual variants and sizes to match the Figma design tokens.
 */
const SearchBar = forwardRef<InterfaceSearchBarRef, InterfaceSearchBarProps>(
  (props, ref) => {
    const { t: tCommon } = useTranslation('common');

    const {
      placeholder,
      value,
      defaultValue = '',
      onSearch,
      onChange,
      onClear,
      className,
      inputClassName,
      buttonClassName,
      inputTestId,
      buttonTestId,
      clearButtonTestId,
      size = 'md',
      variant = 'outline',
      showSearchButton = true,
      showClearButton = true,
      showLeadingIcon = false,
      showTrailingIcon = false,
      buttonLabel = '',
      buttonAriaLabel,
      clearButtonAriaLabel = tCommon('clear'),
      isLoading = false,
      icon,
      disabled = false,
      autoComplete = 'off',
      type = 'search',
      ...rest
    } = props;

    const isControlled = typeof value === 'string';
    const [internalValue, setInternalValue] = useState<string>(
      value ?? defaultValue,
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const currentValue = useMemo(
      () => (isControlled ? (value ?? '') : internalValue),
      [isControlled, internalValue, value],
    );

    useEffect(() => {
      if (isControlled) {
        setInternalValue(value ?? '');
      }
    }, [isControlled, value]);

    const emitChange = useCallback(
      (nextValue: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) {
          return;
        }
        if (event) {
          onChange(nextValue, event);
          return;
        }
        const target = inputRef.current;
        if (target) {
          const syntheticEvent = {
            target,
            currentTarget: target,
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(nextValue, syntheticEvent);
        } else {
          onChange(nextValue, {} as React.ChangeEvent<HTMLInputElement>);
        }
      },
      [onChange],
    );

    const triggerSearch = useCallback(
      (
        trigger: 'button' | 'enter' | 'clear',
        event?:
          | React.KeyboardEvent<HTMLInputElement>
          | React.MouseEvent<HTMLButtonElement>,
        overrideValue?: string,
      ) => {
        if (!onSearch) {
          return;
        }
        const resolvedValue = overrideValue ?? currentValue;
        onSearch(resolvedValue, { trigger, event });
      },
      [currentValue, onSearch],
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      emitChange(nextValue, event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        triggerSearch('enter', event);
      }
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      triggerSearch('button', event);
    };

    const handleClear = useCallback(() => {
      if (disabled) {
        return;
      }
      if (!isControlled) {
        setInternalValue('');
      }
      emitChange('');
      // If a consumer provided onClear, treat it as the primary clear handler
      // and avoid invoking onSearch('') to prevent duplicate side effects.
      if (onClear) {
        onClear();
      } else {
        triggerSearch('clear', undefined, '');
      }
      inputRef.current?.focus();
    }, [disabled, emitChange, isControlled, onClear, triggerSearch]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        clear: () => handleClear(),
      }),
      [handleClear],
    );

    const containerClassName = mergeClassNames(
      styles.searchBarContainer,
      showSearchButton && styles.searchBarContainerWithButton,
      className,
    );

    const wrapperClassName = mergeClassNames(
      styles.searchBarInputWrapper,
      variant === 'filled' && styles.searchBarVariantFilled,
      variant === 'ghost' && styles.searchBarVariantGhost,
      showSearchButton && styles.searchBarInputWrapperWithButton,
    );

    const inputClassNames = mergeClassNames(
      styles.searchBarInput,
      size === 'sm' && styles.searchBarInputSm,
      size === 'lg' && styles.searchBarInputLg,
      !showLeadingIcon && styles.searchBarNoIcon,
      inputClassName,
    );

    const buttonClassNames = mergeClassNames(
      styles.searchBarButton,
      size === 'sm' && styles.searchBarButtonSm,
      size === 'lg' && styles.searchBarButtonLg,
      !buttonLabel && styles.searchBarIconButton,
      buttonClassName,
    );

    const LeadingIcon = icon ?? <SearchIcon fontSize="small" />;

    return (
      <div className={containerClassName}>
        <div className={wrapperClassName}>
          {showLeadingIcon && (
            <span
              className={styles.searchBarIcon}
              data-testid="leading-icon"
              aria-hidden="true"
            >
              {LeadingIcon}
            </span>
          )}
          <input
            ref={inputRef}
            type={type}
            value={currentValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClassNames}
            data-testid={inputTestId}
            disabled={disabled}
            autoComplete={autoComplete}
            {...rest}
          />
          {showClearButton && currentValue.length > 0 && !disabled && (
            <Button
              type="button"
              className={styles.searchBarClearButton}
              aria-label={clearButtonAriaLabel}
              onClick={handleClear}
              data-testid={clearButtonTestId}
            >
              <CloseRoundedIcon fontSize="small" />
            </Button>
          )}
          {showTrailingIcon && (
            <span
              className={styles.searchBarTrailingIcon}
              data-testid="trailing-icon"
              aria-hidden="true"
            >
              <SearchIcon fontSize="small" />
            </span>
          )}
        </div>
        {showSearchButton && (
          <Button
            type="button"
            className={buttonClassNames}
            onClick={handleButtonClick}
            disabled={disabled || isLoading}
            aria-label={buttonAriaLabel || buttonLabel || 'Search'}
            data-testid={buttonTestId}
          >
            {isLoading ? (
              <span className={styles.searchBarSpinner} aria-hidden="true" />
            ) : (
              <SearchIcon fontSize="small" aria-hidden="true" />
            )}
            {buttonLabel && <span>{buttonLabel}</span>}
            {!buttonLabel && (
              <span className={styles.searchBarSrOnly}>
                {buttonAriaLabel || 'Search'}
              </span>
            )}
          </Button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
