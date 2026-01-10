/**
 * PeopleTabNavbarButton
 *
 * A reusable button used in the People Tab navigation bar.
 * Displays an icon and title, and supports an active state.
 *
 * @remarks
 * - Used inside the People Tab to navigate between sections
 * - Icon and text styles change when active
 * - Click behavior is handled via the `action` callback
 *
 * @example
 * ```tsx
 * <PeopleTabNavbarButton
 *   title="Events"
 *   icon="/icons/events.svg"
 *   isActive={true}
 *   action={() => console.log("Events clicked")}
 *   testId="peopleTabEventsBtn"
 * />
 * ```
 *
 * @param title - Text displayed on the button
 * @param icon - Optional icon displayed next to the title
 * @param isActive - Whether the button is currently active
 * @param action - Function invoked when the button is clicked
 * @param testId - Optional test identifier for testing
 *
 * @returns The rendered PeopleTabNavbarButton component
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { InterfacePeopleTabNavbar } from 'types/PeopleTab/interface';

const PeopleTabNavbarButton: React.FC<InterfacePeopleTabNavbar> = ({
  title,
  icon,
  isActive,
  action,
  testId,
}) => {
  return (
    <div
      onClick={action}
      className={`${styles.peopleTabBtnBlock} ${isActive ? styles.peopleTabActiveButton : ''}`}
      data-testid={testId}
    >
      <div className={styles.peopleTabIconWrapper}>
        {icon && (
          <span className={styles.peopleTabIcon}>
            <img
              src={icon}
              alt={`${title}`}
              className={styles.peopleTabImgIcon}
            />
          </span>
        )}

        <span
          className={`${styles.peopleTabEventHeader} ${isActive ? styles.peopleTabActiveHeader : ''}`}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

export default PeopleTabNavbarButton;
