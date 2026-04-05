/**
 * PageHeader — thin wrapper around Toolbar.
 *
 * @deprecated Use `Toolbar` from `shared-components/Toolbar/Toolbar` directly.
 * This component exists only for backward compatibility with existing call sites
 * that have not yet been migrated.
 */
import React from 'react';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import type { InterfacePageHeaderProps } from 'types/shared-components/Navbar/interface';

export default function PageHeader({
  title,
  search,
  sorting,
  actions,
  rootClassName,
}: InterfacePageHeaderProps) {
  return (
    <Toolbar
      title={title}
      search={
        search
          ? {
              placeholder: search.placeholder,
              onSearch: search.onSearch,
              inputTestId: search.inputTestId,
              buttonTestId: search.buttonTestId,
            }
          : undefined
      }
      filters={sorting?.map((s) => ({
        id: s.testIdPrefix,
        type: 'sort' as const,
        title: s.title,
        options: s.options,
        selected: s.selected,
        onChange: s.onChange,
        testIdPrefix: s.testIdPrefix,
        containerClassName: s.containerClassName,
        toggleClassName: s.toggleClassName,
        icon: s.icon,
      }))}
      actions={actions}
      rootClassName={rootClassName}
    />
  );
}
