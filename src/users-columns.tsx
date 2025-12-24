// src/users-columns.tsx
import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { User } from 'types';

const Badge = ({
  variant = 'default',
  children,
  className = '',
}: {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        variants[variant]
      } ${className}`}
    >
      {children}
    </span>
  );
};

export type UserColumn = {
  key: keyof User | 'actions';
  header: string;
  render?: (user: User) => React.ReactNode;
};

export const getColumns = (
  onViewUser?: (user: User) => void,
  onEditUser?: (user: User) => void,
  onDeleteUser?: (userId: string) => void
): UserColumn[] => {
  const columns: UserColumn[] = [
    {
      key: 'firstName',
      header: 'First Name',
      render: (user) => <span className="font-medium">{user.firstName}</span>,
    },
    {
      key: 'lastName',
      header: 'Last Name',
      render: (user) => <span className="font-medium">{user.lastName}</span>,
    },
    {
      key: 'age',
      header: 'Age',
      render: (user) => user.age,
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (user) => (
        <span className="capitalize text-gray-700">{user.gender}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user) => <span className="text-gray-600">{user.email}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (user) => user.phone,
    },
    {
      key: 'dateOfBirth',
      header: 'Date of Birth',
      render: (user) => {
        const date = new Date(user.dateOfBirth);
        return !isNaN(date.getTime())
          ? date.toLocaleDateString()
          : 'Invalid Date';
      },
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => {
        const role = user.role.toLowerCase();
        const variant =
          role === 'admin'
            ? 'destructive'
            : role === 'manager'
            ? 'warning'
            : 'secondary';
        return (
          <Badge variant={variant} className="capitalize">
            {user.role}
          </Badge>
        );
      },
    },
  ];

  if (onViewUser || onEditUser || onDeleteUser) {
    columns.push({
      key: 'actions',
      header: '',
      render: (user) => {
        const handleDelete = () => {
          if (
            onDeleteUser &&
            window.confirm('Are you sure you want to delete this user?')
          ) {
            onDeleteUser(user.id);
          }
        };

        return (
          <div className="flex items-center justify-end gap-2">
            {onViewUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewUser(user);
                }}
                className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="View user"
              >
                <Eye size={16} />
              </button>
            )}
            {onEditUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditUser(user);
                }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                aria-label="Edit user"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDeleteUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete user"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        );
      },
    });
  }

  return columns;
};