/**
 * Props for TruncatedText component.
 */

export interface InterfaceTruncatedTextProps {
  /** The full text to display. It may be truncated if it exceeds the maximum width. */
  text: string;

  /** Optional: Override for the maximum width for truncation. */
  maxWidthOverride?: number;
}
