// src/App.tsx
import { useState, useEffect, useMemo } from 'react';
import { ShadcnTable } from './components/ShadcnTable';
import { Dashboard } from './components/Dashboard';
import { getColumns as getUserColumns } from './users-columns';
import { productColumns } from './products-columns';
import { Product, User } from '../types';
import toast from 'react-hot-toast';

type ProductApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const API_BASE_URL = 'http://localhost:3000/api';

const paginate = <T,>(data: T[], page: number, pageSize: number): T[] => {
  const startIndex = (page - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null); 
  const [userPage, setUserPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: '',
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const result = await response.json();
      if (!Array.isArray(result.data)) {
        throw new Error('Invalid response format: data is not an array');
      }

      const normalizedUsers = result.data.map((user: any) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender || '',
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        role: user.role || 'user',
      }));

      setUsers(normalizedUsers);
      setUserPage(1);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to load users');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data: ProductApiResponse = await response.json();
      setProducts(data.products);
      setProductPage(1);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to load products');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchUsers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter((user) => user.firstName.toLowerCase().includes(term));
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => paginate(filteredUsers, userPage, ITEMS_PER_PAGE), [filteredUsers, userPage]);
  const paginatedProducts = useMemo(() => paginate(products, productPage, ITEMS_PER_PAGE), [products, productPage]);

  const userTotalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const productTotalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      role: formData.role,
    };

    try {
      if (editingUserId) {
        const response = await fetch(`${API_BASE_URL}/user/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update user');
        }
        toast.success('User updated successfully!');
      } else {
        const response = await fetch(`${API_BASE_URL}/user/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create user');
        }
        toast.success('User added successfully!');
      }

      await fetchUsers();
      resetForm();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      role: '',
    });
    setEditingUserId(null);
    setIsUserFormOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      await fetchUsers();
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age.toString(),
      gender: user.gender,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
    });
    setIsUserFormOpen(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, currentPage === userPage ? filteredUsers.length : products.length)}
              </span>{' '}
              of <span className="font-medium">{currentPage === userPage ? filteredUsers.length : products.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === page
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <Dashboard products={products} users={users} setActiveTab={setActiveTab} />
        ) : activeTab === 'products' ? (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">Products</h1>
            <ShadcnTable
              data={paginatedProducts}
              columns={productColumns(handleViewProduct)} // ← pass handler
            />
            <Pagination
              currentPage={productPage}
              totalPages={productTotalPages}
              onPageChange={setProductPage}
            />
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Users</h1>
              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search by first name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsUserFormOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
              >
                Add User
              </button>
            </div>

            <ShadcnTable
              data={paginatedUsers}
              columns={getUserColumns(handleViewUser, handleEditUser, handleDeleteUser)}
            />
            <Pagination
              currentPage={userPage}
              totalPages={userTotalPages}
              onPageChange={setUserPage}
            />
          </div>
        )}

        {/* 👤 User View Modal */}
        {viewingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                <button
                  onClick={() => setViewingUser(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="font-medium">ID:</span> {viewingUser.id}</div>
                <div><span className="font-medium">First Name:</span> {viewingUser.firstName}</div>
                <div><span className="font-medium">Last Name:</span> {viewingUser.lastName}</div>
                <div><span className="font-medium">Age:</span> {viewingUser.age}</div>
                <div><span className="font-medium">Gender:</span> {viewingUser.gender || '—'}</div>
                <div><span className="font-medium">Email:</span> {viewingUser.email}</div>
                <div><span className="font-medium">Phone:</span> {viewingUser.phone || '—'}</div>
                <div><span className="font-medium">Date of Birth:</span> {viewingUser.dateOfBirth || '—'}</div>
                <div><span className="font-medium">Role:</span> {viewingUser.role}</div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product View Modal */}
        {viewingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-3 text-sm max-h-96 overflow-y-auto pr-2">
                <div><span className="font-medium">ID:</span> {viewingProduct.id}</div>
                <div><span className="font-medium">Title:</span> {viewingProduct.title}</div>
                <div><span className="font-medium">Category:</span> {viewingProduct.category}</div>
                <div><span className="font-medium">Brand:</span> {viewingProduct.brand}</div>
                <div><span className="font-medium">Price:</span> ${viewingProduct.price.toFixed(2)}</div>
                <div><span className="font-medium">Discount:</span> {viewingProduct.discountPercentage}%</div>
                <div><span className="font-medium">Rating:</span> {viewingProduct.rating} ⭐</div>
                <div><span className="font-medium">Stock:</span> {viewingProduct.stock}</div>
                <div><span className="font-medium">Availability:</span> {viewingProduct.availabilityStatus}</div>
                <div><span className="font-medium">Description:</span> {viewingProduct.description}</div>
                <div><span className="font-medium">Tags:</span> {viewingProduct.tags?.join(', ') || '—'}</div>
                <div><span className="font-medium">SKU:</span> {viewingProduct.sku}</div>
                <div><span className="font-medium">Weight:</span> {viewingProduct.weight} kg</div>
                <div>
                  <span className="font-medium">Dimensions (W×H×D):</span>{' '}
                  {viewingProduct.dimensions
                    ? `${viewingProduct.dimensions.width} × ${viewingProduct.dimensions.height} × ${viewingProduct.dimensions.depth}`
                    : '—'}
                </div>
                <div><span className="font-medium">Warranty:</span> {viewingProduct.warrantyInformation}</div>
                <div><span className="font-medium">Shipping:</span> {viewingProduct.shippingInformation}</div>
                <div><span className="font-medium">Return Policy:</span> {viewingProduct.returnPolicy}</div>
                <div><span className="font-medium">Min Order Qty:</span> {viewingProduct.minimumOrderQuantity}</div>
                <div>
                  <span className="font-medium">Barcode:</span>{' '}
                  <a
                    href={`https://barcode.tec-it.com/barcode.png?data=${viewingProduct.meta?.barcode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {viewingProduct.meta?.barcode || '—'}
                  </a>
                </div>
                <div>
                  <span className="font-medium">QR Code:</span>{' '}
                  {viewingProduct.meta?.qrCode ? (
                    <img
                      src={viewingProduct.meta.qrCode}
                      alt="QR Code"
                      className="mt-1 max-w-16"
                    />
                  ) : (
                    '—'
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewingProduct(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Form Modal */}
        {isUserFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingUserId ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingUserId ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          {/* &copy; {new Date().getFullYear()} */}
        </div>
      </div>
    </div>
  );
}

export default App;