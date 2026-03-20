# Common Components

Reusable components for consistent UI patterns across the application.

## TableFilters

A flexible filter bar component with search input, dropdown filters, and clear functionality.

### Props

- `searchValue` (string, required): Current search value
- `searchPlaceholder` (string, optional): Placeholder text for search input (default: "Search...")
- `onSearchChange` (function, required): Callback when search value changes
- `filters` (FilterOption[], optional): Array of filter dropdown configurations
- `onClearAll` (function, optional): Callback when clear button is clicked
- `showClearButton` (boolean, optional): Whether to show the clear button
- `children` (ReactNode, optional): Custom filter elements (e.g., date picker)

### FilterOption Interface

```typescript
interface FilterOption {
  label: string;        // Dropdown label/placeholder
  value: string;        // Current selected value
  options: string[];    // Available options
  onChange: (value: string) => void;  // Change handler
}
```

### Usage Example

```tsx
import { TableFilters } from '../../../components/common';

<TableFilters
  searchValue={search}
  searchPlaceholder="Search products..."
  onSearchChange={setSearch}
  filters={[
    {
      label: 'Filter by Category',
      value: filterCategory,
      options: categoryOptions,
      onChange: setFilterCategory
    },
    {
      label: 'Filter by Status',
      value: filterStatus,
      options: statusOptions,
      onChange: setFilterStatus
    }
  ]}
  onClearAll={() => {
    setSearch('');
    setFilterCategory('');
    setFilterStatus('');
  }}
  showClearButton={!!(search || filterCategory || filterStatus)}
>
  {/* Custom filters like date picker */}
  <input type="date" value={date} onChange={e => setDate(e.target.value)} />
</TableFilters>
```

## DataTableWrapper

A styled table component with consistent header, body, and action button styling.

### Props

- `data` (T[], required): Array of data objects (must have `id` field)
- `columns` (Column<T>[], required): Column configuration
- `actions` (Action<T>[], optional): Action buttons for each row
- `emptyMessage` (string, optional): Message when no data (default: "No data found")
- `maxHeight` (string, optional): Max height for scrollable table (default: "60vh")

### Column Interface

```typescript
interface Column<T> {
  key: keyof T;                          // Data key
  label: string;                         // Column header
  align?: 'left' | 'center' | 'right';  // Text alignment
  render?: (value: any, row: T) => ReactNode;  // Custom renderer
}
```

### Action Interface

```typescript
interface Action<T> {
  label: string;                         // Action label
  icon: ReactNode;                       // Icon element
  onClick: (row: T) => void;            // Click handler
  variant?: 'primary' | 'danger';       // Button style
  title?: string;                        // Tooltip text
}
```

### Usage Example

```tsx
import { DataTableWrapper } from '../../../components/common';
import { Edit, Trash2 } from 'lucide-react';

const columns = [
  {
    key: 'name' as const,
    label: 'Product Name',
    render: (value: string) => (
      <span className="font-semibold">{value}</span>
    )
  },
  {
    key: 'price' as const,
    label: 'Price',
    align: 'right' as const,
    render: (value: number) => `$${value.toFixed(2)}`
  }
];

<DataTableWrapper
  data={products}
  columns={columns}
  actions={[
    {
      label: 'Edit',
      icon: <Edit size={14} />,
      onClick: (item) => handleEdit(item),
      variant: 'primary',
      title: 'Edit product'
    },
    {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      onClick: (item) => handleDelete(item),
      variant: 'danger',
      title: 'Delete product'
    }
  ]}
  emptyMessage="No products found"
/>
```

## Complete Page Example

```tsx
import React, { useState, useMemo } from 'react';
import { TableFilters, DataTableWrapper } from '../../../components/common';
import { Edit, Trash2 } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map(p => p.category))),
    [products]
  );

  const displayed = useMemo(
    () => products.filter(p =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCategory || p.category === filterCategory)
    ),
    [products, search, filterCategory]
  );

  const columns = [
    {
      key: 'name' as const,
      label: 'Product',
      render: (value: string) => <span className="font-semibold">{value}</span>
    },
    {
      key: 'category' as const,
      label: 'Category'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>

      <TableFilters
        searchValue={search}
        searchPlaceholder="Search products..."
        onSearchChange={setSearch}
        filters={[
          {
            label: 'Filter by Category',
            value: filterCategory,
            options: categoryOptions,
            onChange: setFilterCategory
          }
        ]}
        onClearAll={() => {
          setSearch('');
          setFilterCategory('');
        }}
        showClearButton={!!(search || filterCategory)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          {
            label: 'Edit',
            icon: <Edit size={14} />,
            onClick: (item) => console.log('Edit', item),
            variant: 'primary'
          },
          {
            label: 'Delete',
            icon: <Trash2 size={14} />,
            onClick: (item) => console.log('Delete', item),
            variant: 'danger'
          }
        ]}
      />
    </div>
  );
};
```

## Styling

Both components use consistent styling:
- Dark blue header (#002147)
- Alternating row colors (white / slate-50/30)
- Hover effects on rows
- Consistent spacing and borders
- Responsive design with mobile support
