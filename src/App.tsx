// src/App.tsx
import { useState, useEffect } from 'react';
import { DataTable } from "./components/ProductTable";
import { UserTable } from "./components/UserTable";
import { Dashboard } from "./components/Dashboard"; 
import { columns as productColumns } from "./products-columns";
import { columns as userColumns } from "./users-columns";
import { User } from "./types/user.types";

type ProductApiResponse = {
  products: any[];
  total: number;
  skip: number;
  limit: number;
};

// Type expected by UserTable component from users-columns
type UserTableUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    role: ""
  });

  // Fetch product data from DummyJSON API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: ProductApiResponse = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform users to match UserTable component's expected format
  const transformUsersForUserTable = (users: User[]): UserTableUser[] => {
    return users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: "active", // Default status
      createdAt: user.dateOfBirth || new Date().toISOString()
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new user object
    const newUser: User = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: parseInt(formData.age),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      role: formData.role
    };
    
    // Add to users array
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // Reset form and close popup
    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      role: ""
    });
    setIsUserFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-9xl mx-auto p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto w-full">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "dashboard"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "products"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "users"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === "dashboard" ? (
          <Dashboard 
            products={products} 
            users={users} 
            setActiveTab={setActiveTab}
          />
        ) : activeTab === "products" ? (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
              Products
            </h1>
            <div className="bg-white rounded-lg shadow overflow-hidden border">
              <DataTable data={products} columns={productColumns} />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Users
              </h1>
              <button 
                onClick={() => setIsUserFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add User
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden border p-5 md:p-8">
              <UserTable data={transformUsersForUserTable(users)} columns={userColumns} />
            </div>
          </div>
        )}
        
        {/* User Form Modal */}
        {isUserFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
                <button 
                  onClick={() => setIsUserFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsUserFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Products data provided by DummyJSON API</p>
        </div>
      </div>
    </div>
  );
}

export default App;