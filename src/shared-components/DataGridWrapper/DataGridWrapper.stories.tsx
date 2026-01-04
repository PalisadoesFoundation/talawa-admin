import { DataGridWrapper } from './DataGridWrapper';
import type { InterfaceDataGridWrapperProps } from '../../types/DataGridWrapper/interface';
import type { Meta, StoryObj } from '@storybook/react';
import type { GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Sample data type
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

// Sample data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Moderator',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Eve Wilson',
    email: 'eve@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Frank Castle',
    email: 'frank@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '8',
    name: 'Henry Ford',
    email: 'henry@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '9',
    name: 'Iris West',
    email: 'iris@example.com',
    role: 'Moderator',
    status: 'Active',
  },
  {
    id: '10',
    name: 'Jack Ryan',
    email: 'jack@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    id: '11',
    name: 'Kate Bishop',
    email: 'kate@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '12',
    name: 'Leo Valdez',
    email: 'leo@example.com',
    role: 'Admin',
    status: 'Active',
  },
];

// Column definitions
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
];

const meta: Meta<typeof DataGridWrapper> = {
  title: 'Components/DataGridWrapper',
  component: DataGridWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A standardized wrapper around Material-UI DataGrid with built-in search, sorting, pagination, and error handling capabilities.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<InterfaceDataGridWrapperProps<User>>;

/**
 * Basic usage of DataGridWrapper with minimal configuration.
 * Just provide rows and columns to display a simple data table.
 */
export const BasicUsage: Story = {
  args: {
    rows: sampleUsers.slice(0, 5),
    columns,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic usage showing a simple data grid with rows and columns.',
      },
    },
  },
};

/**
 * DataGridWrapper with integrated search functionality.
 * Search across multiple fields with a built-in search bar.
 */
export const WithSearch: Story = {
  args: {
    rows: sampleUsers,
    columns,
    searchConfig: {
      enabled: true,
      fields: ['name', 'email', 'role'],
      placeholder: 'Search users by name, email, or role...',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays a search bar that filters across name, email, and role fields. The search is case-insensitive and updates in real-time.',
      },
    },
  },
};

/**
 * DataGridWrapper with sorting dropdown.
 * Pre-configured sorting options for common use cases.
 */
export const WithSorting: Story = {
  args: {
    rows: sampleUsers,
    columns,
    sortConfig: {
      defaultSortField: 'name',
      defaultSortOrder: 'asc',
      sortingOptions: [
        { label: 'Name (A-Z)', value: 'name_asc' },
        { label: 'Name (Z-A)', value: 'name_desc' },
        { label: 'Email (A-Z)', value: 'email_asc' },
        { label: 'Email (Z-A)', value: 'email_desc' },
        { label: 'Role (A-Z)', value: 'role_asc' },
        { label: 'Role (Z-A)', value: 'role_desc' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows a sorting dropdown with predefined sorting options. Default sort is by name (ascending).',
      },
    },
  },
};

/**
 * DataGridWrapper with pagination enabled.
 * Useful for displaying large datasets with configurable page sizes.
 */
export const WithPagination: Story = {
  args: {
    rows: sampleUsers,
    columns,
    paginationConfig: {
      enabled: true,
      defaultPageSize: 5,
      pageSizeOptions: [5, 10, 25, 50],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates pagination with customizable page sizes. Users can select from 5, 10, 25, or 50 rows per page.',
      },
    },
  },
};

/**
 * DataGridWrapper with custom action column.
 * Add interactive buttons for each row.
 */
export const WithActionColumn: Story = {
  args: {
    rows: sampleUsers.slice(0, 5),
    columns,
    actionColumn: (row: User) => (
      <>
        <IconButton
          onClick={() => alert(`Edit user: ${row.name}`)}
          aria-label={'Edit ' + row.name}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => alert(`Delete user: ${row.name}`)}
          aria-label={'Delete ' + row.name}
          size="small"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows an action column with Edit and Delete buttons for each row. The action column is automatically appended to the right.',
      },
    },
  },
};

/**
 * DataGridWrapper in loading state.
 * Displays a loading overlay while data is being fetched.
 */
export const LoadingState: Story = {
  args: {
    rows: [],
    columns,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the loading state with a custom LoadingState component overlay.',
      },
    },
  },
};

/**
 * DataGridWrapper with empty state.
 * Displays a message when no data is available.
 */
export const EmptyState: Story = {
  args: {
    rows: [],
    columns,
    emptyStateMessage: 'No users found. Try adjusting your filters.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays a custom empty state message when there are no rows to show.',
      },
    },
  },
};

/**
 * DataGridWrapper with error state.
 * Shows an error message when data fetching fails.
 */
export const ErrorState: Story = {
  args: {
    rows: [],
    columns,
    error: 'Failed to load users. Please try again later.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays an error message with proper ARIA attributes for accessibility.',
      },
    },
  },
};

/**
 * Complete example with all features enabled.
 * Demonstrates search, sorting, pagination, and action column together.
 */
export const CompleteExample: Story = {
  args: {
    rows: sampleUsers,
    columns,
    searchConfig: {
      enabled: true,
      fields: ['name', 'email', 'role', 'status'],
      placeholder: 'Search users...',
    },
    sortConfig: {
      defaultSortField: 'name',
      defaultSortOrder: 'asc',
      sortingOptions: [
        { label: 'Name (A-Z)', value: 'name_asc' },
        { label: 'Name (Z-A)', value: 'name_desc' },
        { label: 'Email (A-Z)', value: 'email_asc' },
        { label: 'Email (Z-A)', value: 'email_desc' },
      ],
    },
    paginationConfig: {
      enabled: true,
      defaultPageSize: 5,
      pageSizeOptions: [5, 10, 25],
    },
    actionColumn: (row: User) => (
      <>
        <IconButton
          onClick={() => alert(`Edit user: ${row.name}`)}
          aria-label={'Edit ' + row.name}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => alert('Delete user: ' + row.name)}
          aria-label={'Delete ' + row.name}
          size="small"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    ),
    onRowClick: (row: User) => alert(`Row clicked: ${row.name}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A fully-featured example showing all capabilities: search, sorting, pagination, action column, and row click handler.',
      },
    },
  },
};

/**
 * DataGridWrapper with custom empty state and search.
 * Shows how empty state interacts with search functionality.
 */
export const SearchWithNoResults: Story = {
  args: {
    rows: sampleUsers,
    columns,
    searchConfig: {
      enabled: true,
      fields: ['name', 'email'],
      placeholder: 'Try searching for "nonexistent"...',
    },
    emptyStateMessage: 'No matching users found. Try a different search term.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the empty state message when search returns no results.',
      },
    },
  },
};

/**
 * DataGridWrapper with row click handler.
 * Responds to row clicks for navigation or modal opening.
 */
export const WithRowClick: Story = {
  args: {
    rows: sampleUsers.slice(0, 5),
    columns,
    onRowClick: (row: User) => alert(`Clicked on user: ${row.name}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Clicking any row triggers a callback with the row data. Useful for navigation or opening detail modals.',
      },
    },
  },
};
