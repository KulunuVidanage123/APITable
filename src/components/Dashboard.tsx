// src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Product, User } from '../../types';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface DashboardUser {
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

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const Button = ({ 
  children, 
  variant = "default", 
  onClick,
  className = "",
  ...props
}: { 
  children: React.ReactNode; 
  variant?: string; 
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${variant === "outline" 
        ? "border border-gray-300 text-gray-700 hover:bg-gray-50" 
        : "bg-blue-600 text-white hover:bg-blue-700"}
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  description: string;
}
const StatCard = ({ title, value, trend, description }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-2 text-xs">
          <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const transformUsersForDashboard = (users: User[]): DashboardUser[] => {
  return users.map(user => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: "active",
    createdAt: user.dateOfBirth || new Date().toISOString(),
  }));
};

const getSalesDataByCategory = (products: Product[]) => {
  const categoryMap: Record<string, number> = {};
  
  products.forEach(product => {
    const revenue = product.price * product.stock;
    categoryMap[product.category] = (categoryMap[product.category] || 0) + revenue;
  });

  return Object.entries(categoryMap)
    .map(([name, sales]) => ({ name, sales: Math.round(sales) }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6); 
};

export function Dashboard({ 
  products: propProducts, 
  users: propUsers = [], 
  setActiveTab: propSetActiveTab 
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("products");
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: "$0.00",
    totalUsers: "0",
    totalProducts: "0",
    totalOrders: "0",
    revenueTrend: 0,
    usersTrend: 0,
    productsTrend: 0,
    ordersTrend: 0,
  });
  
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>(
    transformUsersForDashboard(propUsers)
  );
  const [loading, setLoading] = useState(!propProducts);

  useEffect(() => {
    setDashboardUsers(transformUsersForDashboard(propUsers));
    setDashboardData(prev => ({
      ...prev,
      totalUsers: propUsers.length.toString(),
    }));
  }, [propUsers]);

  useEffect(() => {
    if (propProducts) {
      const totalRevenue = propProducts.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
      ).toFixed(2);
      setDashboardData(prev => ({
        ...prev,
        totalProducts: propProducts.length.toString(),
        totalRevenue: `$${totalRevenue}`,
      }));
      setProducts(propProducts);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const  { products: fetchedProducts } = await response.json();
        
        const totalRevenue = fetchedProducts.reduce(
          (sum: number, product: Product) => sum + product.price * product.stock,
          0
        ).toFixed(2);

        setDashboardData(prev => ({
          ...prev,
          totalProducts: fetchedProducts.length.toString(),
          totalRevenue: `$${totalRevenue}`,
          totalUsers: propUsers.length.toString(),
        }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [propProducts, propUsers]);

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

  const salesData = getSalesDataByCategory(products);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Analytics and data overview</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            A
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={dashboardData.totalRevenue} 
            trend={12.5} 
            description="from last month" 
          />
          <StatCard 
            title="Total Users" 
            value={dashboardData.totalUsers} 
            trend={8.2} 
            description="new users" 
          />
          <StatCard 
            title="Products" 
            value={dashboardData.totalProducts} 
            trend={3.7} 
            description="in inventory" 
          />
          <StatCard 
            title="Orders" 
            value={dashboardData.totalOrders} 
            trend={5.4} 
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
                  {salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={60}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                          labelFormatter={(name) => `Category: ${name}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="sales" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No product data available
                    </div>
                  )}
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
                <div className="space-y-4 text-sm text-gray-600">
                  <div>New user registered — 2 min ago</div>
                  <div>Order placed — 15 min ago</div>
                  <div>Product added — 1 hr ago</div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
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
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.slice(0, 5).map((product) => (
                          <tr key={product.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{product.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{product.title}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{product.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardUsers.slice(0, 5).map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{user.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{user.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{user.email}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{user.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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