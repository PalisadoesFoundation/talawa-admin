/**
 * A React functional component that truncates a given text based on the available width
 * or an optional maximum width override. The truncated text is displayed within an `<h6>` element.
 *
 * @param props - Component props from InterfaceTruncatedTextProps
 *
 * @returns JSX.Element
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
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useDebounce from '../useDebounce/useDebounce';
import { InterfaceTruncatedTextProps } from 'types/shared-components/TruncatedText/interface';

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
