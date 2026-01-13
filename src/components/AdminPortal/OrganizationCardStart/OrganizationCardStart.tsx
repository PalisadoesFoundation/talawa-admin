/**
 * Renders the `OrganizationCardStart` component, which displays an organization card
 * with an image, name, and a link to the organization's home page.
 *
 * @param id - The unique identifier for the organization. Used to construct the link URI.
 * @param name - The name of the organization to be displayed on the card.
 * @param image - The URL of the organization's image. If not provided, a placeholder image is used.
 *
 * @returns A JSX element representing the organization card.
 *
 * @remarks
 * - The component uses CSS modules for styling, with styles imported from `style/app-fixed.module.css`.
 * - If the `image` prop is not provided, a default placeholder image is displayed.
 * - The card is wrapped in an anchor (`<a>`) tag that navigates to the organization's home page.
 *
 * @example
 * Here's an example of how to use the `OrganizationCardStart` component:
 * ```tsx
 * <OrganizationCardStart
 *   id="123"
 *   name="Example Organization"
 *   image="https://example.com/logo.png"
 * />
 * ```
 *
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import type { InterfaceOrganizationCardStartProps } from 'types/AdminPortal/Organization/interface';

function organizationCardStart(
  props: InterfaceOrganizationCardStartProps,
): JSX.Element {
  const uri = '/orghome/i=' + props.id;

  return (
    <>
      <a href={uri}>
        <div className={styles.box}>
          <div className={styles.first_box}>
            {props.image ? (
              <img src={props.image} className={styles.alignimg} />
            ) : (
              <img
                src="https://via.placeholder.com/80"
                className={styles.alignimg}
              />
            )}
            <div className={styles.second_box}>
              <h4>{props.name}</h4>
              <h5></h5>
            </div>
          </div>
          <div className={styles.deco}></div>
        </div>
      </a>
    </>
  );
}

export default organizationCardStart;
