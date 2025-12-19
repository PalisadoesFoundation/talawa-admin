/**
 * PeopleTabNavbarButton Component
 *
 * A reusable button component used in the People Tab navigation bar.
 * It displays an icon and a title, and supports an active state styling.
 *
 * @component
 *
 * @remarks
 * - Used inside the People Tab to navigate between different sections.
 * - The icon color changes depending on whether the button is active.
 * - Click actions are handled via the `action` prop.
 *
 * @example
 * ```tsx
 * <PeopleTabNavbarButton
 *   title="Events"
 *   icon={<EventIcon />}
 *   isActive={true}
 *   action={() => console.log("Events clicked")}
 *   testId="peopleTabEventsBtn"
 * />
 * ```
 *
 * @param {string} title — The text displayed on the button.
 * @param {React.ReactNode} [icon] — Optional SVG or icon component displayed next to the title.
 * @param {boolean} [isActive=false] — Whether the button is currently active. Applies active styling.
 * @param {() => void} action — Function called when the button is clicked.
 * @param {string} [testId] — Optional test ID for testing purposes.
 *
 * @returns {JSX.Element} The rendered PeopleTabNavbarButton component.
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { InterfacePeopleTab } from 'types/PeopleTab/interface';

const PeopleTabNavbarButton: React.FC<InterfacePeopleTab> = ({
  title,
  icon,
  isActive,
  action,
  testId,
}) => {
  return (
    <div
      onClick={action}
      className={`${styles.peopleTabBtnBlock} ${isActive ? styles.active : ''}`}
      data-testid={testId}
    >
      <div className={styles.peopleTabIconWrapper}>
        {icon && (
          <span className={styles.peopleTabIcon}>
            {React.cloneElement(
              icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
              {
                fill: isActive ? 'var(--bs-black)' : 'var(--bs-secondary)',
              },
            )}
          </span>
        )}

        <span className={styles.peopleTabEventHeader}>{title}</span>
      </div>
    </div>
  );
};

export default PeopleTabNavbarButton;
