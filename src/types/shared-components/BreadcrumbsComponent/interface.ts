/**
 * Interface for individual breadcrumb items.
 *
 * Supports i18n via translation keys, optional navigation,
 * and current page marking for accessibility.
 */
export interface IBreadcrumbItem {
  /**
   * i18n translation key for the breadcrumb label.
   * Takes precedence over `label` if provided.
   */
  translationKey?: string;

  /**
   * Fallback label when no translation key is provided.
   */
  label?: string;

  /**
   * Navigation path for React Router `Link`.
   * If omitted, breadcrumb is rendered as plain text.
   */
  to?: string;

  /**
   * Marks the breadcrumb as the current page.
   *
   * @remarks
   * - This flag is optional and evaluated at runtime by the BreadcrumbsComponent.
   * - If omitted, the component treats the last breadcrumb item as current by convention.
   * - If multiple items are marked `isCurrent: true`, the first encountered
   *   item will be rendered as the active breadcrumb.
   *
   * Applies `aria-current="page"` for accessibility.
   */
  isCurrent?: boolean;
}

/**
 * Props for the BreadcrumbsComponent.
 */
export interface IBreadcrumbsComponentProps {
  /**
   * List of breadcrumb items to render.
   */
  items: IBreadcrumbItem[];

  /**
   * Optional aria-label translation key for the navigation landmark.
   *
   * @remarks
   * - Key is resolved from the `common` i18n namespace.
   * - Defaults to `'breadcrumbs'` (i.e., `common.breadcrumbs`).
   */
  ariaLabelTranslationKey?: string;
}
