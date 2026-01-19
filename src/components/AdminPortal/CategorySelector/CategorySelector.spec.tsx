import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import dayjs from 'dayjs';
import CategorySelector from './CategorySelector';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';

describe('CategorySelector', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockCategories: IActionItemCategoryInfo[] = [
    {
      id: 'cat1',
      name: 'Category One',
      description: 'First category description',
      isDisabled: false,
      createdAt: dayjs().subtract(3, 'day').toISOString(),
      organizationId: 'org1',
    },
    {
      id: 'cat2',
      name: 'Category Two',
      description: 'Second category description',
      isDisabled: false,
      createdAt: dayjs().subtract(2, 'day').toISOString(),
      organizationId: 'org1',
    },
    {
      id: 'cat3',
      name: 'Category Three',
      description: null,
      isDisabled: true,
      createdAt: dayjs().subtract(1, 'day').toISOString(),
      organizationId: 'org1',
    },
  ];

  const renderComponent = (
    categories: IActionItemCategoryInfo[] = mockCategories,
    selectedCategory: IActionItemCategoryInfo | null = null,
    onCategoryChange = vi.fn(),
  ): ReturnType<typeof render> => {
    return render(
      <I18nextProvider i18n={i18n}>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </I18nextProvider>,
    );
  };

  it('renders the category select', () => {
    renderComponent();

    expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
  });

  it('renders the action item category label', () => {
    renderComponent();

    expect(screen.getByLabelText(/action item category/i)).toBeInTheDocument();
  });

  it('shows selected category when provided', () => {
    renderComponent(mockCategories, mockCategories[0]);

    const select = screen.getByTestId('categorySelect');
    expect(select).toHaveValue('cat1');
  });

  it('shows empty value when no category selected', () => {
    renderComponent(mockCategories, null);

    const select = screen.getByTestId('categorySelect');
    expect(select).toHaveValue('');
  });

  it('displays all category options', () => {
    renderComponent();

    const select = screen.getByTestId('categorySelect') as HTMLSelectElement;
    const options = Array.from(select.options).map((opt) => opt.text);

    // Check for the default option (either translation key or fallback)
    expect(
      options.some(
        (opt) =>
          opt === 'Select an action item category' ||
          opt === 'organizationActionItems.selectActionItemCategory',
      ),
    ).toBe(true);
    expect(options).toContain('Category One');
    expect(options).toContain('Category Two');
    expect(options).toContain('Category Three');
  });

  it('calls onCategoryChange when a category is selected', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, null, onCategoryChange);

    const user = userEvent.setup();
    const select = screen.getByTestId('categorySelect');

    await user.selectOptions(select, 'cat2');

    expect(onCategoryChange).toHaveBeenCalledWith(mockCategories[1]);
  });

  it('calls onCategoryChange with null when empty option is selected', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, mockCategories[0], onCategoryChange);

    const user = userEvent.setup();
    const select = screen.getByTestId('categorySelect');

    await user.selectOptions(select, '');

    expect(onCategoryChange).toHaveBeenCalledWith(null);
  });

  it('renders with empty categories array', () => {
    renderComponent([]);

    expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    const select = screen.getByTestId('categorySelect') as HTMLSelectElement;
    const options = Array.from(select.options);
    // Should only have the default "Select an action item category" option
    expect(options).toHaveLength(1);
    // Accept either the translation key or the translated text
    expect(
      options[0].text === 'Select an action item category' ||
        options[0].text === 'organizationActionItems.selectActionItemCategory',
    ).toBe(true);
  });

  it('has required attribute on select', () => {
    renderComponent();

    const select = screen.getByTestId('categorySelect');
    expect(select).toBeRequired();
  });

  it('displays category name correctly in options', () => {
    renderComponent();

    const select = screen.getByTestId('categorySelect') as HTMLSelectElement;
    const options = Array.from(select.options);

    // First option is the default "Select an action item category"
    expect(options[1].text).toBe('Category One');
    expect(options[2].text).toBe('Category Two');
    expect(options[3].text).toBe('Category Three');
  });

  it('allows selecting disabled category', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, null, onCategoryChange);

    const user = userEvent.setup();
    const select = screen.getByTestId('categorySelect');

    await user.selectOptions(select, 'cat3');

    expect(onCategoryChange).toHaveBeenCalledWith(mockCategories[2]);
  });

  it('uses correct test id for integration testing', () => {
    renderComponent();

    const select = screen.getByTestId('categorySelect');
    expect(select).toBeInTheDocument();
  });
});
