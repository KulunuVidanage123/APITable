// src/components/navbar/Navbar.tsx
interface NavbarProps {
  userRole: 'user' | 'admin' | 'manager';
  onNavItemClick: (page: string) => void; 
}

export const Navbar = ({ userRole, onNavItemClick }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <button 
              onClick={() => onNavItemClick('dashboard')}
              className="text-gray-900 hover:text-blue-600"
            >
              Dashboard
            </button>
            
            {userRole === 'admin' && (
              <button 
                onClick={() => onNavItemClick('users')}
                className="text-gray-900 hover:text-blue-600"
              >
                Users
              </button>
            )}
            
            <button 
              onClick={() => onNavItemClick('products')}
              className="text-gray-900 hover:text-blue-600"
            >
              Products
            </button>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            A
          </div>
        </div>
      </div>
    </nav>
  );
};