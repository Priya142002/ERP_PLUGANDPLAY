import React, { useState, useMemo } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Spinner from './Spinner';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  className?: string;
  rowClassName?: (item: T) => string;
  selectedRows?: Set<string>;
  onRowSelect?: (itemId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  getRowId?: (item: T) => string;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    show?: (item: T) => boolean;
  }>;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  filterable = false,
  sortable = false,
  paginated = false,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  onEdit,
  onDelete,
  className = '',
  rowClassName,
  selectedRows,
  onRowSelect,
  onSelectAll,
  getRowId = (item) => item.id || String(Math.random()),
  actions = []
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchable && searchTerm) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          const value = item[column.key];
          return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filters
    if (filterable) {
      Object.entries(filters).forEach(([key, filterValue]) => {
        if (filterValue) {
          filtered = filtered.filter((item) => {
            const value = item[key as keyof T];
            return String(value || '').toLowerCase().includes(filterValue.toLowerCase());
          });
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filters, columns, searchable, filterable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  const handleRowSelect = (item: T, checked: boolean) => {
    if (onRowSelect) {
      onRowSelect(getRowId(item), checked);
    }
  };

  const isAllSelected = !!(selectedRows && paginatedData.length > 0 && 
    paginatedData.every(item => selectedRows.has(getRowId(item))));

  const isSomeSelected = !!(selectedRows && selectedRows.size > 0 && !isAllSelected);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="bg-white px-6 py-5 border-b border-slate-100 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {searchable && (
            <div className="flex-1">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                containerClassName="mb-0"
                leftIcon={
                  <svg className="w-4 h-4 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          )}
          
          {filterable && (
            <div className="flex gap-2">
              {columns.filter(col => col.filterable).map((column) => (
                <Select
                  key={String(column.key)}
                  placeholder={`Filter ${column.label}`}
                  value={filters[String(column.key)] || ''}
                  onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                  containerClassName="mb-0"
                  options={[
                    { value: '', label: `All ${column.label}` },
                    ...Array.from(new Set(data.map(item => String(item[column.key] || ''))))
                      .filter(Boolean)
                      .map(value => ({ value, label: value }))
                  ]}
                />
              ))}
            </div>
          )}
        </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {(selectedRows || onSelectAll) && (
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className=""
                  style={{ color: 'white' }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={`flex items-center space-x-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <span style={{ color: 'white' }}>{column.label}</span>
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-white'
                              : 'text-white/40'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                        </svg>
                        <svg
                          className={`w-3 h-3 -mt-1 ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-white'
                              : 'text-white/40'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(actions.length > 0 || onEdit || onDelete) && (
                <th className="px-5 py-4 !text-center uppercase tracking-widest" style={{ color: 'white' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectedRows ? 1 : 0) + (actions.length > 0 || onEdit || onDelete ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const rowId = getRowId(item);
                const isSelected = selectedRows?.has(rowId) || false;
                
                return (
                  <tr
                    key={rowId}
                    className={`
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${isSelected ? 'bg-primary-50' : ''}
                      ${rowClassName ? rowClassName(item) : ''}
                    `}
                    onClick={() => onRowClick?.(item)}
                  >
                    {(selectedRows || onRowSelect) && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(item, e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')
                        }
                      </td>
                    ))}
                    {(actions.length > 0 || onEdit || onDelete) && (
                      <td className="px-5 py-4 align-middle text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          {actions.map((action, actionIndex) => {
                            if (action.show && !action.show(item)) return null;
                            
                            return (
                              <Button
                                key={actionIndex}
                                size="xs"
                                variant={action.variant || 'secondary'}
                                onClick={() => action.onClick(item)}
                                leftIcon={action.icon}
                                title={action.label}
                                className="px-3 py-2 w-9 h-9 flex items-center justify-center"
                              />
                            );
                          })}
                          {onEdit && (
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => onEdit(item)}
                              leftIcon={
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              }
                              title="Edit"
                              className="px-3 py-2 w-9 h-9 flex items-center justify-center"
                            />
                          )}
                          {onDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => onDelete(item)}
                              leftIcon={
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              }
                              title="Delete"
                              className="px-3 py-2 w-9 h-9 flex items-center justify-center"
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentPage === pageNum ? 'primary' : 'ghost'}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              size="sm"
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;