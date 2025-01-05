import React, { useState, useEffect, useRef } from 'react';

/**
 * Props for the `TruncatedText` component.
 *
 * Includes the text to be displayed and an optional maximum width override.
 */
interface InterfaceTruncatedTextProps {
  /** The full text to display. It may be truncated if it exceeds the maximum width. */
  text: string;
  /** Optional: Override the maximum width for truncation. */
  maxWidthOverride?: number;
}

/**
 * A React functional component that displays text and truncates it with an ellipsis (`...`)
 * if the text exceeds the available width or the `maxWidthOverride` value.
 *
 * The component adjusts the truncation dynamically based on the available space
 * or the `maxWidthOverride` value. It also listens for window resize events to reapply truncation.
 *
 * @param props - The props for the component.
 * @returns A heading element (`<h6>`) containing the truncated or full text.
 *
 * @example
 * ```tsx
 * <TruncatedText text="This is a very long text" maxWidthOverride={150} />
 * ```
 */
const TruncatedText: React.FC<InterfaceTruncatedTextProps> = ({
  text,
  maxWidthOverride,
}) => {
  const [truncatedText, setTruncatedText] = useState<string>(''); // State to store the truncated text
  const textRef = useRef<HTMLHeadingElement>(null); // Ref to measure the width of the text container

  useEffect(() => {
    /**
     * Truncate the text based on the available width or the `maxWidthOverride` value.
     */
    const truncateText = (): void => {
      const element = textRef.current;
      if (element) {
        const maxWidth = maxWidthOverride || element.offsetWidth;
        const fullText = text;

        const computedStyle = getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const charPerPx = 0.065 + fontSize * 0.002;
        const maxChars = Math.floor(maxWidth * charPerPx);

        setTruncatedText(
          fullText.length > maxChars
            ? `${fullText.slice(0, maxChars - 3)}...`
            : fullText,
        );
      }
    };

    truncateText();
    window.addEventListener('resize', truncateText);
    return () => window.removeEventListener('resize', truncateText);
  }, [text, maxWidthOverride]);

  return (
    <h6 ref={textRef} className="text-secondary">
      {truncatedText}
    </h6>
  );
};

export default TruncatedText;
