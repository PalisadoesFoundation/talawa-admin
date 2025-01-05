import React, { useState, useEffect, useRef } from 'react';

interface InterfaceTruncatedTextProps {
  text: string;
  maxWidthOverride?: number;
}

const TruncatedText: React.FC<InterfaceTruncatedTextProps> = ({
  text,
  maxWidthOverride,
}) => {
  const [truncatedText, setTruncatedText] = useState<string>('');
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const truncateText = (): void => {
      const element = textRef.current;
      if (element) {
        const maxWidth = maxWidthOverride || element.offsetWidth;
        const fullText = text;

        const computedStyle = getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const charPerPx = 0.065 + fontSize * 0.002; // Adjust value for truncation according to our needs
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
