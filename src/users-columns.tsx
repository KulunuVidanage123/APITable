// src/users-columns.tsx
import { ColumnDef, CellContext } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

const Badge = ({ variant = "default", children, className = "" }: {
  variant?: "default" | "secondary" | "destructive" | "success" | "warning";
  children: React.ReactNode;
  className?: string;
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ 
  onClick, 
  children, 
  className = "" 
}: { 
  variant?: "ghost"; 
  onClick?: () => void; 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: string;
};

export const getColumns = (
  onEditUser?: (user: User) => void,
  onDeleteUser?: (userId: string) => void
): ColumnDef<User, unknown>[] => [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        First Name
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Last Name
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Age
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ getValue }: CellContext<User, unknown>) => {
      const gender = getValue() as string;
      return <span className="capitalize">{gender}</span>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Phone
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date of Birth
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ getValue }: CellContext<User, unknown>) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }: CellContext<User, unknown>) => {
      const role = getValue() as string;
      const variant = 
        role.toLowerCase() === "admin" ? "destructive" : 
        role.toLowerCase() === "manager" ? "warning" : 
        "secondary";
      return <Badge variant={variant} className="capitalize">{role}</Badge>;
    },
  },
  ...(onEditUser || onDeleteUser ? [{
    id: "actions",
    header: () => (
      <div className="text-center w-full">Actions</div>
    ),
    cell: ({ row }: CellContext<User, unknown>) => {
      const user = row.original;
      
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (onEditUser) {
          onEditUser(user);
        }
      };
      
      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (onDeleteUser && window.confirm("Are you sure you want to delete this user?")) {
          onDeleteUser(user.id);
        }
      };
      
      return (
        <div className="flex justify-center gap-2 min-w-[100px]">
          {onEditUser && (
            <button 
              onClick={handleEdit} 
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
              aria-label="Edit user"
            >
              Edit
            </button>
          )}
          {onDeleteUser && (
            <button 
              onClick={handleDelete} 
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
              aria-label="Delete user"
            >
              Delete
            </button>
          )}
        </div>
      );
    },
  }] : []),
];