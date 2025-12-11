// src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, ShoppingCart, Package, DollarSign } from "lucide-react";
// import { DataTable } from "./ui/data-table";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  availabilityStatus: string;
  warrantyInformation: string;
  shippingInformation: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  tags: string[];
  sku: string;
  weight: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface DashboardProps {
  products?: Product[];
  users?: User[];
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

// Stats card props
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: number;
  description: string;
}

const StatCard = ({ title, value, icon: Icon, trend, description }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-2">
          <span className={`text-xs font-medium ${
            trend > 0 ? "text-green-500" : "text-red-500"
          }`}>
            {trend > 0 ? (
              <ArrowUpRight className="h-4 w-4 inline mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 inline mr-1" />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 7000 },
];

export function Dashboard({ products: propProducts, users: propUsers, setActiveTab: propSetActiveTab }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(propSetActiveTab ? "products" : "products");
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: "$12,345",
    totalUsers: "1,258",
    totalProducts: "246",
    totalOrders: "321",
    revenueTrend: 12.5,
    usersTrend: 8.2,
    productsTrend: 3.7,
    ordersTrend: 5.4
  });
  
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [users, ] = useState<User[]>(propUsers || [
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
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propProducts) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        
        setDashboardData(prev => ({
          ...prev,
          totalProducts: result.products.length.toString(),
          totalRevenue: `$${(result.products.reduce((sum: number, product: Product) => sum + product.price * 100, 0) / 100).toFixed(2)}`,
        }));
        
        setProducts(result.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load product data. Using sample data instead.');
        
        setProducts([
          {
            id: 1,
            title: "iPhone 9",
            description: "An apple mobile which is nothing like apple",
            price: 549,
            discountPercentage: 12.96,
            rating: 4.69,
            stock: 94,
            brand: "Apple",
            category: "smartphones",
            thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
            images: [
              "https://i.dummyjson.com/data/products/1/1.jpg",
              "https://i.dummyjson.com/data/products/1/2.jpg"
            ],
            availabilityStatus: "In Stock",
            warrantyInformation: "1 year warranty",
            shippingInformation: "Ships in 1 week",
            reviews: [],
            returnPolicy: "30 days return policy",
            minimumOrderQuantity: 1,
            meta: {
              createdAt: "2023-01-01T00:00:00.000Z",
              updatedAt: "2023-01-01T00:00:00.000Z",
              barcode: "1234567890",
              qrCode: "https://example.com/qrcode.png"
            },
            dimensions: {
              width: 10,
              height: 10,
              depth: 10
            },
            tags: ["smartphones", "apple"],
            sku: "IPHONE-9",
            weight: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const timer = setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        totalRevenue: "$12,432",
        revenueTrend: 13.2
      }));
      
      if (!propUsers) {
        setDashboardData(prev => ({
          ...prev,
          totalUsers: users.length.toString(),
        }));
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [propProducts, propUsers, users.length]);

  const handleTabChange = (tab: string) => {
    if (propSetActiveTab) {
      propSetActiveTab(tab);
    } else {
      setActiveTab(tab);
    }
  };

  if (loading && !propProducts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    console.warn("Dashboard warning:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Analytics and data overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={dashboardData.totalRevenue} 
            icon={DollarSign} 
            trend={dashboardData.revenueTrend} 
            description="from last month" 
          />
          <StatCard 
            title="Total Users" 
            value={dashboardData.totalUsers} 
            icon={Users} 
            trend={dashboardData.usersTrend} 
            description="new users" 
          />
          <StatCard 
            title="Products" 
            value={dashboardData.totalProducts} 
            icon={Package} 
            trend={dashboardData.productsTrend} 
            description="in inventory" 
          />
          <StatCard 
            title="Orders" 
            value={dashboardData.totalOrders} 
            icon={ShoppingCart} 
            trend={dashboardData.ordersTrend} 
            description="this month" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#6b7280", fontSize: 12 }} 
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }} 
                      />
                      <Bar 
                        dataKey="sales" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {item === 1 ? "N" : item === 2 ? "J" : "S"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {item === 1 ? "New user registered" : 
                           item === 2 ? "Order placed" : "Product added"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item === 1 ? "2 minutes ago" : 
                           item === 2 ? "15 minutes ago" : "1 hour ago"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Tables</CardTitle>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant={activeTab === "products" ? "default" : "outline"}
                    onClick={() => handleTabChange("products")}
                  >
                    Products
                  </Button>
                  <Button
                    variant={activeTab === "users" ? "default" : "outline"}
                    onClick={() => handleTabChange("users")}
                  >
                    Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "products" ? (
                  <div className="overflow-x-auto">
                    <p className="text-sm text-gray-500 mb-4">Note: Product table columns need to be implemented.</p>
                    <div className="border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.slice(0, 5).map((product) => (
                            <tr key={product.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <p className="text-sm text-gray-500 mb-4">Note: User table columns need to be implemented.</p>
                    <div className="border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.slice(0, 5).map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}