// src/components/ShadcnTable.tsx
import React from 'react';

export interface Column<T, K extends string = string> {
  key: K;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface ShadcnTableProps<T, K extends string = string> {
  data: T[];
  columns: Column<T, K>[];
}

export function ShadcnTable<T, K extends string>({
  data,
  columns,
}: ShadcnTableProps<T, K>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}