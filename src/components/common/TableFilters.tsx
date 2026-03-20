import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface TableFiltersProps {
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  onClearAll?: () => void;
  showClearButton?: boolean;
  children?: ReactNode;
}

const selCls = "h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-600";

export const TableFilters: React.FC<TableFiltersProps> = ({
  searchValue,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  onClearAll,
  showClearButton = false,
  children
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input 
          value={searchValue} 
          onChange={e => onSearchChange(e.target.value)} 
          placeholder={searchPlaceholder}
          className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white" 
        />
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => (
        <select 
          key={index}
          value={filter.value} 
          onChange={e => filter.onChange(e.target.value)} 
          className={selCls}
        >
          <option value="">{filter.label}</option>
          {filter.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ))}

      {/* Custom Children (e.g., date picker) */}
      {children}

      {/* Clear Button */}
      {showClearButton && onClearAll && (
        <button 
          onClick={onClearAll}
          className="h-9 px-3 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
};

export default TableFilters;
