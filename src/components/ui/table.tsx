import React from "react";

export const Table: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <table className={`w-full border-collapse ${className ?? ""}`}>
    {children}
  </table>
);

export const TableHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <thead className="bg-gray-100 text-gray-700">{children}</thead>
);

export const TableBody: React.FC<React.PropsWithChildren> = ({ children }) => (
  <tbody className="divide-y">{children}</tbody>
);

export const TableRow: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <tr className={`hover:bg-gray-50 transition ${className ?? ""}`}>{children}</tr>
);

export const TableHead: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <th
    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${className ?? ""}`}
  >
    {children}
  </th>
);

export const TableCell: React.FC<
  React.PropsWithChildren<{ className?: string; colSpan?: number }>
> = ({ children, className, colSpan }) => (
  <td className={`px-4 py-3 text-sm ${className ?? ""}`} colSpan={colSpan}>
    {children}
  </td>
);
