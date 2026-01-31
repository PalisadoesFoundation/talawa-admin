/**
 * EmptyChatState Component
 *
 * This component displays an empty state when no chat is selected. It shows a chat bubble icon
 * and the provided message.
 *
 * @remarks
 * - Uses Material UI's ChatBubbleOutlineIcon for the visual element.
 * - Centered layout using flexbox utilities from react-bootstrap.
 *
 * @param message - The message to display in the empty state.
 * @returns The rendered EmptyChatState component.
 */

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import styles from './EmptyChatState.module.css';
import type { InterfaceEmptyChatStateProps } from 'types/UserPortal/EmptyChatState/interface';

export default function EmptyChatState({
  message,
}: InterfaceEmptyChatStateProps): JSX.Element {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center w-100 h-100 gap-2 ${styles.container}`}
    >
      <div className={styles.iconWrapper}>
        <ChatBubbleOutlineIcon className={styles.icon} />
      </div>
      <h6 className={styles.message} data-testid="noChatSelected">
        {message}
      </h6>
    </div>
  );
}
