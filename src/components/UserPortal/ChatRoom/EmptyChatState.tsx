import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import styles from './ChatRoom.module.css';

interface IEmptyChatStateProps {
  message: string;
}

export default function EmptyChatState({
  message,
}: IEmptyChatStateProps): JSX.Element {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center w-100 h-75 gap-2 ${styles.grey}`}
    >
      <PermContactCalendarIcon fontSize="medium" className={styles.grey} />
      <h6 data-testid="noChatSelected">{message}</h6>
    </div>
  );
}
