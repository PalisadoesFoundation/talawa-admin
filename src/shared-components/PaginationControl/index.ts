/**
 * PaginationControl - Standardized pagination component
 *
 * Replaces inconsistent pagination patterns:
 * - paginationModel/onPaginationModelChange
 * - MUI Pagination component
 * - Varying "Rows per page" implementations
 *
 * @example
 * ```tsx
 * const [currentPage, setCurrentPage] = useState(1);
 * const [pageSize, setPageSize] = useState(25);
 *
 * <PaginationControl
 *   currentPage={currentPage}
 *   totalPages={Math.ceil(totalItems / pageSize)}
 *   pageSize={pageSize}
 *   totalItems={247}
 *   onPageChange={setCurrentPage}
 *   onPageSizeChange={(size) => {
 *     setPageSize(size);
 *     setCurrentPage(1); // Reset to first page
 *   }}
 * />
 * ```
 */

export { PaginationControl } from './PaginationControl';
export type { InterfacePaginationControlProps } from '../../types/shared-components/PaginationControl/interface';
