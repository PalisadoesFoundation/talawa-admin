/**
 * EmptyChatState Component
 *
 * This component displays an empty state when no chat is selected.
 * It shows a centered message to guide the user.
 *
 * @remarks
 * - Centered layout using flexbox utilities from react-bootstrap.
 *
 * @param message - The message to display in the empty state.
 * @returns The rendered EmptyChatState component.
 */

import styles from './EmptyChatState.module.css';
import type { InterfaceEmptyChatStateProps } from 'types/UserPortal/EmptyChatState/interface';

export default function EmptyChatState({
  message,
}: InterfaceEmptyChatStateProps): JSX.Element {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center w-100 h-100 ${styles.container}`}
    >
      <h6 className={styles.message} data-testid="noChatSelected">
        {message}
      </h6>
    </div>
  );
}
