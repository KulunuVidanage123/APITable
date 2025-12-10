// src/users-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// Simple Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: "default" | "outline" | "ghost" 
}>(({ 
  className = "", 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
  };
  
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

// Dropdown menu components with proper TypeScript interfaces
interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  onClose?: () => void;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  onClose?: () => void;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            // Type assertion to let TypeScript know about the props
            const typedChild = child as React.ReactElement<DropdownMenuTriggerProps>;
            
            return React.cloneElement(typedChild, { 
              onClick: (e: React.MouseEvent<HTMLElement>) => {
                // Now TypeScript knows about the onClick prop
                if (typeof typedChild.props.onClick === 'function') {
                  typedChild.props.onClick(e);
                }
                if (!e.defaultPrevented) {
                  setOpen(prev => !prev);
                }
              }
            });
          }
          if (child.type === DropdownMenuContent && open) {
            // Type assertion for DropdownMenuContent
            const typedChild = child as React.ReactElement<DropdownMenuContentProps>;
            
            return React.cloneElement(typedChild, { 
              onClose: () => setOpen(false) 
            });
          }
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children, 
  asChild, 
  onClick 
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick });
  }
  return <div onClick={onClick}>{children}</div>;
};
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  children, 
  align = "start",
  onClose
}) => {
  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };
  
  return (
    <div 
      className={`absolute ${alignClasses[align]} mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      onClick={e => e.stopPropagation()}
    >
      <div className="py-1" role="none">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === DropdownMenuItem) {
              // Type assertion for DropdownMenuItem
              const typedChild = child as React.ReactElement<DropdownMenuItemProps>;
              
              return React.cloneElement(typedChild, { 
                onClose,
                onClick: (e: React.MouseEvent<HTMLElement>) => {
                  if (typeof typedChild.props.onClick === 'function') {
                    typedChild.props.onClick(e);
                  }
                  if (onClose && !e.defaultPrevented) {
                    onClose();
                  }
                }
              });
            }
            if (child.type === DropdownMenuSeparator) {
              return React.cloneElement(child, {});
            }
            if (child.type === DropdownMenuLabel) {
              return React.cloneElement(child, {});
            }
          }
          return child;
        })}
      </div>
    </div>
  );
};
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ 
  children, 
  className = "" 
}) => (
  <div 
    className={`block px-4 py-2 text-sm font-medium text-gray-700 ${className}`}
    role="menuitem"
  >
    {children}
  </div>
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className = "" }) => (
  <div className={`border-t border-gray-200 my-1 ${className}`} role="separator" />
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children, 
  onClick, 
  className = "",
  onClose
}) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (onClick) onClick(e);
    if (onClose && !e.defaultPrevented) onClose();
  };

  return (
    <button
      onClick={handleClick}
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${className}`}
      role="menuitem"
    >
      {children}
    </button>
  );
};
DropdownMenuItem.displayName = "DropdownMenuItem";

// Simple inline badge component 
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

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const variant = role === "admin" ? "destructive" : "secondary";
      
      return (
        <Badge variant={variant} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "success" | "secondary" | "warning" = "secondary";
      
      if (status === "active") variant = "success";
      else if (status === "pending") variant = "warning";
      
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user details</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];