/**
 * A React functional component that truncates a given text based on the available width
 * or an optional maximum width override. The truncated text is displayed within an `<h6>` element.
 *
 * @component
 * @param {InterfaceTruncatedTextProps} props - The props for the TruncatedText component.
 * @param {string} props.text - The full text to display. It may be truncated if it exceeds the maximum width.
 * @param {number} [props.maxWidthOverride] - Optional: Override the maximum width for truncation.
 *
 * @returns {JSX.Element} A truncated version of the provided text, displayed as an `<h6>` element.
 *
 * @remarks
 * - The truncation logic calculates the maximum number of characters that can fit within the width
 *   by estimating the character width based on the font size.
 * - If the text exceeds the maximum allowed characters, it appends an ellipsis (`...`) to the truncated text.
 * - The component listens to window resize events and recalculates the truncation dynamically.
 *
 * @example
 * ```tsx
 * <TruncatedText text="This is a very long text that might be truncated." />
 * <TruncatedText text="Another example" maxWidthOverride={200} />
 * ```
 *
 * @dependencies
 * - React: Used for creating the component and managing state.
 * - useDebounce: A custom hook for debouncing the resize event handler.
 *
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useDebounce from 'utils/useDebounce';

interface InterfaceTruncatedTextProps {
  /** The full text to display. It may be truncated if it exceeds the maximum width. */
  text: string;
  /** Optional: Override the maximum width for truncation. */
  maxWidthOverride?: number;
}

const TruncatedText: React.FC<InterfaceTruncatedTextProps> = ({
  text,
  maxWidthOverride,
}) => {
  const [truncatedText, setTruncatedText] = useState<string>('');
  const textRef = useRef<HTMLHeadingElement>(null);

  /**
   * Stable truncateText wrapped in useCallback (fixes unstable dependency issue flagged by CodeRabbit)
   */
  const truncateText = useCallback((): void => {
    const element = textRef.current;
    if (!element) return;

    const maxWidth =
      typeof maxWidthOverride === 'number'
        ? maxWidthOverride
        : element.offsetWidth;

    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);

    // Character-per-pixel estimation
    const charPerPx = 0.065 + fontSize * 0.002;
    const maxChars = Math.floor(maxWidth * charPerPx);

    setTruncatedText(
      text.length > maxChars
        ? `${text.slice(0, Math.max(0, maxChars - 3))}...`
        : text,
    );
  }, [text, maxWidthOverride]);

  const { debouncedCallback, cancel } = useDebounce(truncateText, 100);

  useEffect(() => {
    truncateText();
    window.addEventListener('resize', debouncedCallback);

    return () => {
      cancel();
      window.removeEventListener('resize', debouncedCallback);
    };
  }, [truncateText, debouncedCallback, cancel]);

  return (
    <h6 ref={textRef} className="text-secondary">
      {truncatedText}
    </h6>
  );
};

export default TruncatedText;
