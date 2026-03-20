import React, { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => ReactNode;
}

interface Action<T> {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  variant?: 'primary' | 'danger';
  title?: string;
}

interface DataTableWrapperProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  emptyMessage?: string;
  maxHeight?: string;
}

export function DataTableWrapper<T extends { id: string }>({
  data,
  columns,
  actions = [],
  emptyMessage = "No data found",
  maxHeight = "60vh"
}: DataTableWrapperProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div 
        className="overflow-auto" 
        style={{ maxHeight, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#002147] text-white">
              {columns.map(col => (
                <th 
                  key={String(col.key)} 
                  className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' : 
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="text-center py-16 text-slate-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={row.id} 
                  className={`group transition-colors hover:bg-slate-50/70 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  {columns.map(col => (
                    <td 
                      key={String(col.key)} 
                      className={`px-5 py-3.5 ${
                        col.align === 'center' ? 'text-center' : 
                        col.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions.map((action, idx) => (
                          <button 
                            key={idx}
                            onClick={() => action.onClick(row)}
                            className={`h-8 w-8 flex items-center justify-center rounded-lg transition ${
                              action.variant === 'danger' 
                                ? 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
                                : 'bg-[#002147] hover:bg-[#003366] text-white border border-[#002147]'
                            }`}
                            title={action.title || action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-400 font-medium">
          {data.length} {data.length === 1 ? 'item' : 'items'} shown
        </span>
      </div>
    </div>
  );
}

export default DataTableWrapper;
