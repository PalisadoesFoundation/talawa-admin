/**
 * BreadcrumbsComponent
 *
 * A reusable breadcrumb navigation component that provides
 * a consistent, accessible breadcrumb trail across the
 * Talawa Admin application.
 *
 * Features:
 * - Standardized breadcrumb rendering using MUI Breadcrumbs
 * - React Router integration for navigable breadcrumb items
 * - i18n support via translation keys with fallback labels
 * - Accessibility support with nav landmark and aria-current
 * - No hardcoded strings; fully translation-driven
 *
 * @component
 * @example
 * <BreadcrumbsComponent
 *   items={[
 *     { translationKey: 'common.organizations', to: '/organizations' },
 *     { translationKey: 'dashboard.title', isCurrent: true }
 *   ]}
 * />
 *
 * @remarks
 * - Requires i18n key `breadcrumbs` in the `common` namespace for aria-label.
 * - Intended as the standard breadcrumb implementation.
 */
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import type {
  IBreadcrumbItem,
  IBreadcrumbsComponentProps,
} from 'types/shared-components/BreadcrumbsComponent/interface';

const BreadcrumbsComponent = ({
  items,
  ariaLabelTranslationKey = 'breadcrumbs',
}: IBreadcrumbsComponentProps): JSX.Element | null => {
  const { t } = useTranslation('common');

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label={t(ariaLabelTranslationKey)}>
      <Breadcrumbs component="ol">
        {items.map((item: IBreadcrumbItem, index: number) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.isCurrent === true || isLast;

          const label = item.translationKey
            ? t(item.translationKey)
            : (item.label ?? '');

          const key = item.to ?? item.translationKey ?? item.label ?? index;

          if (isCurrent) {
            return (
              <Typography key={key} color="text.primary" aria-current="page">
                {label}
              </Typography>
            );
          }

          if (item.to) {
            return (
              <MuiLink
                key={key}
                component={RouterLink}
                to={item.to}
                underline="hover"
                color="inherit"
              >
                {label}
              </MuiLink>
            );
          }

          return (
            <Typography key={key} color="text.primary">
              {label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </nav>
  );
};

export default BreadcrumbsComponent;
