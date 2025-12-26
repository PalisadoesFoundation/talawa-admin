import React from 'react';
import { useInRouterContext } from 'react-router-dom';
import BreadcrumbsComponent from './BreadcrumbsComponent';
import type { IBreadcrumbsComponentProps } from 'types/shared-components/BreadcrumbsComponent/interface';

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
