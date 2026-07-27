/**
 * Action item category management — CRUD, search, filter, sort.
 */
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './OrgActionItemCategories.module.css';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import dayjs from 'dayjs';
import CategoryModal from './Modal/ActionItemCategoryModal';
import CategoryViewModal from './Modal/ActionItemCategoryViewModal';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { useModalState } from 'shared-components/CRUDModalTemplate';

enum CategoryStatus {
  Active = 'active',
  Disabled = 'disabled',
}

interface IActionItemCategoryProps {
  orgId: string;
}

/** SVG icons */
const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const OrgActionItemCategories: FC<IActionItemCategoryProps> = ({ orgId }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const [category, setCategory] = useState<IActionItemCategoryInfo | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );
  const [status, setStatus] = useState<CategoryStatus | null>(null);
  const [categories, setCategories] = useState<IActionItemCategoryInfo[]>([]);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('create');
  const categoryModal = useModalState();
  const viewModal = useModalState();

  const {
    data: catData,
    loading: catLoading,
    error: catError,
    refetch: refetchCategories,
  }: {
    data?: { actionCategoriesByOrganization: IActionItemCategoryInfo[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: { input: { organizationId: orgId } },
  });

  const handleOpenModal = useCallback(
    (cat: IActionItemCategoryInfo | null, mode: 'edit' | 'create') => {
      setCategory(cat);
      setModalMode(mode);
      categoryModal.open();
    },
    [categoryModal],
  );

  useEffect(() => {
    if (!catData?.actionCategoriesByOrganization) return;

    let filtered = catData.actionCategoriesByOrganization;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }

    if (status !== null) {
      filtered = filtered.filter((c) =>
        status === CategoryStatus.Active ? !c.isDisabled : c.isDisabled,
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const d =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortBy === 'createdAt_DESC' ? d : -d;
    });

    setCategories(filtered);
  }, [catData, searchTerm, status, sortBy]);

  if (catError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        // css-check-ignore-next-line
        <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
        <div className={styles.errorText}>
          {tErrors('errorLoading', { entity: 'Action Item Categories' })}
          <br />
          {catError.message}
        </div>
      </div>
    );
  }

  return (
    <LoadingState isLoading={catLoading} variant="spinner">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <SearchBar
          placeholder={tCommon('searchByName')}
          onSearch={setSearchTerm}
          inputTestId="searchByName"
          buttonTestId="searchBtn"
          showSearchButton={false}
          showLeadingIcon
          showClearButton
        />
        <SortingButton
          title={tCommon('sort')}
          sortingOptions={[
            { label: tCommon('createdLatest'), value: 'createdAt_DESC' },
            { label: tCommon('createdEarliest'), value: 'createdAt_ASC' },
          ]}
          selectedOption={
            sortBy === 'createdAt_DESC'
              ? tCommon('createdLatest')
              : tCommon('createdEarliest')
          }
          onSortChange={(v) =>
            setSortBy(v as 'createdAt_DESC' | 'createdAt_ASC')
          }
          dataTestIdPrefix="sort"
          buttonLabel={tCommon('sort')}
          type="sort"
        />
        <SortingButton
          title={t('status')}
          sortingOptions={[
            { label: tCommon('all'), value: 'all' },
            { label: tCommon('active'), value: CategoryStatus.Active },
            { label: tCommon('disabled'), value: CategoryStatus.Disabled },
          ]}
          selectedOption={
            status === null
              ? tCommon('all')
              : status === CategoryStatus.Active
                ? tCommon('active')
                : tCommon('disabled')
          }
          onSortChange={(v) =>
            setStatus(v === 'all' ? null : (v as CategoryStatus))
          }
          dataTestIdPrefix="filter"
          buttonLabel={t('status')}
          type="filter"
        />
        <div className={styles.toolbarSpacer} />
        <button
          className={styles.createBtn}
          onClick={() => handleOpenModal(null, 'create')}
          data-testid="createActionItemCategoryBtn"
        >
          <PlusIcon />
          {tCommon('create')}
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>{tCommon('category')}</th>
              <th>{t('status')}</th>
              <th>{tCommon('createdOn')}</th>
              <th>{tCommon('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>
                  {t('noActionItemCategories')}
                </td>
              </tr>
            ) : (
              categories.map((cat, i) => (
                <tr key={cat.id}>
                  <td>{i + 1}</td>
                  <td>
                    <span className={styles.categoryName}>{cat.name}</span>
                  </td>
                  <td>
                    <StatusBadge
                      variant={cat.isDisabled ? 'disabled' : 'active'}
                      size="sm"
                      dataTestId="statusChip"
                    />
                  </td>
                  <td>{dayjs(cat.createdAt).format('DD/MM/YYYY')}</td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button
                        className={styles.iconBtn}
                        data-testid={`viewCategoryBtn${i + 1}`}
                        onClick={() => {
                          setCategory(cat);
                          viewModal.open();
                        }}
                        title={tCommon('view')}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        className={styles.iconBtn}
                        data-testid={`editCategoryBtn${i + 1}`}
                        onClick={() => handleOpenModal(cat, 'edit')}
                        title={tCommon('edit')}
                      >
                        <PencilIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={categoryModal.isOpen}
        hide={categoryModal.close}
        refetchCategories={refetchCategories}
        category={category}
        orgId={orgId}
        mode={modalMode}
      />
      <CategoryViewModal
        isOpen={viewModal.isOpen}
        hide={viewModal.close}
        category={category}
      />
    </LoadingState>
  );
};

export default OrgActionItemCategories;
