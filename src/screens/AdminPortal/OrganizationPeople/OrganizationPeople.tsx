/**
 * OrganizationPeople Component
 *
 * Renders a paginated and searchable card-based list of organization members,
 * administrators, or users. Uses CursorPaginationManager for cursor-based
 * pagination with "Load More" pattern.
 *
 * @remarks
 * - Uses two CursorPaginationManagers: one for members/admins, one for users.
 * - Supports filtering by roles (members, administrators, users) via a dropdown.
 * - Includes client-side search filtering by name or email.
 * - Displays a modal for removing members.
 *
 * @returns A JSX element rendering the organization people table.
 */
import React, { useMemo, useRef, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, Link } from 'react-router';
import { Delete } from '@mui/icons-material';

import styles from './OrganizationPeople.module.css';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import OrgPeopleListCard from 'components/AdminPortal/OrgPeopleListCard/OrgPeopleListCard';
import Avatar from 'shared-components/Avatar/Avatar';
import AddMember from './addMember/AddMember';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import { languages } from 'utils/languages';
import Button from 'shared-components/Button';
import type { InterfaceMemberNode } from 'types/PeopleTab/interface';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';

const STATE_TO_OPTION: Record<number, string> = {
  0: 'members',
  1: 'admin',
  2: 'users',
};

const OPTION_TO_STATE: Record<string, number> = {
  members: 0,
  admin: 1,
  users: 2,
};

function OrganizationPeople(): JSX.Element {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const role = location?.state;
  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(() => {
    const r = role?.role;
    return r === 0 || r === 1 || r === 2 ? r : 0;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const {
    isOpen: showRemoveModal,
    open: openRemoveModal,
    close: closeRemoveModal,
  } = useModalState();
  const [selectedMemId, setSelectedMemId] = useState<string>();

  const whereFilter = useMemo(() => {
    return state === 1
      ? { role: { equal: 'administrator' as const } }
      : undefined;
  }, [state]);

  const toggleRemoveMemberModal = (id: string): void => {
    setSelectedMemId(id);
    openRemoveModal();
  };

  const handleSortChange = (value: string): void => {
    setState(OPTION_TO_STATE[value] ?? 0);
  };

  const locale = useMemo(() => {
    const currentLang = languages.find(
      (lang: { code: string; country_code: string }) =>
        lang.code === i18n.language,
    );
    return currentLang
      ? `${currentLang.code}-${currentLang.country_code}`
      : 'en-US';
  }, [i18n.language]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      }),
    [locale],
  );

  const visibleCount = useRef(0);

  const renderMemberRow = (
    node: InterfaceMemberNode,
    index: number,
  ): React.ReactNode => {
    if (index === 0) visibleCount.current = 0;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      const nameMatch = node.name?.toLowerCase().includes(lower);
      const emailMatch = node.emailAddress?.toLowerCase().includes(lower);
      if (!nameMatch && !emailMatch) return null;
    }

    visibleCount.current += 1;

    const formattedDate = node.createdAt
      ? dateFormatter.format(new Date(node.createdAt))
      : '-';

    return (
      <div
        className={styles.peopleRow}
        data-testid={`org-people-row-${node.id}`}
        role="row"
      >
        <span
          className={`d-flex ${styles.people_card_header_col_1}`}
          role="cell"
        >
          <span>{visibleCount.current}</span>
          <span className={styles.avatarCell}>
            {node.avatarURL ? (
              <img
                src={node.avatarURL}
                alt={node.name}
                className={styles.avatarImage}
                crossOrigin="anonymous"
              />
            ) : (
              <Avatar name={node.name} alt={node.name} size={40} />
            )}
          </span>
        </span>
        <span className={styles.people_card_header_col_2} role="cell">
          <Link
            to={`/admin/member/${currentUrl}/${node.id}`}
            state={{ id: node.id }}
            className={`${styles.membername}`}
          >
            {node.name}
          </Link>
        </span>
        <span className={styles.people_card_header_col_2} role="cell">
          {node.emailAddress ?? t('emailNotAvailable')}
        </span>
        <span
          className={styles.people_card_header_col_2}
          role="cell"
          data-testid={`org-people-joined-${node.id}`}
        >
          {t('joined')} : {formattedDate}
        </span>
        <span className={styles.people_card_header_col_1} role="cell">
          <Button
            className={styles.removeButton}
            variant="danger"
            disabled={state === 2}
            onClick={() => toggleRemoveMemberModal(node.id)}
            aria-label={tCommon('removeMember')}
            data-testid="removeMemberModalBtn"
          >
            <Delete />
          </Button>
        </span>
      </div>
    );
  };

  return (
    <>
      <SafeBreadcrumbs
        items={[
          {
            translationKey: 'organization',
            to: `/admin/orgdash/${currentUrl}`,
          },
          {
            translationKey: 'people',
            isCurrent: true,
          },
        ]}
      />
      <div className={styles.orgPeopleGrid}>
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={t('searchFullName')}
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          searchInputTestId="member-search-input"
          searchButtonTestId="searchBtn"
          containerClassName={styles.calendar__header}
          dropdowns={[
            {
              id: 'organization-people-sort',
              label: tCommon('sort'),
              type: 'sort',
              options: [
                { label: tCommon('members'), value: 'members' },
                { label: tCommon('admin'), value: 'admin' },
                { label: tCommon('users'), value: 'users' },
              ],
              selectedOption: STATE_TO_OPTION[state] ?? 'members',
              onOptionChange: (value) => handleSortChange(value.toString()),
              dataTestIdPrefix: 'sort',
              containerClassName: styles.membersSortContainer,
              toggleClassName: styles.membersSortToggle,
            },
          ]}
          additionalButtons={
            <AddMember
              rootClassName={styles.membersAddHeader}
              containerClassName={styles.membersAddContainer}
              toggleClassName={styles.membersAddToggle}
            />
          }
        />

        <div
          className={styles.people_content}
          role="table"
          aria-label={t('title')}
        >
          <div role="rowgroup">
            <div className={styles.people_card_header} role="row">
              <span
                className={`d-flex ${styles.people_card_header_col_1}`}
                role="columnheader"
              >
                <span>#</span>
              </span>
              <span
                className={styles.people_card_header_col_2}
                role="columnheader"
              >
                {tCommon('name')}
              </span>
              <span
                className={styles.people_card_header_col_2}
                role="columnheader"
              >
                {tCommon('email')}
              </span>
              <span
                className={styles.people_card_header_col_2}
                role="columnheader"
              >
                {tCommon('joinedOn')}
              </span>
              <span
                className={styles.people_card_header_col_1}
                role="columnheader"
              >
                {tCommon('action')}
              </span>
            </div>
          </div>

          <div className={styles.people_card_main_container} role="rowgroup">
            {state !== 2 ? (
              <CursorPaginationManager<
                unknown,
                InterfaceMemberNode,
                Record<string, unknown>
              >
                query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
                queryVariables={{
                  orgId: currentUrl,
                  where: whereFilter,
                }}
                dataPath="organization.members"
                itemsPerPage={10}
                keyExtractor={(node: InterfaceMemberNode) => node.id}
                renderItem={renderMemberRow}
                emptyStateComponent={
                  <span data-testid="organization-people-empty-state">
                    {t('notFound')}
                  </span>
                }
              />
            ) : (
              <CursorPaginationManager<
                unknown,
                InterfaceMemberNode,
                Record<string, unknown>
              >
                query={USER_LIST_FOR_TABLE}
                queryVariables={{}}
                dataPath="allUsers"
                itemsPerPage={10}
                refetchTrigger={state}
                keyExtractor={(node: InterfaceMemberNode) => node.id}
                renderItem={renderMemberRow}
                emptyStateComponent={
                  <span data-testid="organization-people-empty-state">
                    {t('notFound')}
                  </span>
                }
              />
            )}
          </div>
        </div>
      </div>

      {showRemoveModal && selectedMemId && (
        <OrgPeopleListCard
          id={selectedMemId}
          toggleRemoveModal={closeRemoveModal}
        />
      )}
    </>
  );
}

export default OrganizationPeople;
