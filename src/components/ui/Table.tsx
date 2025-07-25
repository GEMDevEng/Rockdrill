import React from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { TableColumn } from '../../types';
import { Button } from './Button';

interface TableProps<T = any> {
  columns: TableColumn[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: string[];
  onRowSelect?: (rowId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  rowKey?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function Table<T = any>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  sortable = false,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  rowKey = 'id',
  striped = false,
  hoverable = true,
  compact = false,
  className = '',
  'data-testid': testId,
}: TableProps<T>) {
  const handleSort = (column: TableColumn) => {
    if (!sortable || !column.sortable || !onSort) return;
    
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked);
    }
  };

  const handleRowSelect = (rowId: string, selected: boolean) => {
    if (onRowSelect) {
      onRowSelect(rowId, selected);
    }
  };

  const isRowSelected = (row: T) => {
    const id = (row as any)[rowKey];
    return selectedRows.includes(id);
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const tableClasses = `
    min-w-full divide-y divide-gray-200 bg-white
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const rowClasses = (index: number, row: T) => `
    ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
    ${hoverable ? 'hover:bg-gray-50' : ''}
    ${onRowClick ? 'cursor-pointer' : ''}
    ${isRowSelected(row) ? 'bg-blue-50' : ''}
  `.replace(/\s+/g, ' ').trim();

  const cellClasses = `
    ${compact ? 'px-3 py-2' : 'px-6 py-4'}
    text-sm text-gray-900
  `;

  const headerCellClasses = `
    ${compact ? 'px-3 py-2' : 'px-6 py-3'}
    text-left text-xs font-medium text-gray-500 uppercase tracking-wider
  `;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-10 rounded mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-12 rounded mb-1"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className={tableClasses} data-testid={testId}>
        <thead className="bg-gray-50">
          <tr>
            {/* Select all checkbox */}
            {onRowSelect && (
              <th className={headerCellClasses}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${headerCellClasses} ${column.sortable && sortable ? 'cursor-pointer select-none' : ''}`}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && sortable && (
                    <div className="flex flex-col">
                      <ChevronUp 
                        className={`w-3 h-3 ${
                          sortColumn === column.key && sortDirection === 'asc' 
                            ? 'text-gray-900' 
                            : 'text-gray-400'
                        }`} 
                      />
                      <ChevronDown 
                        className={`w-3 h-3 -mt-1 ${
                          sortColumn === column.key && sortDirection === 'desc' 
                            ? 'text-gray-900' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (onRowSelect ? 1 : 0)} 
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const rowId = (row as any)[rowKey];
              return (
                <tr
                  key={rowId || index}
                  className={rowClasses(index, row)}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {/* Row select checkbox */}
                  {onRowSelect && (
                    <td className={cellClasses}>
                      <input
                        type="checkbox"
                        checked={isRowSelected(row)}
                        onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${cellClasses} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                    >
                      {column.render 
                        ? column.render((row as any)[column.key], row)
                        : (row as any)[column.key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// Table action menu component
interface TableActionMenuProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'danger';
    disabled?: boolean;
  }>;
}

export const TableActionMenu: React.FC<TableActionMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        icon={MoreHorizontal}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                disabled={action.disabled}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center space-x-2
                  ${action.variant === 'danger' 
                    ? 'text-red-700 hover:bg-red-50' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
