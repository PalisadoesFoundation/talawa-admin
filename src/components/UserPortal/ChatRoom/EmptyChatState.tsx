/**
 * EmptyChatState Component
 *
 * This component displays an empty state when no chat is selected. It shows a calendar icon
 * and a message instructing the user to select a contact.
 *
 * @remarks
 * - Uses Material UI's PermContactCalendarIcon for the visual element.
 * - Centered layout using flexbox utilities from react-bootstrap.
 *
 * @param props - The props for the EmptyChatState component.
 * @returns The rendered EmptyChatState component.
 *
 * @example
 * ```tsx
 * <EmptyChatState message="Select a contact to start chatting" />
 * ```
 */

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import styles from './EmptyChatState.module.css';

interface IEmptyChatStateProps {
  message: string;
}

export default function EmptyChatState({
  message,
}: IEmptyChatStateProps): JSX.Element {
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
