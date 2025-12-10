// src/App.tsx
import { useState, useEffect } from 'react';
import { DataTable } from "./components/ProductTable";
import { UserTable } from "./components/UserTable";
import { columns as productColumns } from "./products-columns";
import { columns as userColumns } from "./users-columns";

// Define proper types for API response
type ProductApiResponse = {
  products: any[];
  total: number;
  skip: number;
  limit: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

function App() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Set mock user data since we don't have a user API endpoint
        setUsers([
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
            status: "active",
            createdAt: "2023-01-15T09:30:00Z",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "user",
            status: "active",
            createdAt: "2023-02-20T14:22:00Z",
          },
          {
            id: "3",
            name: "Robert Johnson",
            email: "robert.j@example.com",
            role: "user",
            status: "inactive",
            createdAt: "2023-03-05T11:15:00Z",
          },
          {
            id: "4",
            name: "Emily Davis",
            email: "emily.davis@example.com",
            role: "manager",
            status: "active",
            createdAt: "2023-04-12T16:45:00Z",
          },
          {
            id: "5",
            name: "Michael Wilson",
            email: "m.wilson@example.com",
            role: "user",
            status: "pending",
            createdAt: "2023-05-08T10:20:00Z",
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex border-b border-gray-200 mb-6">
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

        {activeTab === "products" ? (
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
              Users
            </h1>
            <div className="bg-white rounded-lg shadow overflow-hidden border">
              <UserTable data={users} columns={userColumns} />
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