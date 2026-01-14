import React from 'react';
import { useInRouterContext } from 'react-router-dom';
import BreadcrumbsComponent from './BreadcrumbsComponent';
import type { IBreadcrumbsComponentProps } from 'types/shared-components/BreadcrumbsComponent/interface';

/**
 * SafeBreadcrumbs is a defensive wrapper around {@link BreadcrumbsComponent}.
 *
 * It ensures breadcrumbs are only rendered when the component is mounted
 * within a valid React Router context. When rendered outside of a router,
 * the component safely returns `null` to prevent runtime errors.
 *
 * In non-production environments, a warning is logged to aid debugging
 * and improve developer experience.
 *
 * @param props - Props forwarded to {@link BreadcrumbsComponent}.
 * @returns A breadcrumb trail when inside a router context, otherwise `null`.
 */
const SafeBreadcrumbs = (props: IBreadcrumbsComponentProps) => {
  const inRouter = useInRouterContext();

  if (!inRouter) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'SafeBreadcrumbs must be used within a Router. Breadcrumbs were not rendered.',
      );
    }
    return null;
  }

  return <BreadcrumbsComponent {...props} />;
};

export default SafeBreadcrumbs;
