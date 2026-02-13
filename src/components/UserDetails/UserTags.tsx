/**
 * UserTags component
 *
 * Displays a list of tags associated with a specific user. Provides
 * client-side searching and sorting functionality to help quickly
 * locate tags by name or creator.
 *
 * Features:
 * - Search tags by tag name or creator name.
 * - Sort tags by "Latest" or "Oldest" creation date.
 * - Shows metadata for each tag including:
 *   - Number of assignees
 *   - Creation date (formatted as `HH:mm DD MMM YYYY`)
 *   - Creator name
 * - Handles loading and error states during GraphQL query execution.
 *
 * @param id - User ID used to fetch tags via GraphQL. Required for the query to run.
 *
 * @returns JSX.Element representing the user tags table and controls.
 *
 * @remarks
 * - Uses Apollo Client `useQuery` hook to fetch tags (`GET_USER_TAGS` query).
 * - Uses `react-i18next` for localization.
 * - Uses React state to manage search input (`searchTerm`) and sort selection (`sortBy`).
 * - Applies client-side filtering and sorting before rendering.
 * - Uses reusable `PeopleTabNavbar` for search and sort UI.
 * - Displays tags in a semantic HTML table with clickable creator names.
 *
 * @example
 * ```tsx
 * // Render user tags for a specific user
 * <UserTags id="12345" />
 * ```
 */

import React, { useState } from 'react';
import styles from './UserTags.module.css';
import { useTranslation } from 'react-i18next';
import PeopleTabNavbar from 'shared-components/PeopleTabNavbar/PeopleTabNavbar';
import { GET_USER_TAGS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { InterfaceUserTagsProps } from 'types/AdminPortal/UserDetails/UserTags/type';
import {
  InterfaceUserTag,
  InterfaceGetUserTagsData,
} from 'types/AdminPortal/UserDetails/UserTags/interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const UserTags = ({ id }: InterfaceUserTagsProps) => {
  const { t: tCommon } = useTranslation('common');
  const [sortBy, setSortBy] = useState('Sort');
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useQuery<InterfaceGetUserTagsData>(
    GET_USER_TAGS,
    {
      variables: { userId: id },
      skip: !id,
    },
  );

  const formatDate = (isoDate: string): string =>
    dayjs.utc(isoDate).format('HH:mm DD MMM YYYY');

  const userTags: InterfaceUserTag[] =
    data?.userTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      assignedTo: tag.assignees?.edges?.length ?? 0,
      createdAt: tag.createdAt,
      createdOn: formatDate(tag.createdAt),
      createdBy: tag.creator?.name,
    })) ?? [];
  const sortTags = (tags: InterfaceUserTag[]) => {
    const sorted = [...tags];

    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  const filterTags = (tags: InterfaceUserTag[]) => {
    if (!searchTerm) return tags;

    const term = searchTerm.toLowerCase();

    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(term) ||
        tag.createdBy?.toLowerCase().includes(term) ||
        tag.createdOn.toLowerCase().includes(term),
    );
  };

  if (loading) {
    return (
      <div className={styles.peopleTabUserTagContainer}>
        <p>{tCommon('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.peopleTabUserTagContainer}>
        <p>{tCommon('somethingWentWrong')}</p>
      </div>
    );
  }
  const displayTags = sortTags(filterTags(userTags));

  return (
    <div className={styles.peopleTabUserTagContainer}>
      {/* Controls */}
      <PeopleTabNavbar
        sorting={[
          {
            title: 'Sort By',
            options: [
              { label: 'Latest', value: 'latest' },
              { label: 'Oldest', value: 'oldest' },
            ],
            icon: '/images/svg/ri_arrow-up-down-line.svg',
            selected: sortBy,
            onChange: (value: string | number) =>
              setSortBy(value as 'latest' | 'oldest'),
            testIdPrefix: 'tagsSort',
          },
        ]}
        search={{
          placeholder: 'Search tags',
          onSearch: (value: string) => setSearchTerm(value),
          inputTestId: 'tagsSearchInput',
          buttonTestId: 'tagsSearchBtn',
        }}
      />
      {displayTags.length === 0 ? (
        <p className={styles.peopleTabUserTagNoResults}>
          {tCommon('noTagsFound')}
        </p>
      ) : (
        <div className={styles.peopleTabUserTagComponentSection}>
          <table className={styles.peopleTabUserTagTable}>
            <thead className={styles.peopleTabUserTagTableHeader}>
              <tr className={styles.peopleTabUserTagColumnHeader}>
                <th className={styles.peopleTabUserTagTableHeaderCell}>
                  {tCommon('peopleTabTagName')}
                </th>
                <th className={styles.peopleTabUserTagTableHeaderCell}>
                  {tCommon('assignedTo')}
                </th>
                <th className={styles.peopleTabUserTagTableHeaderCell}>
                  {tCommon('createdOn')}
                </th>
                <th className={styles.peopleTabUserTagTableHeaderCell}>
                  {tCommon('createdBy')}
                </th>
              </tr>
            </thead>

            <tbody className={styles.peopleTabUserTagTableBody}>
              {displayTags.map((tag) => (
                <tr key={tag.id} className={styles.peopleTabUserTagTableRow}>
                  <td className={styles.peopleTabUserTagTableCell}>
                    {tag.name}
                  </td>
                  <td className={styles.peopleTabUserTagTableCell}>
                    {tag.assignedTo}
                  </td>
                  <td className={styles.peopleTabUserTagTableCell}>
                    {tag.createdOn}
                  </td>
                  <td className={styles.peopleTabUserTagTableCell}>
                    <a className={styles.peopleTabUserTagCreatedByButton}>
                      {tag.createdBy}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTags;
