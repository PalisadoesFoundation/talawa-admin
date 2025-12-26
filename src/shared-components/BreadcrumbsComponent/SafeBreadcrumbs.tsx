import React from 'react';
import { useInRouterContext } from 'react-router-dom';
import BreadcrumbsComponent from './BreadcrumbsComponent';
import type { IBreadcrumbsComponentProps } from 'types/shared-components/BreadcrumbsComponent/interface';

const SafeBreadcrumbs = (props: IBreadcrumbsComponentProps) => {
  const inRouter = useInRouterContext();

  if (!inRouter) {
    return null;
  }

  return <BreadcrumbsComponent {...props} />;
};

export default SafeBreadcrumbs;
