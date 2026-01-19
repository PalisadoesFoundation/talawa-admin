/**
 * UserTags
 *
 * Displays a list of tags associated with a user.
 *
 * The component provides client-side sorting and searching functionality
 * to help users quickly locate specific tags.
 *
 * Tags are currently rendered from a static dataset and displayed in a
 * table with metadata such as assignment count, creation date,
 * and creator information.
 *
 * @returns The rendered UserTags component.
 *
 * @remarks
 * - Uses React state to manage sorting and search input.
 * - Supports sorting tags by latest or oldest creation time.
 * - Supports searching tags by tag name or creator name.
 * - Uses the reusable PeopleTabNavbar component for search and sort controls.
 * - Applies client-side filtering and sorting before rendering.
 * - Displays tags in a semantic HTML table.
 *
 * @example
 * ```tsx
 * <UserTags />
 * ```
 */
import React, { useState } from 'react';
import styles from './UserTags.module.css';
import { useTranslation } from 'react-i18next';
import PeopleTabNavbar from 'shared-components/PeopleTabNavbar/PeopleTabNavbar';

const UserTags = () => {
  const { t: tCommon } = useTranslation('common');
  const [sortBy, setSortBy] = useState('Sort');
  const [searchTerm, setSearchTerm] = useState('');

  const dummyTags = [
    {
      id: 1,
      name: 'Marketing Campaign',
      assignedTo: 167,
      createdOn: '18:00 12 May 2023',
      createdBy: 'John Doe',
    },
    {
      id: 2,
      name: 'Product Launch',
      assignedTo: 142,
      createdOn: '14:30 15 May 2023',
      createdBy: 'Sarah Smith',
    },
    {
      id: 3,
      name: 'Customer Support',
      assignedTo: 203,
      createdOn: '09:15 18 May 2023',
      createdBy: 'Mike Johnson',
    },
    {
      id: 4,
      name: 'Sales Q2',
      assignedTo: 89,
      createdOn: '16:45 20 May 2023',
      createdBy: 'John Doe',
    },
    {
      id: 5,
      name: 'Development Sprint',
      assignedTo: 156,
      createdOn: '11:20 22 May 2023',
      createdBy: 'Emma Wilson',
    },
    {
      id: 6,
      name: 'Design Review',
      assignedTo: 78,
      createdOn: '13:00 25 May 2023',
      createdBy: 'Sarah Smith',
    },
    {
      id: 7,
      name: 'Budget Planning',
      assignedTo: 45,
      createdOn: '10:30 28 May 2023',
      createdBy: 'David Lee',
    },
    {
      id: 8,
      name: 'Team Building',
      assignedTo: 234,
      createdOn: '15:15 30 May 2023',
      createdBy: 'Mike Johnson',
    },
    {
      id: 9,
      name: 'Security Audit',
      assignedTo: 67,
      createdOn: '09:45 02 Jun 2023',
      createdBy: 'John Doe',
    },
  ];

  const sortTags = (
    tags: {
      id: number;
      name: string;
      assignedTo: number;
      createdOn: string;
      createdBy: string;
    }[],
  ) => {
    const sorted = [...tags];
    if (sortBy === 'latest') {
      return sorted.reverse();
    }
    return sorted;
  };

  const filterTags = (
    tags: {
      id: number;
      name: string;
      assignedTo: number;
      createdOn: string;
      createdBy: string;
    }[],
  ) => {
    if (!searchTerm) return tags;
    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const displayTags = sortTags(filterTags(dummyTags));

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

      {/* Table */}
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
                <td className={styles.peopleTabUserTagTableCell}>{tag.name}</td>
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
    </div>
  );
};

export default UserTags;
